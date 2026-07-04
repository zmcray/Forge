// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useLearnProgress from "./useLearnProgress";

beforeEach(() => {
  localStorage.clear();
});

describe("useLearnProgress referential stability [MCR-493]", () => {
  it("returns the same object identity across re-renders without state change", () => {
    const { result, rerender } = renderHook(() => useLearnProgress());
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
    expect(result.current.markComplete).toBe(first.markComplete);
    expect(result.current.getCurrentStep).toBe(first.getCurrentStep);
    expect(result.current.overallStats).toBe(first.overallStats);
  });

  it("returns a new identity after a state change", () => {
    const { result } = renderHook(() => useLearnProgress());
    const first = result.current;

    act(() => {
      result.current.markComplete("ex-some-id");
    });

    expect(result.current).not.toBe(first);
    expect(result.current.isComplete("ex-some-id")).toBe(true);
  });

  it("keeps identity stable when a no-op state update bails out", () => {
    const { result } = renderHook(() => useLearnProgress());

    act(() => {
      result.current.markComplete("ex-dup");
    });
    const afterFirst = result.current;

    act(() => {
      result.current.markComplete("ex-dup");
    });

    expect(result.current).toBe(afterFirst);
  });
});
