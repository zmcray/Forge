// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import useScoring, { loadData, saveData, updateStreak, migrateV1ToV2, SCHEMA_VERSION, STORAGE_KEY, V1_BACKUP_KEY } from "./useScoring";

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
      version: 2,
      sessions: [],
      streak: { current: 0, lastDate: null },
    });
  });

  it("parses stored v2 JSON data without re-migrating", () => {
    const stored = {
      version: 2,
      sessions: [{ date: "2026-03-18", companyId: "test", duration: 10, questions: [] }],
      streak: { current: 3, lastDate: "2026-03-18" },
    };
    localStorageMock.setItem("forge-data", JSON.stringify(stored));

    const data = loadData();
    expect(data.version).toBe(2);
    expect(data.sessions).toHaveLength(1);
    expect(data.streak.current).toBe(3);
    // Migration shouldn't run on already-v2 data → no v1 backup written
    expect(localStorageMock.getItem("forge-data-v1-backup")).toBeNull();
  });

  it("returns default data on invalid JSON", () => {
    localStorageMock.setItem("forge-data", "not valid json{{{");

    const data = loadData();
    expect(data).toEqual({
      version: 2,
      sessions: [],
      streak: { current: 0, lastDate: null },
    });
  });
});

describe("loadData deep sanitization", () => {
  const validSession = {
    date: "2026-07-01",
    companyId: "summit-hvac",
    duration: 60,
    questions: [{ type: "metric", score: 4, delta: 0, unit: "%", atomId: null, atomType: null, feedback: null, timestamp: null }],
  };

  it("drops null and non-object session entries", () => {
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify({
      version: 2,
      sessions: [null, validSession, "junk", 42],
      streak: { current: 1, lastDate: "2026-07-01" },
    }));

    const data = loadData();
    expect(data.sessions).toHaveLength(1);
    expect(data.sessions[0].companyId).toBe("summit-hvac");
    // Downstream consumers must not crash
    expect(() => data.sessions.flatMap((s) => s.questions)).not.toThrow();
  });

  it("coerces a session's non-array questions to an empty array", () => {
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify({
      version: 2,
      sessions: [{ ...validSession, questions: null }],
      streak: { current: 0, lastDate: null },
    }));

    const data = loadData();
    expect(data.sessions[0].questions).toEqual([]);
  });

  it("drops null question entries inside a session", () => {
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify({
      version: 2,
      sessions: [{ ...validSession, questions: [null, validSession.questions[0], "x"] }],
      streak: { current: 0, lastDate: null },
    }));

    const data = loadData();
    expect(data.sessions[0].questions).toHaveLength(1);
    expect(data.sessions[0].questions[0].type).toBe("metric");
  });

  it("normalizes an empty streak object to safe defaults", () => {
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify({
      version: 2,
      sessions: [validSession],
      streak: {},
    }));

    const data = loadData();
    expect(data.streak).toEqual({ current: 0, lastDate: null });
    expect(data.sessions).toHaveLength(1);
  });

  it("normalizes a null streak without discarding sessions", () => {
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify({
      version: 2,
      sessions: [validSession],
      streak: null,
    }));

    const data = loadData();
    expect(data.streak).toEqual({ current: 0, lastDate: null });
    expect(data.sessions).toHaveLength(1);
  });

  it("normalizes wrong-typed streak fields to safe defaults", () => {
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify({
      version: 2,
      sessions: [],
      streak: { current: "five", lastDate: 12345 },
    }));

    const data = loadData();
    expect(data.streak).toEqual({ current: 0, lastDate: null });
  });

  it("falls back to DEFAULT_STATE when sessions is not an array", () => {
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify({ version: 2, sessions: "nope", streak: {} }));

    const data = loadData();
    expect(data).toEqual({ version: 2, sessions: [], streak: { current: 0, lastDate: null } });
  });

  it("still backs up unrecoverable garbage to the corrupt-backup key", () => {
    localStorageMock.setItem(STORAGE_KEY, "not valid json{{{");

    const data = loadData();
    expect(data).toEqual({ version: 2, sessions: [], streak: { current: 0, lastDate: null } });
    expect(localStorageMock.getItem(`${STORAGE_KEY}-corrupt-backup`)).toBe("not valid json{{{");
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

describe("migrateV1ToV2", () => {
  it("upgrades v1-shape data to v2 with null atom/feedback fields on every question", () => {
    const v1 = {
      sessions: [
        {
          date: "2026-04-01",
          companyId: "summit-hvac",
          duration: 120,
          questions: [
            { type: "metric", score: 4, delta: -0.3, unit: "%" },
            { type: "risk", score: 3, delta: null, unit: null },
          ],
        },
      ],
      streak: { current: 5, lastDate: "2026-04-01" },
    };

    const v2 = migrateV1ToV2(v1);

    expect(v2.version).toBe(2);
    expect(v2.streak).toEqual(v1.streak);
    expect(v2.sessions).toHaveLength(1);
    expect(v2.sessions[0].questions).toHaveLength(2);

    const [q1, q2] = v2.sessions[0].questions;
    // Original fields preserved
    expect(q1.type).toBe("metric");
    expect(q1.score).toBe(4);
    expect(q1.delta).toBe(-0.3);
    expect(q1.unit).toBe("%");
    // New fields default to null
    expect(q1.atomId).toBeNull();
    expect(q1.atomType).toBeNull();
    expect(q1.feedback).toBeNull();
    expect(q1.timestamp).toBeNull();

    expect(q2.type).toBe("risk");
    expect(q2.atomId).toBeNull();
    expect(q2.feedback).toBeNull();
  });

  it("preserves any v2 fields that already exist (idempotent on re-run)", () => {
    const partiallyV2 = {
      version: 2,
      sessions: [
        {
          date: "2026-04-02",
          companyId: "coastal-foods",
          duration: 0,
          questions: [
            {
              type: "diagnostic",
              score: 5,
              delta: null,
              unit: null,
              atomId: "coastal-foods-q1",
              atomType: "company-question",
              feedback: { strengths: ["s"], gaps: [], suggestion: "go deeper" },
              timestamp: "2026-04-02T10:00:00.000Z",
            },
          ],
        },
      ],
      streak: { current: 1, lastDate: "2026-04-02" },
    };

    const result = migrateV1ToV2(partiallyV2);
    const q = result.sessions[0].questions[0];
    expect(q.atomId).toBe("coastal-foods-q1");
    expect(q.atomType).toBe("company-question");
    expect(q.feedback.suggestion).toBe("go deeper");
    expect(q.timestamp).toBe("2026-04-02T10:00:00.000Z");
  });

  it("backs up the existing v1 raw JSON to V1_BACKUP_KEY before overwriting", () => {
    const v1 = {
      sessions: [{ date: "2026-04-03", companyId: "x", duration: 0, questions: [] }],
      streak: { current: 0, lastDate: null },
    };
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(v1));

    migrateV1ToV2(v1);

    const backup = localStorageMock.getItem(V1_BACKUP_KEY);
    expect(backup).toBeTruthy();
    expect(JSON.parse(backup)).toEqual(v1);
  });
});

describe("loadData migration integration", () => {
  it("migrates a v1 payload from localStorage on first read", () => {
    const v1 = {
      sessions: [
        {
          date: "2026-04-04",
          companyId: "precision-manufacturing",
          duration: 90,
          questions: [{ type: "valuation", score: 3, delta: 1.2, unit: "x" }],
        },
      ],
      streak: { current: 2, lastDate: "2026-04-04" },
    };
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(v1));

    const data = loadData();

    expect(data.version).toBe(SCHEMA_VERSION);
    expect(data.sessions[0].questions[0].atomId).toBeNull();
    expect(data.sessions[0].questions[0].score).toBe(3);
    // Backup written
    expect(localStorageMock.getItem(V1_BACKUP_KEY)).toBeTruthy();
    // Migrated shape persisted back to main key
    const persisted = JSON.parse(localStorageMock.getItem(STORAGE_KEY));
    expect(persisted.version).toBe(SCHEMA_VERSION);
  });

  it("does not re-migrate or re-backup when data is already v2", () => {
    const v2 = {
      version: 2,
      sessions: [],
      streak: { current: 0, lastDate: null },
    };
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(v2));

    loadData();

    expect(localStorageMock.getItem(V1_BACKUP_KEY)).toBeNull();
  });

  it("preserves the streak value through migration", () => {
    const v1 = {
      sessions: [],
      streak: { current: 12, lastDate: "2026-04-05" },
    };
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(v1));

    const data = loadData();

    expect(data.streak).toEqual({ current: 12, lastDate: "2026-04-05" });
  });
});

