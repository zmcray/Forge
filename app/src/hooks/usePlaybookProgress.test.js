// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import usePlaybookProgress from "./usePlaybookProgress";

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

describe("usePlaybookProgress", () => {
  it("returns default playbook state when none is stored", () => {
    const { result } = renderHook(() => usePlaybookProgress());
    const playbook = result.current.getPlaybook("summit-hvac-playbook");

    expect(playbook).toEqual({
      notes: "",
      lastVisited: null,
      exerciseAttempted: false,
      exerciseScore: null,
      goldenYearGuess: null,
    });
  });

  it("markVisited persists to localStorage under forge-playbooks key", () => {
    const { result } = renderHook(() => usePlaybookProgress());

    act(() => {
      result.current.markVisited("summit-hvac-playbook");
    });

    const stored = JSON.parse(localStorageMock.getItem("forge-playbooks"));
    expect(stored.playbooks["summit-hvac-playbook"].lastVisited).toBeTruthy();
    expect(result.current.getPlaybook("summit-hvac-playbook").lastVisited).toBeTruthy();
  });

  it("markExerciseAttempted records score and persists", () => {
    const { result } = renderHook(() => usePlaybookProgress());

    act(() => {
      result.current.markExerciseAttempted("coastal-foods-playbook", 4);
    });

    const playbook = result.current.getPlaybook("coastal-foods-playbook");
    expect(playbook.exerciseAttempted).toBe(true);
    expect(playbook.exerciseScore).toBe(4);

    const stored = JSON.parse(localStorageMock.getItem("forge-playbooks"));
    expect(stored.playbooks["coastal-foods-playbook"].exerciseScore).toBe(4);
  });

  it("setPlaybookNotes round-trips text content", () => {
    const { result } = renderHook(() => usePlaybookProgress());

    act(() => {
      result.current.setPlaybookNotes(
        "summit-hvac-playbook",
        "Key risk: CFO hire delay cascades across all initiatives"
      );
    });

    expect(result.current.getPlaybook("summit-hvac-playbook").notes).toBe(
      "Key risk: CFO hire delay cascades across all initiatives"
    );
  });

  it("setGoldenYearGuess persists guess value", () => {
    const { result } = renderHook(() => usePlaybookProgress());

    act(() => {
      result.current.setGoldenYearGuess("precision-cnc-playbook", "35%");
    });

    expect(result.current.getPlaybook("precision-cnc-playbook").goldenYearGuess).toBe("35%");

    const stored = JSON.parse(localStorageMock.getItem("forge-playbooks"));
    expect(stored.playbooks["precision-cnc-playbook"].goldenYearGuess).toBe("35%");
  });

  it("remount rehydrates persisted state (full round-trip)", () => {
    // Write state in first render
    const { result: first, unmount } = renderHook(() => usePlaybookProgress());

    act(() => {
      first.current.markVisited("summit-hvac-playbook");
      first.current.markExerciseAttempted("summit-hvac-playbook", 5);
      first.current.setPlaybookNotes("summit-hvac-playbook", "Solid plan");
      first.current.setGoldenYearGuess("summit-hvac-playbook", "72%");
    });

    unmount();

    // Remount -- should rehydrate from localStorage
    const { result: second } = renderHook(() => usePlaybookProgress());
    const rehydrated = second.current.getPlaybook("summit-hvac-playbook");

    expect(rehydrated.lastVisited).toBeTruthy();
    expect(rehydrated.exerciseAttempted).toBe(true);
    expect(rehydrated.exerciseScore).toBe(5);
    expect(rehydrated.notes).toBe("Solid plan");
    expect(rehydrated.goldenYearGuess).toBe("72%");
  });

  it("storage key is isolated from forge-levers", () => {
    localStorageMock.setItem(
      "forge-levers",
      JSON.stringify({
        levers: { "pricing-optimization": { notes: "lever notes" } },
      })
    );

    const { result } = renderHook(() => usePlaybookProgress());

    // forge-playbooks should not contain lever data
    expect(result.current.getPlaybook("pricing-optimization")).toEqual({
      notes: "",
      lastVisited: null,
      exerciseAttempted: false,
      exerciseScore: null,
      goldenYearGuess: null,
    });
  });

  it("getVisitedCount returns number of playbooks with lastVisited set", () => {
    const { result } = renderHook(() => usePlaybookProgress());

    act(() => {
      result.current.markVisited("summit-hvac-playbook");
      result.current.markVisited("coastal-foods-playbook");
      result.current.markVisited("precision-cnc-playbook");
    });

    expect(result.current.getVisitedCount()).toBe(3);
  });

  it("getExerciseCount returns number of playbooks with exerciseAttempted true", () => {
    const { result } = renderHook(() => usePlaybookProgress());

    act(() => {
      result.current.markExerciseAttempted("summit-hvac-playbook", 5);
      result.current.markExerciseAttempted("apex-logistics-playbook", 3);
    });

    expect(result.current.getExerciseCount()).toBe(2);
  });
});
