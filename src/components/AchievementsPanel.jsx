import ACHIEVEMENTS from '../data/achievements';

export default function AchievementsPanel({ unlocked, onClose }) {
  const unlockedSet = new Set(unlocked);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 animate-fade-in" style={{ zIndex: 9999 }}>
      <div className="glass-panel rounded-2xl p-6 w-full max-w-lg animate-pop-in max-h-[80vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-white">🏆 Achievements</h3>
            <p className="text-xs text-gray-500 font-mono">
              {unlocked.length}/{ACHIEVEMENTS.length} unlocked
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-5">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all"
            style={{ width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ACHIEVEMENTS.map(a => {
            const isUnlocked = unlockedSet.has(a.id);

            return (
              <div
                key={a.id}
                className={`rounded-xl p-3 transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-orange-900/30 to-amber-900/20 border border-orange-500/20'
                    : 'bg-gray-800/40 border border-gray-800 opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-2xl ${isUnlocked ? '' : 'grayscale'}`}>
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                      {a.name}
                    </div>
                    <div className={`text-[10px] ${isUnlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                      {a.desc}
                    </div>
                  </div>
                  {isUnlocked && (
                    <div className="text-green-400 text-xs">✓</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