// --- Analytics selectors (getScoresByType, getWeakSpots, getQuantitativeAccuracy) ---

function question(type, score, { delta = null, unit = null } = {}) {
  return { type, score, delta, unit, atomId: null, atomType: null, feedback: null, timestamp: null };
}

function seedSessions(sessions) {
  localStorageMock.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: SCHEMA_VERSION, sessions, streak: { current: 0, lastDate: null } })
  );
}

function renderScoring() {
  return renderHook(() => useScoring()).result;
}

describe("getScoresByType", () => {
  it("returns an empty object with no sessions", () => {
    const result = renderScoring();
    expect(result.current.getScoresByType()).toEqual({});
  });

  it("groups scores by question type across sessions", () => {
    seedSessions([
      {
        date: "2026-06-01", companyId: "summit-hvac", duration: 0,
        questions: [question("metric", 4), question("risk", 2)],
      },
      {
        date: "2026-06-02", companyId: "coastal-foods", duration: 0,
        questions: [question("metric", 5), question("thesis", 3)],
      },
    ]);
    const result = renderScoring();
    expect(result.current.getScoresByType()).toEqual({
      metric: [4, 5],
      risk: [2],
      thesis: [3],
    });
  });
});

describe("getWeakSpots", () => {
  const day = (i) => `2026-06-${String(i + 1).padStart(2, "0")}`;
  // One question per session so total count is easy to control.
  const seedScores = (entries) =>
    seedSessions(
      entries.map(([type, score], i) => ({
        date: day(i), companyId: `co-${i}`, duration: 0, questions: [question(type, score)],
      }))
    );

  it("returns null below the 10-score minimum sample size (9 scores)", () => {
    seedScores(Array.from({ length: 9 }, () => ["metric", 1]));
    const result = renderScoring();
    expect(result.current.getWeakSpots()).toBeNull();
  });

  it("surfaces weak spots at exactly 10 scores", () => {
    seedScores(Array.from({ length: 10 }, () => ["metric", 1]));
    const result = renderScoring();
    expect(result.current.getWeakSpots()).toEqual([{ type: "metric", avg: 1, count: 10 }]);
  });

  it("only surfaces types with avg < 3.5 and 2+ attempts", () => {
    seedScores([
      // metric: avg 2 with 2 attempts → weak
      ["metric", 2], ["metric", 2],
      // risk: avg 4 → not weak
      ["risk", 4], ["risk", 4],
      // thesis: avg 3.5 exactly → not weak (strict <)
      ["thesis", 3], ["thesis", 4],
      // diagnostic: only 1 attempt at score 1 → excluded despite low avg
      ["diagnostic", 1],
      // filler to clear the 10-score gate
      ["valuation", 5], ["valuation", 5], ["valuation", 5],
    ]);
    const result = renderScoring();
    expect(result.current.getWeakSpots()).toEqual([{ type: "metric", avg: 2, count: 2 }]);
  });

  it("sorts weak spots ascending by average (weakest first)", () => {
    seedScores([
      ["risk", 3], ["risk", 3],           // avg 3
      ["metric", 1], ["metric", 2],       // avg 1.5
      ["thesis", 2], ["thesis", 3],       // avg 2.5
      ["valuation", 5], ["valuation", 5], ["valuation", 5], ["valuation", 5],
    ]);
    const result = renderScoring();
    expect(result.current.getWeakSpots().map(w => w.type)).toEqual(["metric", "thesis", "risk"]);
  });

  it("returns null when no type qualifies as weak", () => {
    seedScores(Array.from({ length: 10 }, () => ["metric", 5]));
    const result = renderScoring();
    expect(result.current.getWeakSpots()).toBeNull();
  });
});

