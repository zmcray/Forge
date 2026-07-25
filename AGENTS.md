# AGENTS.md — Forge

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
| Line cap scope | Content/data files under `src/data/` exempt from the 300-line cap | Splitting playbooks.js per-playbook | Single-source content beats mechanical splitting; the cap targets code complexity, not content volume. |

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
- `app/.env` for local dev. `ANTHROPIC_API_KEY` (required), `FORGE_AUTH_TOKEN` (optional, server-side gate), `VITE_FORGE_AUTH_TOKEN` (optional, client-side token sent as `x-forge-token`).
- `VITE_FORGE_AUTH_TOKEN` is embedded in the public bundle by Vite; it is obfuscation, not auth. Real secrets stay server-side.
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
**Coverage:** 43 test files across components, hooks, utils, API handlers, and data integrity.
- Components: TimerBar, DeltaDisplay, CommitInput, FinancialTable, ComparisonList, ComparisonView, LLMFeedback, NotesBlock, ConceptList, LeverCard, BridgeCalculator, PlaybookDetail, ChatDrawer (3 files), ChatMessage, ChatTriggers, LearnModuleChat, PracticeChat, IntroSequence, SmartHomeRecommendations, SoftGate
- Hooks: useScoring (2 files), useTimer, useLearnProgress, useConceptProgress, useLeverProgress, useBridgeProgress, usePlaybookProgress, useChatContext, useChatMode, useOnboarding
- Utils: format, scenarios, evaluateAnswer, bridgeMath, socraticPrompt
- API: apiEvaluate, apiChat, apiGenerate (auth, validation, response shape)
- Data: dataIntegrity (validates all company profiles), conceptCards

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
      chat.js                     # Vercel serverless: LLM chat with SSE streaming
      generate.js                 # Vercel serverless: LLM company profile generation
    src/
      contexts/
        ScoringContext.jsx        # State/dispatch split context for scoring data
        OnboardingContext.jsx     # First-run onboarding state
      data/
        companies.js              # 9 company profiles with full financials + questions
        questionTypes.js          # 6 question types (metric, adjustment, valuation, risk, diagnostic, thesis)
        learnContent.js           # Learn module content (5 sections, 25 subsections: financial statements, screening, DD + QoE, key concepts + LBO/financing, deal process)
        conceptCards.js           # Concept card content for the Learn module
        valueLevers.js            # Value creation lever content
        valueBridge.js            # Value bridge exercise data
        playbooks.js              # Operational playbook content
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
        learn/                    # Learn module components (30 files): LearnHub, LearnModule,
                                  #   ConceptCard/List, LeverCard/List, Bridge* (calculator,
                                  #   waterfall, sliders, exercise), PlaybookDetail/List,
                                  #   ChatDrawer/ChatMessage, ComparisonList/View, NotesBlock, ...
        onboarding/               # IntroSequence, SmartHomeRecommendations, SoftGate
      hooks/
        useScoring.js             # localStorage persistence, sessions, streak, weak spots
        useTimer.js               # Countdown timer with pace milestones
        useKeyboardShortcuts.js   # 1-5 score, Enter reveal, Esc back
        useLearnProgress.js       # Learn module progress tracking
        useConceptProgress.js     # Concept card progress tracking
        useLeverProgress.js       # Value lever progress tracking
        useBridgeProgress.js      # Value bridge progress tracking
        usePlaybookProgress.js    # Playbook progress tracking
        useChatContext.js         # Builds chat system-prompt context
        useChatMode.js            # Chat mode state (socratic vs direct)
        useOnboarding.js          # Onboarding flow state
        useTheme.js               # Dark mode toggle
        useNotes.js               # Per-lesson notes
      utils/
        format.js                 # formatCurrency, extractNumericValue, getDeltaBand, shuffleArray
        scenarios.js              # mergeScenario (deep merge with path validation)
        evaluateAnswer.js         # Client-side handler for /api/evaluate
        buildCompanyContext.js    # Company summary string for LLM context
        bridgeMath.js             # Value bridge calculations
        resolveDataPath.js        # Dot-notation path resolution
      test/
        renderWithProviders.jsx   # Test helper with ScoringProvider + MemoryRouter
        *.test.js(x)              # Cross-cutting tests (API handlers, chat, onboarding, data)
      test-setup.js               # Vitest globals configuration (localStorage shim)
      App.jsx                     # Main orchestrator with React Router
      main.jsx                    # Vite entry point
      index.css                   # Tailwind import + design tokens
    index.html
    package.json
    vite.config.js
    vercel.json                   # SPA rewrite config
  docs/plans/                     # Feature planning docs
  docs/solutions/                 # documented solutions to past problems (bugs, patterns, workflow practices), organized by category with YAML frontmatter (module, tags, problem_type)
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
- Auth: all three API handlers (evaluate, chat, generate) gate on `if (process.env.FORGE_AUTH_TOKEN)`; the `x-forge-token` header check is enforced only when the env var is set, in any environment (including production). When unset, endpoints are open. Client sends `VITE_FORGE_AUTH_TOKEN`, which is embedded in the public bundle: obfuscation, not auth.

