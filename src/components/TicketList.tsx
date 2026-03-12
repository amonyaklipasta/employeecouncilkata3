import { useStore } from '../store/useStore';
import { TicketCard } from './TicketCard';
import type { TicketStatus } from '../data/mockData';
import { STAGE_LABEL } from '../data/mockData';

const COUNCIL_GROUPS: { status: TicketStatus; accent: string }[] = [
  { status: 'submitted',     accent: 'text-slate-500 dark:text-slate-400' },
  { status: 'open',          accent: 'text-[#00F6FF]' },
  { status: 'under_review',  accent: 'text-[#0078C2] dark:text-blue-300' },
  { status: 'escalated',     accent: 'text-[#8453D2] dark:text-[#B896FF]' },
  { status: 'in_discussion', accent: 'text-[#4A71BD] dark:text-[#7BA8FF]' },
  { status: 'resolved',      accent: 'text-emerald-600 dark:text-emerald-400' },
  { status: 'declined',      accent: 'text-red-600 dark:text-red-400' },
  { status: 'merged',        accent: 'text-amber-600 dark:text-amber-400' },
];

export function TicketList() {
  const { currentUser, visibleTickets } = useStore();
  const tickets = visibleTickets();
  const isCouncil = currentUser.role === 'council';

  if (tickets.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-600">
        <p className="text-base mb-1">No tickets yet</p>
        <p className="text-sm">Submit a ticket to get started.</p>
      </div>
    );
  }

  if (isCouncil) {
    return (
      <div className="space-y-8">
        {COUNCIL_GROUPS.map(({ status, accent }) => {
          const group = tickets.filter((t) => t.status === status);
          if (group.length === 0) return null;
          return (
            <Section key={status} title={STAGE_LABEL[status]} count={group.length} accent={accent}>
              {group.map((t) => <TicketCard key={t.id} ticket={t} />)}
            </Section>
          );
        })}
      </div>
    );
  }

  // Employee: newest first, by votes secondarily
  const sorted = [...tickets].sort((a, b) => b.votes.length - a.votes.length);
  return (
    <div className="space-y-3">
      {sorted.map((t) => <TicketCard key={t.id} ticket={t} />)}
    </div>
  );
}

function Section({ title, count, accent, children }: {
  title: string; count: number; accent: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h2 className={`text-xs font-bold uppercase tracking-widest ${accent}`}>{title}</h2>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#1E2235] text-gray-500 dark:text-gray-400">
          {count}
        </span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
