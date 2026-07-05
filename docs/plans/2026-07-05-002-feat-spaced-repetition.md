---
Created: 2026-07-05
Flow: standard
Linear Project: Forge
Linear Issue: MCR-102
Linear Branch: zack/mcr-102-spaced-repetition-engine-passive-review-queue-tier-2
Task: SM-2 spaced-repetition engine + passive review queue over atom-tagged scores
---

# MCR-102: Spaced Repetition Engine + Passive Review Queue

## Context

Phase 0 (atom-tagged v2 scoring schema, full LLM feedback persistence) shipped as
MCR-103. Verified in `app/src/hooks/useScoring.js`: `addScore` persists
`{type, score, delta, unit, atomId, atomType, feedback, timestamp}` under `forge-data`
with `version: 2`. This build layers an SRS engine and passive review surfaces on top.

## Architecture decisions

- **D1: SRS state lives under a NEW key `forge-srs`** (`{version: 1, atoms: {}, lastProcessed: null}`),
  not inside `forge-data`. Scores already carry timestamps + atomIds; SRS state is
  derived-but-stateful (ease drifts with history) and gets its own key so a bug or
  reset never touches the score-of-record.
- **D2: Score ingestion is watermark-driven.** `processScores` consumes score entries
  with `timestamp > lastProcessed` (ascending), applies SM-2 outcomes, and advances the
  watermark. Idempotent: re-running with no new scores returns the same state reference,
  so the shared store bails out (no save, no notify). Any surface mounting
  `useReviewQueue` triggers ingestion; multiple instances are safe.
- **D3: Lean SM-2 outcome mapping.** score >= 4 correct: `interval = max(1, round(interval * ease))`,
  ease drifts up +0.1 (cap 3.0). score = 3 partial: modest extension
  `interval = max(1, round(interval * 1.2))`, ease unchanged. score <= 2 wrong:
  interval resets to 1 day.
- **D4 (open question call): single-fail resets the interval, but ease only degrades
  on two consecutive fails** (-0.2, floor 1.3). Judgment questions (risk/diagnostic/thesis)
  are noisy; a single miss should schedule an early re-look without permanently
  lengthening the atom's whole future schedule. Two misses in a row is signal, not noise.
- **D5: Per-atom history capped at 20 entries** (`{score, timestamp}`), enough to compute
  a rolling average without unbounded growth.
- **D6: Queue ordering = overdue-days weighted by weakness.** Atoms with rolling avg
  score < 3.5 get a 2x priority multiplier, so weak atoms with equal overdue-ness sort first.
- **D7: Review answers feed the SRS via the same update path as practice** (addScore ->
  forge-data -> watermark ingestion). Company-question reviews reuse `QuestionCard` and
  score against the real company. Learn atoms (concept/lever/bridge/playbook) render a
  prompt card with Again/Good/Easy self-marks mapping to scores 2/4/5, persisted via
  `addScore` with `companyId: "review"` and `questionType: atomType`. One update path,
  review history lands in the score-of-record too. `QUESTION_TYPES[type]` consumers
  already fall back on unknown types (`info?.label || type`).
- **D8: Passive surfaces only, no modal interrupts.** A "Review (N due)" pill on the
  Learn hub and a small line in SessionSummary, both visible only when N > 0, both
  navigating to a new lazy `/review` route.
- **D9: Store pattern conformance.** `forge-srs` persists through a `createStore`
  (progressStore.js) shared store over `loadJSON`/`saveJSON` (storage.js), same
  corrupt-backup contract as every other key.

## Phases

1. **Engine (TDD):** `utils/srs.js` (pure: createAtom, applyOutcome, isDue, overdueDays,
   processScores, computeDueQueue) + `hooks/srsStore.js` (shared store) +
   `hooks/useReviewQueue.js` (ingestion effect + due list). Tests first.
2. **Passive surfaces:** `components/ReviewPill.jsx` (LearnHub + SessionSummary),
   `components/ReviewScreen.jsx` + `utils/resolveAtom.js`, `/review` route lazy in
   AppShellWrapper.
3. **Streak:** untouched. Extending streak semantics to review sessions falls out for
   free because review self-marks go through `addScore` (which updates streak). Any
   deeper streak redesign is out of scope; residual noted in PR.

## Outcome

Shipped on branch, PR opened against main. See PR for test summary.
