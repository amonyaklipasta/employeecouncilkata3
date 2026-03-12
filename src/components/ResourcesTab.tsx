import { QUICK_LINKS } from '../data/mockData';

export function ResourcesTab() {
  return (
    <div className="space-y-8">
      {/* Employee Council KB — hero card */}
      <div className="rounded-xl overflow-hidden border border-[#0047FF]/30 dark:border-[#00F6FF]/30 shadow-md">
        <div className="bg-gradient-to-r from-[#0047FF] to-[#0078C2] dark:from-[#060606] dark:to-[#0e0e1a] px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <div>
              <h2 className="text-white dark:text-[#00F6FF] font-bold text-base">Employee Council KB</h2>
              <p className="text-blue-100 dark:text-gray-400 text-sm mt-0.5">
                Official knowledge base for EPAM Türkiye Employee Council
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0e0e1a] px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Find council decisions, policies, meeting minutes, and more.
          </p>
          <a
            href="https://kb.epam.com/spaces/EPMTHC/pages/2305073420/Employee+Council"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 ml-4 bg-gradient-to-r from-[#0047FF] to-[#0078C2] dark:from-[#00F6FF] dark:to-[#7BA8FF] text-white dark:text-[#060606] text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:shadow-md whitespace-nowrap"
          >
            Open KB →
          </a>
        </div>
      </div>

      {/* Quick Links */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#0047FF] dark:text-[#00F6FF] mb-3">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUICK_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-[#0e0e1a] rounded-xl border border-gray-100 dark:border-[#1E2235] p-4 flex items-center gap-3 hover:border-[#0047FF]/40 dark:hover:border-[#00F6FF]/40 hover:shadow-sm transition-all group"
            >
              <span className="text-xl">{link.icon}</span>
              <span className="text-sm font-medium text-[#060606] dark:text-[#FBFAFA] group-hover:text-[#0047FF] dark:group-hover:text-[#00F6FF] transition-colors">
                {link.label}
              </span>
              <span className="ml-auto text-gray-300 dark:text-gray-600 group-hover:text-[#0047FF] dark:group-hover:text-[#00F6FF] transition-colors text-xs">
                →
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
