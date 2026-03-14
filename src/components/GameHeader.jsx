import { weekToDate } from '../game/engine';
import { WEEKS_PER_YEAR } from '../data/constants';

export default function GameHeader({ week, player, players, onEndTurn, onSave, onToggleAchievements, onToggleCompetitors }) {
  const date = weekToDate(week);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateStr = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  const year = Math.floor(week / WEEKS_PER_YEAR) + 1;

  const netProfit = player.totalRevenue - player.totalHireCost / 1000 - (player.totalEventCost || 0);
  const fullStars = Math.floor(player.reputation);
  const halfStar = player.reputation % 1 >= 0.25;

  const aiPlayers = players.filter(p => p.isAI);

  return (
    <div className="glass-panel border-b border-gray-800/50 px-3 py-2 sm:px-5 sm:py-3">
      {/* Top row: title + actions */}
      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gradient tracking-tight">
            TUNNEL TYCOON
          </h1>
          <span className="hidden sm:inline text-[10px] text-gray-600 font-mono bg-gray-800/50 px-2 py-0.5 rounded">
            Y{year}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick action buttons */}
          <div className="hidden sm:flex items-center gap-1.5">
            {aiPlayers.length > 0 && (
              <button
                onClick={onToggleCompetitors}
                className="text-gray-500 hover:text-gray-300 text-xs bg-gray-800/50 hover:bg-gray-700/50 px-2.5 py-1.5 rounded-lg transition-colors font-mono"
                title="View competitors"
              >
                🏢 Rivals
              </button>
            )}
            <button
              onClick={onToggleAchievements}
              className="text-gray-500 hover:text-gray-300 text-xs bg-gray-800/50 hover:bg-gray-700/50 px-2.5 py-1.5 rounded-lg transition-colors font-mono"
              title="Achievements"
            >
              🏆
            </button>
            <button
              onClick={onSave}
              className="text-gray-500 hover:text-gray-300 text-xs bg-gray-800/50 hover:bg-gray-700/50 px-2.5 py-1.5 rounded-lg transition-colors font-mono"
              title="Save game"
            >
              💾
            </button>
          </div>

          <button
            onClick={onEndTurn}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs sm:text-sm font-bold py-2 px-4 sm:px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-900/20 btn-glow"
          >
            END WEEK →
          </button>
        </div>
      </div>

      {/* Bottom row: date + stats */}
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        <div className="bg-gray-800/50 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 flex items-center gap-2">
          <span className="text-xs sm:text-sm font-mono font-bold text-gray-200">Wk {week}</span>
          <span className="text-xs sm:text-sm font-mono text-gray-500">{dateStr}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-gray-600 hidden sm:inline">Cash</span>
            <span className={`font-bold ${player.cash >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              £{player.cash}k
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-gray-600">|</div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600 hidden sm:inline">Rev</span>
            <span className="text-green-400">£{player.totalRevenue}k</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-gray-600">|</div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600 hidden sm:inline">Net</span>
            <span className={netProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
              £{netProfit.toFixed(0)}k
            </span>
          </div>
          <div className="text-amber-400 text-sm sm:text-base ml-1">
            {'★'.repeat(fullStars)}
            {halfStar ? '½' : ''}
            {'☆'.repeat(Math.max(0, 5 - fullStars - (halfStar ? 1 : 0)))}
          </div>
        </div>

        {/* Mobile action buttons */}
        <div className="flex sm:hidden items-center gap-1 ml-auto">
          {aiPlayers.length > 0 && (
            <button
              onClick={onToggleCompetitors}
              className="text-xs bg-gray-800/50 px-2 py-1 rounded"
            >
              🏢
            </button>
          )}
          <button
            onClick={onToggleAchievements}
            className="text-xs bg-gray-800/50 px-2 py-1 rounded"
          >
            🏆
          </button>
          <button
            onClick={onSave}
            className="text-xs bg-gray-800/50 px-2 py-1 rounded"
          >
            💾
          </button>
        </div>
      </div>
    </div>
  );
}
