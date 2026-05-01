export function LLMFeedbackSkeleton() {
  return (
    <div className="animate-pulse space-y-2 mb-3">
      <div className="bg-green-50/50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/50 rounded-lg p-3">
        <div className="h-3 w-28 bg-green-100 dark:bg-green-900/60 rounded mb-2" />
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-green-100/60 dark:bg-green-900/40 rounded" />
          <div className="h-3 w-4/5 bg-green-100/60 dark:bg-green-900/40 rounded" />
        </div>
      </div>
      <div className="bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded-lg p-3">
        <div className="h-3 w-24 bg-amber-100 dark:bg-amber-900/60 rounded mb-2" />
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-amber-100/60 dark:bg-amber-900/40 rounded" />
          <div className="h-3 w-3/5 bg-amber-100/60 dark:bg-amber-900/40 rounded" />
        </div>
      </div>
      <p className="text-xs text-on-surface-variant/60 italic">Analyzing your response...</p>
    </div>
  );
}

export function LLMGrading({ result }) {
  if (!result || typeof result !== "object") return null;
  const score = result.score ?? 0;
  const strengths = Array.isArray(result.strengths) ? result.strengths : [];
  const gaps = Array.isArray(result.gaps) ? result.gaps : [];

  return (
    <div className="space-y-3 mb-3">
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold px-2 py-0.5 rounded ${score >= 4 ? "bg-green-100 text-green-800" : score >= 3 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
          {score}/5
        </span>
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">AI Assessment</span>
      </div>

      {strengths.length > 0 && (
        <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/60 rounded-lg p-3">
          <p className="font-semibold text-green-800 dark:text-green-300 text-xs uppercase mb-1">What You Got Right</p>
          <ul className="text-sm text-green-900 dark:text-green-100 space-y-1">
            {strengths.map((s, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="shrink-0">&#10003;</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {gaps.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-lg p-3">
          <p className="font-semibold text-red-800 dark:text-red-300 text-xs uppercase mb-1">What You Missed</p>
          <ul className="text-sm text-red-900 dark:text-red-100 space-y-1">
            {gaps.map((g, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="shrink-0">&#10007;</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.suggestion && (
        <p className="text-sm text-on-surface-variant bg-surface-container-low border border-outline-variant/30 rounded-lg p-3">
          <span className="font-semibold text-on-surface">Next time:</span> {result.suggestion}
        </p>
      )}
    </div>
  );
}
