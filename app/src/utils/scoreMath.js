/**
 * Pure score-aggregation math shared by useScoring selectors and components
 * that compute over prop-passed question lists (e.g. SessionSummary).
 */

/** Arithmetic mean of a number array. Null for an empty list so callers can render a placeholder. */
export function average(values) {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** Average of the `score` field across question entries. Null when empty. */
export function averageScore(questions) {
  return average(questions.map((q) => q.score));
}

/** Average absolute `delta` across quantitative questions (delta != null). Null when none. */
export function averageAbsDelta(questions) {
  return average(questions.filter((q) => q.delta != null).map((q) => Math.abs(q.delta)));
}

/**
 * Set of companyIds that have at least one scored question.
 * Empty sessions (opened but never answered) do not count as attempts.
 */
export function attemptedCompanyIds(sessions) {
  const ids = new Set();
  for (const session of sessions) {
    if (session.questions.length > 0) ids.add(session.companyId);
  }
  return ids;
}
