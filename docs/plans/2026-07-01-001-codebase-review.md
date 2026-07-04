---
Created: 2026-07-01
Tier: n/a (report-only health audit)
Linear Project: Forge
Linear Issue: none (findings to be filed individually after triage)
Task: Full codebase health audit of app/ against the AGENTS.md standards contract
---

# Forge Codebase Health Review

**Scope:** everything under `app/` (api/, src/components/, src/hooks/, src/utils/, src/data/, src/contexts/, src/test/). Report-only; no code changed.

**Method:** six parallel dimension reviews (structure and duplication, consistency, performance, data and security, test quality, UI standards), then adversarial verification of every finding against the actual code. 60 agents ran; 27 findings were machine-verified, and the remaining 27 (verifiers hit a rate limit) were verified by hand afterward: every grep re-run, every cited line re-read, and the EBITDA reconciliation math re-executed against `companies.js`. Zero findings were refuted outright; six were adjusted (corrections incorporated below). Findings sharing a root cause are merged, so each item below stands alone as a Linear issue.

**Suite status at audit time:** 43 test files, 479 tests, all green, none skipped.

## Health summary

The codebase is healthy at the leaf level: small focused components, a real utils layer, no direct localStorage access from components, genuinely good persistence discipline (parse once in initializers, write only on state change), and a server surface with typed validation and no key leakage. The problems are the compound interest of "clone the proven scaffold and move on" without a consolidation pass: four mature clone families (progress hooks, LLM-eval state machines, localStorage IO, serverless boilerplate), a canonical formatter half the app bypasses (producing one live wrong-output bug), a token system with a 52-site raw-palette residue (producing genuinely unreadable dark-mode surfaces), one 935 kB chunk, and, most seriously, core training data that fails the app's own EBITDA identity for 8 of 9 companies while the test suite checks exactly the one company that passes.

---

## P1: Correctness / Security

### P1-1. 8 of 9 companies' stated EBITDA does not reconcile to their own income statement; the integrity test cherry-picks the one company that passes

