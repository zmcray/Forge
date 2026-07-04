// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useOnboarding from "./useOnboarding";

beforeEach(() => {
  localStorage.clear();
});

describe("useOnboarding referential stability [MCR-493]", () => {
  it("returns the same object identity across re-renders without state change", () => {
    const { result, rerender } = renderHook(() => useOnboarding());
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
    expect(result.current.advanceIntro).toBe(first.advanceIntro);
    expect(result.current.bypassGate).toBe(first.bypassGate);
  });

  it("returns a new identity after a state change", () => {
    const { result } = renderHook(() => useOnboarding());
    const first = result.current;

    act(() => {
      result.current.advanceIntro();
    });

    expect(result.current).not.toBe(first);
    expect(result.current.currentIntroStep).toBe(1);
  });
});
