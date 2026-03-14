import { REP_MULTIPLIERS } from '../data/constants';

export default function GameOverScreen({ player, week, onRestart }) {
  const repStars = Math.max(0, Math.floor(player.reputation));
  const multiplier = REP_MULTIPLIERS[Math.min(5, repStars)] || 0;
  const netProfit = player.totalRevenue - player.totalHireCost / 1000;
  const finalScore = Math.round(netProfit * multiplier);

  const gameOverReason = player.reputation <= 0
    ? 'Board lost confidence — reputation hit zero'
    : '5-year programme complete';

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-black text-orange-500 mb-2">GAME OVER</h1>
      <p className="text-gray-500 text-sm font-mono mb-8">{gameOverReason}</p>

      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-96 space-y-3">
        <div className="flex justify-between text-sm font-mono">
          <span className="text-gray-400">Weeks played</span>
          <span className="text-gray-300">{week}</span>
        </div>
        <div className="flex justify-between text-sm font-mono">
          <span className="text-gray-400">Projects completed</span>
          <span className="text-green-400">{player.projectsCompleted}</span>
        </div>
        <div className="flex justify-between text-sm font-mono">
          <span className="text-gray-400">Projects lost</span>
          <span className="text-red-400">{player.projectsLost}</span>
        </div>
        <div className="flex justify-between text-sm font-mono">
          <span className="text-gray-400">Peak simultaneous</span>
          <span className="text-gray-300">{player.peakSimultaneous}</span>
        </div>

        <div className="border-t border-gray-700 pt-3">
          <div className="flex justify-between text-sm font-mono">
            <span className="text-gray-400">Total revenue</span>
            <span className="text-green-400">£{player.totalRevenue}k</span>
          </div>
          <div className="flex justify-between text-sm font-mono">
            <span className="text-gray-400">Hire costs</span>
            <span className="text-red-400">-£{(player.totalHireCost / 1000).toFixed(0)}k</span>
          </div>
          <div className="flex justify-between text-sm font-mono font-bold">
            <span className="text-gray-300">Net profit</span>
            <span className={netProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
              £{netProfit.toFixed(0)}k
            </span>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-3">
          <div className="flex justify-between text-sm font-mono">
            <span className="text-gray-400">Reputation</span>
            <span className="text-amber-400">
              {'★'.repeat(repStars)}{'☆'.repeat(5 - repStars)}
              {' '}(×{multiplier})
            </span>
          </div>
          <div className="flex justify-between text-lg font-mono font-black mt-2">
            <span className="text-white">FINAL SCORE</span>
            <span className="text-orange-500">£{finalScore}k</span>
          </div>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="mt-8 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-lg transition-colors"
      >
        PLAY AGAIN
      </button>
    </div>
  );
}
