export function LLMFeedbackSkeleton() {
  return (
    <div className="animate-pulse space-y-2 mb-3">
      <div className="bg-green-50/50 border border-green-100 rounded-lg p-3">
        <div className="h-3 w-28 bg-green-100 rounded mb-2" />
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-green-100/60 rounded" />
          <div className="h-3 w-4/5 bg-green-100/60 rounded" />
        </div>
      </div>
      <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-3">
        <div className="h-3 w-24 bg-amber-100 rounded mb-2" />
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-amber-100/60 rounded" />
          <div className="h-3 w-3/5 bg-amber-100/60 rounded" />
        </div>
      </div>
      <p className="text-xs text-gray-400 italic">Analyzing your response...</p>
    </div>
  );
}

export function LLMGrading({ result }) {
  return (
    <div className="space-y-3 mb-3">
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold px-2 py-0.5 rounded ${result.score >= 4 ? "bg-green-100 text-green-800" : result.score >= 3 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
          {result.score}/5
        </span>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">AI Assessment</span>
      </div>

      {result.strengths.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="font-semibold text-green-800 text-xs uppercase mb-1">What You Got Right</p>
          <ul className="text-sm text-green-900 space-y-1">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="shrink-0">&#10003;</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.gaps.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="font-semibold text-red-800 text-xs uppercase mb-1">What You Missed</p>
          <ul className="text-sm text-red-900 space-y-1">
            {result.gaps.map((g, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="shrink-0">&#10007;</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.suggestion && (
        <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
          <span className="font-semibold text-gray-700">Next time:</span> {result.suggestion}
        </p>
      )}
    </div>
  );
}
