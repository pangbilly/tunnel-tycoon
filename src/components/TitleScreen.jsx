import { useState, useEffect } from 'react';
import { hasSave, loadGame, deleteSave } from '../game/save';

const TIPS = [
  'Match TBM sizes to project requirements',
  'Don\'t let projects sit — urgency kills reputation',
  'Hiring TBMs costs cash, but losing contracts costs more',
  'Bid low to win, but don\'t bankrupt yourself',
  'Keep an eye on your competitors\' activity',
  'Random events can help or hinder — choose wisely',
  'Recall TBMs from finished jobs to free up cabins',
  'Reputation multiplies your final score',
  'Upgrade your company to gain competitive advantages',
  'AI competitors have different personalities — learn their patterns',
];

export default function TitleScreen({ onStart, onLoad }) {
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);
  const [titleAnim, setTitleAnim] = useState(false);
  const saveExists = hasSave();

  useEffect(() => {
    setTimeout(() => setTitleAnim(true), 100);
  }, []);

  const handleLoad = () => {
    const save = loadGame();
    if (save) onLoad(save);
  };

  const handleDeleteSave = () => {
    deleteSave();
    setShowSavePrompt(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-orange-500/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-orange-500/3 rounded-full" />
      </div>

      {/* Title */}
      <div className={`mb-8 text-center transition-all duration-1000 ${titleAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-xs font-mono text-gray-600 uppercase tracking-[0.3em] mb-2">
          Fleet Management Simulator
        </div>
        <h1 className="text-5xl sm:text-7xl font-black text-gradient tracking-tight mb-3">
          TUNNEL TYCOON
        </h1>
        <p className="text-gray-400 text-sm sm:text-base font-mono max-w-md mx-auto">
          Dispatch TBMs. Win bids. Outsmart rivals. Build an empire underground.
        </p>
      </div>

      {/* Fleet preview with animated dots */}
      <div className={`mb-8 flex gap-6 sm:gap-8 text-center transition-all duration-1000 delay-300 ${titleAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {[
          { size: '600mm', color: '#10b981', label: 'Small' },
          { size: '1200mm', color: '#3b82f6', label: 'Medium' },
          { size: '1500mm', color: '#f59e0b', label: 'Large' },
          { size: '1800mm', color: '#ef4444', label: 'XL' },
        ].map(({ size, color, label }, i) => (
          <div key={size} className="flex flex-col items-center" style={{ animationDelay: `${i * 100}ms` }}>
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-2 shadow-lg transition-transform hover:scale-110"
              style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}40` }}
            />
            <span className="text-xs font-bold text-gray-300">{size}</span>
            <span className="text-[10px] font-mono text-gray-600">{label}</span>
          </div>
        ))}
      </div>

      {/* Difficulty buttons */}
      <div className={`flex flex-col gap-3 w-72 sm:w-80 transition-all duration-1000 delay-500 ${titleAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <button
          onClick={() => onStart('easy')}
          className="group relative bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-green-900/30"
        >
          <div className="text-sm tracking-wide">EASY</div>
          <div className="text-[10px] font-normal opacity-70">1 rival • Secured projects only • Relaxed deadlines</div>
        </button>
        <button
          onClick={() => onStart('normal')}
          className="group relative bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all active:scale-95 ring-2 ring-orange-400/50 shadow-lg shadow-orange-900/30"
        >
          <div className="absolute -top-2 -right-2 bg-orange-400 text-gray-900 text-[9px] font-black px-2 py-0.5 rounded-full">
            RECOMMENDED
          </div>
          <div className="text-sm tracking-wide">NORMAL</div>
          <div className="text-[10px] font-normal opacity-70">2 rivals • Full pipeline • Random events</div>
        </button>
        <button
          onClick={() => onStart('hard')}
          className="group relative bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-red-900/30"
        >
          <div className="text-sm tracking-wide">HARD</div>
          <div className="text-[10px] font-normal opacity-70">3 rivals • Aggressive AI • Tighter margins</div>
        </button>
      </div>

      {/* Load game */}
      {saveExists && (
        <div className={`mt-6 flex gap-3 transition-all duration-1000 delay-700 ${titleAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={handleLoad}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-mono py-2 px-5 rounded-lg transition-colors border border-gray-700"
          >
            📂 Continue Saved Game
          </button>
          <button
            onClick={() => setShowSavePrompt(true)}
            className="bg-gray-800/50 hover:bg-red-900/30 text-gray-500 hover:text-red-400 text-sm py-2 px-3 rounded-lg transition-colors"
            title="Delete save"
          >
            🗑️
          </button>
        </div>
      )}

      {/* Tip */}
      <div className={`mt-8 max-w-sm text-center transition-all duration-1000 delay-700 ${titleAnim ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">💡 Tip</div>
        <p className="text-gray-500 text-xs font-mono">{tip}</p>
      </div>

      {/* Version */}
      <div className="absolute bottom-4 text-gray-500 text-sm font-mono bg-gray-800/50 px-4 py-1.5 rounded-full border border-gray-700/50">
        v2.1 • Turn-Based Fleet Management
      </div>

      {/* Delete save confirm */}
      {showSavePrompt && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center animate-fade-in" style={{ zIndex: 9999 }}>
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-80 animate-pop-in">
            <h3 className="text-white font-bold mb-2">Delete saved game?</h3>
            <p className="text-gray-400 text-sm mb-4">This cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSavePrompt(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSave}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-sm font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
