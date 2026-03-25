export default function TimerBar({ formattedTime, progress, isExpired, currentMilestone }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm font-mono font-semibold ${isExpired ? "text-red-600" : "text-gray-700"}`}>
          {formattedTime}
        </span>
        {isExpired && (
          <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
            Time's up
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isExpired ? "bg-red-500" : progress > 0.75 ? "bg-amber-500" : "bg-blue-500"}`}
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>
      {currentMilestone && !isExpired && (
        <p className="text-xs text-amber-700 mt-1 bg-amber-50 rounded px-2 py-0.5 inline-block">{currentMilestone.message}</p>
      )}
    </div>
  );
}
