const TYPE_STYLES = {
  success: 'bg-green-900/80 border-green-600 text-green-300',
  error: 'bg-red-900/80 border-red-600 text-red-300',
  warning: 'bg-amber-900/80 border-amber-600 text-amber-300',
  info: 'bg-blue-900/80 border-blue-600 text-blue-300',
  new_project: 'bg-purple-900/80 border-purple-600 text-purple-300',
};

export default function Notifications({ notifications, currentWeek, onDismiss }) {
  const recent = notifications
    .filter(n => currentWeek - n.week < 4)
    .slice(-4);

  if (recent.length === 0) return null;

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40 space-y-1 w-[90vw] max-w-md">
      {recent.map((n, i) => (
        <div
          key={`${n.week}-${i}`}
          className={`px-3 py-2 rounded border text-xs font-mono cursor-pointer transition-opacity hover:opacity-70 ${
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
