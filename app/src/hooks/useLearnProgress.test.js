// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useLearnProgress, { loadProgress, saveProgress } from "./useLearnProgress";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

describe("loadProgress", () => {
  it("returns default data when localStorage is empty", () => {
    const data = loadProgress();
    expect(data).toEqual({
      completedExercises: [],
      visitedSubsections: [],
    });
  });

  it("parses stored JSON data", () => {
    const stored = {
      completedExercises: ["ex-1a-calc", "ex-1b-calc"],
      visitedSubsections: ["s1a", "s1b"],
    };
    localStorageMock.setItem("forge-learn-progress", JSON.stringify(stored));

    const data = loadProgress();
    expect(data.completedExercises).toHaveLength(2);
    expect(data.visitedSubsections).toHaveLength(2);
    expect(data.completedExercises).toContain("ex-1a-calc");
  });

  it("returns default data on invalid JSON", () => {
    localStorageMock.setItem("forge-learn-progress", "not valid json{{{");

    const data = loadProgress();
    expect(data).toEqual({
      completedExercises: [],
      visitedSubsections: [],
    });
  });
});

describe("saveProgress", () => {
  it("serializes data to localStorage", () => {
    const data = {
      completedExercises: ["ex-1a-calc"],
      visitedSubsections: ["s1a"],
    };

    saveProgress(data);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "forge-learn-progress",
      JSON.stringify(data)
    );
  });

  it("does not throw on quota exceeded", () => {
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new DOMException("quota exceeded");
    });

    expect(() =>
      saveProgress({ completedExercises: [], visitedSubsections: [] })
    ).not.toThrow();
  });
});

describe("loadProgress + saveProgress roundtrip", () => {
  it("saves and loads progress correctly", () => {
    const data = {
      completedExercises: ["ex-1a-calc", "ex-2a-1"],
      visitedSubsections: ["s1a", "s2a"],
    };

    saveProgress(data);
    const loaded = loadProgress();
    expect(loaded).toEqual(data);
  });
});

describe("markComplete / isComplete (hook)", () => {
  it("marks an exercise complete and persists it", () => {
    const { result } = renderHook(() => useLearnProgress());

    expect(result.current.isComplete("ex-1a-calc")).toBe(false);

    act(() => {
      result.current.markComplete("ex-1a-calc");
    });

    expect(result.current.isComplete("ex-1a-calc")).toBe(true);
    expect(result.current.progress.completedExercises).toEqual(["ex-1a-calc"]);
    expect(loadProgress().completedExercises).toEqual(["ex-1a-calc"]);
  });

  it("prevents duplicate exercise IDs in completedExercises", () => {
    saveProgress({ completedExercises: ["ex-1a-calc"], visitedSubsections: [] });
    const { result } = renderHook(() => useLearnProgress());

    act(() => {
      result.current.markComplete("ex-1a-calc");
    });

    expect(result.current.progress.completedExercises).toEqual(["ex-1a-calc"]);
  });
});

describe("markVisited / isVisited (hook)", () => {
  it("marks a subsection visited and persists it", () => {
    const { result } = renderHook(() => useLearnProgress());

    expect(result.current.isVisited("s1a")).toBe(false);

    act(() => {
      result.current.markVisited("s1a");
    });

    expect(result.current.isVisited("s1a")).toBe(true);
    expect(loadProgress().visitedSubsections).toEqual(["s1a"]);
  });

  it("prevents duplicate subsection IDs in visitedSubsections", () => {
    saveProgress({ completedExercises: [], visitedSubsections: ["s1a"] });
    const { result } = renderHook(() => useLearnProgress());

    act(() => {
      result.current.markVisited("s1a");
    });

    expect(result.current.progress.visitedSubsections).toEqual(["s1a"]);
  });
});

describe("subsection progress calculation", () => {
  it("returns correct completed/total for a subsection with exercises", () => {
    const subsection = {
      id: "s1a",
      blocks: [
        { type: "text", content: "Some text" },
        { type: "calculationExercise", id: "ex-1a-calc" },
        { type: "exercise", id: "ex-1a-2" },
      ],
    };

    saveProgress({ completedExercises: ["ex-1a-calc"], visitedSubsections: [] });
    const { result } = renderHook(() => useLearnProgress());

    expect(result.current.getSubsectionProgress(subsection)).toEqual({
      completed: 1,
      total: 2,
    });
  });

  it("returns null for subsections with no exercises", () => {
    const subsection = {
      id: "s1-intro",
      blocks: [{ type: "text", content: "Introduction" }],
    };

    const { result } = renderHook(() => useLearnProgress());
    expect(result.current.getSubsectionProgress(subsection)).toBeNull();
  });
});

describe("resetSubsection (hook)", () => {
  it("clears only exercises from the target subsection", () => {
    saveProgress({
      completedExercises: ["ex-1a-calc", "ex-1b-calc", "ex-2a-1"],
      visitedSubsections: ["s1a", "s1b", "s2a"],
    });
    const { result } = renderHook(() => useLearnProgress());

    const subsection = {
      id: "s1a",
      blocks: [{ type: "calculationExercise", id: "ex-1a-calc" }],
    };

    act(() => {
      result.current.resetSubsection(subsection);
    });

    expect(result.current.progress.completedExercises).toEqual([
      "ex-1b-calc",
      "ex-2a-1",
    ]);
    expect(result.current.progress.visitedSubsections).toEqual([
      "s1a",
      "s1b",
      "s2a",
    ]);
    expect(loadProgress().completedExercises).toEqual(["ex-1b-calc", "ex-2a-1"]);
  });

  it("does nothing when subsection has no exercises", () => {
    saveProgress({
      completedExercises: ["ex-1a-calc"],
      visitedSubsections: ["s1a"],
    });
    const { result } = renderHook(() => useLearnProgress());
    const before = result.current.progress;

    const subsection = {
      id: "intro",
      blocks: [{ type: "text", content: "No exercises here" }],
    };

    act(() => {
      result.current.resetSubsection(subsection);
    });

    expect(result.current.progress).toBe(before);
    expect(result.current.progress.completedExercises).toEqual(["ex-1a-calc"]);
  });
});