describe("getQuantitativeAccuracy", () => {
  it("returns null when there are no quantitative scores", () => {
    seedSessions([
      {
        date: "2026-06-01", companyId: "summit-hvac", duration: 0,
        questions: [question("risk", 3), question("thesis", 4)],
      },
    ]);
    const result = renderScoring();
    expect(result.current.getQuantitativeAccuracy()).toBeNull();
  });

  it("averages absolute deltas and skips delta == null entries", () => {
    seedSessions([
      {
        date: "2026-06-01", companyId: "summit-hvac", duration: 0,
        questions: [
          question("metric", 4, { delta: -2, unit: "%" }),   // |−2| = 2
          question("valuation", 3, { delta: 1, unit: "x" }),  // 1
          question("risk", 3),                                 // delta null → skipped
        ],
      },
    ]);
    const result = renderScoring();
    expect(result.current.getQuantitativeAccuracy()).toEqual({ avgDelta: "1.5", count: 2 });
  });

  it("has no minimum sample size gate (returns a result with a single delta)", () => {
    seedSessions([
      {
        date: "2026-06-01", companyId: "summit-hvac", duration: 0,
        questions: [question("metric", 4, { delta: 0.25, unit: "%" })],
      },
    ]);
    const result = renderScoring();
    expect(result.current.getQuantitativeAccuracy()).toEqual({ avgDelta: "0.3", count: 1 });
  });
});

describe("getAttemptedCompanyIds", () => {
  it("returns an empty set with no sessions", () => {
    const result = renderScoring();
    expect(result.current.getAttemptedCompanyIds()).toEqual(new Set());
  });

  it("includes only companies whose sessions have at least one question", () => {
    seedSessions([
      { date: "2026-06-01", companyId: "summit-hvac", duration: 0, questions: [question("metric", 4)] },
      { date: "2026-06-01", companyId: "coastal-foods", duration: 0, questions: [] },
      { date: "2026-06-02", companyId: "precision-cnc", duration: 0, questions: [question("risk", 3)] },
    ]);
    const result = renderScoring();
    expect(result.current.getAttemptedCompanyIds()).toEqual(new Set(["summit-hvac", "precision-cnc"]));
  });

  it("dedupes multiple sessions for the same company", () => {
    seedSessions([
      { date: "2026-06-01", companyId: "summit-hvac", duration: 0, questions: [question("metric", 4)] },
      { date: "2026-06-02", companyId: "summit-hvac", duration: 0, questions: [question("thesis", 5)] },
    ]);
    const result = renderScoring();
    expect(result.current.getAttemptedCompanyIds()).toEqual(new Set(["summit-hvac"]));
  });

  it("returns a referentially stable set across calls for the same sessions", () => {
    seedSessions([
      { date: "2026-06-01", companyId: "summit-hvac", duration: 0, questions: [question("metric", 4)] },
    ]);
    const result = renderScoring();
    expect(result.current.getAttemptedCompanyIds()).toBe(result.current.getAttemptedCompanyIds());
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
