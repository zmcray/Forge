import { describe, it, expect } from "vitest";
import {
  calculateBridge,
  calculateIRR,
  computeAttribution,
  applyAssumptions,
  gradeExercise,
} from "./bridgeMath";

// Reference scenario from the parent plan — textbook cross-product attribution
const BASELINE_ENTRY = {
  revenue: 50,
  ebitda: 10,
  ebitdaMargin: 20,
  multiple: 6.0,
  enterpriseValue: 60,
  netDebt: 30,
};

const BASELINE_EXIT = {
  revenue: 80,
  ebitda: 16,
  ebitdaMargin: 20,
  multiple: 8.0,
  enterpriseValue: 128,
  netDebt: 10,
};

describe("calculateBridge — happy path", () => {
  it("computes standard baseline bridge with 3.93x MOIC", () => {
    const bridge = calculateBridge(BASELINE_ENTRY, BASELINE_EXIT, 5);
    expect(bridge.entryEquity).toBe(30);
    expect(bridge.exitEquity).toBe(118);
    expect(bridge.ebitdaGrowth).toBe(36); // (16-10) * 6
    expect(bridge.multipleExpansion).toBe(32); // (8-6) * 16
    expect(bridge.debtPaydown).toBe(20); // 30 - 10
    expect(bridge.moic).toBeCloseTo(118 / 30, 5);
  });

  it("bridge components sum to equity gain (conservation of value)", () => {
    const bridge = calculateBridge(BASELINE_ENTRY, BASELINE_EXIT, 5);
    const totalDelta = bridge.exitEquity - bridge.entryEquity;
    const components = bridge.ebitdaGrowth + bridge.multipleExpansion + bridge.debtPaydown;
    expect(components).toBeCloseTo(totalDelta, 5);
  });
});

describe("calculateBridge — edge cases", () => {
  it("handles negative revenue growth (declining business)", () => {
    const shrinkExit = { ...BASELINE_EXIT, revenue: 40, ebitda: 8, enterpriseValue: 48 };
    const bridge = calculateBridge(BASELINE_ENTRY, shrinkExit, 5);
    expect(bridge.ebitdaGrowth).toBe(-12); // (8-10) * 6
    expect(bridge.moic).toBeLessThan(2);
  });

  it("handles zero margin expansion (flat margins)", () => {
    const bridge = calculateBridge(BASELINE_ENTRY, BASELINE_EXIT, 5);
    expect(BASELINE_EXIT.ebitdaMargin).toBe(BASELINE_ENTRY.ebitdaMargin);
    expect(bridge.multipleExpansion).toBeGreaterThan(0);
  });

  it("handles multiple contraction (exit multiple below entry)", () => {
    const contractedExit = { ...BASELINE_EXIT, multiple: 5.0, enterpriseValue: 80 };
    const bridge = calculateBridge(BASELINE_ENTRY, contractedExit, 5);
    expect(bridge.multipleExpansion).toBe(-16); // (5-6) * 16
  });

  it("handles debt paydown exceeding entry debt (over-deleveraging)", () => {
    const overDeleveraged = { ...BASELINE_EXIT, netDebt: -5 };
    const bridge = calculateBridge(BASELINE_ENTRY, overDeleveraged, 5);
    expect(bridge.debtPaydown).toBe(35); // 30 - (-5)
  });

  it("handles MOIC < 1 (loss scenario)", () => {
    const lossExit = {
      revenue: 30,
      ebitda: 5,
      ebitdaMargin: 16.67,
      multiple: 4.0,
      enterpriseValue: 20,
      netDebt: 10,
    };
    const bridge = calculateBridge(BASELINE_ENTRY, lossExit, 5);
    expect(bridge.moic).toBeLessThan(1);
    expect(bridge.exitEquity).toBe(10);
    expect(bridge.exitEquity - bridge.entryEquity).toBe(-20);
  });
});

describe("calculateIRR", () => {
  it("calculates IRR for standard 3.93x / 5yr scenario", () => {
    const irr = calculateIRR(3.93, 5);
    expect(irr).toBeCloseTo(0.3151, 3);
  });

  it("returns null when years is zero", () => {
    expect(calculateIRR(3.0, 0)).toBe(null);
  });

  it("returns null when years is negative", () => {
    expect(calculateIRR(3.0, -1)).toBe(null);
  });

  it("returns null when MOIC is zero", () => {
    expect(calculateIRR(0, 5)).toBe(null);
  });

  it("returns null when MOIC is negative", () => {
    expect(calculateIRR(-0.5, 5)).toBe(null);
  });

  it("returns 0 for MOIC = 1 (break-even)", () => {
    expect(calculateIRR(1, 5)).toBe(0);
  });

  it("returns negative IRR for MOIC < 1 (loss)", () => {
    const irr = calculateIRR(0.5, 5);
    expect(irr).toBeLessThan(0);
    expect(irr).toBeCloseTo(-0.1294, 3);
  });
});

