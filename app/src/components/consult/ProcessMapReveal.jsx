const COST_LINE_LABELS = { cogs: "COGS", sgaExpense: "SG&A" };

/**
 * The realistic process map revealed after the Stage 2A commit: one MD3 card
 * per operation with headcount, cost allocation, manual sub-processes,
 * current tools, and data quality.
 */
export default function ProcessMapReveal({ operations }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {operations.map((op) => (
        <div
          key={op.id}
          className="bg-surface-container-lowest ghost-border rounded-xl p-4"
        >
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold font-headline text-on-surface">{op.name}</h4>
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container whitespace-nowrap">
              {op.headcount} FTEs
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mb-3">{op.description}</p>

          <div className="text-xs text-on-surface mb-3">
            <span className="font-semibold">
              ~${op.costAllocation.amount}M in {COST_LINE_LABELS[op.costAllocation.mapsTo] || op.costAllocation.mapsTo}
            </span>
            <span className="text-on-surface-variant"> ... {op.costAllocation.note}</span>
          </div>

          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
            Manual sub-processes
          </p>
          <ul className="text-xs text-on-surface-variant space-y-1 mb-3 list-disc list-inside">
            {op.manualSubProcesses.map((sub) => (
              <li key={sub}>{sub}</li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {op.currentTools.map((tool) => (
              <span
                key={tool}
                className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant"
              >
                {tool}
              </span>
            ))}
          </div>

          <p className="text-xs text-on-surface-variant border-t border-outline-variant/30 pt-2">
            <span className="font-semibold text-on-surface">Data quality:</span> {op.dataQuality}
          </p>
        </div>
      ))}
    </div>
  );
}
