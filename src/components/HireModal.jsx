import { useState } from 'react';
import { TBM_COLORS, TBM_LABELS, HIRE_RATES, HIRE_DURATIONS } from '../data/constants';

export default function HireModal({ onHire, onClose, playerCash }) {
  const [size, setSize] = useState(1200);
  const [duration, setDuration] = useState(8);

  const cost = HIRE_RATES[size] * duration;
  const costK = cost / 1000;
  const sizes = [600, 1200, 1500, 1800];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 animate-fade-in" style={{ zIndex: 9999 }}>
      <div className="glass-panel rounded-2xl p-6 w-full max-w-sm animate-pop-in">
        <h3 className="text-lg font-black text-white mb-1">Hire TBM</h3>
        <p className="text-xs text-gray-500 font-mono mb-4">Temporary addition to your fleet</p>

        {/* Size selection */}
        <div className="mb-4">
          <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mb-2">TBM Size</label>
          <div className="grid grid-cols-2 gap-2">
            {sizes.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  size === s
                    ? 'ring-2 ring-white text-white scale-[1.02]'
                    : 'text-gray-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: size === s ? TBM_COLORS[s] + '30' : '#1e293b',
                }}
              >
                <div>{TBM_LABELS[s]}</div>
                <div className="text-[10px] opacity-60 mt-0.5">
                  £{(HIRE_RATES[s] / 1000).toFixed(1)}k/wk
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Duration selection */}
        <div className="mb-4">
          <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mb-2">Duration</label>
          <div className="flex gap-2">
            {HIRE_DURATIONS.map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`flex-1 px-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  duration === d
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {d}wk
              </button>
            ))}
          </div>
        </div>

        {/* Cost display */}
        <div className="bg-gray-800/60 rounded-xl p-3 mb-4 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Weekly rate</span>
            <span className="text-gray-300 font-mono">£{(HIRE_RATES[size] / 1000).toFixed(1)}k</span>
          </div>
          <div className="flex justify-between text-sm font-bold border-t border-gray-700 pt-1.5">
            <span className="text-gray-300">Total cost</span>
            <span className="text-amber-400 font-mono">£{costK.toFixed(0)}k</span>
          </div>
          {playerCash !== undefined && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">After hire</span>
              <span className={`font-mono ${(playerCash - costK) >= 0 ? 'text-gray-400' : 'text-red-400'}`}>
                £{(playerCash - costK).toFixed(0)}k
              </span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm py-2.5 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onHire(size, duration)}
            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all active:scale-95"
          >
            Hire — £{costK.toFixed(0)}k
          </button>
        </div>
      </div>
    </div>
  );
}
