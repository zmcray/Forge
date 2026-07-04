export default function TimerBar({ formattedTime, progress, isExpired, currentMilestone }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm font-mono font-semibold ${isExpired ? "text-error" : "text-on-surface-variant"}`}>
          {formattedTime}
        </span>
        {isExpired && (
          <span className="text-xs font-semibold bg-error-container text-on-error-container px-2 py-0.5 rounded-full">
            Time's up
          </span>
        )}
      </div>
      <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isExpired ? "bg-error" : progress > 0.75 ? "bg-warning" : "bg-primary"}`}
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>
      {currentMilestone && !isExpired && (
        <p className="text-xs bg-warning-container text-on-warning-container mt-1 rounded px-2 py-0.5 inline-block">{currentMilestone.message}</p>
      )}
    </div>
  );
}
