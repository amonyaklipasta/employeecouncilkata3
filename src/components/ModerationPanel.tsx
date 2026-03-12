import { useState } from 'react';
import toast from 'react-hot-toast';
import type { Ticket } from '../data/mockData';
import { NEXT_STAGE, STAGE_LABEL, TERMINAL_STAGES } from '../data/mockData';
import { useStore } from '../store/useStore';

interface Props {
  ticket: Ticket;
  onClose: () => void;
}

type Action = 'advance' | 'decline' | 'merge';

const inputClass =
  'w-full border border-gray-200 dark:border-[#1E2235] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#060606] text-[#060606] dark:text-[#FBFAFA] focus:outline-none focus:ring-2 focus:ring-[#0047FF] dark:focus:ring-[#00F6FF] resize-none';

export function ModerationPanel({ ticket, onClose }: Props) {
  const { advanceTicket, declineTicket, mergeTicket, tickets } = useStore();
  const [action, setAction]   = useState<Action | null>(null);
  const [note, setNote]       = useState('');
  const [mergeId, setMergeId] = useState('');

  if (TERMINAL_STAGES.includes(ticket.status)) {
    return (
      <div className="text-sm text-gray-400 text-center py-3">
        This ticket is {STAGE_LABEL[ticket.status].toLowerCase()} — no further actions available.
      </div>
    );
  }

  const nextStage   = NEXT_STAGE[ticket.status];
  const otherTickets = tickets.filter((t) => t.id !== ticket.id && !TERMINAL_STAGES.includes(t.status));

  const handleAdvance = () => {
    advanceTicket(ticket.id, note || undefined);
    toast.success(`Moved to ${STAGE_LABEL[nextStage!]}`);
    onClose();
  };

  const handleDecline = () => {
    if (!note.trim()) { toast.error('Provide a reason for declining.'); return; }
    declineTicket(ticket.id, note);
    toast.success('Ticket declined.');
    onClose();
  };

  const handleMerge = () => {
    if (!mergeId) { toast.error('Select a target ticket.'); return; }
    mergeTicket(ticket.id, mergeId);
    toast.success(`Merged into ${mergeId}.`);
    onClose();
  };

  return (
    <div className="space-y-3">
      {!action ? (
        <>
          <p className="text-xs text-gray-400">Choose an action for this ticket:</p>
          <div className="flex gap-2 flex-wrap">
            {nextStage && (
              <button
                onClick={() => setAction('advance')}
                className="flex-1 min-w-[120px] bg-gradient-to-r from-[#0047FF] to-[#0078C2] text-white text-sm font-semibold py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md"
              >
                → {STAGE_LABEL[nextStage]}
              </button>
            )}
            <button
              onClick={() => setAction('merge')}
              className="flex-1 min-w-[100px] bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-all shadow-sm"
            >
              ⊕ Merge
            </button>
            <button
              onClick={() => setAction('decline')}
              className="flex-1 min-w-[100px] bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-all shadow-sm"
            >
              ✗ Decline
            </button>
          </div>
        </>
      ) : action === 'advance' ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[#060606] dark:text-[#FBFAFA]">
            Move to <span className="text-[#0047FF] dark:text-[#00F6FF]">{STAGE_LABEL[nextStage!]}</span>
          </p>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
            placeholder="Optional note for the transition log…" className={inputClass} />
          <div className="flex gap-2">
            <button onClick={handleAdvance} className="flex-1 bg-gradient-to-r from-[#0047FF] to-[#0078C2] text-white text-sm font-semibold py-2.5 rounded-lg">Confirm</button>
            <button onClick={() => setAction(null)} className="px-4 border border-gray-200 dark:border-[#1E2235] text-gray-500 dark:text-gray-400 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-[#0e0e1a]">Back</button>
          </div>
        </div>
      ) : action === 'decline' ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[#060606] dark:text-[#FBFAFA]">Decline reason <span className="text-red-400">*</span></p>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
            placeholder="Explain why this ticket is being declined…" className={inputClass} />
          <div className="flex gap-2">
            <button onClick={handleDecline} className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold py-2.5 rounded-lg">Confirm Decline</button>
            <button onClick={() => setAction(null)} className="px-4 border border-gray-200 dark:border-[#1E2235] text-gray-500 dark:text-gray-400 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-[#0e0e1a]">Back</button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[#060606] dark:text-[#FBFAFA]">Merge into another ticket</p>
          <select value={mergeId} onChange={(e) => setMergeId(e.target.value)} className={inputClass}>
            <option value="">— select target ticket —</option>
            {otherTickets.map((t) => (
              <option key={t.id} value={t.id}>{t.id} · {t.title.slice(0, 40)}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button onClick={handleMerge} className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold py-2.5 rounded-lg">Confirm Merge</button>
            <button onClick={() => setAction(null)} className="px-4 border border-gray-200 dark:border-[#1E2235] text-gray-500 dark:text-gray-400 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-[#0e0e1a]">Back</button>
          </div>
        </div>
      )}
    </div>
  );
}
