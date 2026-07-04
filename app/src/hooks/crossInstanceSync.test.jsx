// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useConceptProgress from "./useConceptProgress";
import useLeverProgress from "./useLeverProgress";
import usePlaybookProgress from "./usePlaybookProgress";
import useBridgeProgress from "./useBridgeProgress";
import useLearnProgress from "./useLearnProgress";
import useNotes from "./useNotes";

beforeEach(() => {
  localStorage.clear();
});

describe("cross-instance sync [MCR-423]", () => {
  it("useConceptProgress: a write in one instance is visible in another", () => {
    const a = renderHook(() => useConceptProgress());
    const b = renderHook(() => useConceptProgress());

    act(() => {
      a.result.current.markStudied("ebitda");
    });

    expect(b.result.current.getStudiedCount()).toBe(1);
    expect(b.result.current.getCard("ebitda").lastStudied).toBeTruthy();
  });

  it("useLeverProgress: a write in one instance is visible in another", () => {
    const a = renderHook(() => useLeverProgress());
    const b = renderHook(() => useLeverProgress());

    act(() => {
      a.result.current.markStudied("pricing");
    });

    expect(b.result.current.getStudiedCount()).toBe(1);
  });

  it("usePlaybookProgress: a write in one instance is visible in another", () => {
    const a = renderHook(() => usePlaybookProgress());
    const b = renderHook(() => usePlaybookProgress());

    act(() => {
      a.result.current.markVisited("hvac-rollup");
    });

    expect(b.result.current.getVisitedCount()).toBe(1);
  });

  it("useBridgeProgress: a write in one instance is visible in another", () => {
    const a = renderHook(() => useBridgeProgress());
    const b = renderHook(() => useBridgeProgress());

    act(() => {
      a.result.current.markExerciseAttempted("coastal", true);
    });

    expect(b.result.current.getPassedCount()).toBe(1);
  });

  it("useLearnProgress: home-screen copy sees learn activity (App.jsx staleness bug)", () => {
    const home = renderHook(() => useLearnProgress());
    const learn = renderHook(() => useLearnProgress());

    act(() => {
      learn.result.current.markComplete("ex-abc");
    });

    expect(home.result.current.isComplete("ex-abc")).toBe(true);
  });

  it("useNotes: a stale instance's save does not clobber notes from another (lost-write bug)", () => {
    const a = renderHook(() => useNotes());
    const b = renderHook(() => useNotes());

    // b hydrated at mount; a writes note-1; then b writes note-2.
    act(() => {
      a.result.current.setNoteText("note-1", "written by a");
    });
    act(() => {
      b.result.current.setNoteText("note-2", "written by b");
    });

    // Both notes must survive in both instances and in storage.
    expect(a.result.current.getNoteText("note-1")).toBe("written by a");
    expect(a.result.current.getNoteText("note-2")).toBe("written by b");
    expect(b.result.current.getNoteText("note-1")).toBe("written by a");

    const stored = JSON.parse(localStorage.getItem("forge-notes"));
    expect(stored["note-1"].text).toBe("written by a");
    expect(stored["note-2"].text).toBe("written by b");
  });

  it("mutator identities are stable across state changes (effect-dep safety)", () => {
    const { result } = renderHook(() => useConceptProgress());
    const before = result.current.markStudied;

    act(() => {
      result.current.markStudied("ebitda");
    });

    expect(result.current.markStudied).toBe(before);
  });
});
