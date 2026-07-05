/**
 * Deterministic Stage 2B (opportunity ranking) grading. No LLM involved:
 * the "right answer" is computable from the aiOpportunities data, so grading
 * stays instant, free, and reproducible.
 *
 * Rubric (documented in docs/plans/2026-07-05-003-feat-stage2-consulting-wedge.md):
 * - value(process) = midpoint(ebitdaImpactRange) * feasibilityWeight
 * - ideal top 3 = values sorted desc; ties break by higher feasibility weight,
 *   then process id alphabetically (stable across runs).
 * - score = clamp(1 + overlapWithIdeal + (userNo1 === idealNo1 ? 1 : 0), 1, 5)
 */

export const FEASIBILITY_WEIGHTS = { high: 1.0, medium: 0.7, low: 0.4 };

/** Weighted expected EBITDA impact of one opportunity ($M midpoint x feasibility). */
export function opportunityValue(opp) {
  const midpoint = (opp.ebitdaImpactRange.low + opp.ebitdaImpactRange.high) / 2;
  return midpoint * (FEASIBILITY_WEIGHTS[opp.feasibility] ?? 0);
}

/**
 * Ideal top 3 process ids for a company's aiOpportunities map, best first.
 * Returns fewer than 3 only if fewer than 3 opportunities exist.
 */
export function computeIdealTop3(aiOpportunities) {
  return Object.entries(aiOpportunities)
    .map(([id, opp]) => ({
      id,
      value: opportunityValue(opp),
      weight: FEASIBILITY_WEIGHTS[opp.feasibility] ?? 0,
    }))
    .sort(
      (a, b) =>
        b.value - a.value || b.weight - a.weight || a.id.localeCompare(b.id),
    )
    .slice(0, 3)
    .map((entry) => entry.id);
}

/** 1-5 score for a user's ranked top 3 against the ideal top 3. */
export function scoreRanking(userIds, idealIds) {
  const overlap = userIds.filter((id) => idealIds.includes(id)).length;
  const firstPickBonus = userIds[0] === idealIds[0] ? 1 : 0;
  return Math.min(5, Math.max(1, 1 + overlap + firstPickBonus));
}

/**
 * Full grade payload for the reveal UI: score plus which picks matched, which
 * ideal picks were missed (to explain via complexityNotes/risks), and whether
 * the user's #1 was the ideal #1.
 */
export function gradeRanking(userIds, aiOpportunities) {
  const ideal = computeIdealTop3(aiOpportunities);
  return {
    ideal,
    score: scoreRanking(userIds, ideal),
    matched: ideal.filter((id) => userIds.includes(id)),
    missed: ideal.filter((id) => !userIds.includes(id)),
    firstPickCorrect: userIds[0] === ideal[0],
  };
}
