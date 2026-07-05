---
Created: 2026-07-05
Flow: design
Linear Project: Forge
Linear Issue: MCR-96 + MCR-97
Linear Branch: zack/mcr-96-stage-2a-process-decomposition-exercise
Task: Stage 2 consulting wedge, process decomposition (2A) + AI opportunity ranking (2B) as one continuous per-company exercise
---

# Stage 2 Consulting Wedge (MCR-96 + MCR-97)

One continuous exercise per company at `/consult/:companyId`. Stage 2A: commit-first
free-text decomposition of the company's operations, revealed against the realistic
process map from `companyOperations.js`, graded by the existing LLM eval. Stage 2B:
rank the top 3 processes by EBITDA automation impact, revealed against an
impact/feasibility matrix and graded deterministically.

## Architecture decisions

- **D1. Route-level lazy boundary at `/consult`.** `ConsultScreen` (list) and
  `ConsultSession` (flow) are `React.lazy` in `AppShellWrapper`, mirroring the
  LearnModule pattern. `companyOperations.js` (~1.6K lines) is imported only by the
  consult tree, so it stays out of the eager bundle.
- **D2. Reuse the qualitative eval pipeline unchanged.** Stage 2A evaluation calls
  `useLLMEvaluation` -> `evaluateAnswer` -> `/api/evaluate` with
  `questionType: "diagnostic"` because `api/evaluate.js` allowlists only
  `risk|diagnostic|thesis` (VALID_TYPES). No API change; the decomposition task is
  diagnostic in nature. The persisted `questionType` is `"process-decomposition"`;
  the API-facing type and the scoring-facing type are decoupled on purpose.
- **D3. Model answer is a compact serialization of the process map.**
  `buildProcessMapSummary()` in `utils/processMapSummary.js` renders operations
  (name, headcount, cost allocation, manual sub-processes, tools, data quality) into
  a string hard-capped below the API's 5000-char `MAX_FIELD_LENGTH` (truncation is
  defensive; current profiles serialize ~2-3K chars). Unit-tested against the
  longest live profile.
- **D4. Deterministic Stage 2B grading, no LLM.** `utils/rankingScore.js` computes
  the ideal top 3 by `midpoint(ebitdaImpactRange) * feasibilityWeight`
  (high 1.0, medium 0.7, low 0.4). Ties break by higher feasibility weight, then
  process id alphabetically, so the ideal list is stable. Rubric below.
- **D5. Scoring persistence extends `QUESTION_TYPES` deliberately.** `addScore`
  accepts arbitrary strings (no enum), but `WeakSpotCard`/`SessionSummary` render
  `QUESTION_TYPES[type]` metadata and `ProgressDashboard` iterates its keys. Two new
  entries are registered: `process-decomposition` and `opportunity-ranking`
  (both qualitative), so dashboards render the new atoms first-class instead of
  relying on `info?.` null-tolerance. Persisted atoms:
  `atomType "process-decomposition"` / `atomId stage2-decompose-<companyId>` and
  `atomType "opportunity-ranking"` / `atomId stage2-rank-<companyId>` (delta null).
- **D6. Ranking UX is numbered selection, zero dependencies.** Click a process card
  to append it to the ranked list (max 3); ranked rows get up/down/remove controls.
  No drag library.
- **D7. Matrix is a CSS grid, not a chart lib.** Rows = feasibility (high/medium/
  low), columns = impact bands (thirds of the company's max impact midpoint). Each
  process renders as a chip with its midpoint and recommended tier. Legible over
  precise; the exact midpoints are listed in the results detail.
- **D8. Starter prompts are static per-exercise chips.** Three generic decomposition
  prompts ("Walk the order-to-cash path...", etc.) insertable into the textarea to
  prevent blank-page freeze (issue usability note). Static strings, no LLM.
- **D9. Nav plumbing follows existing seams.** `viewFromPath` gains `/consult ->
  "consult"`, App's `setView` routes map gains `consult: "/consult"`, AppShell
  NAV_ITEMS gains `{ id: "consult", label: "Consult", icon: "handshake" }`.
  `useKeyboardShortcuts` needs no change (it has no per-view registry).

## Stage 2B scoring rubric (deterministic, unit-tested)

- `weight(feasibility)`: high = 1.0, medium = 0.7, low = 0.4.
- `value(process) = (impactLow + impactHigh) / 2 * weight`.
- Ideal top 3 = processes sorted by value desc (ties: higher weight, then id asc).
- Score = `1 + overlap + firstPickBonus`, clamped to [1, 5]:
  - `overlap` = count of user picks present in the ideal top 3 (0-3).
  - `firstPickBonus` = 1 if the user's #1 equals the ideal #1, else 0.
- So: no overlap = 1, full overlap with wrong #1 = 4, full overlap + right #1 = 5.
  Order of picks #2/#3 is intentionally not penalized; #1 primacy is the signal
  that matters in a 3-item list.
- Feedback: matched picks, missed ideal picks explained via that process's
  `complexityNotes` + `risks`, and `implementationContext` shown as technical
  readiness context.

## File map (all new files < 300 lines)

- `src/utils/rankingScore.js` + `rankingScore.test.js` (TDD first)
- `src/utils/processMapSummary.js` + `processMapSummary.test.js`
- `src/screens/ConsultScreen.jsx` (company list)
- `src/screens/ConsultSession.jsx` (two-stage orchestrator + financial context strip)
- `src/components/consult/DecompositionStage.jsx` (commit-first + LLM eval + persist)
- `src/components/consult/ProcessMapReveal.jsx` (process map cards)
- `src/components/consult/RankingStage.jsx` (pick/rank/commit + grade + persist)
- `src/components/consult/OpportunityMatrix.jsx` (feasibility x impact grid)
- Edits: `AppShellWrapper.jsx`, `App.jsx`, `AppShell.jsx`, `data/questionTypes.js`,
  `test/AppRouting.test.jsx`
- Tests: `DecompositionStage.test.jsx`, `RankingStage.test.jsx`, routing smoke

## Verification

Full Vitest suite, `npm run lint`, `npm run build` (confirm consult chunk is a
separate lazy chunk containing companyOperations), route smoke via findBy*.
