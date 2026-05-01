---
title: "Versioned localStorage migration with backup, atom-level back-references, and full LLM feedback persistence"
date: 2026-04-30
category: patterns
problem_type: schema_evolution
component: "useScoring hook (forge-data localStorage schema)"
symptoms: "schema lacked explicit version field; LLM qualitative feedback (strengths/gaps/suggestion) discarded after eval, only integer score persisted; no atom-level back-references (atomId/atomType/timestamp), blocking SRS work that needs to target specific concepts/levers/bridges/company-questions instead of only question types"
tags: [localstorage, schema-versioning, data-migration, srs, atom-tagging, llm-feedback, react-hooks, backfill-script]
linear_issue: MCR-103
related_issues: [MCR-101, MCR-102]
---

This pattern solves the problem of evolving a client-side localStorage schema without losing existing user data while simultaneously enriching every persisted record with the back-references a future spaced-repetition engine will need. It establishes an explicit `version` field plus a one-shot idempotent v1 to v2 migration that backs up legacy data to a separate key before overwriting, and it backfills stable kebab-case IDs onto previously anonymous content (45 company questions) via an idempotent Node script so persisted entries can point at specific atoms.

## Root Cause

The v1 `forge-data` schema was a write-only sink for integer scores. `addScore` accepted only `{companyId, questionType, score, delta, unit}` and persisted exactly that shape, so two pieces of high-value signal that the system already had access to were silently thrown away on every qualitative answer:

1. **Full LLM feedback was generated and discarded.** `/api/evaluate` already returned a structured `{score, strengths[], gaps[], suggestion}` object via Claude Haiku, and `LLMFeedback.jsx` rendered it in the UI for the current session. But the moment the user moved on, only the integer score survived to localStorage. A user who answered "what are the key risks for Coastal?" got rich diagnostic feedback once and could never review it again.
2. **No back-reference from a saved score to the actual atom being practiced.** Persisted entries were indexed only by coarse `questionType` (one of six categories: metric, adjustment, valuation, risk, diagnostic, thesis). There was no way to ask "how is the user doing on the Coastal customer-concentration risk question specifically?" or "show me every time the user practiced the 'EBITDA add-backs' concept." This made the downstream MCR-101 (Socratic) and MCR-102 (SRS engine) work impossible. SRS in particular needs a stable atom ID and a `lastSeen` timestamp per atom, neither of which existed.

The v1 schema worked for the original "track streak + show weak categories" dashboard but starved every learning-loop feature on the roadmap.

## Solution

### 1. Schema v2 — explicit version, discriminated atom reference, full feedback object

```js
const SCHEMA_VERSION = 2;
const DEFAULT_STATE = {
  version: SCHEMA_VERSION,
  sessions: [],
  streak: { current: 0, lastDate: null },
};
// Per-question: { type, score, delta, unit,
//                 atomId, atomType, feedback, timestamp }   // last 4 nullable
```

Reference is a **discriminated pair** `(atomId, atomType)` rather than a global atom registry. Cheaper than a synthetic key — lookup tables live in different source files (`conceptCards.js`, `valueLevers.js`, `companies.js`, etc.) with different shapes, so a type tag plus an ID is enough to route a lookup. All four new fields are nullable so quantitative questions (no LLM eval) and legacy entries (no atom binding) are first-class.

### 2. Migration — silent, one-shot, with a recovery backup

```js
function loadData() {
  // ...parse + shape-validate...
  if (parsed.version !== SCHEMA_VERSION) {
    const migrated = migrateV1ToV2(parsed);
    saveData(migrated);          // persist immediately, next read is fast
    return migrated;
  }
  return parsed;
}
```

`migrateV1ToV2` writes the raw v1 JSON to `forge-data-v1-backup` **before** overwriting, in a `try/catch` so a localStorage quota error during backup doesn't block the migration itself. Migration is invisible to the user.

### 3. Idempotence

The migration walks every question and uses `q.atomId ?? null` for each new field. Re-running on already-v2 data is a no-op: existing values pass through untouched. A test asserts a v2-shape object round-trips through `migrateV1ToV2` unchanged.

### 4. Plumb-through — both score paths in `QuestionCard`

The single funnel `QuestionCard.onScore → App.handleScore → useScoring.addScore` was updated at all three layers. Both the LLM eval path and the manual quantitative path now pass `atomId: question.id, atomType: "company-question"`. The LLM path additionally passes `feedback: { strengths, gaps, suggestion }`; the manual path passes `feedback: null`. `handleScore` forwards all four through to `addScore`, which auto-stamps `timestamp` to ISO8601 if not provided.

### 5. Bulk data edit — script over manual edits

44 question objects across 9 companies needed an `id` field. Hand-editing was rejected as error-prone. A one-shot Node script (`scripts/inject-question-ids.mjs`) line-walks `companies.js`, tracks company context, and inserts `id: "{companyId}-q{N}"` as the first property of each question object:

```js
if (questionDepth === 1 && pendingInsert) {
  if (line.match(/^        id: /)) {       // already has id → skip
    pendingInsert = false;
    out.push(line);
    continue;
  }
  out.push(`        id: "${currentCompanyId}-q${questionCounter}",`);
  changed++;
}
```

