const FEASIBILITY_ROWS = ["high", "medium", "low"];
const IMPACT_BANDS = ["Lower impact", "Mid impact", "Higher impact"];

const TIER_STYLES = {
  1: "bg-success-container text-on-success-container",
  2: "bg-warning-container text-on-warning-container",
  3: "bg-error-container text-on-error-container",
};

function midpoint(opp) {
  return (opp.ebitdaImpactRange.low + opp.ebitdaImpactRange.high) / 2;
}

/**
 * Feasibility x impact grid. Rows are feasibility levels; columns bucket each
 * process's EBITDA impact midpoint into thirds of the company's max midpoint.
 * Legible over precise: exact ranges live in the results detail below it.
 */
export default function OpportunityMatrix({ operations, aiOpportunities, highlightedIds = [] }) {
  const entries = operations
    .filter((op) => aiOpportunities[op.id])
    .map((op) => ({ op, opp: aiOpportunities[op.id], mid: midpoint(aiOpportunities[op.id]) }));
  const maxMid = Math.max(...entries.map((e) => e.mid), 0.001);
  const bandOf = (mid) => Math.min(2, Math.floor((mid / maxMid) * 3));

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-2 min-w-[560px]">
        <div />
        {IMPACT_BANDS.map((band) => (
          <div
            key={band}
            className="text-[10px] uppercase tracking-widest text-on-surface-variant text-center pb-1"
          >
            {band}
          </div>
        ))}

        {FEASIBILITY_ROWS.map((feasibility) => (
          <MatrixRow
            key={feasibility}
            feasibility={feasibility}
            entries={entries.filter((e) => e.opp.feasibility === feasibility)}
            bandOf={bandOf}
            highlightedIds={highlightedIds}
          />
        ))}
      </div>
    </div>
  );
}

function MatrixRow({ feasibility, entries, bandOf, highlightedIds }) {
  return (
    <>
      <div className="text-[10px] uppercase tracking-widest text-on-surface-variant self-center pr-2">
        {feasibility}
        <span className="block normal-case tracking-normal">feasibility</span>
      </div>
      {[0, 1, 2].map((band) => (
        <div
          key={band}
          className="bg-surface-container-low rounded-lg p-2 min-h-[64px] space-y-1.5"
        >
          {entries
            .filter((e) => bandOf(e.mid) === band)
            .map(({ op, opp, mid }) => (
              <div
                key={op.id}
                className={`rounded-lg px-2 py-1.5 text-xs bg-surface-container-lowest ghost-border ${highlightedIds.includes(op.id) ? "ring-2 ring-primary" : ""}`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="font-medium text-on-surface truncate">{op.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap ${TIER_STYLES[opp.recommendedTier] || ""}`}
                  >
                    Tier {opp.recommendedTier}
                  </span>
                </div>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  ~${mid.toFixed(2)}M EBITDA
                </span>
              </div>
            ))}
        </div>
      ))}
    </>
  );
}
