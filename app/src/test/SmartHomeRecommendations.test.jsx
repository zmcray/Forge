// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { getRecommendations } from "../components/onboarding/SmartHomeRecommendations";

// Mock learnProgress helper
function makeLearnProgress(completedExercises = [], visitedSubsections = []) {
  return {
    progress: { completedExercises, visitedSubsections },
    getSubsectionProgress: (sub) => {
      const exercises = (sub.blocks || []).filter(
        (b) => b.type === "exercise" || b.type === "calculationExercise",
      );
      if (exercises.length === 0) return null;
      const completed = exercises.filter((e) =>
        completedExercises.includes(e.id),
      ).length;
      return { completed, total: exercises.length };
    },
  };
}

describe("SmartHomeRecommendations - getRecommendations", () => {
  it("shows 'Start Learning' for brand-new user", () => {
    const recs = getRecommendations(
      [],
      { current: 0, lastDate: null },
      null,
      makeLearnProgress(),
    );
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].id).toBe("start-learning");
  });

  it("shows 'Next Company' based on difficulty progression", () => {
    const sessions = [
      {
        date: "2026-01-01",
        companyId: "summit-hvac",
        duration: 5,
        questions: [{ type: "metric", score: 4, delta: 0.5, unit: "%" }],
      },
    ];
    const recs = getRecommendations(
      sessions,
      { current: 1, lastDate: "2026-01-01" },
      null,
      makeLearnProgress(),
    );
    const nextCompanyRec = recs.find((r) => r.id === "next-company");
    expect(nextCompanyRec).toBeTruthy();
    // Should suggest the other beginner company (bright-dental) since summit-hvac is done
    expect(nextCompanyRec.companyId).toBe("bright-dental");
  });

  it("shows 'Keep Your Streak' when streak active and not practiced today", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("en-CA");

    const sessions = [
      {
        date: yesterdayStr,
        companyId: "summit-hvac",
        duration: 5,
        questions: [{ type: "metric", score: 4, delta: 0.5, unit: "%" }],
      },
    ];
    const recs = getRecommendations(
      sessions,
      { current: 3, lastDate: yesterdayStr },
      null,
      makeLearnProgress(),
    );
    const streakRec = recs.find((r) => r.id === "keep-streak");
    expect(streakRec).toBeTruthy();
    expect(streakRec.description).toContain("3-day streak");
  });

  it("shows max 3 recommendations", () => {
    // Create many sessions to trigger multiple recommendation types
    const sessions = [
      {
        date: "2026-01-01",
        companyId: "summit-hvac",
        duration: 5,
        questions: [
          { type: "metric", score: 2, delta: 5, unit: "%" },
          { type: "risk", score: 2, delta: null, unit: null },
        ],
      },
      {
        date: "2026-01-01",
        companyId: "coastal-foods",
        duration: 5,
        questions: [
          { type: "metric", score: 2, delta: 5, unit: "%" },
          { type: "risk", score: 2, delta: null, unit: null },
        ],
      },
      {
        date: "2026-01-01",
        companyId: "precision-manufacturing",
        duration: 5,
        questions: [
          { type: "metric", score: 2, delta: 5, unit: "%" },
          { type: "risk", score: 2, delta: null, unit: null },
        ],
      },
      {
        date: "2026-01-01",
        companyId: "bright-dental",
        duration: 5,
        questions: [
          { type: "metric", score: 2, delta: 5, unit: "%" },
          { type: "risk", score: 2, delta: null, unit: null },
        ],
      },
      {
        date: "2026-01-01",
        companyId: "apex-logistics",
        duration: 5,
        questions: [
          { type: "metric", score: 2, delta: 5, unit: "%" },
          { type: "risk", score: 2, delta: null, unit: null },
        ],
      },
    ];
    const weakSpots = [{ type: "metric", avg: 2.0, count: 5 }];
    const recs = getRecommendations(
      sessions,
      { current: 1, lastDate: "2026-01-01" },
      weakSpots,
      makeLearnProgress(),
    );
    expect(recs.length).toBeLessThanOrEqual(3);
  });

  it("priority ordering: 'Next Company' before 'Keep Streak' before 'Weak Spots'", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("en-CA");

    const sessions = [
      {
        date: yesterdayStr,
        companyId: "summit-hvac",
        duration: 5,
        questions: [
          { type: "metric", score: 2, delta: 5, unit: "%" },
          { type: "risk", score: 2, delta: null, unit: null },
          { type: "metric", score: 2, delta: 5, unit: "%" },
          { type: "risk", score: 2, delta: null, unit: null },
          { type: "metric", score: 2, delta: 5, unit: "%" },
          { type: "risk", score: 2, delta: null, unit: null },
          { type: "metric", score: 2, delta: 5, unit: "%" },
          { type: "risk", score: 2, delta: null, unit: null },
          { type: "metric", score: 2, delta: 5, unit: "%" },
          { type: "risk", score: 2, delta: null, unit: null },
        ],
      },
    ];
    const weakSpots = [{ type: "metric", avg: 2.0, count: 5 }];
    const recs = getRecommendations(
      sessions,
      { current: 2, lastDate: yesterdayStr },
      weakSpots,
      makeLearnProgress(),
    );
    const ids = recs.map((r) => r.id);
    const nextIdx = ids.indexOf("next-company");
    const streakIdx = ids.indexOf("keep-streak");
    const weakIdx = ids.indexOf("weak-spots");
    if (nextIdx >= 0 && streakIdx >= 0) expect(nextIdx).toBeLessThan(streakIdx);
    if (streakIdx >= 0 && weakIdx >= 0) expect(streakIdx).toBeLessThan(weakIdx);
  });
});