### LLM Chat (Learn + Practice)
- Endpoint: `app/api/chat.js` (POST). Model: claude-haiku-4-5, max 1024 tokens.
- Streams responses as SSE (`data: {type: "delta", text}` events, terminated by `{type: "done"}`).
- Request: `{ messages: [{role, content}], mode, params }`. Since MCR-390 the system prompt is assembled SERVER-SIDE in `api/_lib/chatPrompt.js` from mode + params (client-supplied `systemPrompt` is rejected with 400); learn-mode lesson content is resolved server-side from `subsectionId`. Validation limits: 20 messages max, 2000 chars per message, per-field caps on params (e.g. 2000-char text fields). System prompt is cached via `cache_control: ephemeral`. `src/test/socraticPrompt.test.js` soft-budgets the built prompt at 5200 chars via the longest subsection.
- Client: `ChatDrawer.jsx` renders the drawer; `useChatContext` builds company/lesson context into the system prompt; `useChatMode` toggles socratic vs direct mode.
- Same `FORGE_AUTH_TOKEN` gate as evaluate/generate.

### LLM Company Generation
- Endpoint: `app/api/generate.js` (POST). Model: claude-haiku-4-5, max 8192 tokens, 60s maxDuration.
- Generates a full LMM company profile (financials + exactly 6 questions, one per type) as plain JSON validated against an in-file JSON Schema; plain-JSON parse is used because the full schema exceeds the structured-output grammar limit.
- Retries up to 2 attempts; `normalizeCompany` + `checkCompanyConsistency` validate internal consistency (0.3 tolerance); inconsistent-but-usable results return with `_warnings`.
- Same `FORGE_AUTH_TOKEN` gate as evaluate/chat.

### Scoring & Persistence
- All scores in `localStorage` under key `forge-data`. Backup of pre-v2 data at `forge-data-v1-backup` after first migration.
- Schema v2: `{ version: 2, sessions: [{date, companyId, duration, questions: [{type, score, delta, unit, atomId, atomType, feedback, timestamp}]}], streak: {current, lastDate} }`
  - `atomId` / `atomType` back-reference the specific learnable atom (`"company-question"`, `"concept"`, `"lever"`, `"bridge"`, `"playbook"`); both nullable for legacy entries
  - `feedback: { strengths, gaps, suggestion } | null` — full LLM evaluation persisted on qualitative answers
  - `timestamp: ISO8601` — set automatically by `addScore` if not provided