**Sites:** `app/src/data/companies.js` (keyMetrics blocks for summit-hvac, coastal-foods, precision-manufacturing, bright-dental, apex-logistics, truenorth-saas, vitality-vet, meridian-fulfillment), `app/src/test/dataIntegrity.test.js:157`
**Standard:** AGENTS.md Data (companies as canonical financials); Testing must-test "data integrity"; Compound Learning "when a reviewer flags a class of bug, walk the entire codebase for it".
**Why it matters:** Forge's product is teaching users to compute EBITDA from the statements. The app's own canonical identity (asserted in `dataIntegrity.test.js:157` and in `api/generate.js`'s SYSTEM_PROMPT: EBITDA = netIncome + interestExpense + depreciation + amortization) fails for 8 of 9 companies. Re-verified by direct computation on latest-year data: summit-hvac stated 4.6 vs computed 3.80; coastal-foods 2.9 vs 2.00; precision-manufacturing 3.6 vs 2.20; bright-dental 1.9 vs 1.60; apex-logistics 4.0 vs 3.40; truenorth-saas 2.6 vs 3.30 (stated is LOWER, so no add-back story explains the gaps); vitality-vet 1.7 vs 2.00; meridian-fulfillment 4.1 vs 3.90. Only ironclad-construction reconciles, and it is the only company the reconciliation test checks, while the adjusted-EBITDA test directly below it (`dataIntegrity.test.js:184`) already loops over all 9 companies, proving the all-company pattern was available. A trainee who computes correctly from the displayed statements gets scored "off" against model answers chained from the wrong figure.
**Fix:** Decide the canonical identity, then recompute either the income statements or keyMetrics so they reconcile for all 9 companies via a one-shot idempotent Node script (per the repo's own bulk-edit learning), update dependent question model answers, and generalize the Ironclad-only test into the same all-company loop the adjusted-EBITDA test uses. If stated EBITDA intentionally differs (e.g. excludes otherIncome), encode that definition in one shared helper and test against it instead.

### P1-2. /api/chat is an effectively unauthenticated general-purpose Claude proxy: client supplies the full system prompt, the shared token ships in the public JS bundle, and no endpoint has rate limiting

**Sites:** `app/api/chat.js:24,57,64`; token exposure: `app/src/utils/evaluateAnswer.js:10`, `app/src/App.jsx:396`, `app/src/components/learn/ChatDrawer.jsx:127`; same auth gate: `app/api/evaluate.js:80`, `app/api/generate.js:197`
**Standard:** AGENTS.md Key Decisions "API key security. Vercel function keeps key server-side"; Environment/Config "Client code never touches API keys".
**Why it matters:** `chat.js` accepts an arbitrary `systemPrompt` (up to 5000 chars) plus 20x2000-char messages from the request body and streams claude-haiku-4-5 output back, so anyone can repurpose it as a free general-purpose LLM proxy billed to the founder's ANTHROPIC_API_KEY. FORGE_AUTH_TOKEN does not mitigate: all three endpoints are fully open when it is unset (the gate is `if (process.env.FORGE_AUTH_TOKEN)`), and when set, the same shared secret is embedded in the public bundle as VITE_FORGE_AUTH_TOKEN, extractable by anyone who views source. No endpoint has rate limiting.
**Fix:** Move chat system prompts server-side: the client sends a context id / mode enum plus small validated params, and chat.js assembles the prompt from server-owned templates (the pattern evaluate.js already uses). Add per-IP rate limiting to all three endpoints (Vercel WAF rule or a lightweight token bucket). Document VITE_FORGE_AUTH_TOKEN as obfuscation, not auth (see P2-12).

### P1-3. Dark mode has genuinely unreadable core surfaces, and index.css lacks `@custom-variant dark`, so existing `dark:` classes track the OS instead of the app's theme toggle

**Sites (unreadable tier):** `app/src/components/FinancialTable.jsx:48,55,93,108,121` (bg-amber-50 highlight rows, ~1.6:1 contrast in dark mode on the core practice screen), `app/src/components/WeakSpotCard.jsx:7,8,15` (text-amber-900 on dark surface, ~2.1:1), `app/src/utils/format.js:104-109` (BAND_COLORS has no dark variants while its sibling BAND_CHIP_COLORS does), `app/src/components/DeltaDisplay.jsx:17`.
**Sites (latent toggle mismatch):** `app/src/index.css:1` (missing `@custom-variant dark (&:where(.dark, .dark *))`), `app/src/components/FinancialTable.jsx:123-127` and `app/src/utils/format.js:111-116` (existing `dark:` variants keyed to the media query, not the `.dark` class useTheme toggles).
**Standard:** AGENTS.md Styling "Tailwind CSS utility classes with design tokens (light + dark)"; Compound Learning on white-on-white cards.
**Why it matters:** The income statement and balance sheet total rows, the core practice surface, are unreadable in dark mode (measured ~1.6:1). Separately, because Tailwind v4 defaults `dark:` to prefers-color-scheme and index.css never rebinds it to the `.dark` class, every `dark:` variant in the app follows the OS setting rather than the in-app toggle: a light-OS user who toggles Forge dark gets light-mode chip colors on dark surfaces.
**Fix:** Add `@custom-variant dark (&:where(.dark, .dark *));` to index.css first (any dark: fix is broken without it), then fix the unreadable tier by replacing raw amber classes with token classes or adding dark: pairs, and give BAND_COLORS dark-safe values matching BAND_CHIP_COLORS. The broader raw-palette sweep is P2-10.

### P1-4. Currency/percent/multiple formatting bypasses canonical format.js across ~50 sites, and the bypass has already produced a live bug: Cmd+K search renders "$0.0M revenue" for every company

**Live bug:** `app/src/components/SearchModal.jsx:14` divides by 1e6 (`${(co.revenue / 1e6).toFixed(1)}M`) but `companies.js` stores revenue already in $M units (`revenue: 32.5`), so all 9 companies display "$0.0M revenue" on every search. CompanyCard.jsx:12 renders the same field correctly via `formatCurrency`. No test references SearchModal.
**Convergence sites:** `learn/BridgeWaterfall.jsx:19,22,43,75,136-137`, `learn/BridgeCalculator.jsx:167-172,190-197`, `learn/BridgeAttribution.jsx:50,53`, `learn/BridgeSliders.jsx:6,18,24`, `learn/BridgeExercise.jsx:11,30-62`, `learn/BridgeList.jsx:72`, `FinancialTable.jsx:56,142-147`, `CompanyCard.jsx:14-15`, `QuickFireScreen.jsx:125-130`.
**Standard:** AGENTS.md Data "Number formatting: $XM for currency, X% for percentages, Xx for multiples"; Code Standards shared-helper principle.
**Why it matters:** utils/format.js is the canonical formatter, but no currency/percent/multiple render anywhere in learn/ uses it (three learn files import format.js only for formatDataPoint/extractNumericValue/getDeltaBand). format.js exports no formatPercent or formatMultiple, so those are hand-rolled everywhere, and three components each invented their own signed-currency variant because formatCurrency renders negatives as "$-2.0M". Sign-handling has already drifted between copies (BridgeSliders shows "+" on multiples, BridgeExercise does not). The SearchModal bug is exactly the failure mode this fragmentation invites, and the next unit mistake has no central place to be caught.
**Fix:** One line for the live bug: `formatCurrency(co.revenue)` in SearchModal.jsx:14. Then add `formatPercent(val, { signed })`, `formatMultiple(val)`, and a signed option to `formatCurrency` (rendering "-$2.0M") in format.js, and sweep the listed sites onto them, deleting the three local signed formatters.

---

## P2: Performance / Structure

### P2-1. No route-level code splitting: the whole app, including ~400 kB of learn data and the react-markdown stack, ships as one 935 kB chunk

**Sites:** `app/src/App.jsx` (all eager imports), `app/vite.config.js`; weight drivers: `src/data/playbooks.js` (2089 lines), `learnContent.js` (1391), `valueLevers.js` (1136), `valueBridge.js`, `conceptCards.js`, the learn/ component tree (30 files), `QuickFireScreen`, `SearchModal`, onboarding/.
**Standard:** Key Decisions "SPA, no SSR needed" implies client bundle discipline; general Vite/React route-splitting practice.
**Why it matters:** A user landing on the practice flow pays for the entire learn curriculum, the markdown renderer, quick-fire, search, and onboarding up front. Verified build output: one 935 kB main chunk.
**Fix:** `React.lazy` + `Suspense` at the route level for the Learn module (which pulls all big data files with it), QuickFireScreen, SearchModal (lazy on first Cmd+K), and onboarding. This is the single biggest load-time lever and requires no restructuring beyond import sites (App.jsx split, P2-5, makes it cleaner but is not a prerequisite).

### P2-2. ScoringContext's state/dispatch split is defeated: the dispatch context carries session-dependent getters, so every score write re-renders every "dispatch-only" consumer including root App

**Sites:** `app/src/contexts/ScoringContext.jsx` (getter functions in the dispatch value), consumers re-invoking getters unmemoized in render bodies: `app/src/App.jsx`, `ProgressDashboard.jsx`, `WeakSpotCard.jsx`.
**Standard:** AGENTS.md Architecture "State/dispatch split context for scoring data"; the split's entire purpose.
**Why it matters:** The documented optimization is nominal. Because getters like getWeakSpots/getQuantitativeAccuracy close over sessions and live in the dispatch context value, that value's identity changes on every score write, re-rendering all dispatch consumers; and the getters are called during render without memoization, recomputing full-array aggregations per render.
**Fix:** Keep the dispatch context to stable-identity mutators only (addScore et al. wrapped in useCallback with no state deps). Move derived reads either into the state context as memoized selectors or into a `useScoringSelectors()` hook that useMemo-izes over sessions. Combine with P2-11 (inline selector drift) so all session math lands in one place.

### P2-3. useTimer lives at the App root: setElapsed re-renders the entire application tree every second during practice, and the interval keeps running after navigating away

**Sites:** `app/src/App.jsx` (useTimer at App level, timer threaded through the 19-prop drill), `app/src/hooks/useTimer.js:16`. Zero React.memo exists in the codebase to dampen the cascade.
**Standard:** AGENTS.md performance intent of the state/dispatch split; component-boundary discipline.
**Why it matters:** During a 15-minute session the whole unmemoized tree re-renders ~900 times, and the interval persists after leaving the practice screen because the timer's lifecycle is tied to App, not the practice route.
**Fix:** Move timer state into the practice subtree (falls out of the usePracticeSession extraction in P2-5) so ticks re-render only TimerBar and the practice screen, and stop/clean up the interval on route exit.

### P2-4. Shape validation is one level too shallow across persistence: version-stamped scoring data with `sessions:[null]` or `questions:null` throws at first paint, and three progress hooks crash on inner-null entries their hardened sibling guards against

**Sites (scoring):** `app/src/hooks/useScoring.js:78-95` (v2 path returns parsed as-is after top-level checks); crash sites `app/src/App.jsx:342,348`, `QuickFireScreen.jsx:13`, `useScoring.js:185,191,219`.
**Sites (progress hooks):** `useConceptProgress.js:96,101`, `usePlaybookProgress.js:121,126`, `useLeverProgress.js:102,107` (`Object.values(...).filter((c) => c.lastStudied)` with no null guard) vs the hardened `useBridgeProgress.js:111` (`filter((s) => s && s.lastStudied)`).
**Standard:** Compound Learning [2026-04-14] "inner values are also untrusted" (the exact class that bricked BridgeList once already); Error Handling.
**Why it matters:** `{"version":2,"sessions":[null],"streak":{}}` passes loadData and crashes inside a useMemo during HomeScreen render, bricking Home, Progress, and QuickFire until the key is hand-cleared. `{"cards":{"x":null}}` in forge-concepts throws in the Learn hub counts. This is the third occurrence of the same class; the codebase contains both the vulnerable and the hardened pattern side by side.
**Fix:** Sanitize once at load instead of null-guarding every consumer: in useScoring's loadData, map sessions through a normalizer that drops non-object sessions, coerces questions to an array of objects, validates streak shape, and falls back to DEFAULT_STATE (with corrupt-backup) if unrecoverable. In the progress hooks, make getCards/getPlaybooks/getLevers strip non-record values once (converging on the bridge pattern). Roll into the storage util in P2-6 so the fix is structural, not per-site.

### P2-5. App.jsx is a 798-line five-component monolith with 19-prop drilling and fetch logic inline

**Sites:** `app/src/App.jsx:54` (App), `:219` (AppShellWrapper), `:277` (PracticeRoute), `:323` (HomeScreen), `:637` (PracticeScreen); prop drill at `:192-212` (19 props into AppShellWrapper, 11 re-drilled into PracticeRoute); /api/generate fetch + reducer inline; AppShellWrapper also takes undestructured props (Code Standards violation).
**Standard:** File Structure "One component per file. Max 300 lines per file"; Code Standards props destructured in signature; layer drift (fetch/data transforms belong in hooks).
**Why it matters:** Every feature that touches practice flow edits this file; the 19-prop interface is a hand-rolled context; the ref-mirror workaround at :64-67 exists only to serve the drilling. It also blocks clean route splitting (P2-1) and timer containment (P2-3).
**Fix:** Split into `src/screens/HomeScreen.jsx`, `PracticeScreen.jsx`, `PracticeRoute.jsx`, plus `src/hooks/useCompanyGeneration.js` (reducer + fetch + abort) and `src/hooks/usePracticeSession.js` (selection, shuffled questions, timer, finish/summary). App.jsx keeps routing and providers only.

### P2-6. localStorage persistence idiom forked into two families: four hooks log corruption and write a `-corrupt-backup` key, six hooks silently swallow the same failures with copy-pasted helpers

**Sites:** canonical family: `useScoring.js:75`, `useLearnProgress.js:21` (warn + corrupt-backup + reset), `useNotes.js:8`, `useOnboarding.js:16`; silent family: `useLeverProgress.js:20`, `usePlaybookProgress.js:21`, `useConceptProgress.js:15`, `useBridgeProgress.js:5`, `useTheme.js:7`, `useChatMode.js:16` (comment-only catch blocks).
**Standard:** Error Handling "Never swallow errors. Every catch must handle, log, or rethrow"; Code Standards shared helper.
**Why it matters:** Ten hand-rolled try/getItem/parse/validate/fallback blocks with three divergent error strategies. The silent family violates the error-handling contract outright, discards user data without a trace, and skips the backup contract the repo's own compound learnings mandate.
**Fix:** Create `src/utils/storage.js` with `loadJSON(key, validate, fallback)` / `saveJSON(key, value)` implementing the canonical pattern (warn + corrupt-backup key + reset, per useLearnProgress). Point all 10 hooks at it. This is also the seam for P2-4's deep sanitize and P2-7's factory.

### P2-7. Four near-identical entity progress hooks (~500 lines wanting one factory), each instantiated per-component so co-mounted copies of the same key go stale; home-screen learn stats are visibly stale until reload

**Sites:** clones: `useLeverProgress.js`, `usePlaybookProgress.js`, `useConceptProgress.js` (byte-identical loadProgress/saveProgress/isRecord modulo one word, verified), plus divergent `useBridgeProgress.js`. Per-instance staleness: `App.jsx:71` (App's useLearnProgress copy hydrates once and feeds HomeScreen's learn ModuleCard at `:522-525`, stale after any learn activity, while SmartHomeRecommendations renders a fresh copy beside it), `LearnModule.jsx:25`. Same pattern in `useNotes.js:35` with 5 co-existing instances (LearnModule, ConceptCard, LeverCard, BridgeCalculator, ComparisonView), where a stale copy's full-object save can clobber notes written by another instance.
**Standard:** Code Standards shared helper; Compound Learning "clone proven component patterns aggressively" needs its consolidation half.
**Why it matters:** Beyond the duplication, per-instance `useState(loadProgress)` with no cross-instance sync is a correctness issue: the home screen shows stale learn progress, and useNotes has a real lost-write path (save serializes the whole stale object).
**Fix:** Extract `createProgressStore({ storageKey, containerKey, defaultRecord })` returning a shared module-level store (useSyncExternalStore or a single provider), so all consumers of one key share state. Canonical shape: usePlaybookProgress (has the isRecord guard and fullest default record). Each domain hook becomes a ~15-line wrapper. Give useNotes the same treatment. Deletes ~500 lines and fixes both staleness bugs.

### P2-8. LLM evaluation commit/reveal state machine duplicated across five components with drift: PlaybookDetail has no AbortController at all

**Sites:** `QuestionCard.jsx:17`, `learn/ConceptCard.jsx:22`, `learn/LeverCard.jsx:32`, `learn/LearnExercise.jsx:22`, `learn/PlaybookDetail.jsx:33` (same 6-variable state machine + evaluateAnswer call; PlaybookDetail.jsx:70-97 lacks the abort/staleness guard the others carry, so navigating mid-request sets state on a stale target).
**Standard:** Code Standards "colocate component-specific hooks in same file if small" (this outgrew small five files ago); Error Handling graceful degradation.
**Why it matters:** Five copies of loading/error/abort logic that have already diverged in the defensive details, which is exactly where divergence hurts.
**Fix:** Extract `useLLMEvaluation({ resetKey })` into src/hooks/ returning `{ phase, llmResult, llmLoading, llmError, reveal(payload), redo() }` with the abort lifecycle inside (canonical: QuestionCard's version, the most defensive). Deletes ~250 lines and fixes PlaybookDetail's missing abort.

### P2-9. Three API callers implement three different fetch/error patterns against the same `{error}` server contract, with the x-forge-token header hand-built at every site

**Sites:** `app/src/utils/evaluateAnswer.js` (canonical: typed errors, timeout), `app/src/App.jsx:396` (generate fetch inline in component), `app/src/components/learn/ChatDrawer.jsx:127` + `useChatContext.js` (SSE handling with its own header/error idiom).
**Standard:** Code Standards shared helper; Error Handling consistency.
**Why it matters:** The auth header and error-shape parsing are security- and contract-sensitive code duplicated with drift; a server-side change to the error shape now requires three client fixes.
**Fix:** A small `src/utils/api.js` exporting `forgeFetch(path, body, { stream })` that owns the header, timeout, and `{error}` parsing; evaluateAnswer's pattern is canonical. The generate call moves into useCompanyGeneration (P2-5).

### P2-10. 52 raw Tailwind palette sites bypass the MD3 token system; the missing piece is semantic success/warning tokens, and the score-badge chip ternary is copy-pasted 7x while a dark-safe canonical exists in format.js

**Sites:** 52 raw `-red|green|amber|orange-NNN` sites across src (verified grep), representative: `TimerBar.jsx:5,16`, `QuestionCard.jsx:154,177,195,335`, `LLMFeedback.jsx:4,39,53`, `CommitInput.jsx:48`, `learn/SimplePnL.jsx:41`, `learn/CalculationExercise.jsx:112`, `data/questionTypes.js:2-7`, plus the chip ternary duplicated 7x. index.css defines error/tertiary token families (used at 80+ sites) but no success/warning tokens, which is what forces green/amber semantics into raw palette.
**Standard:** AGENTS.md Styling "design tokens (light + dark)".
**Why it matters:** The token system is otherwise adopted; this residual pocket is where all the dark-mode misses live (P1-3 is its worst tier). Every new score chip or status color re-decides the palette by hand.
**Fix:** Add `--color-success`/`--color-warning` (+ on-/container variants) to index.css in both modes, extend BAND_CHIP_COLORS-style constants in format.js as the single chip source, replace the 7 chip ternaries with it, then sweep the 52 sites onto tokens. Do after P1-3's `@custom-variant dark` fix.

### P2-11. Session-derived selectors and score-aggregation math reimplemented inline in five components instead of living in useScoring

**Sites:** attempted-companies set derived three ways: `App.jsx:339-345`, `QuickFireScreen.jsx:13`, `onboarding/SmartHomeRecommendations.jsx:27-32` (verified all three); average-score math hand-rolled in `SessionSummary.jsx:9,30,75` (twice in one file), `ProgressDashboard.jsx:10`, `SmartHomeRecommendations.jsx:8`.
**Standard:** Code Standards layer drift ("scoring math rendered inline").
**Why it matters:** useScoring already owns the sibling selectors (getWeakSpots, getQuantitativeAccuracy); these strays will diverge from them (and from each other) the first time the sessions shape changes, and they are exactly the code P2-4's null-tolerance work must touch.
**Fix:** Add `getAttemptedCompanyIds()` and `averageScore(questions)` / `groupScoresByType()` selectors to useScoring (memoized per P2-2) and consume them at all sites.

### P2-12. AGENTS.md has drifted badly from the real tree, including security-relevant misdescriptions

**Sites:** AGENTS.md Architecture (omits `api/chat.js`, `api/generate.js`, playbooks.js, valueLevers.js, valueBridge.js, conceptCards.js, components/onboarding/, six hooks; says learn/ has 11 files, actual 30); Testing ("15 test files", actual 43); `AGENTS.md:205` "Auth: optional FORGE_AUTH_TOKEN header check (skipped in dev)" vs actual gate `if (process.env.FORGE_AUTH_TOKEN)` in all three handlers (skipped whenever unset, including production); Environment/Config omits VITE_FORGE_AUTH_TOKEN entirely.
**Standard:** AGENTS.md self-describes as the cross-tool source of truth; Project setup contract.
**Why it matters:** Every agent and reviewer plans against this map. The auth misdescription materially misstates the deployed threat model (see P1-2); the missing endpoints mean 2 of 3 server surfaces are invisible to a doc-driven security review; the test-count claim hides real gaps behind an undercount.
**Fix:** Regenerate Architecture and Testing from the actual tree; correct the auth sentence to "enforced only when FORGE_AUTH_TOKEN is set (any environment); VITE_FORGE_AUTH_TOKEN is embedded in the public bundle and is obfuscation, not auth"; add both env vars; add Key Mechanics entries for /api/chat and /api/generate. Edit only repo-specific sections (the canonical workflow block is deploy-managed).

### P2-13. /api/generate ships structurally unvalidated model JSON to the client, and known-inconsistent companies are returned with a `_warnings` field no client code reads

**Sites:** `app/api/generate.js:235-239` (returns `{ ...lastCompany, _warnings: lastWarnings }`), `:242-246` (comment: plain JSON parsed manually, structured outputs disabled due to grammar size), consumer `app/src/App.jsx:409`. Verified: zero `_warnings` reads in src/ (only api tests).
**Standard:** Error Handling "Never swallow errors ... User-facing: friendly messages"; Compound Learning write-only persistence class (data produced that nothing consumes).
**Why it matters:** checkCompanyConsistency validates arithmetic but not structural completeness: a company missing balanceSheet keys or with string-typed numbers passes to the client and crashes FinancialTable at render. And when consistency warnings do fire, the user practices on flagged-inconsistent financials with no indication.
**Fix:** Add a ~30-line server-side structural walker over CompanySchema's required lists with leaf type checks, returning 502 on failure; surface `_warnings` as a visible "AI-generated, unverified financials" banner on the practice screen or drop the ship-with-warnings fallback.

### P2-14. evaluate.js input validation is incomplete: questionText has no length cap and companyContext is interpolated into the paid prompt with zero validation

**Sites:** `app/api/evaluate.js:110-112` (questionText non-empty string check only), `:94` (companyContext destructured unvalidated), `:131` (interpolated `Company: ${companyContext || "N/A"}`). Verified against the file.
**Standard:** The endpoint's own convention (userAnswer/modelAnswer capped at MAX_FIELD_LENGTH); Key Decisions API key security.
**Why it matters:** A single request can stuff megabytes of attacker text into the model prompt on an endpoint that is open by default (P1-2), a per-request cost amplifier.
**Fix:** Apply the endpoint's existing three-line pattern to both remaining fields (length-cap questionText; type+length-check companyContext or require undefined).

### P2-15. Documented keyboard shortcuts "1-5 score" and "Enter reveal" are dead code, and Cmd+K has a duplicate global listener with an orphaned `__open` escape hatch

**Sites:** `app/src/hooks/useKeyboardShortcuts.js` (handlers nothing wires up), duplicate Cmd+K listeners (AppShell + SearchModal), the `__open` hatch.
**Standard:** AGENTS.md Navigation/Key Mechanics document these shortcuts as features.
**Why it matters:** Documented product behavior that does not work; dead hook code masquerading as coverage (its "test" is also green theater, P2-17).
**Fix:** Either wire 1-5/Enter into QuestionCard via useKeyboardShortcuts or delete the dead handlers and the doc claim; deduplicate the Cmd+K listener into one owner and remove `__open`.

### P2-16. No modal has dialog semantics, focus trap, or focus restore; SessionSummary and ChatDrawer do not close on Escape

**Sites:** `app/src/components/SearchModal.jsx`, `SessionSummary.jsx`, `learn/ChatDrawer.jsx`.
**Standard:** AGENTS.md UI keyboard-access expectations; semantic HTML.
**Why it matters:** Keyboard users can tab out of open modals into the page behind; Esc behavior is inconsistent across the three overlay surfaces.
**Fix:** One small `useDialog` hook (or native `<dialog>`) providing role="dialog", aria-modal, focus trap, focus restore, and Esc close; adopt in all three.

### P2-17. Test green theater: useTimer.test.js never imports useTimer, and useLearnProgress tests simulate hook logic inline

**Sites:** `app/src/hooks/useTimer.test.js` (verified: imports only vitest; defines its own formatTime, copy-pastes PACE_MILESTONES, asserts tautologies like `expect(900 >= limit).toBe(true)`), `useLearnProgress.test.js:102,174` ("simulate" blocks).
**Standard:** Testing must-test "timer behavior"; hooks convention "integration tests for hooks".
**Why it matters:** AGENTS.md counts useTimer among covered hooks, but the countdown, expiry flag, start/stop/reset, and clearInterval cleanup have zero real coverage; the file tests JavaScript's >= operator. This is the exact "asserting a guard exists rather than that it works" class.
**Fix:** Rewrite as renderHook tests driving vi.advanceTimersByTime and asserting formattedTime/progress/isExpired transitions and interval cleanup; replace the simulate blocks with real hook mounts; add a real useKeyboardShortcuts keydown test (or delete the hook per P2-15).

### P2-18. Scoring analytics (getWeakSpots, getScoresByType, getQuantitativeAccuracy) have zero tests, and getWeakSpots contains an undocumented 10-score gate contradicting AGENTS.md

**Sites:** `app/src/hooks/useScoring.js:188,199,216`; verified: no `*.test.*` file references any of the three. The `if (all.length < 10) return null` gate contradicts Key Mechanics "weak spots surface when avg score < 3.5 with 2+ attempts".
**Standard:** Testing must-test "Scoring logic".
**Why it matters:** These functions drive ProgressDashboard, WeakSpotCard, and the home dashboard; they are also the null-tolerance surface of P2-4. Untested plus doc-contradicting is how silent regressions ship.
**Fix:** Unit tests seeding sessions and asserting the gate, the <3.5/2+ surfacing, ascending sort, and delta==null skipping; fix or document the 10-score gate while writing them.

### P2-19. Core product surfaces have zero test coverage: QuestionCard (the commit-first gate), QuickFireScreen, App routing, SearchModal, ProgressDashboard, SessionSummary, AppShell

**Sites:** verified by grep: no test file references any of these components. `QuestionCard.jsx:183` (`disabled={!hasValidInput}`) is the product's number-one mechanic, untested; CommitInput tests cover only the child's char counter.
**Standard:** Key Mechanics "Commit-First Flow"; Testing coverage claims.
**Why it matters:** Coverage is inverted: peripheral learn components are heavily tested while the surfaces users touch every session have none. The SearchModal P1-4 bug shipping is the direct cost.
**Fix:** QuestionCard.test.jsx first (reveal gating below/above thresholds, scoring fires with right atomId/type), then a MemoryRouter route-smoke test and a QuickFireScreen timer/decision test with fake timers.

### P2-20. SSE chat contract is unasserted at the server end: apiChat tests check only status and headers, never reading the stream body

**Sites:** `app/src/test/apiChat.test.js:151-160` (verified: res.body never read), `app/api/chat.js:73,82` (delta/done/error frames and the 429 mapping, unasserted), `ChatDrawerAdvanced.test.jsx:108` (client parses fixtures the test invents; one assert-nothing test).
**Standard:** Testing must-test "LLM eval client handler"; Error Handling degradation paths.
**Why it matters:** Server could rename an event type and every test stays green while chat breaks; the exact mock-stubs-away-the-seam class the audit brief names.
**Fix:** Read res.body via getReader and assert emitted frames verbatim (delta, done, error/429); extract expected frame shapes into a shared fixture imported by both server and client tests.

### P2-21. 16 files exceed the 300-line cap with no stated exemption; LearnHub.jsx holds four components

**Sites:** data: playbooks.js 2089, learnContent.js 1391, valueLevers.js 1136, companies.js 729, conceptCards.js 416, valueBridge.js 337; code: App.jsx 798 (P2-5), LearnHub.jsx 524 (FocusView :115, JourneyView :284, ProgressRing :488), dataIntegrity.test.js 518, LeverCard.jsx 397, ChatDrawer.jsx 386, PlaybookDetail.jsx 375, generate.js 348, QuestionCard.jsx 344, useChatContext.js 334, ConceptCard.jsx 318.
**Standard:** File Structure "Max 300 lines per file. If longer, split. One component per file"; Key Decisions "If unsure whether to deviate, flag it during planning".
**Why it matters:** The standard was deviated from silently 16 times. Data files arguably deserve an exemption, but that decision was never recorded, so every future agent re-faces the same ambiguity.
**Fix:** (1) Add a Key Decisions row exempting src/data/ content files (or split playbooks.js by playbook into data/playbooks/*.js, the worst offender for review ergonomics); (2) split LearnHub into its four components; the rest shrink naturally via P2-5/P2-7/P2-8 extractions.

---

## P3: Polish

### P3-1. Serverless boilerplate (getEnv, getClient, auth check) duplicated verbatim across all three API routes with drift already visible

**Sites:** `api/evaluate.js:5,80`, `api/chat.js:4,24` (comments "same pattern as evaluate.js"), `api/generate.js:3,197`; drift: a dead method check, three log-prefix conventions.
**Fix:** `app/api/_lib/anthropic.js` exporting getEnv, getClient, requireForgeToken (Vercel does not route underscore-prefixed paths). Auth code especially must not fork (a timing-safe-compare fix must land in one place). Standard: Code Standards shared helper; Environment/Config.

### P3-2. Test placement split-brain: 28 files in src/test/ vs 15 colocated, against the documented colocation convention

**Sites:** like-for-like splits: `components/learn/PlaybookDetail.test.jsx` (colocated) vs `src/test/LeverCard.test.jsx`; `hooks/useScoring.test.js` + `useScoring.hook.test.js` (two files, two naming schemes). Standard: Testing "Colocated test files (thing.test.js)".
**Fix:** Move component/hook/util tests next to their subjects; src/test/ keeps harness files (renderWithProviders, test-setup) plus genuinely cross-cutting suites (dataIntegrity, api*.test.js). Merge the two useScoring files.

### P3-3. Default exports are universal (61 components and hooks) despite AGENTS.md mandating named exports

**Sites:** effectively all of src/components/ and src/hooks/ (exceptions: LLMFeedback.jsx, the two context files, CHAT_MODES). The mismatch already bites: `OnboardingContext.jsx:2` aliases its import because the default collides with the context's named useOnboarding. Standard: Code Standards "Named exports over default exports".
**Fix:** Decide once. Given sole-builder velocity, amending the standard (a Key Decisions row) is the cheaper convergence; if converging on named instead, note the useOnboarding identifier collision needs a rename, then enforce with ESLint import/no-default-export.

### P3-4. Inline styles at 13 sites including a hardcoded hex that fights the token class on the same element

**Sites:** 13 `style={{...}}` occurrences (several are genuinely dynamic widths, acceptable exceptions to judge individually); the hex-vs-token conflict site is the clear fix. Standard: Do NOT "No inline styles"; Styling tokens.
**Fix:** Replace static inline styles with classes; keep only computed values (width percentages) inline; kill the hardcoded hex.

### P3-5. Memoization defeated by unstable identities: useLearnProgress returns a fresh object per render used as a useMemo dep; OnboardingContext value unmemoized

**Sites:** `useLearnProgress.js` return object, `getWeakSpots()` fresh array as dep, `OnboardingContext.jsx` value. Standard: state/dispatch split intent.
**Fix:** useMemo the hook return values and context values; falls out naturally from P2-2/P2-7 restructuring.

### P3-6. Per-input-event localStorage writes: BridgeCalculator serializes the whole progress object on every slider event during a drag, and useNotes does the same on every keystroke

**Sites:** `learn/BridgeCalculator.jsx:93-98` + `useBridgeProgress.js:89-108` (persistence side effect runs inside the setProgress updater, double-firing in dev StrictMode and violating updater purity), `useNotes.js:41-50` via `NotesBlock.jsx:12` (ConceptCard, LeverCard, LearnSection, ComparisonView) and `BridgeCalculator.jsx:248`. Standard: localStorage churn discipline.
**Fix:** A debounced-persistence option in the P2-6 storage util (e.g. 300ms trailing write); move the save out of the state updater.

### P3-7. Dead exports: BRIDGE_SCENARIO_IDS and INITIATIVE_TEMPLATES have zero consumers; validateMergedData is test-only

**Sites:** `data/valueBridge.js:337`, `data/playbooks.js:2058-2089` (31 lines commented "deferred to Phase 3.5"), `utils/scenarios.js:45` (imported only by its own test, so it validates nothing in production). Verified by grep across the whole tree including tests and index.html. Standard: dead code; Elegant > simple.
**Fix:** Delete BRIDGE_SCENARIO_IDS and INITIATIVE_TEMPLATES (recover from git or the Phase 3.5 Linear issue); for validateMergedData either call it inside mergeScenario in dev builds or delete it with its describe block.

### P3-8. QuickFireScreen hand-rolls a setInterval countdown instead of parameterizing useTimer

**Sites:** `QuickFireScreen.jsx:20-43` (verified: local intervalRef/expiry/cleanup) parallel to `useTimer.js:16`. The hand-rolled copy is the untested one. Standard: timer math belongs in hooks/; must-test timer behavior.
**Fix:** Extend useTimer with `{ seconds, countdown }` returning remaining/isExpired/restart; consume in QuickFireScreen; do together with P2-17's real useTimer tests.

### P3-9. Repeated JSX: red/green flags panel duplicated between PracticeScreen and QuickFireScreen (headings already drifted), keyword-fallback block pasted twice inside QuestionCard

**Sites:** `App.jsx:734-757` vs `QuickFireScreen.jsx:183-206` (verified near-identical); `QuestionCard.jsx:237-249` == `:295-307`. Standard: repeated markup should be a component.
**Fix:** `FlagsPanel({ redFlags, greenFlags, compact })`; hoist the fallback into one JSX const.

### P3-10. Icon-only buttons lack accessible names; all 54 Material Symbols ligature spans lack aria-hidden; AppShell ships two inert decorative buttons

**Sites:** across components/ (54 icon spans; icon-only buttons in AppShell, SearchModal, ChatDrawer). Standard: semantic HTML, keyboard access.
**Fix:** aria-label on icon-only buttons, aria-hidden="true" on ligature spans (a Icon component wrapping the span makes this one change), delete or label the inert buttons.

### P3-11. Two competing numeric-typography patterns: undeclared font-mono (19 files) vs tabular-nums (3 sites)

**Standard:** Styling fonts (Manrope/Inter/Material Symbols only; font-mono falls through to the browser default stack, which is none of them).
**Fix:** Converge on `tabular-nums` with Inter for numeric alignment; sweep font-mono off.

### P3-12. useTheme and useNotes are untested; useNotes' corrupt-data backup contract has no test despite the repo's explicit "test the backup contract" learning

**Sites:** verified: zero test references to useTheme/forge-theme; `useNotes.js:19-21` backup write untested. Standard: Compound Learnings backup-contract and round-trip rules.
**Fix:** useNotes.test.js on the useChatMode.test.js pattern (round-trip with remount, corrupt JSON asserts -corrupt-backup bytes, quota-throw no-crash); small useTheme.test.js.

### P3-13. Five test files hand-roll an identical localStorageMock and force-redefine globalThis.localStorage over the setup-file shim

**Sites:** `useScoring.test.js:5`, `useLearnProgress.test.js:5`, `useLeverProgress.test.js:6`, `usePlaybookProgress.test.js:10`, `PlaybookDetail.test.jsx:14` (verified: exactly these 5). Standard: test-setup.js is the documented canonical shim (Node webstorage learning).
**Fix:** Delete the per-file mocks; use the shim + `localStorage.clear()` in beforeEach (the useBridgeProgress.test.js pattern); where setItem spying is needed, one shared helper in src/test/.

---

## Do these first: top 10 by leverage

1. **Fix the EBITDA data + generalize the reconciliation test** (P1-1). The product's core promise; the test change makes the fix permanent for all 9 companies and every future one.
2. **SearchModal one-liner + format.js convergence** (P1-4). Fixes a live user-visible bug immediately, then deletes ~50 hand-rolled formatters into 3 helpers.
3. **Add `@custom-variant dark` + fix the unreadable tier** (P1-3). One CSS line repairs the whole dark: variant class; the readability fixes are a handful of class swaps on core screens.
4. **Lock down /api/chat + extract api/_lib** (P1-2, P2-14, P3-1). Server-owned prompts, shared auth/env/client helpers, and the two missing field checks in one pass; closes the open-proxy hole and collapses three boilerplate copies.
5. **src/utils/storage.js + deep sanitize** (P2-6, P2-4, P3-6). One util replaces 10 hand-rolled IO blocks, fixes the sessions:[null] first-paint brick and the inner-null count crashes structurally, and gains the debounce seam.
6. **createProgressStore factory with shared instances** (P2-7). Deletes ~500 lines of byte-identical hooks and fixes two real bugs (stale home learn stats, useNotes clobber) in the same move.
7. **useLLMEvaluation hook** (P2-8). Deletes ~250 lines across five components and fixes PlaybookDetail's missing abort.
8. **Route-level code splitting** (P2-1). React.lazy on Learn/QuickFire/Search/onboarding; the single biggest load-time win, mostly import-site changes.
9. **Split App.jsx into screens + usePracticeSession/useCompanyGeneration** (P2-5, P2-3, P2-11). Kills the 19-prop drill, contains the every-second timer re-render to the practice subtree, and gives the inline fetch and selectors proper homes.
10. **Real useTimer tests + QuestionCard commit-first test** (P2-17, P2-19). Replaces the worst green theater and puts the product's number-one mechanic under test before any of the refactors above touch it.

Everything not fixed inline should be filed to Linear (Mcraygroup team); each finding above is written to stand alone as an issue.
