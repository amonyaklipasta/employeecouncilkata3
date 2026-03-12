import { useState } from 'react';
import type { Ticket } from '../data/mockData';
import { STAGE_LABEL, TERMINAL_STAGES } from '../data/mockData';
import { useStore } from '../store/useStore';
import { ModerationPanel } from './ModerationPanel';
import { LifecycleStepper } from './LifecycleStepper';

const STATUS_STYLE: Record<string, string> = {
  submitted:     'bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-300',
  open:          'bg-[#00F6FF]/20 text-[#0078C2] dark:text-[#00F6FF]',
  under_review:  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  escalated:     'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-[#B896FF]',
  in_discussion: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-[#7BA8FF]',
  resolved:      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  declined:      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  merged:        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const GRADE_STYLE: Record<string, string> = {
  'Widely Reported': 'text-red-500 dark:text-red-400',
  'Emerging':        'text-yellow-600 dark:text-yellow-400',
  'New Voice':       'text-emerald-600 dark:text-emerald-400',
};
const GRADE_ICON: Record<string, string> = {
  'Widely Reported': '🔥', 'Emerging': '📈', 'New Voice': '💡',
};

interface Props { ticket: Ticket }

export function TicketCard({ ticket }: Props) {
  const { currentUser, voteTicket } = useStore();
  const [expanded, setExpanded] = useState(false);
  const isOwner      = ticket.submittedBy === currentUser.id;
  const isCouncil    = currentUser.role === 'council';
  const hasVoted     = ticket.votes.includes(currentUser.id);
  const canModerate  = isCouncil && !TERMINAL_STAGES.includes(ticket.status);

  return (
    <div className="bg-white dark:bg-[#0e0e1a] rounded-xl border border-gray-100 dark:border-[#1E2235] shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 cursor-pointer" onClick={() => setExpanded((v) => !v)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs text-gray-400 font-mono">{ticket.id}</span>
              <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-[#1E2235] text-gray-500 dark:text-gray-400 rounded-full">
                {ticket.category}
              </span>
              {ticket.grade && (
                <span className={`text-xs font-medium ${GRADE_STYLE[ticket.grade] ?? ''}`}>
                  {GRADE_ICON[ticket.grade]} {ticket.grade}
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-[#060606] dark:text-[#FBFAFA] leading-snug">
              {ticket.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[ticket.status] ?? ''}`}>
              {STAGE_LABEL[ticket.status]}
            </span>
            <span className="text-gray-400 text-xs">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>

        {/* Vote row */}
        <div className="flex items-center mt-2.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => voteTicket(ticket.id)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
              hasVoted
                ? 'bg-[#0047FF] dark:bg-[#00F6FF] text-white dark:text-[#060606] border-transparent'
                : 'border-gray-200 dark:border-[#1E2235] text-gray-500 dark:text-gray-400 hover:border-[#0047FF] dark:hover:border-[#00F6FF]'
            }`}
          >
            ▲ {ticket.votes.length} {ticket.votes.length === 1 ? 'vote' : 'votes'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 dark:border-[#1E2235] pt-3">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {ticket.description}
          </p>

          {/* Lifecycle stepper */}
          <LifecycleStepper ticket={ticket} />

          <div className="text-xs text-gray-400">
            Submitted {new Date(ticket.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            {isOwner && <span className="ml-2 text-[#0047FF] dark:text-[#00F6FF]">· Your submission</span>}
          </div>

          {ticket.status === 'declined' && ticket.declineReason && (isOwner || isCouncil) && (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg p-3">
              <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">Council Decision</p>
              <p className="text-sm text-red-700 dark:text-red-300">{ticket.declineReason}</p>
            </div>
          )}

          {ticket.status === 'merged' && ticket.mergedInto && (
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg p-3">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Merged</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">Combined into ticket {ticket.mergedInto}</p>
            </div>
          )}

          {canModerate && (
            <div className="border-t border-gray-100 dark:border-[#1E2235] pt-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Council Actions</p>
              <ModerationPanel ticket={ticket} onClose={() => setExpanded(false)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
