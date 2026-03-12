export type TicketStatus =
  | 'submitted'
  | 'open'
  | 'under_review'
  | 'escalated'
  | 'in_discussion'
  | 'resolved'
  | 'declined'
  | 'merged';

export type CommonalityGrade = 'Widely Reported' | 'Emerging' | 'New Voice';

export const LIFECYCLE_STAGES: TicketStatus[] = [
  'submitted', 'open', 'under_review', 'escalated', 'in_discussion', 'resolved',
];

export const STAGE_LABEL: Record<TicketStatus, string> = {
  submitted:     'Submitted',
  open:          'Open (Voting)',
  under_review:  'Under Review',
  escalated:     'Escalated',
  in_discussion: 'In Discussion',
  resolved:      'Resolved',
  declined:      'Declined',
  merged:        'Merged',
};

export const NEXT_STAGE: Partial<Record<TicketStatus, TicketStatus>> = {
  submitted:     'open',
  open:          'under_review',
  under_review:  'escalated',
  escalated:     'in_discussion',
  in_discussion: 'resolved',
};

export const TERMINAL_STAGES: TicketStatus[] = ['resolved', 'declined', 'merged'];

// Stages visible to all employees (not just submitter)
export const PUBLIC_STAGES: TicketStatus[] = [
  'open', 'under_review', 'escalated', 'in_discussion', 'resolved', 'merged',
];

export interface MockUser {
  id: string;
  name: string;
  initials: string;
  role: 'employee' | 'council';
  department: string;
}

export interface TicketTransition {
  from: TicketStatus;
  to: TicketStatus;
  actor: string;
  timestamp: string;
  note?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  submittedBy: string;
  status: TicketStatus;
  declineReason?: string;
  mergedInto?: string;
  createdAt: string;
  votes: string[];
  grade?: CommonalityGrade;
  transitions: TicketTransition[];
  isUrgent?: boolean;
  urgencyNote?: string;   // council-only note from AI tone detection
}

export interface KbEntry {
  id: string;
  title: string;
  section?: string;       // e.g. "§4.2"
  summary: string;
  url: string;
  tags: string[];
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  ticketTitle: string;
  ticketId: string;
}

export interface NewsItem {
  id: string;
  type: 'news' | 'achievement';
  title: string;
  body: string;
  date: string;
  emoji: string;
}

export interface QuickLink {
  label: string;
  url: string;
  icon: string;
}

export const MOCK_USERS: MockUser[] = [
  { id: 'u1', name: 'Ayşe Kaya',     initials: 'AK', role: 'employee', department: 'Engineering' },
  { id: 'u2', name: 'Mehmet Demir',  initials: 'MD', role: 'employee', department: 'Design' },
  { id: 'c1', name: 'Zeynep Arslan', initials: 'ZA', role: 'council',  department: 'Council' },
  { id: 'c2', name: 'Can Öztürk',    initials: 'CO', role: 'council',  department: 'Council' },
];

export const CATEGORIES = [
  'Work-Life Balance', 'Remote Work Policy', 'Office Facilities', 'Career Development',
  'Health & Wellness', 'Team Culture', 'Compensation & Benefits', 'Process Improvement',
  'Communication', 'Other',
];

