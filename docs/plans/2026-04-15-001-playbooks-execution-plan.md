---
title: "feat: Operating Playbooks — Execution Plan (Phase 3)"
type: execution-plan
status: draft
date: 2026-04-15
branch: feat/value-creation-playbooks
parent_plan: 2026-03-29-002-feat-value-creation-learn-sections.md
predecessors:
  - 2026-04-13-001-levers-execution-plan.md (Phase 1, shipped)
  - Bridge Phase 2 (shipped 2026-04-14, no separate plan file)
---

# Operating Playbooks — Execution Plan

Execution-ready breakdown of Phase 3 (Playbooks) from the parent plan. Turns the cleared scope into file-by-file micro-tasks. Phase 4 (Roll-ups) is explicitly out of scope.

## Status

- Pending D1-D5 signoff.
- Branch to cut from `main` once approved: `feat/value-creation-playbooks`.

## Recon findings

### Canonical company IDs (same lesson as Levers)

Parent plan uses shortened IDs (`summit`, `coastal`, etc.). Real IDs in `src/data/companies.js`:

| Short (plan draft) | Canonical |
|---|---|
| summit | `summit-hvac` |
| coastal | `coastal-foods` |
| precision | `precision-manufacturing` |
| brightsmile | `bright-dental` |
| apex | `apex-logistics` |
| truenorth | `truenorth-saas` |
| ironclad | `ironclad-construction` |
| vitality | `vitality-vet` |
| meridian | `meridian-fulfillment` |

Levers/Bridge both hit this. Data integrity test catches drift.

### Canonical lever IDs (new cross-reference surface)

Each initiative in the parent plan references a `lever` slug. These must match IDs in `src/data/valueLevers.js` (15 levers from Phase 1). Draft examples (`pricing-optimization`, `sales-effectiveness`, `management-upgrades`, `procurement`, `labor-optimization`, `automation`, `financial-controls`, `channel-expansion`) need to be validated against the live file during Chunk 1.

### Pattern to clone

Two proven patterns to clone:

- **`LeverCard.jsx` + `LeverList.jsx` + `useLeverProgress.js`** — list-of-cards + detail pattern. Base template for playbook list + detail.
- **`BridgeCalculator.jsx` + `BridgeWaterfall.jsx`** — interactive, phased rendering. Template for phased timeline layout with expected value creation callouts.

Routes in `App.jsx` mirror the learn routes added for Levers and Bridge. Add 2 routes for playbooks (list + detail). `LearnModule.jsx` location checks follow the Levers precedent. `LearnNav.jsx` gets a third link under "Value Creation".

## Architecture decisions (pending signoff)

### D1. Use canonical `companyId` in playbook objects, match to `companies.js`

- **Draft says:** `company: "summit"`
- **Recommend:** `companyId: "summit-hvac"`, with data integrity test that every playbook's `companyId` resolves to a live company.
- **Why:** same drift prevention lesson from Levers. Non-negotiable.

### D2. New `usePlaybookProgress.js` hook, storage key `forge-playbooks`

- **Why:** needs its own key for isolation. `useLeverProgress` set the precedent ("new domain gets a new hook").
- **Schema:** `{ playbooks: { [playbookId]: { lastVisited, exerciseAttempted, exerciseScore, goldenYearGuess } } }` — no custom initiatives or 100-day builder state in v1 (see D3).
- **Round-trip test mandatory** per Bridge Phase 2 compound learning (localStorage round-trips verified end-to-end, not just write-tested).

### D3. Ship read-only playbook detail in v1. Defer interactive 100-day builder to Phase 3.5.

- **Parent plan has:** drag-and-drop 100-day builder with dependency validation, custom initiative creation, sequencing exercise graded vs expert ordering.
- **Recommend:** ship read-only playbook list + detail + Golden Year assessment in v1. The builder is a ~600-line surface (drag-drop, validation, exercise grading) that doubles the PR.
- **Why:** Levers shipped in 5 commits, Bridge in ~6. Bundling the builder pushes Phase 3 to 10+ commits and creates review surface Codex already flagged us on in Phase 2. Follow the "ship tight, then extend" rhythm.
- **Follow-on plan:** `2026-04-??-002-playbook-100-day-builder-execution-plan.md` captures the deferred scope.
- **Alternative:** if user insists, add Chunk 7 for builder — flag size risk, extend estimate to ~10 hours.

### D4. Link each initiative to its lever by `leverId`. Render "View Lever →" link on initiative card.

- **Why:** parent plan already has `lever: "pricing-optimization"` on each initiative. Wiring it to `LeverCard` at `/learn/levers/:leverId` costs one line per render and gives the user a concrete cross-reference between the *what* (lever) and the *when/how* (playbook).
- **Cost:** data integrity test that every initiative's `leverId` resolves to a live lever.

### D5. Golden Year analysis as a computed summary panel + one lightweight exercise