- v1 → v2 migration runs silently on first read of v1-shape data; pattern documented at `docs/solutions/patterns/localstorage-schema-migration-with-atom-tagging.md`
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
- [2026-04-30] pattern: Stamp an explicit `version` field at schema introduction time, even when only v1 exists. Detecting absence-of-version is fragile and tangles with first-run/empty-state logic; explicit version mismatch is precise. Migration runs on first read, persists v2 immediately, never re-runs. Full pattern: `docs/solutions/patterns/localstorage-schema-migration-with-atom-tagging.md`. (Source: MCR-103 Phase 0)
- [2026-04-30] pattern: Backup raw bytes of the prior schema version under a separate localStorage key BEFORE writing the migrated shape. The raw string preserves fields the migrator didn't know about, gives a recovery path if the migrator has a bug, and costs nothing in disk. Test the backup contract explicitly. (Source: MCR-103 Phase 0)
- [2026-04-30] pattern: When extending a persisted schema, add new fields as nullable so legacy and new entries coexist in the same array. Then audit every consumer (`getWeakSpots`, `getAllScores`, dashboards, exports) for null-tolerance — a mixed-shape array is a new failure surface. (Source: MCR-103 Phase 0)
- [2026-04-30] tooling: For bulk data edits across many similar objects (44 question objects in `companies.js` needing IDs), prefer a one-shot Node script over manual edits. Make it idempotent — early-return on entries that already have the new field — so re-running is safe and reports `Injected 0`. Saves time and eliminates drift between near-identical edits. (Source: MCR-103 Phase 0)
- [2026-04-30] testing: Default-state shape assertions are load-bearing. The 2 pre-existing `useScoring.test.js` tests that asserted the canonical default state caught the v2 schema change immediately on first test run. Update those assertions deliberately when shape changes; never silence them. (Source: MCR-103 Phase 0)

## Do NOT

- No `var`. No `console.log` in production. No hardcoded secrets or env values.
- No new dependencies without stating why. No breaking API changes without flagging.
- NO em dashes anywhere. Use commas, periods, semicolons, or "..." instead.
- No class components. No inline styles. No raw `<img>` tags.

<!-- BEGIN CANONICAL WORKFLOW (managed by deploy-agents-md.sh ... edit here, not in repos) -->

## Issue tracker

Linear (Mcraygroup team). File all deferred findings, residuals, and follow-ups there. The board is the audit trail: move issue status as work progresses, post plan and review summaries as comments, and link the PR. A reviewer should be able to follow the whole build without opening a terminal.

## Project setup (one-time)

A repo wired into this system is:

