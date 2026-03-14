import { useState } from 'react';
import { TBM_COLORS, TBM_LABELS, BID_MIN, BID_MAX } from '../data/constants';

export default function BiddingModal({ project, playerCash, playerFleet, onBid, onSkip }) {
  const [bidPercent, setBidPercent] = useState(100);

  const baseRevenue = project.revenue;
  const bidAmount = Math.round(baseRevenue * bidPercent / 100);
  const hasMatchingTbm = playerFleet.some(t => t.status === 'available' && t.size === project.tbmSize);

  const minBid = Math.round(BID_MIN * 100);
  const maxBid = Math.round(BID_MAX * 100);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-panel rounded-2xl p-6 w-full max-w-md animate-pop-in">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">📋</div>
          <div>
            <div className="text-xs text-orange-400 font-mono uppercase tracking-wider">Tender Available</div>
            <h3 className="text-lg font-bold text-white">{project.name}</h3>
          </div>
        </div>

        {/* Project details */}
        <div className="bg-gray-800/60 rounded-xl p-4 mb-4 border-l-4" style={{ borderColor: TBM_COLORS[project.tbmSize] }}>
          <div className="text-xs text-gray-400 mb-3">{project.detail}</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className="text-gray-500">TBM Size: </span>
              <span style={{ color: TBM_COLORS[project.tbmSize] }}>{TBM_LABELS[project.tbmSize]}</span>
            </div>
            <div>
              <span className="text-gray-500">Duration: </span>
              <span className="text-gray-300">{project.durationWeeks} weeks</span>
            </div>
            <div>
              <span className="text-gray-500">Location: </span>
              <span className="text-gray-300">{project.location}</span>
            </div>
            <div>
              <span className="text-gray-500">Client: </span>
              <span className="text-gray-300">{project.client}</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">Estimated Value</span>
              <span className="text-green-400 font-mono font-bold">£{baseRevenue}k</span>
            </div>
          </div>
        </div>

        {/* TBM availability warning */}
        {!hasMatchingTbm && (
          <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-3 mb-4 text-xs text-amber-300">
            ⚠️ You don't have an available {TBM_LABELS[project.tbmSize]} TBM. You can still bid, but you'll need to hire or free one up.
          </div>
        )}

        {/* Bid slider */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Your Bid</label>
            <span className={`text-lg font-mono font-black ${
              bidPercent <= 85 ? 'text-green-400' : bidPercent >= 110 ? 'text-red-400' : 'text-white'
            }`}>
              £{bidAmount}k
            </span>
          </div>

          <input
            type="range"
            min={minBid}
            max={maxBid}
            value={bidPercent}
            onChange={(e) => setBidPercent(parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right,
                #10b981 0%,
                #10b981 ${((85 - minBid) / (maxBid - minBid)) * 100}%,
                #f59e0b ${((100 - minBid) / (maxBid - minBid)) * 100}%,
                #ef4444 100%)`,
            }}
          />

          <div className="flex justify-between text-[10px] font-mono text-gray-600 mt-1">
            <span>Low ({minBid}%)</span>
            <span className="text-gray-500">Market rate</span>
            <span>High ({maxBid}%)</span>
          </div>

          <div className="mt-2 text-xs text-gray-500 text-center font-mono">
            {bidPercent < 80 && '🎯 Aggressive — high chance to win, low margin'}
            {bidPercent >= 80 && bidPercent < 95 && '📊 Competitive — good balance of risk and reward'}
            {bidPercent >= 95 && bidPercent <= 105 && '💼 Market rate — reasonable profit'}
            {bidPercent > 105 && bidPercent <= 120 && '💎 Premium — less likely to win'}
            {bidPercent > 120 && '🤑 Optimistic — rivals will probably undercut you'}
          </div>
        </div>

        {/* Cash display */}
        <div className="bg-gray-800/40 rounded-lg p-2 mb-4 flex justify-between text-xs font-mono">
          <span className="text-gray-500">Your cash balance</span>
          <span className={playerCash >= 0 ? 'text-green-400' : 'text-red-400'}>£{playerCash}k</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-3 rounded-xl transition-all active:scale-95 text-sm"
          >
            Skip
          </button>
          <button
            onClick={() => onBid(bidAmount)}
            className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-900/30 text-sm"
          >
            Submit Bid — £{bidAmount}k
          </button>
        </div>
      </div>
    </div>
  );
}
