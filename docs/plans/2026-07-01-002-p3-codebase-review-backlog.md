---
Created: 2026-07-01
Tier: n/a (reference backlog, not an active plan)
Linear Project: Forge
Linear Issue: none — these were filed to Linear (MCR-477 through MCR-512) then canceled per user request; this file is the sole live reference
Task: P3 (polish) findings from the full codebase health audit, kept for later triage
---

# P3 Backlog: Forge Codebase Health Review

Source: [2026-07-01-001-codebase-review.md](2026-07-01-001-codebase-review.md) (P1/P2 findings still live in Linear as MCR-386 through MCR-470). These 13 P3 items were briefly filed as Linear issues and canceled there to keep the backlog free of low-severity noise; this file is the reference copy. Pull any of these back into Linear when picked up.

## P3-1. Serverless boilerplate (getEnv, getClient, auth check) duplicated verbatim across all three API routes

**Sites:** `api/evaluate.js:5,80`, `api/chat.js:4,24` (comments "same pattern as evaluate.js"), `api/generate.js:3,197`; drift: a dead method check, three log-prefix conventions.
**Fix:** `app/api/_lib/anthropic.js` exporting getEnv, getClient, requireForgeToken (Vercel does not route underscore-prefixed paths). Auth code especially must not fork (a timing-safe-compare fix must land in one place). Standard: Code Standards shared helper; Environment/Config.

## P3-2. Test placement split-brain: 28 files in src/test/ vs 15 colocated, against the documented colocation convention

**Sites:** like-for-like splits: `components/learn/PlaybookDetail.test.jsx` (colocated) vs `src/test/LeverCard.test.jsx`; `hooks/useScoring.test.js` + `useScoring.hook.test.js` (two files, two naming schemes). Standard: Testing "Colocated test files (thing.test.js)".
**Fix:** Move component/hook/util tests next to their subjects; src/test/ keeps harness files (renderWithProviders, test-setup) plus genuinely cross-cutting suites (dataIntegrity, api*.test.js). Merge the two useScoring files.

## P3-3. Default exports are universal (61 components and hooks) despite AGENTS.md mandating named exports

**Sites:** effectively all of src/components/ and src/hooks/ (exceptions: LLMFeedback.jsx, the two context files, CHAT_MODES). The mismatch already bites: `OnboardingContext.jsx:2` aliases its import because the default collides with the context's named useOnboarding. Standard: Code Standards "Named exports over default exports".
**Fix:** Decide once. Given sole-builder velocity, amending the standard (a Key Decisions row) is the cheaper convergence; if converging on named instead, note the useOnboarding identifier collision needs a rename, then enforce with ESLint import/no-default-export.

## P3-4. Inline styles at 13 sites including a hardcoded hex that fights the token class on the same element

**Sites:** 13 `style={{...}}` occurrences (several are genuinely dynamic widths, acceptable exceptions to judge individually); the hex-vs-token conflict site is the clear fix. Standard: Do NOT "No inline styles"; Styling tokens.
**Fix:** Replace static inline styles with classes; keep only computed values (width percentages) inline; kill the hardcoded hex.

## P3-5. Memoization defeated by unstable identities: useLearnProgress returns a fresh object per render used as a useMemo dep; OnboardingContext value unmemoized

