import { getScoreChipClass } from "../utils/format";

export function LLMFeedbackSkeleton() {
  return (
    <div className="animate-pulse space-y-2 mb-3">
      <div className="bg-success-container/30 border border-success-container rounded-lg p-3">
        <div className="h-3 w-28 bg-success-container rounded mb-2" />
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-success-container/60 rounded" />
          <div className="h-3 w-4/5 bg-success-container/60 rounded" />
        </div>
      </div>
      <div className="bg-warning-container/30 border border-warning-container rounded-lg p-3">
        <div className="h-3 w-24 bg-warning-container rounded mb-2" />
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-warning-container/60 rounded" />
          <div className="h-3 w-3/5 bg-warning-container/60 rounded" />
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
        <span className={`text-sm font-bold px-2 py-0.5 rounded ${getScoreChipClass(score)}`}>
          {score}/5
        </span>
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">AI Assessment</span>
      </div>

      {strengths.length > 0 && (
        <div className="bg-success-container/40 border border-success-container rounded-lg p-3">
          <p className="font-semibold text-on-success-container text-xs uppercase mb-1">What You Got Right</p>
          <ul className="text-sm text-on-success-container space-y-1">
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
        <div className="bg-error-container/40 border border-error-container rounded-lg p-3">
          <p className="font-semibold text-on-error-container text-xs uppercase mb-1">What You Missed</p>
          <ul className="text-sm text-on-error-container space-y-1">
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
