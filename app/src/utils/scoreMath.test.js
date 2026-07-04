import { describe, it, expect } from "vitest";
import { average, averageScore, averageAbsDelta, attemptedCompanyIds } from "./scoreMath";

describe("average", () => {
  it("returns null for an empty array", () => {
    expect(average([])).toBeNull();
  });

  it("averages a list of numbers", () => {
    expect(average([2, 3, 4])).toBe(3);
  });

  it("does not round", () => {
    expect(average([1, 2])).toBe(1.5);
  });
});

describe("averageScore", () => {
  it("returns null for an empty question list", () => {
    expect(averageScore([])).toBeNull();
  });

  it("averages the score field across question entries", () => {
    expect(averageScore([{ score: 5 }, { score: 3 }])).toBe(4);
  });
});

describe("averageAbsDelta", () => {
  it("returns null when no question has a delta", () => {
    expect(averageAbsDelta([{ score: 4, delta: null }])).toBeNull();
  });

  it("averages absolute deltas, skipping delta == null entries", () => {
    const questions = [
      { score: 4, delta: -2 },
      { score: 3, delta: 4 },
      { score: 5, delta: null },
    ];
    expect(averageAbsDelta(questions)).toBe(3);
  });
});

describe("attemptedCompanyIds", () => {
  it("returns an empty set for no sessions", () => {
    expect(attemptedCompanyIds([])).toEqual(new Set());
  });

  it("collects companyIds from sessions with at least one question, deduped", () => {
    const sessions = [
      { companyId: "a", questions: [{ score: 4 }] },
      { companyId: "a", questions: [{ score: 2 }] },
      { companyId: "b", questions: [] },
      { companyId: "c", questions: [{ score: 5 }] },
    ];
    expect(attemptedCompanyIds(sessions)).toEqual(new Set(["a", "c"]));
  });
});
