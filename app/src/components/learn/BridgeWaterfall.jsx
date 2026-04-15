/**
 * Waterfall chart for a value creation bridge.
 * Five vertical bars: entry equity, three delta contributors, exit equity.
 * Pure Tailwind + inline height/bottom percentages. No charting library.
 */
export default function BridgeWaterfall({ bridge }) {
  const { entryEquity, ebitdaGrowth, multipleExpansion, debtPaydown, exitEquity } = bridge;

  // Scale: use the maximum of entry/exit/cumulative peak so every bar fits.
  const cumulativeAfterEbitda = entryEquity + ebitdaGrowth;
  const cumulativeAfterMultiple = cumulativeAfterEbitda + multipleExpansion;
  const peak = Math.max(entryEquity, exitEquity, cumulativeAfterEbitda, cumulativeAfterMultiple);
  const scale = peak > 0 ? peak : 1;

  // For delta bars, compute top and bottom of each float relative to cumulative path.
  const ebitdaFloat = deltaFloat(entryEquity, ebitdaGrowth, scale);
  const multipleFloat = deltaFloat(cumulativeAfterEbitda, multipleExpansion, scale);
  const debtFloat = deltaFloat(cumulativeAfterMultiple, debtPaydown, scale);

  const bars = [
    {
      label: "Entry Equity",
      valueLabel: `$${entryEquity.toFixed(1)}M`,
      bottomPct: 0,
      heightPct: (entryEquity / scale) * 100,
      color: "bg-outline-variant",
      labelColor: "text-on-surface-variant",
    },
    {
      label: "EBITDA Growth",
      valueLabel: formatDelta(ebitdaGrowth),
      bottomPct: ebitdaFloat.bottomPct,
      heightPct: ebitdaFloat.heightPct,
      color: ebitdaGrowth >= 0 ? "bg-primary" : "bg-error",
      labelColor: "text-on-surface",
    },
    {
      label: "Multiple Expansion",
      valueLabel: formatDelta(multipleExpansion),
      bottomPct: multipleFloat.bottomPct,
      heightPct: multipleFloat.heightPct,
      color: multipleExpansion >= 0 ? "bg-tertiary" : "bg-error",
      labelColor: "text-on-surface",
    },
    {
      label: "Debt Paydown",
      valueLabel: formatDelta(debtPaydown),
      bottomPct: debtFloat.bottomPct,
      heightPct: debtFloat.heightPct,
      color: debtPaydown >= 0 ? "bg-secondary" : "bg-error",
      labelColor: "text-on-surface",
    },
    {
      label: "Exit Equity",
      valueLabel: `$${exitEquity.toFixed(1)}M`,
      bottomPct: 0,
      heightPct: (exitEquity / scale) * 100,
      color: "bg-on-surface",
      labelColor: "text-on-surface",
    },
  ];

  return (
    <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-4">
      <div className="relative h-64 flex items-end justify-between gap-3 px-2 pb-1 border-b border-outline-variant/40">
        {bars.map((bar, i) => (
          <div key={i} className="relative flex-1 h-full">
            {bar.heightPct > 0 && (
              <div
                className={`absolute left-0 right-0 ${bar.color} rounded-t transition-all duration-200 ease-out`}
                style={{
                  bottom: `${bar.bottomPct}%`,
                  height: `${Math.max(0.5, bar.heightPct)}%`,
                }}
              >
                <div className={`absolute -top-5 left-0 right-0 text-center text-[10px] font-semibold font-mono ${bar.labelColor}`}>
                  {bar.valueLabel}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-start justify-between gap-3 px-2 pt-2">
        {bars.map((bar, i) => (
          <div key={i} className="flex-1 text-center">
            <div className="text-[10px] uppercase tracking-wide text-on-surface-variant leading-tight">
              {bar.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Compute the bottom position and height of a delta bar on the cumulative path.
 * A positive delta floats up from `cumulative` by `delta`.
 * A negative delta floats down from `cumulative` by |delta|.
 */
function deltaFloat(cumulative, delta, scale) {
  if (delta >= 0) {
    return {
      bottomPct: (cumulative / scale) * 100,
      heightPct: (delta / scale) * 100,
    };
  }
  return {
    bottomPct: ((cumulative + delta) / scale) * 100,
    heightPct: (Math.abs(delta) / scale) * 100,
  };
}

function formatDelta(value) {
  if (value >= 0) return `+$${value.toFixed(1)}M`;
  return `-$${Math.abs(value).toFixed(1)}M`;
}
