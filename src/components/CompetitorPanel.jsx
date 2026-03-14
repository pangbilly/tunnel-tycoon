import { TBM_COLORS } from '../data/constants';

export default function CompetitorPanel({ players, activeProjects, onClose }) {
  const aiPlayers = players.filter(p => p.isAI);

  if (aiPlayers.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 animate-fade-in" style={{ zIndex: 9999 }}>
      <div className="glass-panel rounded-2xl p-6 w-full max-w-lg animate-pop-in max-h-[80vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-white">🏢 Competitor Intel</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {aiPlayers.map(ai => {
            const aiProjects = activeProjects.filter(p => p.assignedTo === ai.id);
            const activeCount = aiProjects.filter(p => p.status === 'active' || p.status === 'mobilising').length;
            const waitingCount = aiProjects.filter(p => p.status === 'waiting').length;
            const availableTbms = ai.fleet.filter(t => t.status === 'available').length;
            const totalTbms = ai.fleet.length;

            return (
              <div
                key={ai.id}
                className="bg-gray-800/60 rounded-xl p-4 border-l-4"
                style={{ borderColor: ai.color }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white shadow-lg"
                    style={{ backgroundColor: ai.color }}
                  >
                    {ai.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{ai.name}</div>
                    {ai.tagline && (
                      <div className="text-[10px] text-gray-500 font-mono italic">{ai.tagline}</div>
                    )}
                  </div>
                  <div className="ml-auto text-amber-400 text-sm">
                    {'★'.repeat(Math.floor(ai.reputation))}
                    {'☆'.repeat(5 - Math.floor(ai.reputation))}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-gray-900/50 rounded-lg p-2">
                    <div className="text-lg font-black text-green-400">{ai.projectsCompleted}</div>
                    <div className="text-[9px] text-gray-500 uppercase">Completed</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-2">
                    <div className="text-lg font-black text-blue-400">{activeCount}</div>
                    <div className="text-[9px] text-gray-500 uppercase">Active</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-2">
                    <div className="text-lg font-black text-gray-300">{availableTbms}/{totalTbms}</div>
                    <div className="text-[9px] text-gray-500 uppercase">TBMs Free</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-2">
                    <div className="text-lg font-black text-green-400">£{ai.totalRevenue}k</div>
                    <div className="text-[9px] text-gray-500 uppercase">Revenue</div>
                  </div>
                </div>

                {/* Fleet breakdown */}
                <div className="mt-2 flex gap-1">
                  {[600, 1200, 1500, 1800].map(size => {
                    const count = ai.fleet.filter(t => t.size === size).length;
                    if (count === 0) return null;
                    return (
                      <div
                        key={size}
                        className="flex items-center gap-1 bg-gray-900/30 rounded px-2 py-0.5"
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: TBM_COLORS[size] }}
                        />
                        <span className="text-[10px] font-mono text-gray-400">
                          {size}×{count}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Current projects */}
                {aiProjects.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {aiProjects.slice(0, 3).map(p => (
                      <div key={p.id} className="flex items-center gap-2 text-[10px] font-mono">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: TBM_COLORS[p.tbmSize] }}
                        />
                        <span className="text-gray-400 truncate flex-1">{p.name}</span>
                        <span className={
                          p.status === 'active' ? 'text-green-400' :
                          p.status === 'mobilising' ? 'text-blue-400' :
                          'text-amber-400'
                        }>
                          {p.status === 'active' ? `${p.weeksRemaining}wk` : p.status}
                        </span>
                      </div>
                    ))}
                    {aiProjects.length > 3 && (
                      <div className="text-[10px] text-gray-600 font-mono">
                        +{aiProjects.length - 3} more...
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
