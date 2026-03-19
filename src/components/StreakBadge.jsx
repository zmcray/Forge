export default function StreakBadge({ streak, totalQuestions }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
      <div className="text-center">
        <div className="flex items-center gap-1">
          {streak.current > 0 && <span className="text-orange-500 text-lg">{"\uD83D\uDD25"}</span>}
          <span className="text-2xl font-bold text-gray-900">{streak.current}</span>
        </div>
        <p className="text-xs text-gray-500">Day Streak</p>
      </div>
      <div className="h-8 w-px bg-gray-200" />
      <div className="text-center">
        <span className="text-2xl font-bold text-blue-600">{totalQuestions}</span>
        <p className="text-xs text-gray-500">Qs Answered</p>
      </div>
    </div>
  );
}
