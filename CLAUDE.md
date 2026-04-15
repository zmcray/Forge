# CLAUDE.md — Forge

## Identity

Builder: Zack McRay — founder of McRay Group. Not an engineer, learns fast.

- Expert-level code. Never dumb it down. Elegant > simple.
- Explain the "why" on architecture decisions. One or two sentences max.
- Keep pace. Don't teach unless I ask.

## Project

- **Name:** Forge
- **What it is:** PE deal analysis practice tool. Trains LMM deal skills through realistic company scenarios with commit-first flow, LLM-powered feedback, and persistent scoring.
- **Live:** https://forge-six-kappa.vercel.app/
- **Stack:** Vite 8, React 19, Tailwind CSS v4, React Router 7, Vitest

## Build Tier

**Active Tier:** 2  |  **Set on:** 2026-04-12  |  **Reason:** Production app, significant features. Override to Tier 1 for new modules (e.g. new learning sections, new practice modes).
Override per-task by saying "this is a tier [X] task" — does not change the project default.

## Key Decisions

| Decision | Chose | Over | Why |
|----------|-------|------|-----|
| Framework | Vite + React 19 | Next.js | SPA, no SSR needed. Vercel serverless for API. |
| Language | JSX | TypeScript | Speed of iteration. Sole builder, no team handoff. |
| State | localStorage + Context | Backend DB | No auth, no multi-device sync needed yet. |
| Styling | Tailwind v4 + design tokens | CSS modules | Consistent with McRay stack. Token-based theming. |
| LLM eval | Claude Haiku via serverless | Client-side | API key security. Vercel function keeps key server-side. |
| Routing | React Router 7 (URL-based) | Hash routing | Clean URLs, SPA rewrites via vercel.json. |

## Code Standards

Defaults, not rules. Override in Key Decisions if a project needs a different approach. If unsure whether to deviate, flag it during planning — don't silently change.

### React / JSX
- Functional components only. No class components.
- Props destructured in function signature.
- Named exports over default exports.
- One component per file. Colocate component-specific hooks in same file if small.

### Styling
- Tailwind CSS utility classes with design tokens (light + dark).
- Material Design 3 tokens. Fonts: Manrope (headlines), Inter (body), Material Symbols (icons).
- Glassmorphism header, ghost borders, surface elevation hierarchy.
- No inline styles, CSS modules, or styled-components.

### Error Handling
- Never swallow errors. Every catch must handle, log, or rethrow.
- User-facing: friendly messages. Console: stack traces.
- LLM eval failures degrade gracefully (show keyword feedback instead).

### Data
- Company data in `src/data/companies.js`. 9 companies with full 2-year financials.
- 6 question types in `src/data/questionTypes.js`.
- Scenarios overlay base data via `mergeScenario()` with path validation.
- Number formatting: $XM for currency, X% for percentages, Xx for multiples.

### Environment/Config
- `app/.env` for local dev. `ANTHROPIC_API_KEY` (required), `FORGE_AUTH_TOKEN` (optional).
- On Vercel: set in project environment variables dashboard.
- No `NEXT_PUBLIC_` prefix (not Next.js). Client code never touches API keys.

### Dependencies
- Check if React/existing stack handles it before installing anything new.
- State the reason in the commit message. Prefer packages with >1K GitHub stars.

### File Structure
- `components/` (PascalCase), `hooks/`, `utils/`, `data/`, `contexts/`, `test/`.
- One component per file. Max 300 lines per file. If longer, split.
- All commands run from `app/` directory.

## Testing

**Must test:** Scoring logic, data integrity, LLM eval client handler, utility functions, timer behavior.
**Conventions:** Vitest. Colocated test files (`thing.test.js`). Integration tests for hooks, unit tests for utils.
**Coverage:** 15 test files across components, hooks, utils, and data integrity.
- Components: TimerBar, DeltaDisplay, CommitInput, FinancialTable, ComparisonList, ComparisonView, LLMFeedback, NotesBlock
- Hooks: useScoring, useTimer, useLearnProgress
- Utils: format (52 tests), scenarios, evaluateAnswer
- Data: dataIntegrity (validates all company profiles)

CI runs all tests via GitHub Actions on push/PR to main.

