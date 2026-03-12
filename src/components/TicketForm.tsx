import { useState } from 'react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { CATEGORIES, MOCK_KB_ENTRIES } from '../data/mockData';
import { AiAssistantPanel } from './AiAssistantPanel';
import { analyzeSubmission } from '../services/aiService';
import type { AiAnalysis } from '../services/aiService';

interface Props { onClose: () => void }

export function TicketForm({ onClose }: Props) {
  const { tickets, submitTicket, currentUser } = useStore();
  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory]     = useState(CATEGORIES[0]);
  const [isUrgent, setIsUrgent]     = useState(false);
  const [analyzing, setAnalyzing]   = useState(false);
  const [analysis, setAnalysis]     = useState<AiAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in the title and description.');
      return;
    }
    setAnalyzing(true);
    try {
      const result = await analyzeSubmission(title, description, category, tickets, MOCK_KB_ENTRIES, isUrgent);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      toast.error('AI analysis failed — submitting directly.');
      submitTicket({ title, description, category, submittedBy: currentUser.id, isUrgent });
      toast.success('Ticket submitted for council review!');
      onClose();
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConfirm = () => {
    submitTicket({
      title,
      description,
      category: analysis?.suggestedCategory ?? category,
      submittedBy: currentUser.id,
      grade: analysis?.grade,
      isUrgent,
      urgencyNote: analysis?.urgencyNote ?? undefined,
    });
    toast.success('Ticket submitted for council review!');
    onClose();
  };

  const inputClass =
    'w-full border border-gray-200 dark:border-[#1E2235] rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-[#0e0e1a] text-[#060606] dark:text-[#FBFAFA] focus:outline-none focus:ring-2 focus:ring-[#0047FF] dark:focus:ring-[#00F6FF] placeholder-gray-400 transition';

  return (
    <div className="space-y-4">
      {!analysis ? (
        <>
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of your suggestion or concern" className={inputClass} />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              rows={5} placeholder="Describe the issue and the outcome you're hoping for…"
              className={`${inputClass} resize-none`} />
          </div>

          {/* Urgency toggle */}
          <button
            type="button"
            onClick={() => setIsUrgent((v) => !v)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-sm font-semibold ${
              isUrgent
                ? 'border-red-500 bg-red-50 dark:bg-red-900/15 text-red-600 dark:text-red-400'
                : 'border-gray-200 dark:border-[#1E2235] bg-white dark:bg-[#0e0e1a] text-gray-500 dark:text-gray-400 hover:border-red-300'
            }`}
          >
            <span className="text-lg leading-none">{isUrgent ? '🚨' : '🔔'}</span>
            <div className="text-left flex-1">
              <div>{isUrgent ? 'Marked as Urgent' : 'Mark as Urgent'}</div>
              {isUrgent && (
                <div className="text-xs font-normal opacity-75 mt-0.5">
                  Council will be notified for priority review. Urgency is not shown to other employees.
                </div>
              )}
            </div>
            <div className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${isUrgent ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isUrgent ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
          </button>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex-1 bg-gradient-to-r from-[#0047FF] to-[#0078C2] hover:from-[#003dd4] hover:to-[#0068a8] dark:from-[#00F6FF] dark:to-[#7BA8FF] dark:text-[#060606] disabled:opacity-50 text-white text-sm font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {analyzing ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Checking 3 sources…
                </>
              ) : '✦ Smart Check & Submit'}
            </button>
            <button onClick={onClose}
              className="px-4 border border-gray-200 dark:border-[#1E2235] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#0e0e1a] text-sm rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </>
      ) : (
        <AiAssistantPanel
          analysis={analysis}
          tickets={tickets}
          onConfirm={handleConfirm}
          onDiscard={() => setAnalysis(null)}
        />
      )}
    </div>
  );
}
