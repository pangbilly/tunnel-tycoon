import { TBM_COLORS, TBM_LABELS, URGENCY_DEADLINE_WEEKS } from '../data/constants';

export default function ProjectPanel({
  activeProjects,
  selectedProject,
  selectedTbm,
  onSelectProject,
  onDispatch,
  week,
  playerId = 'player',
}) {
  // Only show player's projects
  const playerProjects = activeProjects.filter(p => p.assignedTo === playerId);

  const statusOrder = { waiting: 0, mobilising: 1, active: 2 };
  const sorted = [...playerProjects].sort((a, b) => {
    const sa = statusOrder[a.status] ?? 3;
    const sb = statusOrder[b.status] ?? 3;
    if (sa !== sb) return sa - sb;
    if (a.status === 'waiting') return (b.urgencyWeeks || 0) - (a.urgencyWeeks || 0);
    return (a.weeksRemaining || 0) - (b.weeksRemaining || 0);
  });

  const selected = playerProjects.find(p => p.id === selectedProject);
  const waitingCount = playerProjects.filter(p => p.status === 'waiting').length;
  const activeCount = playerProjects.filter(p => p.status === 'active' || p.status === 'mobilising').length;

  return (
    <div className="glass-panel rounded-xl p-3 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-black text-gray-300 uppercase tracking-wider">Projects</h3>
        <div className="flex gap-2 text-[10px] font-mono">
          {waitingCount > 0 && (
            <span className="text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
              {waitingCount} needs TBM
            </span>
          )}
          <span className="text-gray-500">{activeCount} active</span>
        </div>
      </div>

      {/* Selected project detail */}
      {selected && (
        <div
          className="bg-gray-800/60 rounded-xl p-3 mb-3 border-l-4 animate-slide-up"
          style={{ borderColor: TBM_COLORS[selected.tbmSize] }}
        >
          <div className="flex items-start justify-between mb-1">
            <h4 className="text-sm font-bold text-white">{selected.name}</h4>
            <span className="text-[9px] font-mono text-gray-600">{selected.id}</span>
          </div>
          <div className="text-[11px] text-gray-400 mb-2">{selected.detail}</div>

          <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
            <div>
              <span className="text-gray-500">TBM </span>
              <span style={{ color: TBM_COLORS[selected.tbmSize] }}>{TBM_LABELS[selected.tbmSize]}</span>
            </div>
            <div>
              <span className="text-gray-500">Duration </span>
              <span className="text-gray-300">{selected.durationWeeks}wk</span>
            </div>
            <div>
              <span className="text-gray-500">Revenue </span>
              <span className="text-green-400">£{selected.actualRevenue || selected.revenue}k</span>
            </div>
            <div>
              <span className="text-gray-500">Location </span>
              <span className="text-gray-300">{selected.location}</span>
            </div>
          </div>

          {/* Waiting - urgency bar */}
          {selected.status === 'waiting' && (
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-red-400 font-bold animate-pulse">
                  NEEDS TBM ({URGENCY_DEADLINE_WEEKS - selected.urgencyWeeks}wk left)
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all progress-striped"
                  style={{
                    width: `${(selected.urgencyWeeks / URGENCY_DEADLINE_WEEKS) * 100}%`,
                    backgroundColor: selected.urgencyWeeks >= URGENCY_DEADLINE_WEEKS - 1 ? '#ef4444' : '#f59e0b',
                  }}
                />
              </div>

              {/* Dispatch button */}
              {selectedTbm && (
                <button
                  onClick={() => onDispatch(selectedTbm, selected.id)}
                  className="mt-3 w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-green-900/30"
                >
                  ⚡ DISPATCH SELECTED TBM
                </button>
              )}
            </div>
          )}

          {/* Active - progress */}
          {selected.status === 'active' && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Progress</span>
                <span className="text-gray-300 font-mono">
                  {selected.durationWeeks - selected.weeksRemaining}/{selected.durationWeeks}wk
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-blue-500 transition-all progress-striped"
                  style={{
                    width: `${((selected.durationWeeks - selected.weeksRemaining) / selected.durationWeeks) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {selected.status === 'mobilising' && (
            <div className="mt-3 text-xs text-blue-400 font-mono flex items-center gap-2">
              <span className="animate-pulse">●</span> TBM in transit — mobilising...
            </div>
          )}
        </div>
      )}

      {/* Project list */}
      <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar" style={{ maxHeight: '350px' }}>
        {sorted.length === 0 && (
          <div className="text-xs text-gray-600 text-center py-8 font-mono">
            No active projects<br />
            <span className="text-gray-700">Win bids to get started</span>
          </div>
        )}
        {sorted.map(project => {
          const isSelected = selectedProject === project.id;
          const urgencyPercent = project.status === 'waiting'
            ? (project.urgencyWeeks / URGENCY_DEADLINE_WEEKS) * 100
            : 0;

          return (
            <button
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all card-hover ${
                isSelected
                  ? 'bg-gray-700/80 ring-1 ring-gray-500'
                  : 'bg-gray-800/40 hover:bg-gray-800/80'
              } ${project.status === 'waiting' && project.urgencyWeeks >= URGENCY_DEADLINE_WEEKS - 1 ? 'animate-[urgentPulse_1.5s_infinite]' : ''}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm"
                  style={{
                    backgroundColor: TBM_COLORS[project.tbmSize],
                    boxShadow: project.status === 'waiting' ? `0 0 6px ${TBM_COLORS[project.tbmSize]}60` : 'none',
                  }}
                />
                <span className="text-gray-300 truncate flex-1">{project.name}</span>
                {project.status === 'waiting' && (
                  <span className="text-red-400 font-bold text-[10px] flex-shrink-0 bg-red-500/10 px-1.5 py-0.5 rounded">
                    {URGENCY_DEADLINE_WEEKS - project.urgencyWeeks}wk
                  </span>
                )}
                {project.status === 'active' && (
                  <span className="text-gray-500 font-mono text-[10px] flex-shrink-0">
                    {project.weeksRemaining}wk
                  </span>
                )}
                {project.status === 'mobilising' && (
                  <span className="text-blue-400 font-mono text-[10px] flex-shrink-0">
                    MOB
                  </span>
                )}
              </div>

              {/* Mini urgency bar for waiting projects */}
              {project.status === 'waiting' && (
                <div className="mt-1 ml-4 w-full max-w-[80%] bg-gray-700 rounded-full h-0.5">
                  <div
                    className="h-0.5 rounded-full transition-all"
                    style={{
                      width: `${urgencyPercent}%`,
                      backgroundColor: urgencyPercent > 66 ? '#ef4444' : '#f59e0b',
                    }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