## Git & Commits

Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`. Atomic commits. Lowercase, no period, under 72 chars.

## Execution Rules

Rules that govern how code gets written, regardless of tier.

### TDD When It Matters
For tasks touching scoring logic, data transforms, LLM eval, or utility functions: write a failing test first, implement to pass, then refactor. Red-green-refactor. Commit after each green.

### Branch Isolation
Start each feature on a clean branch. Confirm tests pass before writing new code. Never work directly on main.

### Subagent Isolation
For multi-file tasks (3+ files), break into independent subtasks and execute each in a fresh subagent. One subtask per agent. Merge results at the end.

### Micro-Task Breakdown
During planning, break every implementation step into tasks that take 2-5 minutes each. Each task specifies: exact file paths, what changes, and how to verify it worked.

## Workflow — McRay Build Loop

### Tier 1: Full Build
1. `/plan-ceo-review` — Am I building the right thing? Selective expansion.
2. `/ultraplan` — Deep architectural plan.
3. `/plan-eng-review` — Stress-test before code.
4. Execute.
5. `/ce:review` + `/review` — CE parallel + GStack adversarial.
6. `/ce:compound` — Capture learnings.

### Tier 2: Significant Feature (default for Forge)
1. `/ultraplan` — Deep plan.
2. `/plan-eng-review` — If plan is hand-wavy or new territory.
3. Execute → `/ce:review` → `/ce:compound`.

### Tier 3: Quick Build
`/ce:plan` → Execute → `/ce:review`.

Decision rule: How much would it hurt if this shipped broken? A lot → T1. Some → T2. Not much → T3.
Plans go in `.claude/plans/` as `plan-YYYY-MM-DD-description.md`. Archive to `.claude/plans/archive/` after shipping.

## Architecture

```
forge/
  app/                            # Vite + React application
    api/
      evaluate.js                 # Vercel serverless: Claude-powered qualitative eval
    src/
      contexts/
        ScoringContext.jsx        # State/dispatch split context for scoring data
      data/
        companies.js              # 9 company profiles with full financials + questions
        questionTypes.js          # 6 question types (metric, adjustment, valuation, risk, diagnostic, thesis)
        learnContent.js           # Learn module content (3 sections, 10 subsections)
        scenarios.js              # 5 scenario overlays (what-if variations)
        comparisons.js            # Cross-company comparison data
      components/
        AppShell.jsx              # Sidebar nav + glassmorphism header (collapsible, mobile)
        FinancialTable.jsx        # Income statement, balance sheet, cash flow, key metrics
        QuestionCard.jsx          # Commit-first question flow with LLM feedback
        ProgressDashboard.jsx     # Persisted scoring dashboard with streak + accuracy
        CompanyCard.jsx           # Company selector card
        DeltaDisplay.jsx          # Quantitative answer comparison (your vs model)
        CommitInput.jsx           # Number or textarea with char counter
        TimerBar.jsx              # 15-minute countdown with pace milestones
        StatCard.jsx              # Dashboard stat card
        MasteryCard.jsx           # Mastery level card
        ModuleCard.jsx            # Module card with progress bar
        WeakSpotCard.jsx          # Focus areas by question type
        SessionSummary.jsx        # Post-session modal with copy-to-clipboard
        QuickFireScreen.jsx       # 60-second go/no-go screening mode
        SearchModal.jsx           # Cmd+K search across companies, metrics, learn
        LLMFeedback.jsx           # Structured feedback (score, strengths, gaps, suggestion)
        learn/                    # Learn module components (11 files)
      hooks/
        useScoring.js             # localStorage persistence, sessions, streak, weak spots
        useTimer.js               # Countdown timer with pace milestones
        useKeyboardShortcuts.js   # 1-5 score, Enter reveal, Esc back
        useLearnProgress.js       # Learn module progress tracking
        useTheme.js               # Dark mode toggle
        useNotes.js               # Per-lesson notes
      utils/
        format.js                 # formatCurrency, extractNumericValue, getDeltaBand, shuffleArray
        scenarios.js              # mergeScenario (deep merge with path validation)
        evaluateAnswer.js         # Client-side handler for /api/evaluate
        buildCompanyContext.js    # Company summary string for LLM context
        resolveDataPath.js        # Dot-notation path resolution
      test/
        renderWithProviders.jsx   # Test helper with ScoringProvider + MemoryRouter
        test-setup.js             # Vitest globals configuration
      App.jsx                     # Main orchestrator with React Router
      main.jsx                    # Vite entry point
      index.css                   # Tailwind import + design tokens
    index.html
    package.json
    vite.config.js
    vercel.json                   # SPA rewrite config
  docs/plans/                     # Feature planning docs
  docs/ideation/                  # Raw brainstorming notes
  mockups/                        # UI/UX reference mockups
  .github/workflows/ci.yml       # GitHub Actions: test + build on push/PR
