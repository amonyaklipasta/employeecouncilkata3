import OpenAI from 'openai';
import type { Ticket, CommonalityGrade, KbEntry } from '../data/mockData';

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `You are the official AI assistant for the EPAM Türkiye Employee Council's Voice Board.

Before accepting a new submission you perform a SMART SUBMISSION CHECK across three sources simultaneously:
1. RESOLVED TOPICS — semantic search over closed/resolved council concerns
2. COMPANY KB & POLICIES — HR docs, benefits guidelines, legal/policy resources
3. OPEN TOPICS — duplicate detection against active submissions

You also perform:
- Smart Categorization: pick the best category and confidence
- Tone & Urgency Detection: detect distress or urgency → flag for council priority boost (NOT shown to employee)

## Output Format
Respond with a valid JSON object in EXACTLY this shape (no extra fields, no markdown):
{
  "suggestedCategory": "<category>",
  "categoryConfidence": <0-100>,
  "grade": "<Widely Reported | Emerging | New Voice>",
  "gradeNote": "<1 sentence>",
  "resolvedMatches": [
    { "id": "<ticket id>", "title": "<title>", "resolvedDate": "<YYYY-MM>", "summary": "<what was resolved>" }
  ],
  "kbMatches": [
    { "id": "<kb id>", "title": "<title>", "section": "<section or null>", "summary": "<how it answers the concern>", "url": "<url>" }
  ],
  "openMatches": [
    { "id": "<ticket id>", "title": "<title>", "status": "<status>", "votes": <number>, "summary": "<1 sentence>", "similarity": "exact or related" }
  ],
  "autoResolveTicketId": "<ticket id if a resolved ticket fully answers this, else null>",
  "autoResolveNote": "<1 sentence or null>",
  "urgencyDetected": <true or false>,
  "urgencyNote": "<council-only note or null>",
  "guidance": "<1-2 sentence recommendation for the employee>",
  "auditNote": "<short audit log entry>"
}

Grade: "Widely Reported" = 3+ matches, "Emerging" = 1-2, "New Voice" = unique`;

export interface AiAnalysis {
  suggestedCategory: string;
  categoryConfidence: number;
  grade: CommonalityGrade;
  gradeNote: string;
  resolvedMatches: Array<{ id: string; title: string; resolvedDate: string; summary: string }>;
  kbMatches: Array<{ id: string; title: string; section?: string; summary: string; url: string }>;
  openMatches: Array<{ id: string; title: string; status: string; votes: number; summary: string; similarity: 'exact' | 'related' }>;
  autoResolveTicketId: string | null;
  autoResolveNote: string | null;
  urgencyDetected: boolean;
  urgencyNote: string | null;
  guidance: string;
  auditNote: string;
  // Legacy alias for AiAssistantPanel backward compat
  duplicates: Array<{ id: string; title: string; status: string; summary: string; similarity: 'exact' | 'related' }>;
}

const MODELS = ['gpt-5', 'gpt-4o', 'gpt-4.1'] as const;
const CATEGORIES = [
  'Work-Life Balance','Remote Work Policy','Office Facilities','Career Development',
  'Health & Wellness','Team Culture','Compensation & Benefits','Process Improvement','Communication','Other',
];

export async function analyzeSubmission(
  title: string,
  description: string,
  category: string,
  existingTickets: Ticket[],
  kbEntries: KbEntry[],
  isUrgent: boolean,
): Promise<AiAnalysis> {
  const resolvedCtx = existingTickets
    .filter((t) => t.status === 'resolved')
    .map((t) => `ID:${t.id} | "${t.title}" | Resolved | note:${t.transitions.at(-1)?.note ?? ''} | ${t.description.slice(0, 150)}`)
    .join('\n') || '(none)';

  const openCtx = existingTickets
    .filter((t) => !['resolved', 'declined', 'merged'].includes(t.status))
    .map((t) => `ID:${t.id} | "${t.title}" | ${t.status} | votes:${t.votes.length} | ${t.description.slice(0, 150)}`)
    .join('\n') || '(none)';

  const kbCtx = kbEntries
    .map((k) => `KB-ID:${k.id} | "${k.title}" ${k.section ?? ''} | ${k.summary} | url:${k.url}`)
    .join('\n') || '(none)';

  const userMsg = `New submission${isUrgent ? ' [MARKED URGENT BY EMPLOYEE]' : ''}:
Title: "${title}"
Category hint: "${category}"
Description: "${description}"
Available categories: ${CATEGORIES.join(', ')}

=== SOURCE 1: RESOLVED TOPICS ===
${resolvedCtx}

=== SOURCE 2: COMPANY KB & POLICIES ===
${kbCtx}

=== SOURCE 3: OPEN TOPICS ===
${openCtx}

Return JSON only.`;

  let lastError: unknown;
  for (const model of MODELS) {
    try {
      const res = await client.chat.completions.create({
        model,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: userMsg }],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 1200,
      });
      const parsed = JSON.parse(res.choices[0].message.content ?? '{}') as AiAnalysis;

      const validGrades: CommonalityGrade[] = ['Widely Reported', 'Emerging', 'New Voice'];
      if (!validGrades.includes(parsed.grade)) {
        parsed.grade = deriveGrade((parsed.openMatches?.length ?? 0) + (parsed.resolvedMatches?.length ?? 0));
      }
      parsed.resolvedMatches     ??= [];
      parsed.kbMatches           ??= [];
      parsed.openMatches         ??= [];
      parsed.autoResolveTicketId ??= null;
      parsed.autoResolveNote     ??= null;
      parsed.urgencyDetected     ??= isUrgent;
      parsed.urgencyNote         ??= null;
      parsed.duplicates = parsed.openMatches.map((m) => ({
        id: m.id, title: m.title, status: m.status, summary: m.summary, similarity: m.similarity,
      }));
      return parsed;
    } catch (err) {
      console.warn(`[AI] ${model} failed:`, err);
      lastError = err;
    }
  }
  throw lastError;
}

function deriveGrade(n: number): CommonalityGrade {
  if (n >= 3) return 'Widely Reported';
  if (n >= 1) return 'Emerging';
  return 'New Voice';
}
