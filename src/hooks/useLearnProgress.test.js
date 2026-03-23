import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadProgress, saveProgress } from "./useLearnProgress";

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

describe("exercise completion logic", () => {
  it("prevents duplicate exercise IDs in completedExercises", () => {
    const data = {
      completedExercises: ["ex-1a-calc"],
      visitedSubsections: [],
    };
    saveProgress(data);

    const loaded = loadProgress();
    // Simulate what markComplete does: check before adding
    const exerciseId = "ex-1a-calc";
    if (!loaded.completedExercises.includes(exerciseId)) {
      loaded.completedExercises.push(exerciseId);
    }
    expect(loaded.completedExercises).toHaveLength(1);
    expect(loaded.completedExercises).toEqual(["ex-1a-calc"]);
  });
});

describe("visited subsection logic", () => {
  it("prevents duplicate subsection IDs in visitedSubsections", () => {
    const data = {
      completedExercises: [],
      visitedSubsections: ["s1a"],
    };
    saveProgress(data);

    const loaded = loadProgress();
    const subsectionId = "s1a";
    if (!loaded.visitedSubsections.includes(subsectionId)) {
      loaded.visitedSubsections.push(subsectionId);
    }
    expect(loaded.visitedSubsections).toHaveLength(1);
    expect(loaded.visitedSubsections).toEqual(["s1a"]);
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

    const completedExercises = ["ex-1a-calc"];
    const exercises = subsection.blocks.filter(
      (b) => b.type === "exercise" || b.type === "calculationExercise"
    );
    const completed = exercises.filter((e) =>
      completedExercises.includes(e.id)
    ).length;

    expect(completed).toBe(1);
    expect(exercises.length).toBe(2);
  });

  it("returns null for subsections with no exercises", () => {
    const subsection = {
      id: "s1-intro",
      blocks: [{ type: "text", content: "Introduction" }],
    };

    const exercises = (subsection.blocks || []).filter(
      (b) => b.type === "exercise" || b.type === "calculationExercise"
    );
    const result = exercises.length === 0 ? null : { completed: 0, total: exercises.length };
    expect(result).toBeNull();
  });
});

describe("subsection reset logic", () => {
  it("clears only exercises from the target subsection", () => {
    const data = {
      completedExercises: ["ex-1a-calc", "ex-1b-calc", "ex-2a-1"],
      visitedSubsections: ["s1a", "s1b", "s2a"],
    };

    // Simulate resetSubsection for s1a
    const subsection = {
      id: "s1a",
      blocks: [
        { type: "calculationExercise", id: "ex-1a-calc" },
      ],
    };

    const exerciseIds = subsection.blocks
      .filter((b) => b.type === "exercise" || b.type === "calculationExercise")
      .map((b) => b.id);

    const next = {
      ...data,
      completedExercises: data.completedExercises.filter(
        (id) => !exerciseIds.includes(id)
      ),
    };

    expect(next.completedExercises).toEqual(["ex-1b-calc", "ex-2a-1"]);
    expect(next.visitedSubsections).toEqual(["s1a", "s1b", "s2a"]);
  });

  it("does nothing when subsection has no exercises", () => {
    const data = {
      completedExercises: ["ex-1a-calc"],
      visitedSubsections: ["s1a"],
    };

    const subsection = {
      id: "intro",
      blocks: [{ type: "text", content: "No exercises here" }],
    };

    const exerciseIds = (subsection.blocks || [])
      .filter((b) => b.type === "exercise" || b.type === "calculationExercise")
      .map((b) => b.id);

    expect(exerciseIds).toHaveLength(0);
    // No change expected
    expect(data.completedExercises).toEqual(["ex-1a-calc"]);
  });
});
