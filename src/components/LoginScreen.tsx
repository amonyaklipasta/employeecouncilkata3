import { useState } from 'react';
import { useStore } from '../store/useStore';
import { MOCK_USERS } from '../data/mockData';

export function LoginScreen() {
  const [selectedUser, setSelectedUser] = useState(MOCK_USERS[0].id);
  const login = useStore((s) => s.login);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFAFA] dark:bg-[#060606] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#0e0e1a] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-[#1E2235]">
          {/* Hero */}
          <div className="relative bg-gradient-to-br from-[#0047FF] via-[#0078C2] to-[#8453D2] px-8 pt-10 pb-9 text-white overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5" />
            <div className="relative flex items-center justify-center gap-3 mb-6">
              <div className="flex gap-1">
                {['#e53935', '#fb8c00', '#43a047', '#1e88e5'].map((c, i) => (
                  <div key={i} className="w-4 h-4 rounded-sm shadow-sm" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span className="text-2xl font-black tracking-widest">EPAM</span>
            </div>
            <div className="relative text-center">
              <h1 className="text-xl font-bold">Employee Council</h1>
              <p className="text-blue-100 text-sm mt-1">Voice Board Portal · Türkiye</p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="text-base font-bold text-[#060606] dark:text-[#FBFAFA] mb-1">Sign in</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Select your demo persona to continue
            </p>

            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Demo User
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full border border-gray-200 dark:border-[#1E2235] rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-[#060606] text-[#060606] dark:text-[#FBFAFA] focus:outline-none focus:ring-2 focus:ring-[#0047FF] dark:focus:ring-[#00F6FF] mb-6"
            >
              {MOCK_USERS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.role === 'council' ? 'Council Member' : 'Employee'} ({u.department})
                </option>
              ))}
            </select>

            <button
              onClick={() => login(selectedUser)}
              className="w-full bg-gradient-to-r from-[#0047FF] to-[#0078C2] hover:from-[#003dd4] hover:to-[#0068a8] text-white font-bold py-3 rounded-lg transition-all shadow-sm hover:shadow-md text-sm"
            >
              Sign in with EPAM SSO
            </button>

            <p className="text-xs text-center text-gray-400 dark:text-gray-600 mt-4">
              Demo environment — no real authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
