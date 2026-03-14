export default function EventModal({ event, onChoice }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 animate-fade-in" style={{ zIndex: 9999 }}>
      <div className="glass-panel rounded-2xl p-6 w-full max-w-md animate-pop-in">
        {/* Icon and title */}
        <div className="text-center mb-4">
          <div className="text-5xl mb-3">{event.icon}</div>
          <h3 className="text-xl font-black text-white mb-1">{event.name}</h3>
          <div className="text-xs text-orange-400 font-mono uppercase tracking-wider">Random Event</div>
        </div>

        {/* Description */}
        <div className="bg-gray-800/60 rounded-xl p-4 mb-5">
          <p className="text-gray-300 text-sm leading-relaxed">{event.description}</p>
        </div>

        {/* Choices */}
        <div className="space-y-2">
          {event.choices.map((choice, i) => {
            const effect = choice.effect;
            let costLabel = '';
            let costColor = 'text-gray-400';

            if (effect.type === 'SPEND_CASH') {
              costLabel = `−£${effect.amount}k`;
              costColor = 'text-red-400';
            } else if (effect.type === 'BONUS_CASH') {
              costLabel = `+£${effect.amount}k`;
              costColor = 'text-green-400';
            } else if (effect.type === 'DELAY_RANDOM_PROJECT') {
              costLabel = `+${effect.weeks}wk delay`;
              costColor = 'text-amber-400';
            } else if (effect.type === 'DELAY_ALL_PROJECTS') {
              costLabel = `All sites +${effect.weeks}wk`;
              costColor = 'text-amber-400';
            } else if (effect.type === 'REP_CHANGE') {
              costLabel = effect.amount > 0 ? `Rep +${effect.amount}` : `Rep ${effect.amount}`;
              costColor = effect.amount > 0 ? 'text-green-400' : 'text-red-400';
              if (effect.chance) costLabel += ` (${Math.round(effect.chance * 100)}% chance)`;
            }

            if (effect.repBoost) {
              costLabel += (costLabel ? ' · ' : '') + `Rep +${effect.repBoost}`;
            }

            return (
              <button
                key={i}
                onClick={() => onChoice(i)}
                className={`w-full text-left bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/50 hover:border-gray-600 rounded-xl p-4 transition-all active:scale-[0.98] group ${
                  i === 0 ? 'hover:border-orange-500/30' : 'hover:border-gray-500/30'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-200 font-medium group-hover:text-white transition-colors">
                    {choice.label}
                  </span>
                  {costLabel && (
                    <span className={`text-xs font-mono ml-3 flex-shrink-0 ${costColor}`}>
                      {costLabel}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
