export default function TitleScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
      {/* Title */}
      <div className="mb-12 text-center">
        <h1 className="text-6xl font-black text-orange-500 tracking-tight mb-2">
          TUNNEL TYCOON
        </h1>
        <p className="text-gray-500 text-sm font-mono">
          Dispatch TBMs. Deliver projects. Don't lose your reputation.
        </p>
      </div>

      {/* Fleet preview */}
      <div className="mb-10 flex gap-6 text-center">
        {[
          { size: '600mm', color: '#10b981', count: 3 },
          { size: '1200mm', color: '#3b82f6', count: 3 },
          { size: '1500mm', color: '#f59e0b', count: 1 },
          { size: '1800mm', color: '#ef4444', count: 2 },
        ].map(({ size, color, count }) => (
          <div key={size} className="flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-full mb-1"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs font-mono text-gray-400">{size}</span>
            <span className="text-xs font-mono text-gray-600">×{count}</span>
          </div>
        ))}
      </div>

      {/* Difficulty buttons */}
      <div className="flex flex-col gap-3 w-64">
        <button
          onClick={() => onStart('easy')}
          className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          <div className="text-sm">EASY</div>
          <div className="text-[10px] font-normal opacity-70">Secured projects only, no events</div>
        </button>
        <button
          onClick={() => onStart('normal')}
          className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-lg transition-colors ring-2 ring-orange-400"
        >
          <div className="text-sm">NORMAL</div>
          <div className="text-[10px] font-normal opacity-70">Full pipeline with likelihood rolls</div>
        </button>
        <button
          onClick={() => onStart('hard')}
          className="bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          <div className="text-sm">HARD</div>
          <div className="text-[10px] font-normal opacity-70">Tighter timelines, more pressure</div>
        </button>
      </div>

      <p className="mt-8 text-gray-700 text-xs font-mono">
        Manage your fleet across UK infrastructure projects
      </p>
    </div>
  );
}
