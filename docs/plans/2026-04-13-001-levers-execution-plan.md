---
title: "feat: Value Creation Levers — Execution Plan (Phase 1)"
type: execution-plan
status: in-progress
date: 2026-04-13
branch: feat/value-creation-levers
parent_plan: 2026-03-29-002-feat-value-creation-learn-sections.md
---

## Session resume state (paused 2026-04-13 evening)

**Branch:** `feat/value-creation-levers` (8 commits ahead of main)

**Chunks complete:**
- Chunk 1: 15-lever data file (expanded from 12 per 2026 research, +strategic category)
- Chunk 2: useLeverProgress hook
- Chunk 3: LeverList grid + routing + nav wiring (+ card visibility style fix)
- Chunk 4: LeverCard detail view + 12 component tests

**Chunk 5 remaining:**
- Route tests (/learn/levers mounts list, /learn/levers/:id mounts card, invalid id, deep-link, back nav)
- Additional integration tests per the 28-path matrix
- `npm run build` + `npm run lint` pass
- Push branch
- Open PR referencing parent plan

**Tests:** 282/282 passing at pause.

**D1-D4 decisions:** all approved and implemented.

**Scope expansion mid-session:** user approved shipping the complete 15-lever framework (was 12) with a new `strategic` category and 2026 research calibration. Still one PR, not split.

**Research doc landed mid-session:** `PE Value Creation Levers Review.md` at repo root. Scope and content expansion driven from this.

**Resume command:** "resume levers Chunk 5" or "push the Levers PR"

---


# Value Creation Levers — Execution Plan

Execution-ready breakdown of Phase 1 (Levers) from the parent plan. CEO and Eng reviews already cleared Phase 1; this file turns the cleared scope into file-by-file micro-tasks. Phases 2-4 (Bridge, Playbooks, Roll-ups) are explicitly out of scope.

## Status

- Branch `feat/value-creation-levers` cut from main at commit `ea02c91`.
- D1-D4 decisions below are pending user signoff before Chunk 1 starts.

## Recon findings

### Canonical company IDs (from `src/data/companies.js`)

The parent plan used shortened IDs. Real IDs are longer:

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

This was the CEO review's #1 flagged item. Data integrity test 6 catches drift.

### Pattern to clone

`ConceptCard.jsx` + `ConceptList.jsx` + `useConceptProgress.js` ship the exact pattern we need. Lever components should be near-clones:

- `ConceptCard.jsx` (300 lines) ... template for `LeverCard.jsx`
- `ConceptList.jsx` (67 lines) ... template for `LeverList.jsx`
- `useConceptProgress.js` (99 lines) ... template for `useLeverProgress.js`

Routes in `App.jsx` lines 235-239 show how learn routes wire through `LearnModule`. Add 2 lines for levers.

`LearnModule.jsx` uses location checks to pick which child to render. Add 2 checks for levers matching the concept pattern (lines 28-29).

`LearnNav.jsx` has a bottom link group with Concepts + Compare. Add a third link for Levers under a "Value Creation" label.

## Architecture decisions (deviations from draft plan, pending signoff)

### D1. Use `resolveDataPath` against live companies, not hardcoded metric strings

- **Draft says:** `currentMetrics: { revenue: "$32.5M", ebitdaMargin: "18.5%" }`
- **Recommend:** `dataPoints: [{ label: "Revenue", path: "financials.incomeStatement.revenue" }]` matching ConceptCard.
- **Why:** stays in sync with `companies.js`, no drift risk.
- **Cost:** slightly more work writing the data file.

### D2. Create `useLeverProgress.js` new hook (breaks eng review "no new hooks" rule)

- **Why:** needs its own localStorage key `forge-levers` for isolation. `useConceptProgress` already broke the rule; levers should follow suit.
- **Alternative:** cram into `useConceptProgress` with a type discriminator (worse; mixes domains).

### D3. Use acceptance criteria AS the model answer for LLM grading

- **Gap in draft:** `exercise: { type, prompt, acceptanceCriteria }` has no `modelAnswer` field. `evaluateAnswer()` needs one.
- **Recommend:** build model answer from criteria at render time: `"A strong answer addresses: 1) [criterion]. 2) [criterion]. ..."`.
- **Why:** criteria are the rubric. Cleaner pedagogy than a hand-written model answer.

### D4. Skip acceptance-criteria checklist + self-score UI

- **Draft has:** user checks off criteria + rates self 1-5.
- **Recommend:** drop it. LLM grading already gives 1-5 + model answer. Checklist adds noise.
- **Add later if wanted:** ~30 min + 2 tests.

## File structure

### New (5)

| File | Size | Purpose |
|---|---|---|
| `src/data/valueLevers.js` | ~900 lines | 12 lever objects w/ canonical companyIds + dataPoints |
| `src/hooks/useLeverProgress.js` | ~100 lines | Near-clone of useConceptProgress, storage key `forge-levers` |
| `src/components/learn/LeverList.jsx` | ~80 lines | Grid grouped by category |
| `src/components/learn/LeverCard.jsx` | ~300 lines | Detail view, mirrors ConceptCard |
| `src/components/learn/LeverCard.test.jsx` | ~150 lines | 10 component tests |

### Modified (5)

