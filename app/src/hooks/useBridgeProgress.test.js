// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useBridgeProgress from "./useBridgeProgress";

beforeEach(() => {
  localStorage.clear();
});

describe("useBridgeProgress", () => {
  it("returns default scenario state when none is stored", () => {
    const { result } = renderHook(() => useBridgeProgress());
    const s = result.current.getScenario("services-platform");
    expect(s).toEqual({
      customAssumptions: null,
      lastStudied: null,
      exerciseAttempted: false,
      exerciseScore: null,
    });
  });

  it("markStudied persists to localStorage under forge-bridge key", () => {
    const { result } = renderHook(() => useBridgeProgress());
    act(() => {
      result.current.markStudied("services-platform");
    });
    const stored = JSON.parse(localStorage.getItem("forge-bridge"));
    expect(stored.scenarios["services-platform"].lastStudied).toBeTruthy();
    expect(result.current.getScenario("services-platform").lastStudied).toBeTruthy();
  });

  it("markExerciseAttempted records pass/fail and persists", () => {
    const { result } = renderHook(() => useBridgeProgress());
    act(() => {
      result.current.markExerciseAttempted("dental-rollup", true);
    });
    const s = result.current.getScenario("dental-rollup");
    expect(s.exerciseAttempted).toBe(true);
    expect(s.exerciseScore).toBe(5);
  });

  it("setCustomAssumptions round-trips user slider state", () => {
    const { result } = renderHook(() => useBridgeProgress());
    const custom = {
      revenueCAGR: 15,
      marginExpansion: 400,
      multipleExpansion: 2.5,
      debtPaydown: 6,
      holdPeriod: 5,
    };
    act(() => {
      result.current.setCustomAssumptions("margin-turnaround", custom);
    });
    expect(result.current.getScenario("margin-turnaround").customAssumptions).toEqual(custom);
  });

  it("getStudiedCount and getExerciseCount track progress across scenarios", () => {
    const { result } = renderHook(() => useBridgeProgress());
    act(() => {
      result.current.markStudied("services-platform");
      result.current.markStudied("dental-rollup");
      result.current.markExerciseAttempted("services-platform", true);
    });
    expect(result.current.getStudiedCount()).toBe(2);
    expect(result.current.getExerciseCount()).toBe(1);
  });

  it("loads existing progress from localStorage on mount", () => {
    localStorage.setItem(
      "forge-bridge",
      JSON.stringify({
        scenarios: {
          "saas-multiple-expansion": {
            customAssumptions: { revenueCAGR: 30, marginExpansion: 500, multipleExpansion: 5, debtPaydown: 2, holdPeriod: 5 },
            lastStudied: "2026-04-01T00:00:00.000Z",
            exerciseAttempted: true,
            exerciseScore: 5,
          },
        },
      })
    );
    const { result } = renderHook(() => useBridgeProgress());
    const s = result.current.getScenario("saas-multiple-expansion");
    expect(s.exerciseAttempted).toBe(true);
    expect(s.customAssumptions.revenueCAGR).toBe(30);
  });
});
