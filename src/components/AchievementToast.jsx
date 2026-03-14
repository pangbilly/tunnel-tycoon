import ACHIEVEMENTS from '../data/achievements';

export default function AchievementToast({ achievementId }) {
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!achievement) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] animate-achievement pointer-events-none">
      <div className="glass-panel rounded-xl px-5 py-3 flex items-center gap-3 shadow-xl shadow-orange-900/20 border border-orange-500/30">
        <div className="text-3xl">{achievement.icon}</div>
        <div>
          <div className="text-[10px] text-orange-400 font-mono uppercase tracking-wider">
            Achievement Unlocked!
          </div>
          <div className="text-sm font-bold text-white">{achievement.name}</div>
          <div className="text-[10px] text-gray-400">{achievement.desc}</div>
        </div>
      </div>
    </div>
  );
}
