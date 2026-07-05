/**
 * Serialize a company's operations (process map) into the model-answer string
 * sent to /api/evaluate for Stage 2A decomposition grading.
 *
 * /api/evaluate caps every field at 5000 chars (MAX_FIELD_LENGTH); live
 * profiles serialize well under that, but the cap here is a hard guarantee so
 * a future data edit can never produce a 400.
 */

// Headroom under the API's 5000-char MAX_FIELD_LENGTH.
export const MAX_SUMMARY_LENGTH = 4800;

const COST_LINE_LABELS = { cogs: "COGS", sgaExpense: "SG&A" };

export function buildProcessMapSummary(operations) {
  const summary = operations
    .map((op) => {
      const costLine = COST_LINE_LABELS[op.costAllocation.mapsTo] || op.costAllocation.mapsTo;
      return [
        `${op.name}: ${op.headcount} FTEs, ~$${op.costAllocation.amount}M in ${costLine}.`,
        `Manual work: ${op.manualSubProcesses.join("; ")}.`,
        `Tools: ${op.currentTools.join(", ")}.`,
        `Data quality: ${op.dataQuality}`,
      ].join(" ");
    })
    .join("\n");

  if (summary.length <= MAX_SUMMARY_LENGTH) return summary;
  return `${summary.slice(0, MAX_SUMMARY_LENGTH - 3)}...`;
}
