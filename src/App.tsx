import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store/useStore';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { TicketForm } from './components/TicketForm';
import { TicketList } from './components/TicketList';
import { AuditLog } from './components/AuditLog';
import { NewsTab } from './components/NewsTab';
import { ResourcesTab } from './components/ResourcesTab';

type Tab = 'board' | 'news' | 'resources' | 'audit';

const EMPLOYEE_TABS: { id: Tab; label: string }[] = [
  { id: 'board',     label: 'Board' },
  { id: 'news',      label: 'News & Achievements' },
  { id: 'resources', label: 'KB & Links' },
];

const COUNCIL_TABS: { id: Tab; label: string }[] = [
  { id: 'board',     label: 'Tickets' },
  { id: 'news',      label: 'News & Achievements' },
  { id: 'resources', label: 'KB & Links' },
  { id: 'audit',     label: 'Audit Log' },
];

export default function App() {
  const { loggedIn, currentUser } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('board');
  const isCouncil = currentUser.role === 'council';
  const tabs = isCouncil ? COUNCIL_TABS : EMPLOYEE_TABS;

  if (!loggedIn) return <LoginScreen />;

  return (
    <div className="min-h-screen bg-[#FBFAFA] dark:bg-[#060606] transition-colors duration-200">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '13px',
            borderRadius: '10px',
            background: '#0e0e1a',
            color: '#FBFAFA',
            border: '1px solid #1E2235',
          },
        }}
      />
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-xl font-black text-[#060606] dark:text-[#FBFAFA]">
              {isCouncil ? 'Council Dashboard' : 'Voice Board'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {isCouncil
                ? `Welcome, ${currentUser.name}. Review and moderate submitted tickets.`
                : `Raise a concern or suggestion. Approved tickets are visible to all employees.`}
            </p>
          </div>
          {!isCouncil && activeTab === 'board' && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-[#0047FF] to-[#0078C2] hover:from-[#003dd4] hover:to-[#0068a8] dark:from-[#00F6FF] dark:to-[#7BA8FF] dark:text-[#060606] text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 shadow-sm hover:shadow-md"
            >
              + New Ticket
            </button>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-[#0e0e1a] p-1 rounded-xl border border-gray-100 dark:border-[#1E2235] overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#0047FF] to-[#0078C2] dark:from-[#00F6FF] dark:to-[#7BA8FF] text-white dark:text-[#060606] shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-[#0047FF] dark:hover:text-[#00F6FF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Ticket submission modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-16 px-4">
            <div className="bg-white dark:bg-[#0e0e1a] rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-gray-100 dark:border-[#1E2235]">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-[#060606] dark:text-[#FBFAFA]">
                  Submit a Ticket
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none transition-colors"
                >
                  ✕
                </button>
              </div>
              <TicketForm onClose={() => setShowForm(false)} />
            </div>
          </div>
        )}

        {/* Tab content */}
        {activeTab === 'board' && <TicketList />}
        {activeTab === 'news' && <NewsTab />}
        {activeTab === 'resources' && <ResourcesTab />}
        {activeTab === 'audit' && (
          <div className="bg-white dark:bg-[#0e0e1a] rounded-xl border border-gray-100 dark:border-[#1E2235] p-4">
            <AuditLog />
          </div>
        )}
      </main>
    </div>
  );
}
