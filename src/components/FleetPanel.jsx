import { TBM_COLORS, TBM_LABELS } from '../data/constants';

export default function FleetPanel({ player, selectedTbm, onSelectTbm, onRecall, onOpenHire }) {
  const fleet = player.fleet;

  const bySize = {};
  for (const tbm of fleet) {
    if (!bySize[tbm.size]) bySize[tbm.size] = [];
    bySize[tbm.size].push(tbm);
  }

  const sizes = [600, 1200, 1500, 1800];

  const statusIcon = {
    available: '●',
    in_transit: '▶',
    on_site: '◆',
    returning: '◀',
  };

  const statusColor = {
    available: 'text-green-400',
    in_transit: 'text-blue-400',
    on_site: 'text-amber-400',
    returning: 'text-purple-400',
  };

  return (
    <div className="glass-panel rounded-xl p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-black text-gray-300 uppercase tracking-wider">Fleet</h3>
        <div className="text-[10px] font-mono text-gray-600">
          {player.cabinsInUse}/{player.cabinsTotal} cabins
        </div>
      </div>

      {/* Cabin indicator */}
      <div className="flex gap-1 mb-3">
        {Array.from({ length: player.cabinsTotal }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < player.cabinsInUse ? 'bg-orange-500' : 'bg-gray-800'
            }`}
          />
        ))}
      </div>

      {sizes.map(size => {
        const tbms = bySize[size] || [];
        if (tbms.length === 0) return null;
        const available = tbms.filter(t => t.status === 'available').length;

        return (
          <div key={size} className="mb-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="w-3 h-3 rounded-full inline-block shadow-sm"
                style={{ backgroundColor: TBM_COLORS[size], boxShadow: `0 0 6px ${TBM_COLORS[size]}40` }}
              />
              <span className="text-xs text-gray-300 font-bold">{TBM_LABELS[size]}</span>
              <span className="text-[10px] font-mono ml-auto" style={{
                color: available === 0 ? '#ef4444' : '#10b981'
              }}>
                {available}/{tbms.length} free
              </span>
            </div>

            {tbms.map(tbm => {
              const isSelected = selectedTbm === tbm.id;
              const canSelect = tbm.status === 'available';
              const canRecall = tbm.status === 'on_site' || tbm.status === 'in_transit';

              return (
                <button
                  key={tbm.id}
                  onClick={() => {
                    if (canSelect) onSelectTbm(tbm.id);
                    else if (canRecall) onRecall(tbm.id);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono mb-1 transition-all card-hover ${
                    isSelected
                      ? 'bg-orange-600/20 border border-orange-500/50 text-orange-300'
                      : canSelect
                      ? 'bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 border border-transparent'
                      : 'bg-gray-800/40 text-gray-500 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] ${statusColor[tbm.status]}`}>
                      {statusIcon[tbm.status]}
                    </span>
                    <span className="truncate flex-1">{tbm.hired ? '⟐ ' : ''}{tbm.name}</span>
                  </div>
                  <div className="text-[10px] opacity-60 ml-5">
                    {tbm.status === 'available' && 'Ready'}
                    {tbm.status === 'in_transit' && `Mobilising (${tbm.transitWeeksLeft}wk)`}
                    {tbm.status === 'on_site' && 'On site — click to recall'}
                    {tbm.status === 'returning' && `Returning (${tbm.transitWeeksLeft}wk)`}
                    {tbm.hired && tbm.hireWeeksLeft !== undefined && ` · ${tbm.hireWeeksLeft}wk hire left`}
                  </div>
                </button>
              );
            })}
          </div>
        );
      })}

      {/* Hire button */}
      <button
        onClick={onOpenHire}
        className="mt-2 w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all active:scale-95 shadow-md shadow-amber-900/20"
      >
        + HIRE TBM
      </button>
    </div>
  );
}