**Sites:** `useLearnProgress.js` return object, `getWeakSpots()` fresh array as dep, `OnboardingContext.jsx` value. Standard: state/dispatch split intent.
**Fix:** useMemo the hook return values and context values; falls out naturally from the ScoringContext and progress-hook-factory work tracked in MCR-404 / MCR-423.
**Note:** never filed to Linear (hit the workspace's free-tier issue cap mid-run); this file is its only record.

## P3-6. Per-input-event localStorage writes: BridgeCalculator serializes the whole progress object on every slider event during a drag, and useNotes does the same on every keystroke

**Sites:** `learn/BridgeCalculator.jsx:93-98` + `useBridgeProgress.js:89-108` (persistence side effect runs inside the setProgress updater, double-firing in dev StrictMode and violating updater purity), `useNotes.js:41-50` via `NotesBlock.jsx:12` (ConceptCard, LeverCard, LearnSection, ComparisonView) and `BridgeCalculator.jsx:248`. Standard: localStorage churn discipline.
**Fix:** A debounced-persistence option in the shared storage util tracked in MCR-416 (e.g. 300ms trailing write); move the save out of the state updater.

## P3-7. Dead exports: BRIDGE_SCENARIO_IDS and INITIATIVE_TEMPLATES have zero consumers; validateMergedData is test-only

**Sites:** `data/valueBridge.js:337`, `data/playbooks.js:2058-2089` (31 lines commented "deferred to Phase 3.5"), `utils/scenarios.js:45` (imported only by its own test, so it validates nothing in production). Verified by grep across the whole tree including tests and index.html. Standard: dead code; Elegant > simple.
**Fix:** Delete BRIDGE_SCENARIO_IDS and INITIATIVE_TEMPLATES (recover from git or the Phase 3.5 Linear issue); for validateMergedData either call it inside mergeScenario in dev builds or delete it with its describe block.

## P3-8. QuickFireScreen hand-rolls a setInterval countdown instead of parameterizing useTimer

**Sites:** `QuickFireScreen.jsx:20-43` (verified: local intervalRef/expiry/cleanup) parallel to `useTimer.js:16`. The hand-rolled copy is the untested one. Standard: timer math belongs in hooks/; must-test timer behavior.
**Fix:** Extend useTimer with `{ seconds, countdown }` returning remaining/isExpired/restart; consume in QuickFireScreen; do together with the real-useTimer-tests work tracked in MCR-459.

## P3-9. Repeated JSX: red/green flags panel duplicated between PracticeScreen and QuickFireScreen (headings already drifted), keyword-fallback block pasted twice inside QuestionCard

**Sites:** `App.jsx:734-757` vs `QuickFireScreen.jsx:183-206` (verified near-identical); `QuestionCard.jsx:237-249` == `:295-307`. Standard: repeated markup should be a component.
**Fix:** `FlagsPanel({ redFlags, greenFlags, compact })`; hoist the fallback into one JSX const.

## P3-10. Icon-only buttons lack accessible names; all 54 Material Symbols ligature spans lack aria-hidden; AppShell ships two inert decorative buttons

**Sites:** across components/ (54 icon spans; icon-only buttons in AppShell, SearchModal, ChatDrawer). Standard: semantic HTML, keyboard access.
**Fix:** aria-label on icon-only buttons, aria-hidden="true" on ligature spans (a small Icon component wrapping the span makes this one change), delete or label the inert buttons.

## P3-11. Two competing numeric-typography patterns: undeclared font-mono (19 files) vs tabular-nums (3 sites)

**Standard:** Styling fonts (Manrope/Inter/Material Symbols only; font-mono falls through to the browser default stack, which is none of them).
**Fix:** Converge on `tabular-nums` with Inter for numeric alignment; sweep font-mono off.

## P3-12. useTheme and useNotes are untested; useNotes' corrupt-data backup contract has no test despite the repo's explicit "test the backup contract" learning

**Sites:** verified: zero test references to useTheme/forge-theme; `useNotes.js:19-21` backup write untested. Standard: Compound Learnings backup-contract and round-trip rules.
**Fix:** useNotes.test.js on the useChatMode.test.js pattern (round-trip with remount, corrupt JSON asserts -corrupt-backup bytes, quota-throw no-crash); small useTheme.test.js.

## P3-13. Five test files hand-roll an identical localStorageMock and force-redefine globalThis.localStorage over the setup-file shim

**Sites:** `useScoring.test.js:5`, `useLearnProgress.test.js:5`, `useLeverProgress.test.js:6`, `usePlaybookProgress.test.js:10`, `PlaybookDetail.test.jsx:14` (verified: exactly these 5). Standard: test-setup.js is the documented canonical shim (Node webstorage learning).
**Fix:** Delete the per-file mocks; use the shim + `localStorage.clear()` in beforeEach (the useBridgeProgress.test.js pattern); where setItem spying is needed, one shared helper in src/test/.

## Canceled Linear issues (reference)

| ID | Title |
|---|---|
| MCR-477 | Serverless boilerplate duplicated across API routes |
| MCR-483 | Test placement split-brain |
| MCR-489 | Default exports universal despite named-export standard |
| MCR-492 | Inline styles at 13 sites |
| MCR-495 | Per-input-event localStorage writes |
| MCR-498 | Dead exports (BRIDGE_SCENARIO_IDS, INITIATIVE_TEMPLATES, validateMergedData) |
| MCR-501 | QuickFireScreen hand-rolled countdown |
| MCR-504 | Repeated JSX (flags panel, keyword fallback) |
| MCR-505 | Icon accessibility gaps |
| MCR-507 | font-mono vs tabular-nums |
| MCR-509 | useTheme/useNotes untested |
| MCR-512 | Duplicate localStorageMock in 5 test files |

(P3-5 was never filed — the workspace's free-tier issue cap was hit mid-run.)