- **Parent plan has:** static `goldenYearAnalysis: { year1_ebitda, year1_vs_plan, assessment }` block in data.
- **Recommend:** render it as a panel at the bottom of playbook detail, plus one qualitative exercise — "Would you deploy this playbook? What's your top risk?" — graded via `evaluateAnswer()` against acceptance criteria (same pattern as Lever exercise).
- **Why:** gives users a commitment surface without building the drag-drop builder. Matches the commit-first flow the rest of the app uses.

## File structure

### New (7)

| File | Size | Purpose |
|---|---|---|
| `src/data/playbooks.js` | ~1800 lines | 9 playbooks × 3 phases × 3-5 initiatives each, w/ canonical IDs |
| `src/hooks/usePlaybookProgress.js` | ~100 lines | Clone of useLeverProgress, storage key `forge-playbooks` |
| `src/hooks/usePlaybookProgress.test.js` | ~120 lines | 6 integration tests incl. remount round-trip |
| `src/components/learn/PlaybookList.jsx` | ~90 lines | Grid of 9 company playbooks |
| `src/components/learn/PlaybookDetail.jsx` | ~350 lines | 3 phase blocks + Golden Year + exercise |
| `src/components/learn/PhaseBlock.jsx` | ~120 lines | Single phase with objective + initiative cards + expected value |
| `src/components/learn/InitiativeCard.jsx` | ~90 lines | Initiative row w/ owner, timeline, resources, metrics, lever link |
| `src/components/learn/PlaybookDetail.test.jsx` | ~180 lines | 12 component tests |

### Modified (4)

| File | Change |
|---|---|
| `src/App.jsx` | +2 routes (`/learn/playbooks`, `/learn/playbooks/:playbookId`) |
| `src/components/learn/LearnModule.jsx` | +2 location checks, +2 conditional renders |
| `src/components/learn/LearnNav.jsx` | +1 link "Playbooks" under Value Creation group |
| `src/test/dataIntegrity.test.js` | +8 data integrity tests |

## Micro-task chunks

### Chunk 1: Data foundation

Commit: `feat(learn): add operating playbooks data`

1. Validate lever IDs referenced in parent plan against live `valueLevers.js`. Log any mismatches.
2. Create `playbooks.js` skeleton + Summit playbook (fully written, uses as exemplar).
3. Fill playbooks 2-4 (Coastal, Precision, BrightSmile).
4. Fill playbooks 5-7 (Apex, TrueNorth, Ironclad).
5. Fill playbooks 8-9 (Vitality, Meridian).
6. Add 8 data integrity tests:
   - exactly 9 playbooks
   - unique playbook IDs
   - every `companyId` resolves to a live company
   - every playbook has exactly 3 phases (months-1-6, months-7-18, months-19-36)
   - every phase has 2+ initiatives
   - every initiative has required fields (id, name, leverId, owner, timeline, resources, successMetrics array, dependencies array)
   - every initiative's `leverId` resolves to a live lever
   - every initiative's `dependencies` resolve to a sibling initiative ID
7. Commit.

### Chunk 2: Progress hook

Commit: `feat(learn): add usePlaybookProgress hook`

1. Clone `useLeverProgress.js` → `usePlaybookProgress.js`. Rename storage key + methods.
2. Colocated test file, 6 tests. **One must be a full remount round-trip** (write → unmount → remount → assert UI reflects persisted state). This is the Bridge Phase 2 lesson.
3. Commit.

### Chunk 3: List view

Commit: `feat(learn): add playbook list view`

1. Create `PlaybookList.jsx` as near-clone of `LeverList.jsx`. Grid of 9 cards.
2. Each card shows: company name, industry, entry revenue, exit target, playbook tagline (e.g., "Pricing + Growth + M&A").
3. Add 2 routes to `App.jsx`.
4. Add location checks + conditional render to `LearnModule.jsx`.
5. Stub `PlaybookDetail.jsx` as placeholder.
6. Add "Playbooks" link to `LearnNav.jsx` under Value Creation group.
7. Manual visual check: `npm run dev`. Verify grid renders, routing works, dark mode clean, mobile sidebar works.
8. Commit.

### Chunk 4: Detail view (read-only phases + initiatives)

Commit: `feat(learn): add playbook detail with phases and initiatives`

1. Replace `PlaybookDetail.jsx` stub with 3-phase layout.
2. Extract `PhaseBlock.jsx` (objective, expected value creation callout, list of `InitiativeCard`s).
3. Extract `InitiativeCard.jsx` (name, lever link, owner, timeline, resources, success metrics list, dependencies).
4. "View Lever →" link wires to `/learn/levers/:leverId`.
5. Golden Year panel renders at the bottom of detail.
6. Prev/Next playbook navigation by array index.
7. Manual visual check: `npm run dev` through all 9 playbooks. First-paint review (catches default-state issues per Bridge Phase 2 lesson).
8. Commit.

### Chunk 5: Exercise + LLM grading

Commit: `feat(learn): add playbook Golden Year exercise with LLM grading`

1. Add commit-first exercise at bottom of detail view: "Would you deploy this playbook as written? What's your top execution risk?"
2. 50-character minimum gate (matches Lever exercise).
3. Wire `evaluateAnswer()` with acceptance criteria from playbook data.
4. Render `LLMFeedback.jsx` component (score, strengths, gaps, suggestion).
5. Persist attempt + score to `forge-playbooks` via `usePlaybookProgress`.
6. Commit.

