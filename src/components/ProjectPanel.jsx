import { TBM_COLORS, TBM_LABELS } from '../data/constants';

export default function ProjectPanel({
  activeProjects,
  selectedProject,
  selectedTbm,
  onSelectProject,
  onDispatch,
  week,
}) {
  // Sort: waiting first (by urgency desc), then mobilising, then active
  const statusOrder = { waiting: 0, mobilising: 1, active: 2 };
  const sorted = [...activeProjects].sort((a, b) => {
    const sa = statusOrder[a.status] ?? 3;
    const sb = statusOrder[b.status] ?? 3;
    if (sa !== sb) return sa - sb;
    if (a.status === 'waiting') return (b.urgencyWeeks || 0) - (a.urgencyWeeks || 0);
    return (a.weeksRemaining || 0) - (b.weeksRemaining || 0);
  });

  const selected = activeProjects.find(p => p.id === selectedProject);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 flex flex-col h-full">
      <h3 className="text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Projects</h3>

      {/* Selected project detail */}
      {selected && (
        <div className="bg-gray-800 rounded p-3 mb-3 border-l-4" style={{ borderColor: TBM_COLORS[selected.tbmSize] }}>
          <div className="flex items-start justify-between mb-1">
            <h4 className="text-sm font-bold text-white">{selected.name}</h4>
            <span className="text-[10px] font-mono text-gray-500">{selected.id}</span>
          </div>
          <div className="text-xs text-gray-400 mb-2">{selected.detail}</div>
          <div className="grid grid-cols-2 gap-1 text-xs font-mono">
            <div>
              <span className="text-gray-500">TBM: </span>
              <span style={{ color: TBM_COLORS[selected.tbmSize] }}>{TBM_LABELS[selected.tbmSize]}</span>
            </div>
            <div>
              <span className="text-gray-500">Duration: </span>
              <span className="text-gray-300">{selected.durationWeeks}wk</span>
            </div>
            <div>
              <span className="text-gray-500">Revenue: </span>
              <span className="text-green-400">£{selected.revenue}k</span>
            </div>
            <div>
              <span className="text-gray-500">Location: </span>
              <span className="text-gray-300">{selected.location}</span>
            </div>
          </div>

          {selected.status === 'waiting' && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-red-400 font-bold">
                  NEEDS TBM! ({3 - selected.urgencyWeeks}wk left)
                </span>
              </div>
              {/* Urgency bar */}
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${(selected.urgencyWeeks / 3) * 100}%`,
                    backgroundColor: selected.urgencyWeeks >= 2 ? '#ef4444' : '#f59e0b',
                  }}
                />
              </div>
            </div>
          )}

          {selected.status === 'waiting' && selectedTbm && (
            <button
              onClick={() => onDispatch(selectedTbm, selected.id)}
              className="mt-2 w-full bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 rounded transition-colors"
            >
              DISPATCH SELECTED TBM
            </button>
          )}

          {selected.status === 'active' && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Progress</span>
                <span className="text-gray-300 font-mono">
                  {selected.durationWeeks - selected.weeksRemaining}/{selected.durationWeeks}wk
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-blue-500 transition-all"
                  style={{
                    width: `${((selected.durationWeeks - selected.weeksRemaining) / selected.durationWeeks) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {selected.status === 'mobilising' && (
            <div className="mt-2 text-xs text-blue-400 font-mono">
              TBM in transit — mobilising...
            </div>
          )}
        </div>
      )}

      {/* Project list */}
      <div className="flex-1 overflow-y-auto space-y-1" style={{ maxHeight: '350px' }}>
        {sorted.length === 0 && (
          <div className="text-xs text-gray-600 text-center py-4">No active projects</div>
        )}
        {sorted.map(project => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
              selectedProject === project.id
                ? 'bg-gray-700 ring-1 ring-gray-500'
                : 'bg-gray-800 hover:bg-gray-750'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: TBM_COLORS[project.tbmSize] }}
              />
              <span className="text-gray-300 truncate flex-1">{project.name}</span>
              {project.status === 'waiting' && (
                <span className="text-red-400 font-bold text-[10px] flex-shrink-0">
                  NEEDS TBM
                </span>
              )}
              {project.status === 'active' && (
                <span className="text-gray-500 font-mono text-[10px] flex-shrink-0">
                  {project.weeksRemaining}wk
                </span>
              )}
              {project.status === 'mobilising' && (
                <span className="text-blue-400 font-mono text-[10px] flex-shrink-0">
                  TRANSIT
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
