import { NEWS_AND_ACHIEVEMENTS } from '../data/mockData';

export function NewsTab() {
  const news = NEWS_AND_ACHIEVEMENTS;
  const achievements = news.filter((n) => n.type === 'achievement');
  const updates     = news.filter((n) => n.type === 'news');

  return (
    <div className="space-y-8">
      {/* Achievements */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#0047FF] dark:text-[#00F6FF] mb-3">
          🏆 Achievements
        </h2>
        <div className="space-y-3">
          {achievements.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* News */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#8453D2] dark:text-[#B896FF] mb-3">
          📣 Council Updates
        </h2>
        <div className="space-y-3">
          {updates.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

function NewsCard({ item }: { item: (typeof NEWS_AND_ACHIEVEMENTS)[0] }) {
  const isAchievement = item.type === 'achievement';
  return (
    <div className={`bg-white dark:bg-[#0e0e1a] rounded-xl border shadow-sm p-4 ${
      isAchievement
        ? 'border-[#0047FF]/20 dark:border-[#00F6FF]/20'
        : 'border-gray-100 dark:border-[#1E2235]'
    }`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none mt-0.5">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-sm font-semibold text-[#060606] dark:text-[#FBFAFA]">
              {item.title}
            </h3>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.body}</p>
        </div>
      </div>
    </div>
  );
}
