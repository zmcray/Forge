// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ScoringProvider } from "../contexts/ScoringContext";
import useReviewQueue from "./useReviewQueue";
import { SRS_STORAGE_KEY } from "./srsStore";

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

const NOW = Date.now();
const daysAgo = (n) => new Date(NOW - n * 86400000).toISOString();

const question = (over = {}) => ({
  type: "metric",
  score: 5,
  delta: null,
  unit: null,
  atomId: "summit-hvac-q1",
  atomType: "company-question",
  feedback: null,
  timestamp: daysAgo(10),
  ...over,
});

function seedForgeData(questions) {
  localStorage.setItem(
    "forge-data",
    JSON.stringify({
      version: 2,
      sessions: [{ date: "2026-06-25", companyId: "summit-hvac", duration: 10, questions }],
      streak: { current: 1, lastDate: "2026-06-25" },
    }),
  );
}

const wrapper = ({ children }) => <ScoringProvider>{children}</ScoringProvider>;

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

describe("useReviewQueue", () => {
  it("ingests seeded sessions into forge-srs and surfaces due atoms", async () => {
    seedForgeData([question()]);
    const { result } = renderHook(() => useReviewQueue(), { wrapper });

    await act(async () => {}); // flush ingestion effect

    expect(result.current.dueCount).toBe(1);
    expect(result.current.dueAtoms[0]).toMatchObject({
      atomId: "summit-hvac-q1",
      atomType: "company-question",
    });

    const persisted = JSON.parse(localStorage.getItem(SRS_STORAGE_KEY));
    expect(persisted.version).toBe(1);
    expect(persisted.atoms["summit-hvac-q1"].interval).toBe(1);
    expect(persisted.lastProcessed).toBe(daysAgo(10));
  });

  it("orders weak atoms ahead of stronger, more overdue ones", async () => {
    seedForgeData([
      question({ atomId: "strong", score: 5, timestamp: daysAgo(10) }),
      question({ atomId: "weak", score: 2, timestamp: daysAgo(8) }),
    ]);
    const { result } = renderHook(() => useReviewQueue(), { wrapper });
    await act(async () => {});

    // strong: 9 days overdue, weight 1 -> 9. weak: 7 days overdue, weight 2 -> 14.
    expect(result.current.dueAtoms.map((a) => a.atomId)).toEqual(["weak", "strong"]);
  });

  it("ignores legacy entries without atomId and reports zero due when empty", async () => {
    seedForgeData([question({ atomId: null, atomType: null })]);
    const { result } = renderHook(() => useReviewQueue(), { wrapper });
    await act(async () => {});

    expect(result.current.dueCount).toBe(0);
    expect(result.current.dueAtoms).toEqual([]);
  });

  it("does not surface atoms scheduled in the future", async () => {
    seedForgeData([question({ timestamp: daysAgo(0.5) })]); // due in +0.5 days
    const { result } = renderHook(() => useReviewQueue(), { wrapper });
    await act(async () => {});

    expect(result.current.dueCount).toBe(0);
  });

  it("does not reprocess already-ingested scores on remount (watermark)", async () => {
    seedForgeData([question({ score: 2 })]);
    const first = renderHook(() => useReviewQueue(), { wrapper });
    await act(async () => {});
    expect(
      JSON.parse(localStorage.getItem(SRS_STORAGE_KEY)).atoms["summit-hvac-q1"]
        .consecutiveFails,
    ).toBe(1);
    first.unmount();

    const second = renderHook(() => useReviewQueue(), { wrapper });
    await act(async () => {});
    expect(
      JSON.parse(localStorage.getItem(SRS_STORAGE_KEY)).atoms["summit-hvac-q1"]
        .consecutiveFails,
    ).toBe(1); // unchanged: same score not double-counted
    second.unmount();
  });
});
