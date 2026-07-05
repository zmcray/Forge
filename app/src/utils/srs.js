/**
 * Lean SM-2 spaced-repetition engine (MCR-102). Pure functions only; the
 * shared store lives in hooks/srsStore.js.
 *
 * Outcome mapping (scores are the existing 1-5 practice scale):
 * - score >= 4 (correct): interval *= ease, ease drifts up.
 * - score === 3 (partial): modest extension, ease untouched.
 * - score <= 2 (wrong): interval resets to 1 day. Ease only degrades on two
 *   CONSECUTIVE fails: judgment questions are noisy, so a single miss earns an
 *   early re-look without permanently steepening the atom's whole schedule.
 */

export const EASE_START = 2.5;
export const EASE_MIN = 1.3;
export const EASE_MAX = 3.0;
export const EASE_UP = 0.1;
export const EASE_DOWN = 0.2;
export const PARTIAL_FACTOR = 1.2;
export const INTERVAL_MAX = 3650; // days; keeps compounded schedules inside Date range
export const HISTORY_CAP = 20;
export const WEAK_AVG_THRESHOLD = 3.5;
export const WEAK_PRIORITY_MULTIPLIER = 2;

const DAY_MS = 86_400_000;

export const DEFAULT_SRS_STATE = { version: 1, atoms: {}, lastProcessed: null };

export function createAtom(atomType) {
  return {
    atomType,
    ease: EASE_START,
    interval: 0, // days; 0 = never scheduled
    nextDue: null, // ISO8601
    lastSeen: null, // ISO8601
    consecutiveFails: 0,
    history: [], // [{score, timestamp}], capped at HISTORY_CAP
  };
}

const clampEase = (ease) => Math.min(EASE_MAX, Math.max(EASE_MIN, ease));

/** Apply one scored outcome to an atom. Returns a new atom; never mutates. */
export function applyOutcome(atom, { score, timestamp }) {
  let { ease, interval, consecutiveFails } = atom;

  if (score >= 4) {
    interval = interval < 1 ? 1 : Math.min(INTERVAL_MAX, Math.round(interval * ease));
    ease = clampEase(ease + EASE_UP);
    consecutiveFails = 0;
  } else if (score === 3) {
    interval = Math.min(INTERVAL_MAX, Math.max(1, Math.round(interval * PARTIAL_FACTOR)));
  } else {
    consecutiveFails += 1;
    if (consecutiveFails >= 2) ease = clampEase(ease - EASE_DOWN);
    interval = 1;
  }

  return {
    ...atom,
    ease,
    interval,
    consecutiveFails,
    lastSeen: timestamp,
    nextDue: new Date(Date.parse(timestamp) + interval * DAY_MS).toISOString(),
    history: [...atom.history, { score, timestamp }].slice(-HISTORY_CAP),
  };
}

export function isDue(atom, now) {
  return atom.nextDue != null && Date.parse(atom.nextDue) <= now.getTime();
}

export function overdueDays(atom, now) {
  if (atom.nextDue == null) return 0;
  return Math.max(0, (now.getTime() - Date.parse(atom.nextDue)) / DAY_MS);
}

/**
 * Fold score entries into SRS state, watermark-driven: only entries strictly
 * newer than `lastProcessed` (and carrying both atomId and timestamp) apply,
 * in timestamp order. Returns the SAME state reference when nothing new
 * landed, so the shared store's bail-out skips the save/notify.
 */
export function processScores(state, scores) {
  const watermark = state.lastProcessed ? Date.parse(state.lastProcessed) : -Infinity;
  const fresh = scores
    .filter((s) => s.atomId != null && s.timestamp != null && Date.parse(s.timestamp) > watermark)
    .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
  if (fresh.length === 0) return state;

  const atoms = { ...state.atoms };
  for (const s of fresh) {
    atoms[s.atomId] = applyOutcome(atoms[s.atomId] ?? createAtom(s.atomType), s);
  }
  return { ...state, version: 1, atoms, lastProcessed: fresh.at(-1).timestamp };
}

const historyAverage = (history) =>
  history.length === 0 ? null : history.reduce((sum, h) => sum + h.score, 0) / history.length;

/**
 * Due atoms sorted by priority (descending): overdue-days, doubled for atoms
 * whose rolling average score is below the weak-spot threshold, so weak atoms
 * jump the queue.
 */
export function computeDueQueue(atoms, now) {
  return Object.entries(atoms)
    .filter(([, atom]) => isDue(atom, now))
    .map(([atomId, atom]) => {
      const over = overdueDays(atom, now);
      const avg = historyAverage(atom.history);
      const weak = avg != null && avg < WEAK_AVG_THRESHOLD;
      return {
        atomId,
        atomType: atom.atomType,
        overdueDays: over,
        priority: over * (weak ? WEAK_PRIORITY_MULTIPLIER : 1),
      };
    })
    .sort((a, b) => b.priority - a.priority);
}
