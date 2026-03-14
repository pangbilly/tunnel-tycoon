import { useState } from 'react';
import { TBM_COLORS, TBM_LABELS, HIRE_RATES, HIRE_DURATIONS } from '../data/constants';

export default function HireModal({ onHire, onClose }) {
  const [size, setSize] = useState(1200);
  const [duration, setDuration] = useState(8);

  const cost = HIRE_RATES[size] * duration;
  const sizes = [600, 1200, 1500, 1800];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-600 rounded-lg p-6 w-80">
        <h3 className="text-lg font-bold text-white mb-4">Hire TBM</h3>

        {/* Size selection */}
        <div className="mb-4">
          <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">TBM Size</label>
          <div className="grid grid-cols-2 gap-2">
            {sizes.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-3 py-2 rounded text-xs font-bold transition-colors ${
                  size === s
                    ? 'ring-2 ring-white text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: size === s ? TBM_COLORS[s] + '40' : '#1f2937',
                  borderColor: TBM_COLORS[s],
                }}
              >
                {TBM_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Duration selection */}
        <div className="mb-4">
          <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Duration</label>
          <div className="flex gap-2">
            {HIRE_DURATIONS.map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`flex-1 px-3 py-2 rounded text-xs font-bold transition-colors ${
                  duration === d
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {d} weeks
              </button>
            ))}
          </div>
        </div>

        {/* Cost display */}
        <div className="bg-gray-800 rounded p-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Weekly rate</span>
            <span className="text-gray-300 font-mono">£{(HIRE_RATES[size] / 1000).toFixed(1)}k</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">Total cost</span>
            <span className="text-amber-400 font-mono font-bold">£{(cost / 1000).toFixed(0)}k</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm py-2 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onHire(size, duration)}
            className="flex-1 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold py-2 rounded transition-colors"
          >
            Hire — £{(cost / 1000).toFixed(0)}k
          </button>
        </div>
      </div>
    </div>
  );
}