```

## Key Mechanics

### Commit-First Flow
Users must enter an answer before revealing the model answer:
- Quantitative (metric, adjustment, valuation): number input required
- Qualitative (risk, diagnostic, thesis): minimum 50 characters required
- After reveal: side-by-side comparison with delta bands (exact/close/off/way off)
- Keyword feedback for qualitative: shows which key factors identified

### LLM Evaluation (Qualitative)
- Endpoint: `app/api/evaluate.js` (POST)
- Model: claude-haiku-4-5 with structured JSON output
- Returns: score (1-5), strengths[], gaps[], suggestion
- Client: `utils/evaluateAnswer.js` handles fetch, `LLMFeedback.jsx` renders results
- Auth: optional `FORGE_AUTH_TOKEN` header check (skipped in dev)

### Scoring & Persistence
- All scores in `localStorage` under key `forge-data`
- Schema: `{ sessions: [{date, companyId, duration, questions: [{type, score, delta, unit}]}], streak: {current, lastDate} }`
- Streak tracks consecutive practice days
- Weak spots surface when avg score < 3.5 with 2+ attempts

### Scenario System
- Overlay patches on base company data via `mergeScenario()`
- Path validation: throws if overlay references non-existent fields
- 5 scenarios: Coastal top customer, Summit flat growth, Precision owner exit, BrightSmile founder depart, Apex IC reclassification

### Quick Screen Mode
- 60-second timer per company, shuffled order
- Go/no-go decision with reasoning, results summary at end

### Navigation
- React Router: /, /practice/:companyId, /progress, /learn, /quickfire
- AppShell: collapsible sidebar (w-64 or w-16 icons-only), mobile hamburger
- Cmd+K / Ctrl+K search modal

## Dev Workflow
All commands run from `app/` directory:
- `npm run dev` ... Vite dev server with HMR
- `npm test` ... run all Vitest tests
- `npm run test:watch` ... Vitest in watch mode
- `npm run build` ... production build
- `npm run lint` ... ESLint check
- `npm run format` ... Prettier format check
- `npm run format:fix` ... Prettier auto-fix

## Company Data
9 companies with full financials (2-year income statement, balance sheet, cash flow, key metrics):
Summit Mechanical Services (HVAC, $32.5M), Coastal Fresh Foods (food distribution, $48.2M), Precision CNC Solutions (manufacturing, $12.8M), BrightSmile Dental Partners (dental rollup, $9.8M), Apex Last-Mile Logistics (delivery, $38.5M), TrueNorth Analytics (B2B SaaS, $14.2M), Ironclad Builders (commercial construction, $52.8M), Vitality Pet Wellness (veterinary rollup, $8.4M), Meridian Fulfillment Co. (e-commerce 3PL, $29.5M).

## Question Types
| Type | Input | Example |
|------|-------|---------|
| metric | quantitative | "What is the adjusted EBITDA margin?" |
| adjustment | quantitative | "Walk through the EBITDA add-backs" |
| valuation | quantitative | "What multiple range is appropriate?" |
| risk | qualitative | "What are the key risks?" |
| diagnostic | qualitative | "What would you investigate further?" |
| thesis | qualitative | "Would you invest? Why or why not?" |

## Compound Learnings

- [2026-04-13] pattern: Clone proven component patterns aggressively. LeverCard was a ~300-line near-verbatim clone of ConceptCard; entire detail view was written as one file because the scaffold was proven. Pays back 5x on subsequent features. (Source: levers Phase 1)
- [2026-04-13] testing: Validate cross-file data references via live resolution tests. `dataPoints.path resolves` tests fail at write time if a referenced ID or path is wrong, catching draft-plan vs canonical-source drift before any component code runs. (Source: levers Phase 1)
- [2026-04-13] process: Document architecture decisions (D1/D2/... style) before writing code and get explicit signoff. Eliminates rework at review time. Capture them in the plan file so future sessions can pick up cold. (Source: levers Phase 1)
- [2026-04-13] process: Screenshot and visually verify after every chunk that touches UI. Catches cheap issues (white-on-white cards, mis-aligned spacing) that are easier to see than reason about. (Source: levers Phase 1)
- [2026-04-13] tooling: Read `.github/workflows/ci.yml` before any CI-sensitive change (Node version, test command, env vars). One second of prevention beats NODE_OPTIONS-style revert whiplash. (Source: levers Phase 1)
- [2026-04-13] tooling: vitest 4.1 `poolOptions.forks.execArgv` does not propagate to workers in jsdom env. Use a setup-file shim or NODE_OPTIONS instead. Verified via repeated `localStorage.clear is not a function` failures after config change had no effect. (Source: levers Phase 1)
- [2026-04-13] dx: Node 24+ ships a half-enabled `globalThis.localStorage` that lacks Storage API methods and breaks jsdom. Shim in `src/test-setup.js` works across Node 20-25+. The cleaner `--no-experimental-webstorage` flag is NOT viable via NODE_OPTIONS because Node 20 rejects unknown flags. See `docs/solutions/test-failures/node-25-webstorage-breaks-jsdom-tests.md` for full writeup. (Source: levers Phase 1)
- [2026-04-13] process: Before launching session-spawned skills (ultraplan, autoplan), probe filesystem access with a 1-line `ls` or `git status`. If the spawned session can't see local files, pivot inline immediately instead of retrying. (Source: levers Phase 1)
- [2026-04-13] process: Push prep commits or put them on their own branch before cutting a feature branch. Local-only commits on main cause divergence at squash-merge time, requiring `git reset --hard origin/main` to clean up. (Source: levers Phase 1)
- [2026-04-13] pattern: When new research or spec material lands mid-session, explicitly ask if it changes scope before acting on it. Scope expansions deserve an explicit signoff, not silent absorption. (Source: levers Phase 1)
- [2026-04-14] process: Pair `/ce:review` with `/codex challenge` before merge. Codex caught 3 P1/P2 bugs all 5 Claude reviewers missed (write-only persistence, mislabeled count, default-state visual bug). Two-AI adversarial gives ~30% more coverage; the cost is a few minutes. (Source: bridge Phase 2)
- [2026-04-14] testing: Verify localStorage round-trips end-to-end. A passing write test plus a passing read test does not prove the data is actually loaded back into UI state. Add a remount test that asserts the persisted value rehydrates. The Phase 2 calculator stored custom assumptions but never read them back; tests passed at every layer in isolation. (Source: bridge Phase 2)
- [2026-04-14] pattern: Default-state data is a separate audit surface from edge-case input. Reviewers focused on slider abuse missed that dental-rollup's plan case shipped with `debtPaydown: -2` rendering as a positive bar. First-paint review catches what input-fuzz review will not. (Source: bridge Phase 2)
- [2026-04-14] process: When a reviewer flags a class of bug, walk the entire codebase for it before declaring the fix done. The P3 localStorage shape-validation patch was top-level only; `{"scenarios":{"id":null}}` still bricked BridgeList because the inner values were also untrusted. Ask: where else does this class apply? (Source: bridge Phase 2)
- [2026-04-14] process: Cross-check confident race-condition or "infinite loop" claims against actual JS semantics before acting. A reviewer claimed `Array.find()` returns a new reference each call; it does not (returns the actual element from the array). Rejecting the false claim saved a useMemo rewrite. (Source: bridge Phase 2)

## Do NOT

- No `var`. No `console.log` in production. No hardcoded secrets or env values.
- No new dependencies without stating why. No breaking API changes without flagging.
- NO em dashes anywhere. Use commas, periods, semicolons, or "..." instead.
- No class components. No inline styles. No raw `<img>` tags.