- A git repo with a private GitHub remote, kebab-case name matching the folder, living under `~/Developer` (never iCloud), with `node_modules`, `.next`, build output, and `.env*` gitignored.
- Linked to a Linear project, recorded in a `.linear-project.json` file at the repo root (id + slug + name). The link travels with the repo... no central cache.
- Carrying this `AGENTS.md` plus a `CLAUDE.md` that imports it (`@AGENTS.md`).
- **If it uses a deployed database (e.g. Supabase): an automatic migration-to-prod path, wired BEFORE the first production deploy.** Deploying code never applies DB migrations — they are a separate ship — so without this, shipped code runs ahead of the prod schema and every page touching it 500s. Default (Supabase): the native **GitHub Integration** (dashboard → project → Integrations → GitHub) — OAuth, no stored secrets, applies migrations on merge to the production branch; set **Working directory** to the folder that *contains* `supabase/` (the repo root `.`, or a subdir like `app`/`atlas` if it's nested), **Deploy to production** ON → `main`, **Automatic branching** OFF (per-PR preview DBs are billable, uncapped). Fallback: a `supabase db push` GitHub Action gated on `main` with the project's access-token / project-ref / db-password as repo secrets. `/zmcray-kickoff` sets this up.

Plans live in `docs/plans/` (archive completed ones in `docs/plans/archive/`); checkpoints live in `docs/checkpoints/`. Flow is never set at the repo level: it is a per-issue property (see below). On Claude Code, `/zmcray-kickoff` performs this setup once, then hands off to `/caspian` (PRD + issues) and `/zmcray-build` (per issue). The canonical sequence for a new product is **kickoff (wire the repo) > caspian (strategy: PRD + labeled issues) > build (per issue)**.

## Build workflow (tool-agnostic)

This section defines how any coding agent works an issue in this repo, whether it runs on Claude Code, Codex, Cursor, or another harness. It describes *roles* first, then names the commands that fill them. If your tool has the named command, use it. If it does not, perform the role's described work natively. The workflow is the contract; the commands are conveniences.

### Two routing signals

Every issue carries up to two labels that decide how it gets built:

- `flow:*` says *how much rigor*: `flow:design`, `flow:standard`, or `flow:ship`.
- `prd-source` says *whether strategy thinking already happened* (the issue came from a Caspian PRD). If present, skip the Think phase: the strategy council already ran.

Classify by blast radius, not effort:

- `flow:design` ... new surface area, architecture, auth/data/payments, anything hard to reverse.
- `flow:standard` ... a meaty feature in known territory.
- `flow:ship` ... small, reversible, well-specced (copy change, config tweak, contained bug fix).

If an issue is unlabeled, triage it in ~30 seconds, apply the label in Linear, state the call in one line, and proceed.

### The four phases

| Phase | Role | Command implementation (use if available) | Native fallback (any tool) |
|---|---|---|---|
| **Think** | Founder/strategy lens: is this the right problem, framed the right way? | gstack `/office-hours` then `/plan-ceo-review`; or Compound Engineering `/ce-brainstorm` / `/ce-ideate` | Write a short design doc answering: problem, who it is for, the 10x version, what we are deliberately not doing. |
| **Plan** | Turn the issue (and PRD, if present) into a concrete, reviewed plan | CE `/ce-plan` (its persona council gates the plan: feasibility, design, product, scope, security) | Write `docs/plans/plan-[date]-[slug].md` with the metadata header below; self-review it against feasibility, scope, and security before writing code. |
| **Execute** | Implement through to a merged PR (CI green, then merge-on-green — see Discipline) | CE `/lfg` (plan gate > work > plan-aware multi-persona code review > apply fixes + commit > file residuals to Linear > browser test > commit/push/PR > CI watch, max 3 fix attempts), then the merge-on-green rule | Implement on a branch, write tests, run the review yourself or via `/ce-code-review`, commit, push, open the PR, watch CI to green, file any unfixed findings to Linear as issues, then merge per the merge-on-green rule. Delegate the CI watch, Actions log reduction, and per-file review passes to cheap/mid-tier subagents per Delegation; keep failure diagnosis and the merge call in the main thread. |
| **Learn** | Capture what worked and what the plan missed so the next build is easier | CE `/ce-compound` | Append a short "what worked / what the plan missed / new pattern" note to this repo's learnings (CLAUDE.md `## Compound Learnings` or a `LEARNINGS.md`). |

### Flow routing

| | has `prd-source` (Caspian-born) | no PRD (buildnote / ad hoc) |
|---|---|---|
| **flow:design** | Plan (+ architecture pass) > Execute > Learn | Think > Plan (+ architecture pass) > Execute > Learn |
| **flow:standard** | Plan > Execute > Learn | Plan > Execute > Learn |
| **flow:ship** | Execute (the plan gate is the only planning) | Execute |

The **architecture pass** on `flow:design` only: gstack `/plan-eng-review` on the approved plan, or a native dedicated review of system design, data model, and failure modes. This is the one place a deeper architecture review still earns its cost; CE's plan council covers the rest.

### Effort (reasoning budget)

A separate axis from flow. Flow decides *which* phases run; effort decides *how hard the model reasons* while running them. They are orthogonal: a `flow:ship` fix can be reasoning-trivial, and a `flow:design` feature can be mostly boilerplate or a genuinely hard problem.

Effort is an ordered dial, lowest to highest:

`low` ... `medium` ... `high` ... `extra` ... `max` ... `ultracode`

Apply the chosen level with your tool's reasoning-effort control (on Claude Code, the `/effort` setting). These level names are owned by the tool and change over time, so use whatever your tool currently exposes and map by intent to the nearest step it offers. Do not hard-code a tool's effort syntax into a plan or an issue.

Pick the level by *reasoning difficulty*, not blast radius (blast radius is flow's job). Step up as these rise:

- *novelty* ... solved this shape of problem before, or net-new?
- *ambiguity* ... one obvious approach, or several plausible ones / multiple possible root causes?
- *subtlety* ... algorithmic, concurrency, security, or correctness traps?
- *simultaneity* ... how much must be held in mind at once to get it right (not files touched)?

`low` for mechanical, well-trodden work; `high` is the sensible default for real but familiar reasoning; `max`/`ultracode` for novel, subtle, or high-stakes problems where deeper reasoning earns its cost.

Set effort at pull-down, against the actual task, and re-tune per phase. Unlike flow, effort is not fixed for an issue... planning a hard design may warrant `max` while its implementation runs at `medium`. Set it at the start of the Plan phase and again at the start of Execute.

Out of scope here: parallel orchestration and run-persistence are separate axes, not governed by this dial (see Autonomous runs below).

### Delegation (subagents and model tiers)

A third axis, orthogonal to flow and effort. Flow decides which phases run, effort decides how hard the model reasons, delegation decides *who does each piece and at what cost*.

**The tier assessment is mandatory, not optional.** Before starting any step that runs more than a couple of tool calls, assess whether a lower-tier subagent can do it and state the call in one line: **"Delegating [work] → [tier] ([why])"**, or **"Main thread: [work] ([why it needs judgment])"**. The default answer is delegate-and-downshift. Work stays in the main thread on the frontier model only when it genuinely requires judgment; "it's faster to just do it here" is not a reason. Main-thread context is the scarcest resource in a run... spend it on decisions and synthesis, never on file dumps, log tails, or status polling.

When model selection is exposed, tier by work type — **mechanical → cheapest tier, moderate synthesis → mid tier, judgment → frontier tier**:

| Work | Tier | Claude Code model |
|---|---|---|
| Repo exploration, multi-file reads, existing-pattern discovery, dependency audits, mechanical transcription (issue spec → plan file), TODO/FIXME scans, PROJECT.md / Build Log edits, Linear comment formatting, duplicate-issue checks | mechanical | `haiku` |
| **GitHub and CI work** (see the rule below) | mechanical, mid if logs need real interpretation | `haiku` → `sonnet` |
| Per-file review passes, test-suite triage, implementation slices against a settled spec, drafting a spec from decisions already made, summarizing what a mechanical pass found | moderate synthesis | `sonnet` |
| Flow triage, effort setting, plan approval, architecture calls, scope and taste judgment, root-causing a CI failure, the merge decision, anything the human will be asked to decide | judgment | frontier (main thread) |

**GitHub / CI operations run on the cheapest tier that can do them.** Delegate to `haiku` (escalating to `sonnet` only when output needs real interpretation): CI watch and check-status polling, fetching and reducing Actions run logs to the failing lines, PR body assembly, authoring or editing Actions workflow YAML, and label / secret / branch plumbing across multiple items. The main thread receives the *reduced* result — the failing test name and error, not the log. Deciding what a failure means and whether to merge stays frontier. Exception: a single one-shot `gh` call (one `gh pr view`, one `gh pr merge`) stays inline — a subagent round-trip costs more than the call. The rule targets anything that loops, polls, or returns bulk output.

Tier names are owned by the tool and change over time... map by intent to what your harness currently offers (Claude Code today: `haiku` / `sonnet` / `opus` on the subagent `model` param; Codex and Cursor: default unless exposed). Do not hard-code a tier name into a plan or an issue. If subagents are unavailable, do the work in the main thread and say so once.

**Escalate on failure, not on suspicion.** Start a delegated subtask at the lowest plausible tier. If the result comes back incomplete, low-confidence, or wrong, re-run it one tier up rather than absorbing it into the main thread. Two failed tiers on the same subtask means the work needed judgment all along... pull it back and reclassify. Never pre-emptively route to frontier because a cheaper tier *might* struggle.

**Fan out in parallel.** Independent delegated subtasks are dispatched in a single message with multiple subagent calls, never one at a time.

**Parallel tool calls:** when making multiple tool calls with no dependencies between them (independent file reads, searches, status checks), issue them in parallel rather than sequentially, using whatever batching mechanism your harness provides (e.g. Codex's `multi_tool_use.parallel`; Claude Code batches independent calls in one turn natively). Sequence calls only when a later call needs an earlier call's result.

### Autonomous runs (goal mode)

A fourth axis: does the run pause for the human? Default is interactive (confirm between pre-work steps). In **goal mode** the human sets an objective spanning one or more issues and the agent runs to completion without prompting: every would-be question becomes a stated one-line judgment call, logged to the relevant Linear issue so decisions stay auditable. Planning, flow/effort decisions, and architecture calls stay in the main thread; execution subtasks are delegated per the Delegation section above. Goal runs work issues strictly sequentially under the merge-on-green rule and end only when the objective is met or a hard stop fires: an unmergeable PR, red baseline, the kick-back rule, or anything destructive the plan doesn't cover — never skip past a stuck issue. On Claude Code this is `/goal [objective]` (which drives `/zmcray-build` in its autonomous mode); on other harnesses, apply this contract natively when the user asks for a hands-off run.

### Discipline that holds on every flow

- **Branch from a fresh base:** before creating the feature branch, check out the default branch and pull it from origin — never branch from a stale local HEAD or a leftover feature branch (that is where PR merge conflicts come from). Then use the Linear `gitBranchName` if the issue has one, else `feat/[short-slug]`. Never work on `main`.
- **Merge on green (auto-merge):** when CI is green, squash-merge the PR (`gh pr merge --squash --delete-branch`), pull the default branch, and post a "PR merged" comment to the Linear issue. Never merge a red or blocked PR. Multi-issue runs are strictly sequential: merge issue N before branching issue N+1; if a PR cannot merge, stop the run there — do not skip ahead. Opt out per-repo with `"automerge": false` in `.linear-project.json`. (PR review is not a gate in this workflow; quality gates are CI plus reviewing the live app after merge.)
- **Test-first (design + standard):** write the failing test before the implementation for each unit of work.
- **Commits:** conventional commits with the issue ID appended, e.g. `feat: implement upload flow [MCR-123]`, so Linear auto-links. Commit on the branch and leave the working tree clean before picking up the next issue.
- **Scope is the PRD (kick-back rule):** if the issue carries `prd-source` and the work wants scope beyond what the PRD defines, do not expand scope here. Post a Linear comment ("Scope exceeds PRD: [reason]. Kicking back for Caspian EXPAND."), move the issue to Backlog, and stop. Strategy changes go through Caspian, not the build loop.
- **Escalate up only (escalation rule):** if work reveals a bigger blast radius than the label implies (auth, data migration, new architecture), escalate to the higher flow, update the label, and post a one-line Linear comment explaining why. Never de-escalate mid-build.
- **Residuals go to Linear:** any review finding you do not fix becomes a Linear issue on the Mcraygroup team, severity mapped to priority. Do not weaken, skip, or mock a failing assertion to get CI green.
- **Migrations reach prod separately from code:** deploying code does NOT apply database migrations. The auto-migration-to-prod path (Project setup) must already exist; when an issue adds a migration, confirm it actually reaches the prod DB — the code deploy won't carry it. Additive migrations (new columns/tables) deploy safely alongside the code; for a destructive/renaming one, apply the migration first, confirm, then ship the code.

### Plan file convention (design + standard)

Plans live in `docs/plans/plan-[YYYY-MM-DD]-[short-slug].md` (archive completed plans to `docs/plans/archive/`) with this header so the execute phase and any wrap step can find them:

```
---
Created: [timestamp]
Flow: [design|standard|ship]
Linear Project: [name or "none"]
Linear Issue: [ID or "none"]
Linear Branch: [gitBranchName or "none"]
Task: [one-line description]
---
```

### Session close

When the build session ends: move the Linear issue to **In Review** (or **Done** if shipped, or leave **In Progress** if paused), post a session-summary comment (what shipped, PR + CI status, commit count, tests, residuals filed, loose ends), archive the plan with an `## Outcome` note, and run the Learn phase for design/standard flows. By session close the PR should already be merged via the merge-on-green rule above; if auto-merge was skipped or blocked, flag the unmerged PR as a loose end rather than merging during close.

### Claude Code accelerators

On Claude Code, `/zmcray-build` and `/zmcray-wrap` run this exact workflow as a guided loop (flow routing, the phase sequence, Linear sync). They are conveniences layered on top of this file, not a separate process. Any other harness reads this section and runs the same workflow directly.

### shadcn registries

Every shadcn-initialized app registers the namespaced registries from `templates/components.registries.json` in the dev-workflow repo... merge the `registries` key into the app's `components.json`, never overwrite existing keys, and keep the literal `{name}` placeholder intact. Current registries: `@bklit` (https://bklit.com/r/{name}.json) and `@kokonutui` (https://kokonutui.com/r/{name}.json). On installing any component from these registries, restyle it to McRay Group brand tokens (`colors_and_type.css` semantic vars) before first use; no raw registry styling ships.

<!-- END CANONICAL WORKFLOW -->
