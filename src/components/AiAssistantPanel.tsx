import type { AiAnalysis } from '../services/aiService';
import type { Ticket } from '../data/mockData';
import { SEED_TICKETS } from '../data/mockData';

interface Props {
  analysis: AiAnalysis;
  tickets: Ticket[];
  onConfirm: () => void;
  onDiscard: () => void;
}

const GRADE_STYLES = {
  'Widely Reported': 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/40',
  'Emerging':        'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/40',
  'New Voice':       'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/40',
};
const GRADE_ICON = { 'Widely Reported': '🔥', 'Emerging': '📈', 'New Voice': '💡' } as Record<string, string>;

export function AiAssistantPanel({ analysis, tickets, onConfirm, onDiscard }: Props) {
  const totalMatches = analysis.resolvedMatches.length + analysis.kbMatches.length + analysis.openMatches.length;

  const autoResolveTicket = analysis.autoResolveTicketId
    ? ([...tickets, ...SEED_TICKETS].find((t) => t.id === analysis.autoResolveTicketId))
    : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0047FF] to-[#8453D2] dark:from-[#00F6FF] dark:to-[#7BA8FF] flex items-center justify-center text-white dark:text-[#060606] text-xs font-black">C</div>
        <div>
          <p className="text-sm font-bold text-[#0047FF] dark:text-[#00F6FF]">Smart Submission Check</p>
          <p className="text-xs text-gray-400">Checked 3 sources · {totalMatches} match{totalMatches !== 1 ? 'es' : ''} found</p>
        </div>
        {analysis.grade && (
          <div className={`ml-auto flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${GRADE_STYLES[analysis.grade] ?? ''}`}>
            <span>{GRADE_ICON[analysis.grade]}</span>
            {analysis.grade}
          </div>
        )}
      </div>

      {/* Auto-resolve highlight */}
      {autoResolveTicket && analysis.autoResolveNote && (
        <div className="rounded-xl border-2 border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/15 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl leading-none mt-0.5">✅</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-0.5">This may already be answered</p>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-3">{analysis.autoResolveNote}</p>
              <div className="bg-white dark:bg-[#0e0e1a] rounded-lg p-3 border border-emerald-200 dark:border-emerald-800/40 mb-3">
                <p className="text-xs text-gray-400 mb-0.5">Resolved · {autoResolveTicket.id}</p>
                <p className="text-sm font-semibold text-[#060606] dark:text-[#FBFAFA]">{autoResolveTicket.title}</p>
                {autoResolveTicket.transitions.at(-1)?.note && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">"{autoResolveTicket.transitions.at(-1)!.note}"</p>
                )}
                <a
                  href="https://kb.epam.com/spaces/EPMTHC/pages/2305073420/Employee+Council"
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs text-[#0047FF] dark:text-[#00F6FF] hover:underline mt-1 block"
                >
                  KB Pages: Medical Check Reports (İstanbul · İzmir) →
                </a>
              </div>
              <button
                onClick={onDiscard}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-lg transition-colors"
              >
                ✓ Mark as Auto-Resolved — don't submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOURCE 1: Resolved */}
      <SourceSection title="Resolved Topics" icon="🟢"
        border="border-emerald-400/40 dark:border-emerald-600/30" count={analysis.resolvedMatches.length}
        empty="No resolved topics match this concern.">
        {analysis.resolvedMatches.map((m) => (
          <div key={m.id} className="bg-white dark:bg-[#0e0e1a] rounded-lg p-3 border border-gray-100 dark:border-[#1E2235]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-gray-400">{m.id}</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium">
                Resolved {m.resolvedDate}
              </span>
            </div>
            <p className="text-sm font-semibold text-[#060606] dark:text-[#FBFAFA] mb-0.5">{m.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{m.summary}</p>
          </div>
        ))}
      </SourceSection>

      {/* SOURCE 2: KB */}
      <SourceSection title="Company KB & Policies" icon="📋"
        border="border-[#0047FF]/25 dark:border-[#00F6FF]/20" count={analysis.kbMatches.length}
        empty="No relevant KB articles or policies found.">
        {analysis.kbMatches.map((m) => (
          <div key={m.id} className="bg-white dark:bg-[#0e0e1a] rounded-lg p-3 border border-gray-100 dark:border-[#1E2235]">
            <div className="flex items-center gap-2 mb-1">
              {m.section && <span className="text-xs font-mono text-[#0047FF] dark:text-[#00F6FF]">{m.section}</span>}
              <span className="text-sm font-semibold text-[#060606] dark:text-[#FBFAFA]">{m.title}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">{m.summary}</p>
            <a href={m.url} target="_blank" rel="noopener noreferrer"
              className="text-xs text-[#0047FF] dark:text-[#00F6FF] hover:underline">Open KB article →</a>
          </div>
        ))}
      </SourceSection>

      {/* SOURCE 3: Open */}
      <SourceSection title="Open Topics" icon="🟠"
        border="border-orange-400/40 dark:border-orange-500/25" count={analysis.openMatches.length}
        empty="No similar open topics found.">
        {analysis.openMatches.map((m) => (
          <div key={m.id} className="bg-white dark:bg-[#0e0e1a] rounded-lg p-3 border border-gray-100 dark:border-[#1E2235]">
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-sm font-semibold text-[#060606] dark:text-[#FBFAFA]">{m.title}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                m.similarity === 'exact'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
              }`}>{m.similarity === 'exact' ? 'Duplicate' : 'Related'}</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-gray-400">{m.id}</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#1E2235] text-gray-500 dark:text-gray-400">{m.status}</span>
              <span className="text-xs text-gray-400">▲ {m.votes}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{m.summary}</p>
          </div>
        ))}
        {analysis.openMatches.length > 0 && (
          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
            Similar concerns already raised — consider voting instead.
          </p>
        )}
      </SourceSection>

      {/* Category confidence */}
      <div className="bg-white dark:bg-[#0e0e1a] rounded-lg p-3 border border-gray-100 dark:border-[#1E2235] flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Auto-categorized as</p>
          <p className="text-sm font-semibold text-[#060606] dark:text-[#FBFAFA]">{analysis.suggestedCategory}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 mb-0.5">Confidence</p>
          <p className="text-sm font-bold text-[#0047FF] dark:text-[#00F6FF]">{analysis.categoryConfidence}%</p>
        </div>
      </div>

      {/* Guidance */}
      <div className="bg-[#0047FF]/5 dark:bg-[#00F6FF]/5 rounded-lg p-3 border border-[#0047FF]/10 dark:border-[#00F6FF]/10">
        <p className="text-xs font-semibold text-[#0047FF] dark:text-[#00F6FF] mb-1">Recommendation</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.guidance}</p>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <div className="flex gap-3">
          <button onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-[#0047FF] to-[#0078C2] dark:from-[#00F6FF] dark:to-[#7BA8FF] text-white dark:text-[#060606] text-sm font-bold py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all">
            Submit as New Ticket
          </button>
          <button onClick={onDiscard}
            className="flex-1 border border-gray-200 dark:border-[#1E2235] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#0e0e1a] text-sm font-medium py-2.5 rounded-lg transition-colors">
            Edit
          </button>
        </div>
        <button onClick={onDiscard}
          className="w-full text-xs text-gray-400 hover:text-[#0047FF] dark:hover:text-[#00F6FF] transition-colors py-1">
          My concern is different — proceed to submit →
        </button>
      </div>
    </div>
  );
}

function SourceSection({ title, icon, border, count, empty, children }: {
  title: string; icon: string; border: string; count: number; empty: string; children?: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border-2 ${border} p-3`}>
      <div className="flex items-center gap-2 mb-2">
        <span>{icon}</span>
        <span className="text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300">{title}</span>
        <span className="ml-auto text-xs text-gray-400">{count} match{count !== 1 ? 'es' : ''}</span>
      </div>
      {count === 0
        ? <p className="text-xs text-gray-400 dark:text-gray-500 italic">{empty}</p>
        : <div className="space-y-2">{children}</div>
      }
    </div>
  );
}
