export default function TimerBar({ formattedTime, progress, isExpired, currentMilestone }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm font-mono font-semibold ${isExpired ? "text-red-600 dark:text-red-400" : "text-on-surface-variant"}`}>
          {formattedTime}
        </span>
        {isExpired && (
          <span className="text-xs font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full">
            Time's up
          </span>
        )}
      </div>
      <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isExpired ? "bg-red-500" : progress > 0.75 ? "bg-amber-500" : "bg-primary"}`}
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>
      {currentMilestone && !isExpired && (
        <p className="text-xs text-amber-800 dark:text-amber-200 mt-1 bg-amber-100 dark:bg-amber-900/40 rounded px-2 py-0.5 inline-block">{currentMilestone.message}</p>
      )}
    </div>
  );
}