The early-return on existing `id` makes the script idempotent — re-running it is safe and reports `Injected 0 question IDs`. Final shipped form was `summit-hvac-q1`-style (full company prefix, not the planned short prefix), which is more robust against future name collisions at no downstream cost.

## Prevention

- **Version from day one.** Stamp an explicit `version` field on the schema the moment you introduce it, even when only v1 exists. Detecting "version mismatch" is precise; detecting "absence of version" is fragile and tangles with first-run/empty-state logic.
- **Backup raw bytes before overwrite.** When a migration runs, copy the prior version's exact JSON string to a separate key (e.g. `forge-data-v1-backup`) BEFORE writing the new shape. Disk is cheap; recovery from a bad migration is not. The raw string preserves everything, including fields the migrator didn't know about.
- **Migrations must be idempotent.** Running the migration on already-migrated data is a no-op: same `version`, all v2-specific fields preserved, no field clobbering. Treat this as a hard invariant, not an aspiration.
- **Migrate on first read, persist immediately.** Don't defer the write. As soon as the consumer hydrates and detects v1, run the migration and write the v2 shape back to storage. Subsequent reads should never re-run the migration.
- **New fields are nullable, both shapes coexist.** Legacy entries get `null` for the new field (`atomId`, `feedback`, `timestamp`); new entries get real values. The same `sessions[]` array must safely hold both. Don't backfill synthetic data that pretends legacy entries had the new info.
- **Audit consumers for null-tolerance.** Any function that aggregates persisted data (`getWeakSpots`, `getAllScores`, dashboards, exports) is now operating on a mixed-shape array. Walk every consumer and confirm it handles `null` on each new field without crashing or silently miscounting.

## Testing

- **Don't delete default-state shape tests.** The two tests that caught this migration were load-bearing precisely because they assert the canonical shape. Keep them; update them deliberately when shape changes; never silence them.
- **Test the migration round-trip.** Feed a v1 fixture through the migrator and assert the output: `version === 2`, new fields present and null-defaulted, all v1 data preserved exactly.
- **Test idempotence explicitly.** Feed a fully-formed v2 object into the migrator; assert the result is byte-equivalent and that v2-specific fields (populated `atomId`, populated `feedback`) are not nulled out.
- **Test the backup key.** After migration runs, assert `localStorage[backupKey]` contains the original v1 JSON string verbatim. This is the recovery contract; prove it.
- **Test mixed v1+v2 entries.** Construct a session array with one legacy entry (null `atomId`, null `feedback`) and one new entry (populated). Run every aggregation method against it and assert no crashes, correct counts, correct grouping.
- **Atom-level ID integrity.** For data IDs like company question IDs, add `dataIntegrity` tests asserting: presence on every entry, regex-validated format, uniqueness across the file, and prefix correctly matches the parent ID. These run at suite startup and fail loudly on drift.

## Related Docs

- `docs/ideation/2026-03-29-open-ideation.md` — Idea #1 (Persist LLM Feedback) and #3 (Answer Text Persistence) are the direct origin spec for this migration. Calls out the discarded `strengths`/`gaps`/`suggestion` and proposes extending `forge-data`.
- `docs/plans/2026-03-24-001-feat-llm-qualitative-answer-evaluation-plan.md` — Original LLM eval pipeline plan; defines the `{score, strengths, gaps, suggestion}` shape and explicitly leaves "evaluation history persistence" as a future enhancement.
- `docs/plans/2026-03-23-001-refactor-state-management-contexts-plan.md` — Establishes `useScoring` as the localStorage owner; any schema change touches this contract.
- `docs/solutions/test-failures/node-25-webstorage-breaks-jsdom-tests.md` — Required reading for any localStorage-touching tests (jsdom shim still applies).
- Forge `CLAUDE.md` Compound Learnings — `[2026-04-14] testing` (verify localStorage round-trips end-to-end) and `[2026-04-14] process` (walk codebase for shape-validation gaps) are directly relevant to v1→v2 migration safety.

### Refresh candidates

- `docs/plans/2026-03-24-001-feat-llm-qualitative-answer-evaluation-plan.md` — Now stale: it states feedback persistence is "future enhancement (but data shape supports it)". Update to point to the v2 schema and the SRS/Socratic downstream consumers.
- `docs/ideation/2026-03-29-open-ideation.md` — Mark Ideas #1 and #3 as shipped; note that the v2 `forge-data` shape now persists feedback and atom-level tagging, unblocking #5 (spaced repetition / SRS).
- Forge `CLAUDE.md` `### Scoring & Persistence` block — Documents the v1 shape (`{date, companyId, duration, questions: [{type, score, delta, unit}]}`). Update to reflect v2 fields (`atomId`, `atomType`, `strengths`, `gaps`, `suggestion`) and reference the migration.

## Linear

- **MCR-103** — [Phase 0: Persist full LLM feedback + atom-level schema](https://linear.app/mcraygroup/issue/MCR-103/phase-0-persist-full-llm-feedback-atom-level-schema-tier-2)
- **Blocks MCR-101** — [Socratic toggle in ChatDrawer](https://linear.app/mcraygroup/issue/MCR-101/socratic-toggle-in-chatdrawer-tier-2)
- **Blocks MCR-102** — [Spaced repetition engine + passive review queue](https://linear.app/mcraygroup/issue/MCR-102/spaced-repetition-engine-passive-review-queue-tier-2)
