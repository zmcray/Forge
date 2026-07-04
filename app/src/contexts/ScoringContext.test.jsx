// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ScoringProvider, useScoringState, useScoringDispatch } from "./ScoringContext";

const wrapper = ({ children }) => <ScoringProvider>{children}</ScoringProvider>;

function useBoth() {
  return { state: useScoringState(), dispatch: useScoringDispatch() };
}

beforeEach(() => {
  localStorage.clear();
});

const entry = (overrides = {}) => ({
  companyId: "summit-hvac",
  questionType: "metric",
  score: 2,
  delta: 1.5,
  unit: "%",
  ...overrides,
});

describe("ScoringContext referential stability", () => {
  it("dispatch value identity is unchanged across addScore", () => {
    const { result } = renderHook(useBoth, { wrapper });
    const before = result.current.dispatch;

    act(() => result.current.dispatch.addScore(entry()));

    expect(result.current.dispatch).toBe(before);
    expect(result.current.dispatch.addScore).toBe(before.addScore);
    expect(result.current.dispatch.updateSessionDuration).toBe(before.updateSessionDuration);
  });

  it("dispatch value identity is unchanged across updateSessionDuration", () => {
    const { result } = renderHook(useBoth, { wrapper });
    act(() => result.current.dispatch.addScore(entry()));
    const before = result.current.dispatch;

    act(() => result.current.dispatch.updateSessionDuration("summit-hvac", 120));

    expect(result.current.dispatch).toBe(before);
  });

  it("selector results are memoized per sessions snapshot", () => {
    const { result, rerender } = renderHook(useBoth, { wrapper });
    act(() => {
      for (let i = 0; i < 10; i++) result.current.dispatch.addScore(entry());
    });

    const snapshot = result.current.state;
    rerender();

    expect(result.current.state).toBe(snapshot);
    expect(result.current.state.weakSpots).toBe(snapshot.weakSpots);
    expect(result.current.state.scoresByType).toBe(snapshot.scoresByType);
    expect(result.current.state.quantitativeAccuracy).toBe(snapshot.quantitativeAccuracy);
    expect(result.current.state.attemptedCompanyIds).toBe(snapshot.attemptedCompanyIds);
    expect(result.current.state.allScores).toBe(snapshot.allScores);
  });

  it("selector results recompute after a write", () => {
    const { result } = renderHook(useBoth, { wrapper });
    expect(result.current.state.attemptedCompanyIds).toEqual(new Set());
    expect(result.current.state.weakSpots).toBeNull();

    act(() => {
      for (let i = 0; i < 10; i++) result.current.dispatch.addScore(entry());
    });

    expect(result.current.state.attemptedCompanyIds).toEqual(new Set(["summit-hvac"]));
    expect(result.current.state.weakSpots).toEqual([{ type: "metric", avg: 2, count: 10 }]);
    expect(result.current.state.scoresByType).toEqual({ metric: Array(10).fill(2) });
    expect(result.current.state.quantitativeAccuracy).toEqual({ avgDelta: "1.5", count: 10 });
    expect(result.current.state.allScores).toHaveLength(10);
  });
});