### Chunk 6: Tests + integration + ship

Commit: `test(learn): add playbook integration tests and route coverage`

1. 12 component tests in `PlaybookDetail.test.jsx`:
   - list renders 9
   - detail renders 3 phases
   - initiative cards render all fields
   - lever link navigates
   - dependencies display correctly
   - Golden Year panel renders
   - exercise commit gate at 50 chars
   - LLM score badge renders after grading
   - prev/next nav
   - progress persists (write-side)
   - **progress rehydrates on remount** (read-side, end-to-end — Bridge P2 lesson)
   - invalid playbookId shows not-found state
2. 5 route tests: `/learn/playbooks` list, `/learn/playbooks/:id` detail, invalid id, deep-link reload, back nav.
3. 2 LearnNav tests: active highlight, keyboard shortcut navigation.
4. Full suite: `npm test`. Expect ~310 passing (282 Levers baseline + ~28 new).
5. `npm run build`.
6. `npm run lint`.
7. Commit.
8. Push branch, open PR referencing parent plan.

## Test matrix (28 paths)

| # | Test | File | Chunk |
|---|---|---|---|
| 1 | 9 playbooks exist | dataIntegrity.test.js | 1 |
| 2 | unique playbook IDs | " | 1 |
| 3 | canonical companyIds resolve | " | 1 |
| 4 | 3 phases per playbook | " | 1 |
| 5 | 2+ initiatives per phase | " | 1 |
| 6 | initiative required fields | " | 1 |
| 7 | leverIds resolve to live lever | " | 1 |
| 8 | dependencies resolve to sibling initiatives | " | 1 |
| 9 | progress hook load/save | usePlaybookProgress.test.js | 2 |
| 10 | progress round-trip on remount | " | 2 |
| 11 | notes round-trip | " | 2 |
| 12 | score write | " | 2 |
| 13 | goldenYearGuess persists | " | 2 |
| 14 | storage key isolation from forge-levers | " | 2 |
| 15 | PlaybookList renders 9 | PlaybookDetail.test.jsx | 3/6 |
| 16 | company info on cards | " | 3 |
| 17 | detail renders 3 phases | " | 4 |
| 18 | InitiativeCard shows all fields | " | 4 |
| 19 | lever "View →" link target | " | 4 |
| 20 | dependencies section renders | " | 4 |
| 21 | Golden Year panel renders | " | 4 |
| 22 | exercise commit gate at 50 chars | " | 5 |
| 23 | LLM score badge after grading | " | 5 |
| 24 | progress rehydrates on remount (UI) | " | 6 |
| 25 | invalid playbookId not-found state | route test | 6 |
| 26 | deep-link reload | " | 6 |
| 27 | LearnNav active highlight | LearnNav test | 6 |
| 28 | prev/next playbook nav | PlaybookDetail.test.jsx | 4 |

## Risks

1. **Scope drift on the 100-day builder.** D3 explicitly defers it. If mid-session the user wants it, add Chunk 7 and extend estimate by 4 hours. Do not silently absorb (Levers P1 lesson).
2. **`playbooks.js` at ~1800 lines** exceeds the 300-line file rule. Intentional for data files. Flag in PR, matches precedent set by `valueLevers.js` and `valueBridge.js`.
3. **`PlaybookDetail.jsx` at ~350 lines** overshoots 300-line soft limit. PhaseBlock + InitiativeCard extractions keep the main file near 250. If it still overshoots, split out `GoldenYearPanel.jsx`.
4. **Lever ID drift between parent plan draft and live `valueLevers.js`.** Chunk 1 task 1 validates before data is written.
5. **Default-state visual bugs** (Bridge P2 lesson). Chunk 4 task 7 mandates first-paint review through all 9 playbooks in light + dark mode.
6. **LLM grading variance** on qualitative exercise. Mitigation: dev-test one playbook exercise end-to-end before filling rubrics for all 9.

## Estimate

6 commits, 5-7 hours focused work. Data file is long pole (~2.5 hours). Components and tests fast because near-clones of Levers pattern. D3 (defer builder) is the unlock — bundling it pushes to 10+ hours and 10+ commits.

## Resume instructions

1. Verify branch: `git status` on `feat/value-creation-playbooks`, tree clean.
2. Confirm D1-D5 decisions with user.
3. Validate lever IDs from parent plan against live `valueLevers.js` (Chunk 1, task 1).
4. Start Chunk 1, task 2 (Summit playbook fully written as exemplar).

## Open questions for user

1. **D3 — ship read-only playbooks first, or bundle interactive 100-day builder now?** Recommend defer. Your call.
2. **D5 — one lightweight exercise per playbook, or skip exercises entirely in v1?** Recommend one exercise (commit-first flow is the Forge identity).
3. **Tier 2 workflow — run `/plan-eng-review` on this plan before starting Chunk 1?** CLAUDE.md says "If plan is hand-wavy or new territory." This plan is tight but Playbooks is a new domain. Lean yes.
