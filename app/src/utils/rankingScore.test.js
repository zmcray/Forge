import { describe, it, expect } from "vitest";
import {
  FEASIBILITY_WEIGHTS,
  opportunityValue,
  computeIdealTop3,
  scoreRanking,
  gradeRanking,
} from "./rankingScore";
import { OPERATIONS_PROFILES } from "../data/companyOperations";

const OPPS = {
  a: { feasibility: "high", ebitdaImpactRange: { low: 0.2, high: 0.6 } }, // 0.4 * 1.0 = 0.40
  b: { feasibility: "medium", ebitdaImpactRange: { low: 0.3, high: 0.7 } }, // 0.5 * 0.7 = 0.35
  c: { feasibility: "low", ebitdaImpactRange: { low: 0.6, high: 1.0 } }, // 0.8 * 0.4 = 0.32
  d: { feasibility: "high", ebitdaImpactRange: { low: 0.05, high: 0.15 } }, // 0.1 * 1.0 = 0.10
};

describe("opportunityValue", () => {
  it("weights the impact midpoint by feasibility", () => {
    expect(opportunityValue(OPPS.a)).toBeCloseTo(0.4);
    expect(opportunityValue(OPPS.b)).toBeCloseTo(0.35);
    expect(opportunityValue(OPPS.c)).toBeCloseTo(0.32);
  });

  it("exposes the documented feasibility weights", () => {
    expect(FEASIBILITY_WEIGHTS).toEqual({ high: 1.0, medium: 0.7, low: 0.4 });
  });
});

describe("computeIdealTop3", () => {
  it("returns the top 3 process ids by weighted impact, descending", () => {
    expect(computeIdealTop3(OPPS)).toEqual(["a", "b", "c"]);
  });

  it("breaks value ties by higher feasibility weight, then id", () => {
    const tied = {
      // both value 0.35
      zeta: { feasibility: "high", ebitdaImpactRange: { low: 0.3, high: 0.4 } },
      beta: { feasibility: "medium", ebitdaImpactRange: { low: 0.4, high: 0.6 } },
      // both value 0.2, same feasibility: alphabetical
      bb: { feasibility: "high", ebitdaImpactRange: { low: 0.1, high: 0.3 } },
      aa: { feasibility: "high", ebitdaImpactRange: { low: 0.1, high: 0.3 } },
    };
    expect(computeIdealTop3(tied)).toEqual(["zeta", "beta", "aa"]);
  });

  it("handles fewer than 3 opportunities", () => {
    expect(computeIdealTop3({ a: OPPS.a })).toEqual(["a"]);
  });

  it("produces a full top 3 for every live company profile", () => {
    for (const [companyId, profile] of Object.entries(OPERATIONS_PROFILES)) {
      const ideal = computeIdealTop3(profile.aiOpportunities);
      expect(ideal, companyId).toHaveLength(3);
      for (const id of ideal) {
        expect(profile.aiOpportunities[id], `${companyId}:${id}`).toBeDefined();
      }
    }
  });
});

describe("scoreRanking", () => {
  const ideal = ["a", "b", "c"];

  it("scores 5 for full overlap with the right #1", () => {
    expect(scoreRanking(["a", "c", "b"], ideal)).toBe(5);
  });

  it("scores 4 for full overlap with the wrong #1", () => {
    expect(scoreRanking(["b", "a", "c"], ideal)).toBe(4);
  });

  it("scores by overlap when picks are partially right", () => {
    expect(scoreRanking(["b", "c", "d"], ideal)).toBe(3); // overlap 2, wrong #1
    expect(scoreRanking(["d", "x", "b"], ideal)).toBe(2); // overlap 1
  });

  it("scores 1 for zero overlap", () => {
    expect(scoreRanking(["x", "y", "z"], ideal)).toBe(1);
  });

  it("gives the #1 bonus even with partial overlap", () => {
    expect(scoreRanking(["a", "x", "y"], ideal)).toBe(3); // overlap 1 + bonus 1
  });
});

describe("gradeRanking", () => {
  it("returns score, ideal list, matched and missed ids", () => {
    const grade = gradeRanking(["a", "d", "b"], OPPS);
    expect(grade.ideal).toEqual(["a", "b", "c"]);
    expect(grade.score).toBe(4); // overlap 2 (a, b) + right #1
    expect(grade.matched).toEqual(["a", "b"]);
    expect(grade.missed).toEqual(["c"]);
    expect(grade.firstPickCorrect).toBe(true);
  });
});
