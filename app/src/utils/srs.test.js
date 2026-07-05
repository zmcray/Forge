import { describe, it, expect } from "vitest";
import {
  createAtom,
  applyOutcome,
  isDue,
  overdueDays,
  processScores,
  computeDueQueue,
  DEFAULT_SRS_STATE,
  EASE_START,
  EASE_MIN,
  EASE_MAX,
  HISTORY_CAP,
} from "./srs";

const T0 = "2026-07-01T12:00:00.000Z";
const day = (n) => new Date(Date.parse(T0) + n * 86400000).toISOString();

describe("createAtom", () => {
  it("returns the default atom shape", () => {
    expect(createAtom("concept")).toEqual({
      atomType: "concept",
      ease: EASE_START,
      interval: 0,
      nextDue: null,
      lastSeen: null,
      consecutiveFails: 0,
      history: [],
    });
  });
});

describe("applyOutcome", () => {
  it("correct (score >= 4) on a new atom schedules 1 day out and drifts ease up", () => {
    const next = applyOutcome(createAtom("concept"), { score: 5, timestamp: T0 });
    expect(next.interval).toBe(1);
    expect(next.ease).toBeCloseTo(EASE_START + 0.1);
    expect(next.nextDue).toBe(day(1));
    expect(next.lastSeen).toBe(T0);
    expect(next.consecutiveFails).toBe(0);
  });

  it("correct on a seasoned atom multiplies interval by ease", () => {
    const atom = { ...createAtom("concept"), interval: 4, ease: 2.5 };
    const next = applyOutcome(atom, { score: 4, timestamp: T0 });
    expect(next.interval).toBe(10); // round(4 * 2.5)
    expect(next.nextDue).toBe(day(10));
  });

  it("partial (score 3) extends modestly without touching ease", () => {
    const atom = { ...createAtom("concept"), interval: 10, ease: 2.5 };
    const next = applyOutcome(atom, { score: 3, timestamp: T0 });
    expect(next.interval).toBe(12); // round(10 * 1.2)
    expect(next.ease).toBe(2.5);
    expect(next.consecutiveFails).toBe(0);
  });

  it("partial on a new atom still schedules at least 1 day", () => {
    const next = applyOutcome(createAtom("concept"), { score: 3, timestamp: T0 });
    expect(next.interval).toBe(1);
  });

  it("wrong (score <= 2) resets interval to 1 day but keeps ease on first fail", () => {
    const atom = { ...createAtom("concept"), interval: 20, ease: 2.5 };
    const next = applyOutcome(atom, { score: 1, timestamp: T0 });
    expect(next.interval).toBe(1);
    expect(next.ease).toBe(2.5); // single fail: no ease degradation
    expect(next.consecutiveFails).toBe(1);
  });

  it("two consecutive fails degrade ease", () => {
    let atom = { ...createAtom("concept"), interval: 20, ease: 2.5 };
    atom = applyOutcome(atom, { score: 2, timestamp: T0 });
    atom = applyOutcome(atom, { score: 1, timestamp: day(1) });
    expect(atom.ease).toBeCloseTo(2.3);
    expect(atom.consecutiveFails).toBe(2);
  });

  it("a success between fails resets the consecutive-fail counter", () => {
    let atom = createAtom("concept");
    atom = applyOutcome(atom, { score: 1, timestamp: T0 });
    atom = applyOutcome(atom, { score: 5, timestamp: day(1) });
    atom = applyOutcome(atom, { score: 1, timestamp: day(2) });
    expect(atom.ease).toBeCloseTo(EASE_START + 0.1); // never degraded
    expect(atom.consecutiveFails).toBe(1);
  });

  it("ease is clamped to [EASE_MIN, EASE_MAX]", () => {
    let low = { ...createAtom("concept"), ease: EASE_MIN };
    low = applyOutcome(low, { score: 1, timestamp: T0 });
    low = applyOutcome(low, { score: 1, timestamp: day(1) });
    expect(low.ease).toBe(EASE_MIN);

    let high = { ...createAtom("concept"), ease: EASE_MAX };
    high = applyOutcome(high, { score: 5, timestamp: T0 });
    expect(high.ease).toBe(EASE_MAX);
  });

  it("caps history at HISTORY_CAP entries, keeping the most recent", () => {
    let atom = createAtom("concept");
    for (let i = 0; i < HISTORY_CAP + 5; i++) {
      atom = applyOutcome(atom, { score: 4, timestamp: day(i) });
    }
    expect(atom.history).toHaveLength(HISTORY_CAP);
    expect(atom.history.at(-1).timestamp).toBe(day(HISTORY_CAP + 4));
  });
});

