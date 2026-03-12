import { useStore } from '../store/useStore';

export function AuditLog() {
  const auditLog = useStore((s) => s.auditLog);

  if (auditLog.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
        No audit entries yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Time
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Actor
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Action
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Ticket
            </th>
          </tr>
        </thead>
        <tbody>
          {[...auditLog].reverse().map((entry) => (
            <tr
              key={entry.id}
              className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20"
            >
              <td className="py-2 px-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {new Date(entry.timestamp).toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </td>
              <td className="py-2 px-3 text-xs font-medium text-[#1a1a2e] dark:text-white whitespace-nowrap">
                {entry.actor}
              </td>
              <td className="py-2 px-3 text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {entry.action}
              </td>
              <td className="py-2 px-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-mono text-xs text-[#0f6cbd] dark:text-blue-400 mr-1">
                  {entry.ticketId}
                </span>
                {entry.ticketTitle}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
