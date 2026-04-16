import { QUESTION_TYPES } from "../data/questionTypes";

export default function WeakSpotCard({ weakSpots, quantitativeAccuracy }) {
  if (!weakSpots && !quantitativeAccuracy) return null;

  return (
    <div className="bg-surface-container-lowest border border-amber-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-amber-900 mb-2">Focus Areas</h3>
      {weakSpots && weakSpots.map(w => {
        const info = QUESTION_TYPES[w.type];
        return (
          <div key={w.type} className="flex items-center gap-2 text-sm mb-1.5">
            <span>{info?.icon}</span>
            <span className="text-on-surface-variant">{info?.label}</span>
            <span className="text-amber-700 font-mono text-xs">avg {w.avg.toFixed(1)}/5</span>
          </div>
        );
      })}
      {quantitativeAccuracy && (
        <div className="text-xs text-on-surface-variant mt-2 pt-2 border-t border-outline-variant">
          Quantitative accuracy: avg {quantitativeAccuracy.avgDelta}pp off ({quantitativeAccuracy.count} questions)
        </div>
      )}
    </div>
  );
}
