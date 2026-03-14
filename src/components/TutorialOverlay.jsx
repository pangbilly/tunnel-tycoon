const TUTORIAL_STEPS = [
  {
    title: 'Welcome to Tunnel Tycoon! 🏗️',
    text: 'You run a TBM (Tunnel Boring Machine) fleet. Your job: win contracts, dispatch machines, and make money. Simple, right?',
    tip: 'Spoiler: it\'s not simple.',
  },
  {
    title: 'Bidding for Contracts 📋',
    text: 'When new projects appear, you\'ll bid against AI rivals. Bid low to win, but not too low — you need to actually make money!',
    tip: 'The sweet spot is usually 85-95% of market rate.',
  },
  {
    title: 'Your Fleet 🚜',
    text: 'You have TBMs in 4 sizes: 600mm, 1200mm, 1500mm, and 1800mm. Each project requires a specific size.',
    tip: 'Select a TBM, then select a project to dispatch it.',
  },
  {
    title: 'Cabins & Logistics 🏠',
    text: 'Each active TBM needs a cabin for the crew. You only have 6 cabins, so you can\'t run everything at once.',
    tip: 'Recall TBMs from completed jobs to free up cabins.',
  },
  {
    title: 'Reputation ⭐',
    text: 'Your reputation is everything. Lose contracts and it drops. Hit zero and the board fires you. Keep it high for score multipliers!',
    tip: 'Complete projects to maintain your stars.',
  },
  {
    title: 'Random Events 🎲',
    text: 'Expect the unexpected! Breakdowns, weather, inspections, and more. Each event gives you choices with trade-offs.',
    tip: 'Sometimes spending a bit now saves a lot later.',
  },
  {
    title: 'Ready to Dig! ⛏️',
    text: 'Click END WEEK to advance time. You\'ve got 5 years to build the biggest tunnelling empire in the UK. Good luck!',
    tip: 'Press Enter or Space to quickly end the week.',
  },
];

export default function TutorialOverlay({ step, onNext, onSkip }) {
  if (step === null || step >= TUTORIAL_STEPS.length) return null;

  const current = TUTORIAL_STEPS[step];
  const isLast = step === TUTORIAL_STEPS.length - 1;
  const progress = ((step + 1) / TUTORIAL_STEPS.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 animate-fade-in" style={{ zIndex: 9999 }}>
      <div className="glass-panel rounded-2xl p-6 w-full max-w-md animate-pop-in">
        {/* Progress bar */}
        <div className="w-full bg-gray-800 rounded-full h-1 mb-4">
          <div
            className="h-1 rounded-full bg-orange-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step counter */}
        <div className="text-[10px] text-gray-600 font-mono mb-3">
          {step + 1} / {TUTORIAL_STEPS.length}
        </div>

        {/* Content */}
        <h3 className="text-lg font-black text-white mb-2">{current.title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed mb-3">{current.text}</p>

        {/* Tip */}
        {current.tip && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-4">
            <span className="text-xs text-orange-400 font-mono">💡 {current.tip}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="text-gray-500 hover:text-gray-300 text-sm font-mono transition-colors"
          >
            Skip tutorial
          </button>
          <button
            onClick={onNext}
            className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2.5 rounded-xl transition-all active:scale-95 text-sm"
          >
            {isLast ? 'Let\'s Go!' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
