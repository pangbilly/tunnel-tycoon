export default function YearEndScreen({ yearEndStats, onContinue }) {
  if (!yearEndStats) return null;

  const { year, players } = yearEndStats;
  const humanPlayer = players[0];
  const aiPlayers = players.slice(1);

  // Sort all players by revenue for leaderboard
  const sorted = [...players].sort((a, b) => b.revenue - a.revenue);
  const playerRank = sorted.findIndex(p => p.name === humanPlayer.name) + 1;

  const rankLabels = {
    1: '🥇 1st Place!',
    2: '🥈 2nd Place',
    3: '🥉 3rd Place',
    4: '4th Place',
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-panel rounded-2xl p-6 sm:p-8 w-full max-w-lg animate-pop-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">📊</div>
          <h2 className="text-2xl sm:text-3xl font-black text-gradient mb-1">Year {year} Complete</h2>
          <p className="text-gray-500 text-sm font-mono">
            {year < 5 ? `${5 - year} year${5 - year > 1 ? 's' : ''} remaining` : 'Final year!'}
          </p>
        </div>

        {/* Your stats */}
        <div className="bg-gray-800/60 rounded-xl p-4 mb-4 border border-orange-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="font-bold text-white text-sm">{humanPlayer.name}</span>
            </div>
            <span className="text-orange-400 font-bold text-sm">{rankLabels[playerRank] || `#${playerRank}`}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900/50 rounded-lg p-3 text-center">
              <div className="text-xl font-black text-green-400">£{humanPlayer.revenue}k</div>
              <div className="text-[10px] text-gray-500 uppercase mt-0.5">Total Revenue</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3 text-center">
              <div className="text-xl font-black text-blue-400">{humanPlayer.completed}</div>
              <div className="text-[10px] text-gray-500 uppercase mt-0.5">Projects Done</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3 text-center">
              <div className="text-xl font-black text-red-400">{humanPlayer.lost}</div>
              <div className="text-[10px] text-gray-500 uppercase mt-0.5">Projects Lost</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3 text-center">
              <div className="text-xl font-black text-amber-400">
                {'★'.repeat(Math.floor(humanPlayer.reputation))}
                {'☆'.repeat(5 - Math.floor(humanPlayer.reputation))}
              </div>
              <div className="text-[10px] text-gray-500 uppercase mt-0.5">Reputation</div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        {aiPlayers.length > 0 && (
          <div className="bg-gray-800/40 rounded-xl p-4 mb-6">
            <h4 className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">Leaderboard</h4>
            <div className="space-y-2">
              {sorted.map((p, i) => (
                <div
                  key={p.name}
                  className={`flex items-center gap-3 text-sm font-mono rounded-lg px-3 py-2 ${
                    p.name === humanPlayer.name ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-gray-900/30'
                  }`}
                >
                  <span className="text-gray-500 font-bold w-5">{i + 1}</span>
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className={`flex-1 truncate ${p.name === humanPlayer.name ? 'text-orange-400' : 'text-gray-300'}`}>
                    {p.name}
                  </span>
                  <span className="text-green-400 text-xs">£{p.revenue}k</span>
                  <span className="text-gray-500 text-xs">{p.completed}✓</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-900/30 text-base"
        >
          {year < 5 ? `Continue to Year ${year + 1} →` : 'View Final Results →'}
        </button>
      </div>
    </div>
  );
}
