import { TBM_COLORS, TBM_LABELS } from '../data/constants';

export default function FleetPanel({ player, selectedTbm, onSelectTbm, onRecall, onOpenHire }) {
  const fleet = player.fleet;

  // Group fleet by size
  const bySize = {};
  for (const tbm of fleet) {
    if (!bySize[tbm.size]) bySize[tbm.size] = [];
    bySize[tbm.size].push(tbm);
  }

  const sizes = [600, 1200, 1500, 1800];

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
      <h3 className="text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Fleet</h3>

      {sizes.map(size => {
        const tbms = bySize[size] || [];
        const available = tbms.filter(t => t.status === 'available').length;
        const total = tbms.length;

        return (
          <div key={size} className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: TBM_COLORS[size] }}
              />
              <span className="text-xs text-gray-400 font-mono">
                {TBM_LABELS[size]}
              </span>
              <span className="text-xs font-mono ml-auto" style={{
                color: available === 0 && total > 0 ? '#ef4444' : '#9ca3af'
              }}>
                {available}/{total}
              </span>
            </div>

            {tbms.map(tbm => (
              <button
                key={tbm.id}
                onClick={() => {
                  if (tbm.status === 'available') onSelectTbm(tbm.id);
                  else if (tbm.status === 'on_site' || tbm.status === 'in_transit') onRecall(tbm.id);
                }}
                className={`w-full text-left px-2 py-1 rounded text-xs font-mono mb-0.5 transition-colors ${
                  selectedTbm === tbm.id
                    ? 'bg-orange-600 text-white'
                    : tbm.status === 'available'
                    ? 'bg-gray-800 text-green-400 hover:bg-gray-700'
                    : tbm.status === 'on_site'
                    ? 'bg-gray-800 text-amber-400'
                    : tbm.status === 'in_transit'
                    ? 'bg-gray-800 text-blue-400'
                    : 'bg-gray-800 text-gray-500'
                }`}
              >
                <span className="truncate block">
                  {tbm.hired ? '🔶 ' : ''}{tbm.name}
                </span>
                <span className="text-[10px] opacity-70">
                  {tbm.status === 'available' && 'Ready'}
                  {tbm.status === 'in_transit' && `Transit (${tbm.transitWeeksLeft}wk)`}
                  {tbm.status === 'on_site' && 'On site'}
                  {tbm.status === 'returning' && `Returning (${tbm.transitWeeksLeft}wk)`}
                  {tbm.hired && tbm.hireWeeksLeft !== undefined && ` · ${tbm.hireWeeksLeft}wk left`}
                </span>
              </button>
            ))}
          </div>
        );
      })}

      {/* Cabins */}
      <div className="mt-3 pt-2 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-mono">Cabins</span>
          <span className={`text-xs font-mono font-bold ${
            player.cabinsInUse >= player.cabinsTotal ? 'text-red-400' : 'text-green-400'
          }`}>
            {player.cabinsInUse}/{player.cabinsTotal}
          </span>
        </div>
      </div>

      {/* Hire button */}
      <button
        onClick={onOpenHire}
        className="mt-3 w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-2 px-3 rounded transition-colors"
      >
        + HIRE IN
      </button>
    </div>
  );
}
