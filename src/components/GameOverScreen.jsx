import { REP_MULTIPLIERS } from '../data/constants';

export default function GameOverScreen({ player, players, week, difficulty, onRestart }) {
  const repStars = Math.max(0, Math.floor(player.reputation));
  const multiplier = REP_MULTIPLIERS[Math.min(5, repStars)] || 0;
  const netProfit = player.totalRevenue - player.totalHireCost / 1000 - (player.totalEventCost || 0);
  const finalScore = Math.round(netProfit * multiplier);

  const gameOverReason = player.reputation <= 0
    ? 'Board lost confidence — reputation hit zero'
    : '5-year programme complete';

  // Sort all players by final score for leaderboard
  const allScores = players.map(p => {
    const rep = Math.max(0, Math.floor(p.reputation));
    const mult = REP_MULTIPLIERS[Math.min(5, rep)] || 0;
    const net = p.totalRevenue - p.totalHireCost / 1000 - (p.totalEventCost || 0);
    return {
      name: p.name,
      color: p.color,
      score: Math.round(net * mult),
      revenue: p.totalRevenue,
      completed: p.projectsCompleted,
      lost: p.projectsLost,
      reputation: p.reputation,
      isPlayer: !p.isAI,
    };
  }).sort((a, b) => b.score - a.score);

  const playerRank = allScores.findIndex(s => s.isPlayer) + 1;
  const won = playerRank === 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {won && (
          <>
            <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
          </>
        )}
      </div>

      {/* Result header */}
      <div className="text-center mb-6 animate-pop-in">
        <div className="text-5xl mb-3">{won ? '🏆' : player.reputation <= 0 ? '💀' : '🏁'}</div>
        <h1 className="text-3xl sm:text-4xl font-black text-gradient mb-2">
          {won ? 'CHAMPION!' : 'GAME OVER'}
        </h1>
        <p className="text-gray-500 text-sm font-mono">{gameOverReason}</p>
      </div>

      {/* Stats card */}
      <div className="glass-panel rounded-2xl p-6 w-full max-w-md space-y-3 animate-slide-up mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <div className="text-xl font-black text-gray-300">{week}</div>
            <div className="text-[9px] text-gray-500 uppercase">Weeks Played</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <div className="text-xl font-black text-green-400">{player.projectsCompleted}</div>
            <div className="text-[9px] text-gray-500 uppercase">Completed</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <div className="text-xl font-black text-red-400">{player.projectsLost}</div>
            <div className="text-[9px] text-gray-500 uppercase">Lost</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <div className="text-xl font-black text-blue-400">{player.peakSimultaneous}</div>
            <div className="text-[9px] text-gray-500 uppercase">Peak Active</div>
          </div>
        </div>

        <div className="border-t border-gray-700/50 pt-3 space-y-2 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Revenue</span>
            <span className="text-green-400">£{player.totalRevenue}k</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Hire costs</span>
            <span className="text-red-400">-£{(player.totalHireCost / 1000).toFixed(0)}k</span>
          </div>
          {(player.totalEventCost || 0) > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-400">Event costs</span>
              <span className="text-red-400">-£{player.totalEventCost}k</span>
            </div>
          )}
          <div className="flex justify-between font-bold">
            <span className="text-gray-200">Net profit</span>
            <span className={netProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
              £{netProfit.toFixed(0)}k
            </span>
          </div>
        </div>

        <div className="border-t border-gray-700/50 pt-3">
          <div className="flex justify-between text-sm font-mono mb-2">
            <span className="text-gray-400">Reputation</span>
            <span className="text-amber-400">
              {'★'.repeat(repStars)}{'☆'.repeat(5 - repStars)}
              <span className="text-gray-500 ml-1">×{multiplier}</span>
            </span>
          </div>
          <div className="bg-gradient-to-r from-orange-600/20 to-amber-600/20 rounded-xl p-4 text-center border border-orange-500/20">
            <div className="text-xs text-orange-400 uppercase tracking-wider mb-1">Final Score</div>
            <div className="text-3xl font-black text-gradient">£{finalScore}k</div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      {allScores.length > 1 && (
        <div className="glass-panel rounded-2xl p-4 w-full max-w-md mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h4 className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3 text-center">Final Standings</h4>
          <div className="space-y-2">
            {allScores.map((s, i) => (
              <div
                key={s.name}
                className={`flex items-center gap-3 text-sm font-mono rounded-xl px-3 py-2.5 ${
                  s.isPlayer
                    ? 'bg-orange-500/10 border border-orange-500/20'
                    : 'bg-gray-800/40'
                }`}
              >
                <span className="text-lg font-black text-gray-500 w-6 text-center">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                </span>
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className={`flex-1 truncate ${s.isPlayer ? 'text-orange-400 font-bold' : 'text-gray-300'}`}>
                  {s.name}
                </span>
                <span className="text-green-400 font-bold">£{s.score}k</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onRestart}
        className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3 px-8 rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-900/30"
      >
        PLAY AGAIN
      </button>
    </div>
  );
}