describe("isDue / overdueDays", () => {
  it("an atom with no schedule is never due", () => {
    expect(isDue(createAtom("concept"), new Date(T0))).toBe(false);
  });

  it("due exactly at nextDue and after", () => {
    const atom = applyOutcome(createAtom("concept"), { score: 4, timestamp: T0 });
    expect(isDue(atom, new Date(day(0.5)))).toBe(false);
    expect(isDue(atom, new Date(day(1)))).toBe(true);
    expect(overdueDays(atom, new Date(day(3)))).toBeCloseTo(2);
  });
});

describe("processScores", () => {
  const entry = (over = {}) => ({
    atomId: "summit-hvac-q1",
    atomType: "company-question",
    score: 4,
    timestamp: T0,
    ...over,
  });

  it("ingests atom-tagged entries and advances the watermark", () => {
    const state = processScores(DEFAULT_SRS_STATE, [entry()]);
    expect(state.atoms["summit-hvac-q1"].interval).toBe(1);
    expect(state.lastProcessed).toBe(T0);
    expect(state.version).toBe(1);
  });

  it("ignores entries without atomId or timestamp", () => {
    const state = processScores(DEFAULT_SRS_STATE, [
      entry({ atomId: null }),
      entry({ timestamp: null }),
    ]);
    expect(state).toBe(DEFAULT_SRS_STATE); // bail-out reference
  });

  it("skips entries at or before the watermark (idempotent re-runs)", () => {
    const once = processScores(DEFAULT_SRS_STATE, [entry()]);
    const twice = processScores(once, [entry()]);
    expect(twice).toBe(once); // same reference: shared store bails out
  });

  it("applies out-of-order entries in timestamp order", () => {
    const state = processScores(DEFAULT_SRS_STATE, [
      entry({ score: 1, timestamp: day(1) }),
      entry({ score: 5, timestamp: T0 }),
    ]);
    // 5 then 1: interval ends reset to 1, one fail recorded
    expect(state.atoms["summit-hvac-q1"].interval).toBe(1);
    expect(state.atoms["summit-hvac-q1"].consecutiveFails).toBe(1);
    expect(state.lastProcessed).toBe(day(1));
  });
});

describe("computeDueQueue", () => {
  it("returns due atoms sorted by overdue-ness, weak atoms weighted 2x", () => {
    let state = DEFAULT_SRS_STATE;
    state = processScores(state, [
      // strong atom, 4 days overdue at day(5)
      { atomId: "strong", atomType: "concept", score: 5, timestamp: T0 },
      // weak atom (avg < 3.5), 3 days overdue at day(5): priority 6 > 4
      { atomId: "weak", atomType: "lever", score: 2, timestamp: day(1) },
      // not yet due
      { atomId: "future", atomType: "concept", score: 5, timestamp: day(4.5) },
    ]);
    const queue = computeDueQueue(state.atoms, new Date(day(5)));
    expect(queue.map((a) => a.atomId)).toEqual(["weak", "strong"]);
    expect(queue[0].atomType).toBe("lever");
    expect(queue[0].overdueDays).toBeGreaterThan(0);
  });

  it("returns an empty array when nothing is due", () => {
    expect(computeDueQueue({}, new Date(T0))).toEqual([]);
  });
});