describe("computeAttribution", () => {
  it("percentages sum to 100.0 at display precision (1 decimal)", () => {
    const bridge = calculateBridge(BASELINE_ENTRY, BASELINE_EXIT, 5);
    const attr = computeAttribution(bridge);
    const sum = attr.entryEquity + attr.ebitdaGrowth + attr.multipleExpansion + attr.debtPaydown;
    // Float arithmetic may leave residual in last decimal place after summing;
    // what matters is that the rounded display reads 100.0.
    expect(Math.round(sum * 10) / 10).toBe(100);
  });

  it("handles zero-return case safely", () => {
    const bridge = { entryEquity: 0, exitEquity: 0, ebitdaGrowth: 0, multipleExpansion: 0, debtPaydown: 0 };
    const attr = computeAttribution(bridge);
    expect(attr.entryEquity).toBe(0);
    expect(attr.ebitdaGrowth).toBe(0);
  });

  it("handles irregular fractions that would naively round to 99.9 or 100.1", () => {
    // A scenario where three-way split would naively leave residual
    const bridge = {
      entryEquity: 33.33,
      exitEquity: 100,
      ebitdaGrowth: 33.33,
      multipleExpansion: 33.33,
      debtPaydown: 0.01,
    };
    const attr = computeAttribution(bridge);
    const sum = attr.entryEquity + attr.ebitdaGrowth + attr.multipleExpansion + attr.debtPaydown;
    // Displayed sum reads exactly 100.0 after 1-decimal rounding
    expect(Math.round(sum * 10) / 10).toBe(100);
  });
});

describe("applyAssumptions", () => {
  it("applies revenue CAGR to compound over hold period", () => {
    const assumptions = { revenueCAGR: 10, marginExpansion: 0, multipleExpansion: 0, debtPaydown: 0, holdPeriod: 5 };
    const exit = applyAssumptions(BASELINE_ENTRY, assumptions);
    // $50M at 10% CAGR over 5 years = ~$80.5M
    expect(exit.revenue).toBeCloseTo(50 * Math.pow(1.1, 5), 2);
  });

  it("applies margin expansion in bps", () => {
    const assumptions = { revenueCAGR: 0, marginExpansion: 200, multipleExpansion: 0, debtPaydown: 0, holdPeriod: 5 };
    const exit = applyAssumptions(BASELINE_ENTRY, assumptions);
    expect(exit.ebitdaMargin).toBeCloseTo(22, 5); // 20% + 200bps = 22%
  });

  it("applies multiple expansion", () => {
    const assumptions = { revenueCAGR: 0, marginExpansion: 0, multipleExpansion: 2.0, debtPaydown: 0, holdPeriod: 5 };
    const exit = applyAssumptions(BASELINE_ENTRY, assumptions);
    expect(exit.multiple).toBe(8.0);
  });

  it("applies debt paydown clamped to zero floor", () => {
    const assumptions = { revenueCAGR: 0, marginExpansion: 0, multipleExpansion: 0, debtPaydown: 100, holdPeriod: 5 };
    const exit = applyAssumptions(BASELINE_ENTRY, assumptions);
    expect(exit.netDebt).toBe(0);
  });
});

describe("gradeExercise", () => {
  it("returns passed=true when MOIC is within tolerance", () => {
    const assumptions = { revenueCAGR: 9.8, marginExpansion: 0, multipleExpansion: 2.0, debtPaydown: 20, holdPeriod: 5 };
    const result = gradeExercise(BASELINE_ENTRY, assumptions, 3.93, 0.1);
    expect(result.passed).toBe(true);
    expect(result.delta).toBeLessThanOrEqual(0.1);
  });

  it("returns passed=false when MOIC is outside tolerance", () => {
    const assumptions = { revenueCAGR: 1, marginExpansion: 0, multipleExpansion: 0, debtPaydown: 0, holdPeriod: 5 };
    const result = gradeExercise(BASELINE_ENTRY, assumptions, 4.5, 0.1);
    expect(result.passed).toBe(false);
    expect(result.delta).toBeGreaterThan(0.1);
  });

  it("reports the user's actual MOIC and the target", () => {
    const assumptions = { revenueCAGR: 9.8, marginExpansion: 0, multipleExpansion: 2.0, debtPaydown: 20, holdPeriod: 5 };
    const result = gradeExercise(BASELINE_ENTRY, assumptions, 3.93, 0.1);
    expect(result.targetMoic).toBe(3.93);
    expect(result.userMoic).toBeGreaterThan(3);
  });
});