| File | Change |
|---|---|
| `src/App.jsx` | +2 routes |
| `src/components/learn/LearnModule.jsx` | +3 location checks, +2 conditional renders |
| `src/components/learn/LearnNav.jsx` | +1 link group "Value Creation → Levers" |
| `src/test/dataIntegrity.test.js` | +7 data integrity tests |
| `src/hooks/useLeverProgress.test.js` | new, +6 integration tests |

## Micro-task chunks

### Chunk 1: Data foundation

Commit: `feat(learn): add value creation levers data`

1. Create `valueLevers.js` skeleton + Pricing Optimization lever (sample, fully written)
2. Fill levers 2-4 (Sales Effectiveness, Channel Expansion, Cross-Sell) — revenue
3. Fill levers 5-8 (Procurement, Labor, Automation, Facility) — margin
4. Fill levers 9-11 (Management, Incentives, Financial Controls) — organizational
5. Fill lever 12 (AI & Software) — technology
6. Add 7 data integrity tests (count, unique ids, category enum, 2 examples each, canonical companyIds, paths resolve, non-empty criteria)
7. Commit

### Chunk 2: Progress hook

Commit: `feat(learn): add useLeverProgress hook`

1. Clone `useConceptProgress.js` → `useLeverProgress.js`, rename storage key + methods
2. Colocated test file, 6 tests mirroring useLearnProgress test structure
3. Commit

### Chunk 3: List view

Commit: `feat(learn): add lever list grid view`

1. Create `LeverList.jsx` clone of ConceptList, group by category
2. Category color map at top (revenue, margin, organizational, technology)
3. Add 2 routes to `App.jsx`
4. Add location checks + conditional render to `LearnModule.jsx`
5. Stub `LeverCard.jsx` as placeholder
6. Add "Value Creation" link group to `LearnNav.jsx`
7. Manual visual check: `npm run dev`, verify grid + routing
8. Commit

### Chunk 4: Detail view

Commit: `feat(learn): add lever detail view with exercise`

1. Replace LeverCard stub with ConceptCard clone
2. Rename symbols: cardId→leverId, CONCEPT_CARDS→VALUE_LEVERS, etc.
3. Replace "Why It Matters" with "When to Deploy"
4. Add "Typical Impact" 3-row table
5. Replace "How to Spot It" with "Business Type Fit"
6. Keep "Red Flags" section as-is
7. Rewrite "Company Examples" with dataPoints + "See Company →" link
8. Practice section: rebuild model answer from acceptance criteria at render
9. Prev/Next navigation by array index
10. Create LeverCard.test.jsx with 10 tests
11. Commit

### Chunk 5: Integration + ship

Commit: `test(learn): add lever integration tests and route coverage`

1. 5 route tests
2. 6 integration tests
3. Full suite: `npm test` (expect 232 passing)
4. `npm run build`
5. `npm run lint`
6. Commit
7. Push branch, open PR

## Test matrix (28 paths)

| # | Test | File | Chunk |
|---|---|---|---|
| 1 | 12 lever count | dataIntegrity.test.js | 1 |
| 2 | unique IDs | " | 1 |
| 3 | category enum | " | 1 |
| 4 | 2 examples per lever | " | 1 |
| 5 | canonical companyIds | " | 1 |
| 6 | dataPoints paths resolve | " | 1 |
| 7 | non-empty acceptance criteria | " | 1 |
| 8 | LeverList renders 12 | LeverCard.test.jsx | 3/4 |
| 9 | category grouping | " | 3 |
| 10 | LeverCard all sections | " | 4 |
| 11 | business type fit chips | " | 4 |
| 12 | red flag rendering | " | 4 |
| 13 | company examples with real data | " | 4 |
| 14 | commit gate at 50 chars | " | 4 |
| 15 | LLM score badge | " | 4 |
| 16 | "See Company" links | " | 4 |
| 17 | prev/next nav | " | 4 |
| 18 | /learn/levers mounts list | route test | 5 |
| 19 | /learn/levers/:id mounts card | " | 5 |
| 20 | invalid leverId | " | 5 |
| 21 | deep-link reload | " | 5 |
| 22 | back nav | " | 5 |
| 23 | progress persists | useLeverProgress.test.js | 2/5 |
| 24 | exercise writes to forge-levers | " | 5 |
| 25 | notes round-trip | " | 5 |
| 26 | LearnNav highlights active | LearnNav test | 5 |
| 27 | keyboard shortcuts | " | 5 |
| 28 | dark mode | visual | 5 |

## Risks

1. **dataPoints path validation catches content drift** at test time. Non-negotiable.
2. **LLM grading with generated model answer is untested.** Mitigation: dev first lever end-to-end, validate grading quality on 3-4 real answers before writing all 12.
3. **valueLevers.js ~900 lines exceeds 300-line file rule.** Intentional for data files. Flag in PR.
4. **LeverCard.jsx ~300 lines at soft limit.** If it overshoots, split out LeverSections.jsx.

## Estimate

5 commits, 4-6 hours focused work. Data file is the long pole (~2 hours). Components and tests fast because near-clones.

## Resume instructions

1. Verify branch: `git status` on `feat/value-creation-levers`, tree clean.
2. Confirm D1-D4 decisions.
3. Start Chunk 1, task 1.1.
