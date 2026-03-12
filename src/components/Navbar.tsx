import { useStore } from '../store/useStore';
import { MOCK_USERS } from '../data/mockData';

export function Navbar() {
  const { currentUser, darkMode, switchRole, toggleDarkMode, logout } = useStore();

  return (
    <nav className="sticky top-0 z-50 shadow-md">
      {/* Gradient bar */}
      <div className="h-0.5 bg-gradient-to-r from-[#0047FF] via-[#8453D2] to-[#0078C2] dark:from-[#00F6FF] dark:via-[#B896FF] dark:to-[#7BA8FF]" />
      <div className="bg-[#FBFAFA]/95 dark:bg-[#060606]/95 backdrop-blur-sm border-b border-gray-100 dark:border-[#1E2235]">
        <div className="max-w-3xl mx-auto px-4 h-13 flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5 items-center">
              {['#e53935', '#fb8c00', '#43a047', '#1e88e5'].map((c, i) => (
                <div key={i} className="w-2 h-2 rounded-sm" style={{ backgroundColor: c }} />
              ))}
            </div>
            <span className="font-black text-sm tracking-widest text-[#060606] dark:text-[#FBFAFA]">EPAM</span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="text-sm font-semibold text-[#0047FF] dark:text-[#00F6FF] hidden sm:inline">
              Voice Board
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2.5">
            {/* Role badge */}
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              currentUser.role === 'council'
                ? 'bg-gradient-to-r from-[#8453D2] to-[#4A71BD] text-white'
                : 'bg-gradient-to-r from-[#0047FF] to-[#0078C2] text-white'
            }`}>
              {currentUser.role === 'council' ? 'Council' : 'Employee'}
            </span>

            {/* User switcher */}
            <select
              value={currentUser.id}
              onChange={(e) => switchRole(e.target.value)}
              className="text-xs border border-gray-200 dark:border-[#1E2235] bg-white dark:bg-[#0e0e1a] text-[#060606] dark:text-[#FBFAFA] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#0047FF] dark:focus:ring-[#00F6FF] cursor-pointer"
            >
              {MOCK_USERS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            {/* Dark mode */}
            <button
              onClick={toggleDarkMode}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 dark:border-[#1E2235] hover:bg-gray-100 dark:hover:bg-[#0e0e1a] transition-colors text-sm"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀' : '🌙'}
            </button>

            <button
              onClick={logout}
              className="text-xs text-gray-400 hover:text-[#0047FF] dark:hover:text-[#00F6FF] transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
