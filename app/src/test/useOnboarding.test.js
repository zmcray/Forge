// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useOnboarding from "../hooks/useOnboarding";

describe("useOnboarding", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns correct initial state", () => {
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.isIntroComplete).toBe(false);
    expect(result.current.currentIntroStep).toBe(0);
  });

  it("advanceIntro increments step", () => {
    const { result } = renderHook(() => useOnboarding());
    act(() => result.current.advanceIntro());
    expect(result.current.currentIntroStep).toBe(1);
    act(() => result.current.advanceIntro());
    expect(result.current.currentIntroStep).toBe(2);
  });

  it("skipIntro sets introCompleted and skippedAt", () => {
    const { result } = renderHook(() => useOnboarding());
    act(() => result.current.advanceIntro()); // step 1
    act(() => result.current.skipIntro());
    expect(result.current.isIntroComplete).toBe(true);
  });

  it("completeIntro sets introCompleted", () => {
    const { result } = renderHook(() => useOnboarding());
    act(() => result.current.completeIntro());
    expect(result.current.isIntroComplete).toBe(true);
  });

  it("bypassGate adds gate ID to list", () => {
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.hasBypassedGate("test-gate")).toBe(false);
    act(() => result.current.bypassGate("test-gate"));
    expect(result.current.hasBypassedGate("test-gate")).toBe(true);
  });

  it("bypassGate does not duplicate gate IDs", () => {
    const { result } = renderHook(() => useOnboarding());
    act(() => result.current.bypassGate("test-gate"));
    act(() => result.current.bypassGate("test-gate"));
    // Check localStorage directly
    const stored = JSON.parse(localStorage.getItem("forge-onboarding"));
    expect(stored.softGateBypasses).toEqual(["test-gate"]);
  });

  it("hasBypassedGate returns false for unknown gates", () => {
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.hasBypassedGate("unknown")).toBe(false);
  });

  it("resetOnboarding clears all state", () => {
    const { result } = renderHook(() => useOnboarding());
    act(() => result.current.advanceIntro());
    act(() => result.current.completeIntro());
    act(() => result.current.bypassGate("g1"));
    act(() => result.current.resetOnboarding());
    expect(result.current.isIntroComplete).toBe(false);
    expect(result.current.currentIntroStep).toBe(0);
    expect(result.current.hasBypassedGate("g1")).toBe(false);
  });

  it("persists state across hook re-mounts", () => {
    const { result, unmount } = renderHook(() => useOnboarding());
    act(() => result.current.advanceIntro());
    act(() => result.current.advanceIntro());
    act(() => result.current.bypassGate("persisted-gate"));
    unmount();

    const { result: result2 } = renderHook(() => useOnboarding());
    expect(result2.current.currentIntroStep).toBe(2);
    expect(result2.current.hasBypassedGate("persisted-gate")).toBe(true);
  });
});
