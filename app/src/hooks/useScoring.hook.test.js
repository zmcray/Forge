// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useScoring from "./useScoring";

beforeEach(() => {
  localStorage.clear();
});

describe("useScoring.addScore (v2 schema)", () => {
  it("persists atomId, atomType, feedback, and timestamp from a qualitative entry", () => {
    const { result } = renderHook(() => useScoring());

    const feedback = {
      strengths: ["Clear thesis", "Right multiple range"],
      gaps: ["Didn't address customer concentration"],
      suggestion: "Walk through retention math next time.",
    };

    act(() => {
      result.current.addScore({
        companyId: "summit-hvac",
        questionType: "thesis",
        score: 4,
        delta: null,
        unit: null,
        atomId: "summit-hvac-q4",
        atomType: "company-question",
        feedback,
      });
    });

    const stored = JSON.parse(localStorage.getItem("forge-data"));
    expect(stored.version).toBe(2);
    const q = stored.sessions[0].questions[0];
    expect(q.type).toBe("thesis");
    expect(q.score).toBe(4);
    expect(q.atomId).toBe("summit-hvac-q4");
    expect(q.atomType).toBe("company-question");
    expect(q.feedback).toEqual(feedback);
    // Timestamp should be auto-populated as ISO8601
    expect(typeof q.timestamp).toBe("string");
    expect(() => new Date(q.timestamp).toISOString()).not.toThrow();
    expect(new Date(q.timestamp).toISOString()).toBe(q.timestamp);
  });

  it("persists nulls for atom/feedback fields when caller doesn't supply them", () => {
    const { result } = renderHook(() => useScoring());

    act(() => {
      result.current.addScore({
        companyId: "coastal-foods",
        questionType: "metric",
        score: 5,
        delta: 0,
        unit: "%",
      });
    });

    const stored = JSON.parse(localStorage.getItem("forge-data"));
    const q = stored.sessions[0].questions[0];
    expect(q.atomId).toBeNull();
    expect(q.atomType).toBeNull();
    expect(q.feedback).toBeNull();
    expect(typeof q.timestamp).toBe("string"); // still auto-populated
  });

  it("appends a second question to the same session entry on the same day/company", () => {
    const { result } = renderHook(() => useScoring());

    act(() => {
      result.current.addScore({
        companyId: "precision-manufacturing",
        questionType: "metric",
        score: 4,
      });
    });
    act(() => {
      result.current.addScore({
        companyId: "precision-manufacturing",
        questionType: "valuation",
        score: 3,
        atomId: "precision-manufacturing-q3",
        atomType: "company-question",
      });
    });

    const stored = JSON.parse(localStorage.getItem("forge-data"));
    expect(stored.sessions).toHaveLength(1);
    expect(stored.sessions[0].questions).toHaveLength(2);
    expect(stored.sessions[0].questions[1].atomId).toBe("precision-manufacturing-q3");
  });

  it("getAllScores returns mixed legacy (null atomId) and new (with atomId) entries without crashing", () => {
    // Seed v1-shape data to force migration on first read
    const v1 = {
      sessions: [
        {
          date: "2026-04-15",
          companyId: "apex-logistics",
          duration: 0,
          questions: [{ type: "risk", score: 2, delta: null, unit: null }],
        },
      ],
      streak: { current: 1, lastDate: "2026-04-15" },
    };
    localStorage.setItem("forge-data", JSON.stringify(v1));

    const { result } = renderHook(() => useScoring());

    act(() => {
      result.current.addScore({
        companyId: "apex-logistics",
        questionType: "diagnostic",
        score: 4,
        atomId: "apex-logistics-q1",
        atomType: "company-question",
      });
    });

    const all = result.current.getAllScores();
    expect(all.length).toBeGreaterThanOrEqual(2);
    // Legacy entry has no atomId; new entry does. Both should be present.
    const legacy = all.find((q) => q.type === "risk");
    const fresh = all.find((q) => q.type === "diagnostic");
    expect(legacy.atomId ?? null).toBeNull();
    expect(fresh.atomId).toBe("apex-logistics-q1");
  });
});
