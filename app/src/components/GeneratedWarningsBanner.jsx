import { useState } from "react";

export default function GeneratedWarningsBanner({ warnings }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !warnings?.length) return null;

  return (
    <div
      role="alert"
      className="bg-warning/10 border-l-4 border-warning rounded-lg px-4 py-3 mb-4 flex items-start justify-between gap-4"
    >
      <div className="flex items-start gap-3 min-w-0">
        <span className="material-symbols-outlined text-[20px] text-warning shrink-0">
          warning
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-on-surface">
            AI-generated, unverified financials ({warnings.length}{" "}
            {warnings.length === 1 ? "inconsistency" : "inconsistencies"})
          </p>
          <ul className="mt-1 list-disc list-inside text-xs text-on-surface-variant">
            {warnings.map(warning => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-xs text-on-surface-variant hover:text-on-surface transition-colors uppercase tracking-widest font-medium shrink-0"
      >
        Dismiss
      </button>
    </div>
  );
}
