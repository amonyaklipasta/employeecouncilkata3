import type { Ticket, TicketStatus } from '../data/mockData';
import { LIFECYCLE_STAGES, STAGE_LABEL } from '../data/mockData';

const STAGE_ACTIVE_COLOR: Record<string, string> = {
  submitted:     'bg-slate-500 text-white',
  open:          'bg-[#00F6FF] text-[#060606]',
  under_review:  'bg-[#0078C2] text-white',
  escalated:     'bg-[#8453D2] text-white',
  in_discussion: 'bg-[#4A71BD] text-white',
  resolved:      'bg-emerald-500 text-white',
};

interface Props {
  ticket: Ticket;
}

function stageIndex(status: TicketStatus): number {
  return LIFECYCLE_STAGES.indexOf(status);
}

export function LifecycleStepper({ ticket }: Props) {
  const { status, transitions } = ticket;
  const isTerminalExit = status === 'declined' || status === 'merged';
  const currentIdx = isTerminalExit ? -1 : stageIndex(status);

  return (
    <div className="w-full">
      {/* Stage pills */}
      <div className="flex items-center gap-0 overflow-x-auto pb-1">
        {LIFECYCLE_STAGES.map((stage, idx) => {
          const isDone    = !isTerminalExit && idx < currentIdx;
          const isCurrent = !isTerminalExit && idx === currentIdx;

          return (
            <div key={stage} className="flex items-center shrink-0">
              {/* Step */}
              <div className={`relative flex items-center justify-center rounded px-2 py-1 text-xs font-semibold transition-all whitespace-nowrap ${
                isCurrent
                  ? `${STAGE_ACTIVE_COLOR[stage]} shadow-sm ring-2 ring-offset-1 ring-current`
                  : isDone
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-gray-100 dark:bg-[#1E2235] text-gray-400 dark:text-gray-600'
              }`}>
                {isDone && <span className="mr-1 text-[10px]">✓</span>}
                {STAGE_LABEL[stage]}
              </div>
              {/* Connector */}
              {idx < LIFECYCLE_STAGES.length - 1 && (
                <div className={`w-4 h-0.5 shrink-0 ${isDone ? 'bg-emerald-400' : 'bg-gray-200 dark:bg-[#1E2235]'}`} />
              )}
            </div>
          );
        })}

        {/* Terminal exit badges */}
        {isTerminalExit && (
          <>
            <div className="w-4 h-0.5 shrink-0 bg-gray-200 dark:bg-[#1E2235]" />
            <div className={`px-2 py-1 rounded text-xs font-semibold shrink-0 ${
              status === 'declined'
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-2 ring-red-400'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 ring-2 ring-amber-400'
            }`}>
              {STAGE_LABEL[status]}
            </div>
          </>
        )}
      </div>

      {/* Transition history (if any) */}
      {transitions.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {transitions.map((t, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="text-[10px] mt-0.5 shrink-0 text-gray-300 dark:text-gray-600">
                {new Date(t.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
              <span className="shrink-0 font-medium text-[#0047FF] dark:text-[#00F6FF]">{t.actor}</span>
              <span className="shrink-0">·</span>
              <span className="font-mono text-[10px] px-1 py-0.5 bg-gray-100 dark:bg-[#1E2235] rounded shrink-0">
                {STAGE_LABEL[t.from]} → {STAGE_LABEL[t.to]}
              </span>
              {t.note && <span className="text-gray-400 dark:text-gray-500 italic">"{t.note}"</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
