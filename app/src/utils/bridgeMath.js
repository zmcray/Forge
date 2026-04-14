/**
 * Value Creation Bridge math utilities.
 *
 * Decomposes PE returns into four drivers using the standard textbook
 * cross-product attribution:
 *
 *   ΔEnterpriseValue = ΔEBITDA × EntryMultiple + ΔMultiple × ExitEBITDA
 *   ΔEquity          = ΔEnterpriseValue + DebtPaydown
 *
 * This is the "organic EBITDA growth + multiple expansion + debt paydown"
 * bridge that every PE deck uses at exit.
 */

/**
 * Calculate the bridge decomposition from entry and exit states.
 *
 * @param {Object} entry { revenue, ebitda, ebitdaMargin, multiple, enterpriseValue, netDebt }
 * @param {Object} exit  { revenue, ebitda, ebitdaMargin, multiple, enterpriseValue, netDebt }
 * @returns {Object} { entryEquity, exitEquity, ebitdaGrowth, multipleExpansion, debtPaydown, moic, irr }
 */
export function calculateBridge(entry, exit, holdPeriod) {
  const entryEquity = entry.enterpriseValue - entry.netDebt;
  const exitEquity = exit.enterpriseValue - exit.netDebt;

  // Standard cross-product attribution:
  //   EBITDA growth at the entry multiple (what the buyer paid for each $)
  //   Multiple expansion on the exit EBITDA (what the seller delivered)
  const ebitdaGrowth = (exit.ebitda - entry.ebitda) * entry.multiple;
  const multipleExpansion = (exit.multiple - entry.multiple) * exit.ebitda;
  const debtPaydown = entry.netDebt - exit.netDebt;

  const moic = entryEquity > 0 ? exitEquity / entryEquity : 0;
  const irr = calculateIRR(moic, holdPeriod);

  return {
    entryEquity,
    exitEquity,
    ebitdaGrowth,
    multipleExpansion,
    debtPaydown,
    moic,
    irr,
  };
}

/**
 * Calculate IRR for a single-flow MOIC over a hold period.
 * IRR = MOIC^(1/years) - 1
 *
 * Returns null for degenerate inputs (non-positive MOIC or years).
 */
export function calculateIRR(moic, years) {
  if (years == null || years <= 0) return null;
  if (moic == null || moic <= 0) return null;
  return Math.pow(moic, 1 / years) - 1;
}

/**
 * Compute attribution percentages that sum to exactly 100.0.
 *
 * Total return = exitEquity - entryEquity, decomposed into four parts:
 *   entryEquity  (capital at risk)
 *   ebitdaGrowth
 *   multipleExpansion
 *   debtPaydown
 *
 * Naive rounding can leave the sum at 99.8 or 100.2. We round three components
 * and absorb the residual into the largest one so the displayed sum is exact.
 */
export function computeAttribution(bridge) {
  const total = bridge.exitEquity;
  if (total <= 0) {
    return {
      entryEquity: 0,
      ebitdaGrowth: 0,
      multipleExpansion: 0,
      debtPaydown: 0,
    };
  }

  const raw = {
    entryEquity: (bridge.entryEquity / total) * 100,
    ebitdaGrowth: (bridge.ebitdaGrowth / total) * 100,
    multipleExpansion: (bridge.multipleExpansion / total) * 100,
    debtPaydown: (bridge.debtPaydown / total) * 100,
  };

  const rounded = {
    entryEquity: Math.round(raw.entryEquity * 10) / 10,
    ebitdaGrowth: Math.round(raw.ebitdaGrowth * 10) / 10,
    multipleExpansion: Math.round(raw.multipleExpansion * 10) / 10,
    debtPaydown: Math.round(raw.debtPaydown * 10) / 10,
  };

  // Absorb residual into the largest component so displayed sum = 100.0
  const sum = rounded.entryEquity + rounded.ebitdaGrowth + rounded.multipleExpansion + rounded.debtPaydown;
  const residual = Math.round((100 - sum) * 10) / 10;

  const largestKey = Object.entries(rounded).sort((a, b) => b[1] - a[1])[0][0];
  rounded[largestKey] = Math.round((rounded[largestKey] + residual) * 10) / 10;

  return rounded;
}

/**
 * Apply user-adjusted assumptions to an entry state to derive a synthetic exit state.
 * Used by the exercise grader so users can adjust sliders and see the resulting MOIC.
 *
 * @param {Object} entry entry metrics
 * @param {Object} assumptions { revenueCAGR, marginExpansion, multipleExpansion, debtPaydown, holdPeriod }
 * @returns {Object} synthetic exit metrics
 */
export function applyAssumptions(entry, assumptions) {
  const years = assumptions.holdPeriod;
  const revenueGrowthFactor = Math.pow(1 + assumptions.revenueCAGR / 100, years);
  const exitRevenue = entry.revenue * revenueGrowthFactor;

  const exitMarginPct = entry.ebitdaMargin + assumptions.marginExpansion / 100;
  const exitEbitda = (exitRevenue * exitMarginPct) / 100;

  const exitMultiple = entry.multiple + assumptions.multipleExpansion;
  const exitEnterpriseValue = exitEbitda * exitMultiple;

  const exitNetDebt = Math.max(0, entry.netDebt - assumptions.debtPaydown);

  return {
    revenue: exitRevenue,
    ebitda: exitEbitda,
    ebitdaMargin: exitMarginPct,
    multiple: exitMultiple,
    enterpriseValue: exitEnterpriseValue,
    netDebt: exitNetDebt,
  };
}

/**
 * Grade a user's exercise attempt.
 *
 * @param {Object} entry scenario entry state
 * @param {Object} userAssumptions user-adjusted assumptions
 * @param {Number} targetMoic the MOIC the user is trying to hit
 * @param {Number} tolerance acceptable ± delta (default 0.1x)
 * @returns {Object} { passed, userMoic, targetMoic, delta }
 */
export function gradeExercise(entry, userAssumptions, targetMoic, tolerance = 0.1) {
  const userExit = applyAssumptions(entry, userAssumptions);
  const bridge = calculateBridge(entry, userExit, userAssumptions.holdPeriod);
  const userMoic = bridge.moic;
  const delta = Math.abs(userMoic - targetMoic);
  const passed = delta <= tolerance;
  return { passed, userMoic, targetMoic, delta };
}