export const SEED_TICKETS: Ticket[] = [
  {
    id: 'T-1001', title: 'Remote Work Policy Extension',
    description: 'Many employees requested an extension of the flexible remote work policy introduced last year. Commute times are long and productivity has remained high.',
    category: 'Remote Work Policy', submittedBy: 'u1', status: 'resolved',
    createdAt: '2025-11-15T09:20:00Z', votes: ['u1', 'u2', 'c1'], grade: 'Widely Reported',
    transitions: [
      { from: 'submitted', to: 'open',          actor: 'Zeynep Arslan', timestamp: '2025-11-16T10:00:00Z', note: 'Opened for employee voting.' },
      { from: 'open',      to: 'under_review',  actor: 'Zeynep Arslan', timestamp: '2025-12-01T09:00:00Z', note: '32 votes collected — moving to review.' },
      { from: 'under_review', to: 'in_discussion', actor: 'Can Öztürk', timestamp: '2025-12-15T11:00:00Z', note: 'Liaising with HR on feasibility.' },
      { from: 'in_discussion', to: 'resolved',  actor: 'Zeynep Arslan', timestamp: '2026-01-10T14:00:00Z', note: 'HR approved hybrid policy through 2026.' },
    ],
  },
  {
    id: 'T-1002', title: 'Ergonomic Office Equipment Request',
    description: 'Standing desks and ergonomic chairs should be provided for all full-time employees. Long hours at non-ergonomic setups are causing health issues.',
    category: 'Office Facilities', submittedBy: 'u2', status: 'in_discussion',
    createdAt: '2025-12-01T11:00:00Z', votes: ['u1', 'u2'], grade: 'Emerging',
    transitions: [
      { from: 'submitted',    to: 'open',          actor: 'Can Öztürk',    timestamp: '2025-12-03T09:00:00Z' },
      { from: 'open',         to: 'under_review',  actor: 'Zeynep Arslan', timestamp: '2026-01-05T10:00:00Z', note: 'Reviewing budget.' },
      { from: 'under_review', to: 'in_discussion', actor: 'Can Öztürk',    timestamp: '2026-02-01T11:00:00Z', note: 'Procurement in progress.' },
    ],
  },
  {
    id: 'T-1003', title: 'Mentorship Program for Junior Engineers',
    description: 'A structured 6-month mentorship pairing junior engineers with senior staff would improve onboarding and retention.',
    category: 'Career Development', submittedBy: 'u1', status: 'open',
    createdAt: '2026-01-10T14:30:00Z', votes: ['u2'], grade: 'Emerging',
    transitions: [
      { from: 'submitted', to: 'open', actor: 'Zeynep Arslan', timestamp: '2026-01-12T09:00:00Z', note: 'Opened for community voting.' },
    ],
  },
  {
    id: 'T-1004', title: 'Mental Health Days Off Policy',
    description: 'Employees should be allowed to take up to 2 dedicated mental health days per quarter without using their annual leave balance.',
    category: 'Health & Wellness', submittedBy: 'u2', status: 'under_review',
    createdAt: '2026-02-03T08:45:00Z', votes: ['u1', 'u2', 'c2', 'c1'], grade: 'Widely Reported',
    transitions: [
      { from: 'submitted', to: 'open',         actor: 'Can Öztürk',    timestamp: '2026-02-05T09:00:00Z' },
      { from: 'open',      to: 'under_review', actor: 'Zeynep Arslan', timestamp: '2026-02-20T10:00:00Z', note: 'High vote count — escalating to council review.' },
    ],
  },
  {
    id: 'T-1005', title: 'Team Building Budget Increase',
    description: 'The quarterly team event budget of ₺500/person is insufficient. Proposing an increase to ₺1200/person.',
    category: 'Team Culture', submittedBy: 'u1', status: 'declined',
    declineReason: 'Budget constraints this quarter. Council will revisit in Q3 2026.',
    createdAt: '2026-01-20T10:00:00Z', votes: [], grade: 'New Voice',
    transitions: [
      { from: 'submitted', to: 'open',     actor: 'Can Öztürk',    timestamp: '2026-01-22T09:00:00Z' },
      { from: 'open',      to: 'declined', actor: 'Zeynep Arslan', timestamp: '2026-02-10T15:00:00Z', note: 'Budget constraints this quarter.' },
    ],
  },
  {
    id: 'T-1006', title: 'Lunch Subsidy Reinstatement',
    description: 'The lunch subsidy suspended in 2024 should be reinstated. Rising food costs near the office have significantly impacted daily expenses.',
    category: 'Compensation & Benefits', submittedBy: 'u2', status: 'submitted',
    createdAt: '2026-03-01T13:15:00Z', votes: ['u1'], grade: 'Emerging',
    transitions: [],
  },
  {
    id: 'T-1007', title: 'SGK Medical Check Reports — Process Clarification',
    description: 'Employees are unsure how to report SGK health checks and whether the NPA reporting mechanism applies. Need guidance on Medical Check Reports process for Istanbul and Izmir offices.',
    category: 'Health & Wellness', submittedBy: 'u1', status: 'resolved',
    createdAt: '2025-07-10T09:00:00Z', votes: ['u1', 'u2', 'c1', 'c2'], grade: 'Widely Reported',
    transitions: [
      { from: 'submitted', to: 'open',         actor: 'Can Öztürk',    timestamp: '2025-07-11T09:00:00Z' },
      { from: 'open',      to: 'under_review', actor: 'Zeynep Arslan', timestamp: '2025-07-14T10:00:00Z', note: 'Escalated to HR for KB documentation.' },
      { from: 'under_review', to: 'resolved',  actor: 'Zeynep Arslan', timestamp: '2025-07-19T11:00:00Z', note: 'KB Pages on Medical Check Reports Process published. NPA reporting introduced.' },
    ],
    // This ticket is the demo auto-resolve anchor
  },
];

