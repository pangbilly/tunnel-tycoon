import { weekToDate } from '../game/engine';

export default function GameHeader({ week, player, onEndTurn }) {
  const date = weekToDate(week);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateStr = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

  const netProfit = player.totalRevenue - player.totalHireCost / 1000;

  const fullStars = Math.floor(player.reputation);
  const halfStar = player.reputation % 1 >= 0.25;

  return (
    <div className="bg-gray-950 border-b border-gray-800 px-3 py-2 sm:px-4 sm:py-3">
      {/* Top row: title + end turn */}
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-xl sm:text-2xl font-black text-orange-500 tracking-tight">TUNNEL TYCOON</h1>
        </div>
        <button
          onClick={onEndTurn}
          className="bg-orange-600 hover:bg-orange-500 text-white text-xs sm:text-sm font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors active:scale-95"
        >
          END WEEK →
        </button>
      </div>

      {/* Bottom row: date + stats */}
      <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
        <div className="bg-gray-900 rounded px-2 py-1 sm:px-3 sm:py-1.5">
          <span className="text-xs sm:text-sm font-mono text-gray-300">Week {week}</span>
          <span className="text-xs sm:text-sm font-mono text-gray-500 ml-1 sm:ml-2">{dateStr}</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-mono flex-wrap">
          <div>
            <span className="text-gray-500 hidden sm:inline">Revenue </span>
            <span className="text-gray-500 sm:hidden">Rev </span>
            <span className="text-green-400">£{player.totalRevenue}k</span>
          </div>
          <div>
            <span className="text-gray-500 hidden sm:inline">Hire </span>
            <span className="text-gray-500 sm:hidden">Hire </span>
            <span className="text-red-400">£{(player.totalHireCost / 1000).toFixed(0)}k</span>
          </div>
          <div>
            <span className="text-gray-500">Net </span>
            <span className={netProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
              £{netProfit.toFixed(0)}k
            </span>
          </div>
          <div className="text-amber-400 text-sm sm:text-base">
            {'★'.repeat(fullStars)}
            {halfStar ? '½' : ''}
            {'☆'.repeat(5 - fullStars - (halfStar ? 1 : 0))}
          </div>
        </div>
      </div>
    </div>
  );
}
