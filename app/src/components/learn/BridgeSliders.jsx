const SLIDER_DEFS = [
  {
    key: "revenueCAGR",
    label: "Revenue CAGR",
    unit: "%",
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "marginExpansion",
    label: "Margin Expansion",
    unit: "bps",
    format: (v) => `${v >= 0 ? "+" : ""}${Math.round(v)} bps`,
  },
  {
    key: "multipleExpansion",
    label: "Multiple Expansion",
    unit: "x",
    format: (v) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}x`,
  },
  {
    key: "debtPaydown",
    label: "Debt Paydown",
    unit: "$M",
    format: (v) => `${v >= 0 ? "" : "-"}$${Math.abs(v).toFixed(1)}M`,
  },
];

export default function BridgeSliders({ assumptions, ranges, onChange, onReset, canReset }) {
  return (
    <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">
          Exit Assumptions (Year {assumptions.holdPeriod})
        </h3>
        {canReset && (
          <button
            onClick={onReset}
            className="text-xs text-primary hover:opacity-80"
          >
            Reset to plan
          </button>
        )}
      </div>
      <div className="space-y-4">
        {SLIDER_DEFS.map((def) => {
          const range = ranges[def.key];
          const value = assumptions[def.key];
          return (
            <div key={def.key}>
              <div className="flex items-baseline justify-between mb-1">
                <label className="text-xs text-on-surface">{def.label}</label>
                <span className="text-sm font-mono font-semibold text-on-surface">
                  {def.format(value)}
                </span>
              </div>
              <input
                type="range"
                min={range.min}
                max={range.max}
                step={range.step}
                value={value}
                onChange={(e) => onChange(def.key, Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
                aria-label={def.label}
              />
              <div className="flex justify-between text-[10px] text-outline-variant">
                <span>{def.format(range.min)}</span>
                <span>{def.format(range.max)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
