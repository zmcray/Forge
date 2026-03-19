import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadData, saveData, updateStreak } from "./useScoring";

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

describe("loadData", () => {
  it("returns default data when localStorage is empty", () => {
    const data = loadData();
    expect(data).toEqual({
      sessions: [],
      streak: { current: 0, lastDate: null },
    });
  });

  it("parses stored JSON data", () => {
    const stored = {
      sessions: [{ date: "2026-03-18", companyId: "test", duration: 10, questions: [] }],
      streak: { current: 3, lastDate: "2026-03-18" },
    };
    localStorageMock.setItem("forge-data", JSON.stringify(stored));

    const data = loadData();
    expect(data.sessions).toHaveLength(1);
    expect(data.streak.current).toBe(3);
  });

  it("returns default data on invalid JSON", () => {
    localStorageMock.setItem("forge-data", "not valid json{{{");

    const data = loadData();
    expect(data).toEqual({
      sessions: [],
      streak: { current: 0, lastDate: null },
    });
  });
});

describe("saveData", () => {
  it("serializes data to localStorage", () => {
    const data = {
      sessions: [{ date: "2026-03-18", companyId: "test", duration: 5, questions: [{ type: "metric", score: 4 }] }],
      streak: { current: 1, lastDate: "2026-03-18" },
    };

    saveData(data);
    expect(localStorageMock.setItem).toHaveBeenCalledWith("forge-data", JSON.stringify(data));
  });

  it("does not throw on quota exceeded", () => {
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new DOMException("quota exceeded");
    });

    expect(() => saveData({ sessions: [], streak: { current: 0, lastDate: null } })).not.toThrow();
  });
});

describe("updateStreak", () => {
  it("starts a new streak on first use", () => {
    const result = updateStreak({ current: 0, lastDate: null }, "2026-03-18");
    expect(result).toEqual({ current: 1, lastDate: "2026-03-18" });
  });

  it("increments streak for consecutive days", () => {
    // Mock Date to control "yesterday"
    const realDate = globalThis.Date;
    const mockDate = class extends realDate {
      constructor(...args) {
        if (args.length === 0) {
          super(2026, 2, 18); // March 18, 2026
        } else {
          super(...args);
        }
      }
    };
    globalThis.Date = mockDate;

    const result = updateStreak({ current: 5, lastDate: "2026-03-17" }, "2026-03-18");
    expect(result).toEqual({ current: 6, lastDate: "2026-03-18" });

    globalThis.Date = realDate;
  });

  it("resets streak when a day is skipped", () => {
    const realDate = globalThis.Date;
    const mockDate = class extends realDate {
      constructor(...args) {
        if (args.length === 0) {
          super(2026, 2, 20); // March 20
        } else {
          super(...args);
        }
      }
    };
    globalThis.Date = mockDate;

    const result = updateStreak({ current: 5, lastDate: "2026-03-18" }, "2026-03-20");
    expect(result).toEqual({ current: 1, lastDate: "2026-03-20" });

    globalThis.Date = realDate;
  });

  it("returns same streak if called twice on the same day", () => {
    const streak = { current: 3, lastDate: "2026-03-18" };
    const result = updateStreak(streak, "2026-03-18");
    expect(result).toBe(streak); // same reference, unchanged
  });
});
