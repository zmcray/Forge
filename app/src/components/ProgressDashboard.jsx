import { QUESTION_TYPES } from "../data/questionTypes";
import { useScoringState, useScoringDispatch } from "../contexts/ScoringContext";

export default function ProgressDashboard() {
  const { streak } = useScoringState();
  const { getScoresByType, getQuantitativeAccuracy } = useScoringDispatch();
  const scores = getScoresByType();
  const quantitativeAccuracy = getQuantitativeAccuracy();
  const allScores = Object.values(scores).flat();
  const avgScore = allScores.length > 0 ? (allScores.reduce((a,b) => a+b, 0) / allScores.length).toFixed(1) : "\u2014";
  const totalQs = allScores.length;

  const byType = Object.entries(QUESTION_TYPES).map(([key, info]) => {
    const typeScores = scores[key] || [];
    const avg = typeScores.length > 0 ? (typeScores.reduce((a,b) => a+b, 0) / typeScores.length) : null;
    return { key, ...info, scores: typeScores, avg, count: typeScores.length };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest ghost-border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-on-surface">{totalQs}</p>
          <p className="text-sm text-on-surface-variant">Questions Completed</p>
        </div>
        <div className="bg-surface-container-lowest ghost-border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-primary">{avgScore}</p>
          <p className="text-sm text-on-surface-variant">Average Score</p>
        </div>
        <div className="bg-surface-container-lowest ghost-border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-on-tertiary-container">{allScores.filter(s => s >= 4).length}</p>
          <p className="text-sm text-on-surface-variant">Strong Answers (4-5)</p>
        </div>
        <div className="bg-surface-container-lowest ghost-border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-on-surface">{streak ? streak.current : 0}</p>
          <p className="text-sm text-on-surface-variant">Day Streak</p>
        </div>
      </div>

      {quantitativeAccuracy && (
        <div className="bg-surface-container-lowest ghost-border rounded-xl p-4">
          <h3 className="font-semibold text-on-surface mb-1">Quantitative Accuracy</h3>
          <p className="text-sm text-on-surface-variant">Average delta: <span className="font-mono font-semibold">{quantitativeAccuracy.avgDelta}pp</span> off across {quantitativeAccuracy.count} questions</p>
        </div>
      )}

      <div className="bg-surface-container-lowest ghost-border rounded-xl p-4">
        <h3 className="font-semibold text-on-surface mb-3">Performance by Category</h3>
        <div className="space-y-3">
          {byType.map(t => (
            <div key={t.key} className="flex items-center gap-3">
              <span className="text-lg w-6 text-center">{t.icon}</span>
              <span className="text-sm font-medium text-on-surface-variant w-40">{t.label}</span>
              <div className="flex-1 bg-surface-container-high rounded-full h-4 overflow-hidden">
                {t.avg !== null && (
                  <div
                    className={`h-full rounded-full transition-all ${t.avg >= 4 ? "bg-on-tertiary-container" : t.avg >= 2.5 ? "bg-secondary-container" : "bg-error"}`}
                    style={{ width: `${(t.avg / 5) * 100}%` }}
                  />
                )}
              </div>
              <span className="text-sm font-mono font-semibold w-16 text-right">
                {t.avg !== null ? `${t.avg.toFixed(1)} / 5` : "\u2014"}
              </span>
              <span className="text-xs text-outline-variant w-12 text-right">{t.count} Qs</span>
            </div>
          ))}
        </div>
      </div>

      {allScores.length > 0 && (
        <div className="bg-surface-container-lowest ghost-border rounded-xl p-4">
          <h3 className="font-semibold text-on-surface mb-3">Focus Areas</h3>
          {byType.filter(t => t.avg !== null && t.avg < 3).length > 0 ? (
            <div className="space-y-2">
              {byType.filter(t => t.avg !== null && t.avg < 3).map(t => (
                <div key={t.key} className="bg-error-container border border-error/30 rounded-lg p-3 text-sm">
                  <span className="font-semibold text-error">{t.icon} {t.label}</span>
                  <span className="text-error ml-2">avg {t.avg.toFixed(1)}/5. Keep practicing this area.</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-tertiary-container bg-tertiary-container border border-on-tertiary-container/30 rounded-lg p-3">
              All categories at 3.0+. Solid foundation across the board.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
