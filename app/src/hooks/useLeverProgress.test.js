// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useLeverProgress from "./useLeverProgress";

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

describe("useLeverProgress", () => {
  it("returns default lever state when none is stored", () => {
    const { result } = renderHook(() => useLeverProgress());
    const lever = result.current.getLever("pricing-optimization");

    expect(lever).toEqual({
      notes: "",
      lastStudied: null,
      exerciseAttempted: false,
      exerciseScore: null,
    });
  });

  it("markStudied persists to localStorage under forge-levers key", () => {
    const { result } = renderHook(() => useLeverProgress());

    act(() => {
      result.current.markStudied("pricing-optimization");
    });

    const stored = JSON.parse(localStorageMock.getItem("forge-levers"));
    expect(stored.levers["pricing-optimization"].lastStudied).toBeTruthy();
    expect(result.current.getLever("pricing-optimization").lastStudied).toBeTruthy();
  });

  it("markExerciseAttempted records score and persists", () => {
    const { result } = renderHook(() => useLeverProgress());

    act(() => {
      result.current.markExerciseAttempted("sales-effectiveness", 4);
    });

    const lever = result.current.getLever("sales-effectiveness");
    expect(lever.exerciseAttempted).toBe(true);
    expect(lever.exerciseScore).toBe(4);

    const stored = JSON.parse(localStorageMock.getItem("forge-levers"));
    expect(stored.levers["sales-effectiveness"].exerciseScore).toBe(4);
  });

  it("setLeverNotes round-trips text content", () => {
    const { result } = renderHook(() => useLeverProgress());

    act(() => {
      result.current.setLeverNotes("procurement", "Key takeaway: vendor consolidation first");
    });

    expect(result.current.getLever("procurement").notes).toBe(
      "Key takeaway: vendor consolidation first"
    );
  });

  it("getStudiedCount returns number of levers with lastStudied set", () => {
    const { result } = renderHook(() => useLeverProgress());

    act(() => {
      result.current.markStudied("pricing-optimization");
      result.current.markStudied("sales-effectiveness");
      result.current.markStudied("procurement");
    });

    expect(result.current.getStudiedCount()).toBe(3);
  });

  it("getExerciseCount returns number of levers with exerciseAttempted true", () => {
    const { result } = renderHook(() => useLeverProgress());

    act(() => {
      result.current.markExerciseAttempted("pricing-optimization", 5);
      result.current.markExerciseAttempted("automation", 3);
    });

    expect(result.current.getExerciseCount()).toBe(2);
  });

  it("loads existing progress from localStorage on mount", () => {
    localStorageMock.setItem(
      "forge-levers",
      JSON.stringify({
        levers: {
          "ai-software": {
            notes: "prior notes",
            lastStudied: "2026-04-01T00:00:00.000Z",
            exerciseAttempted: true,
            exerciseScore: 5,
          },
        },
      })
    );

    const { result } = renderHook(() => useLeverProgress());
    const lever = result.current.getLever("ai-software");
    expect(lever.notes).toBe("prior notes");
    expect(lever.exerciseAttempted).toBe(true);
    expect(lever.exerciseScore).toBe(5);
  });
});