export const NEWS_AND_ACHIEVEMENTS: NewsItem[] = [
  { id: 'n1', type: 'achievement', emoji: '🎉', title: 'Remote Work Policy Approved!', date: '2026-03-05T10:00:00Z', body: 'Following 32 employee votes and council deliberation, the hybrid remote policy has been officially extended through end of 2026.' },
  { id: 'n2', type: 'news',        emoji: '📋', title: 'Q1 Council Meeting Summary',   date: '2026-03-01T09:00:00Z', body: 'The Employee Council held its Q1 meeting on Feb 28. Key items: office equipment, mentorship program scoping, and the lunch subsidy proposal.' },
  { id: 'n3', type: 'achievement', emoji: '🪑', title: 'Ergonomic Equipment Rollout Begins', date: '2026-02-20T11:00:00Z', body: '50 standing desks and ergonomic chairs ordered for Istanbul office. Delivery expected end of April.' },
  { id: 'n4', type: 'news',        emoji: '🗳️', title: 'New Council Members Elected',  date: '2026-01-15T08:00:00Z', body: 'Zeynep Arslan and Can Öztürk elected as council representatives. Term runs through December 2026.' },
  { id: 'n5', type: 'achievement', emoji: '💬', title: '100 Voices Heard',              date: '2025-12-10T14:00:00Z', body: 'The Voice Board has received over 100 submissions since launch. Every voice matters.' },
];

export const QUICK_LINKS: QuickLink[] = [
  { label: 'Employee Council KB',    url: 'https://kb.epam.com/spaces/EPMTHC/pages/2305073420/Employee+Council', icon: '📚' },
  { label: 'EPAM Turkey HR Portal',  url: 'https://kb.epam.com', icon: '🏢' },
  { label: 'Benefits Overview',      url: 'https://kb.epam.com', icon: '💼' },
  { label: 'Facilities Request',     url: 'https://kb.epam.com', icon: '🏗️' },
  { label: 'Learning & Development', url: 'https://kb.epam.com', icon: '📖' },
];

// Mock KB / HR Policy entries used by Smart Submission AI check
export const MOCK_KB_ENTRIES: KbEntry[] = [
  {
    id: 'kb-001',
    title: 'Medical Check Reports Process — SGK',
    section: 'KB:Medical',
    summary: 'KB Pages on Medical Check Reports Process published (Jul 2025). Opportunity to report SGK checks as NPA introduced. Covers Istanbul and Izmir offices.',
    url: 'https://kb.epam.com/spaces/EPMTHC/pages/2305073420/Employee+Council',
    tags: ['SGK', 'medical', 'health', 'NPA', 'check', 'report'],
  },
  {
    id: 'kb-002',
    title: 'Remote Work & Hybrid Policy',
    section: '§3.1',
    summary: 'Employees may work remotely up to 3 days/week subject to manager approval. Policy extended through end of 2026 per council decision Jan 2026.',
    url: 'https://kb.epam.com',
    tags: ['remote', 'hybrid', 'WFH', 'work from home', 'flexible'],
  },
  {
    id: 'kb-003',
    title: 'Medical Reimbursement Procedure',
    section: '§4.2',
    summary: 'Employees can claim up to ₺2,000/year for medical expenses not covered by standard insurance. Submit receipts via HR portal within 30 days.',
    url: 'https://kb.epam.com',
    tags: ['medical', 'reimbursement', 'health', 'insurance', 'expense'],
  },
  {
    id: 'kb-004',
    title: 'Annual Leave & Special Leave Policy',
    section: '§2.4',
    summary: 'Employees accrue 15 days annual leave per year. Mental health and personal leave guidance updated Q1 2026. Separate from sick leave.',
    url: 'https://kb.epam.com',
    tags: ['leave', 'annual', 'holiday', 'mental health', 'time off'],
  },
  {
    id: 'kb-005',
    title: 'Office Facilities & Equipment Requests',
    section: '§5.1',
    summary: 'Standard equipment requests submitted via Facilities portal. Ergonomic equipment available upon occupational health recommendation.',
    url: 'https://kb.epam.com',
    tags: ['equipment', 'desk', 'chair', 'ergonomic', 'office', 'facilities'],
  },
];

// The SGK ticket ID used as the auto-resolve demo anchor
export const AUTO_RESOLVE_DEMO_TICKET_ID = 'T-1007';
