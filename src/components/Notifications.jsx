const TYPE_STYLES = {
  success: 'bg-green-900/80 border-green-600/50 text-green-300',
  error: 'bg-red-900/80 border-red-600/50 text-red-300',
  warning: 'bg-amber-900/80 border-amber-600/50 text-amber-300',
  info: 'bg-blue-900/80 border-blue-600/50 text-blue-300',
  new_project: 'bg-purple-900/80 border-purple-600/50 text-purple-300',
  bid_won: 'bg-green-900/80 border-green-600/50 text-green-300',
  bid_lost: 'bg-gray-800/80 border-gray-600/50 text-gray-400',
  event: 'bg-orange-900/80 border-orange-600/50 text-orange-300',
  achievement: 'bg-amber-900/80 border-amber-500/50 text-amber-300',
};

export default function Notifications({ notifications, currentWeek, onDismiss }) {
  const recent = notifications
    .filter(n => currentWeek - n.week < 4)
    .slice(-5);

  if (recent.length === 0) return null;

  return (
    <div className="fixed bottom-16 md:bottom-4 left-1/2 -translate-x-1/2 z-40 space-y-1.5 w-[92vw] max-w-md">
      {recent.map((n, i) => (
        <div
          key={`${n.week}-${i}-${n.message.slice(0, 20)}`}
          className={`px-3 py-2 rounded-xl border text-xs font-mono cursor-pointer transition-all hover:opacity-70 backdrop-blur-sm shadow-lg animate-bounce-in ${
            TYPE_STYLES[n.type] || TYPE_STYLES.info
          }`}
          onClick={() => onDismiss(notifications.indexOf(n))}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}
