# Forge -- PE Deal Analysis Practice Tool

## What This Is
Forge is a React app that trains PE deal analysis skills through realistic LMM company scenarios. Users review financial statements, commit answers before seeing model answers, and track progress over time with persistent scoring.

## Architecture

```
forge/
  src/
    data/
      companies.js         # 9 company profiles with full financials + questions
      questionTypes.js      # 6 question types (metric, adjustment, valuation, risk, diagnostic, thesis)
      learnContent.js       # Learn module structured content (3 sections, 10 subsections)
      scenarios.js          # 5 scenario overlays (what-if variations on base companies)
    components/
      AppShell.jsx          # Sidebar nav + glassmorphism header (collapsible, mobile-responsive)
      FinancialTable.jsx    # Income statement, balance sheet, cash flow, key metrics views
      QuestionCard.jsx      # Commit-first question flow with keyword feedback
      ProgressDashboard.jsx # Persisted scoring dashboard with streak + accuracy
      CompanyCard.jsx       # Company selector card
      DeltaDisplay.jsx      # Quantitative answer comparison (your answer vs model)
      CommitInput.jsx       # Input component (number or textarea with char counter)
      TimerBar.jsx          # 15-minute countdown with pace milestones
      StatCard.jsx          # Dashboard stat card (streak, questions)
      MasteryCard.jsx       # Mastery level card
      ModuleCard.jsx        # Module card with optional progress bar
      WeakSpotCard.jsx      # Focus areas by question type
      SessionSummary.jsx    # Post-session modal with copy-to-clipboard
      QuickFireScreen.jsx   # 60-second go/no-go screening mode
      SearchModal.jsx       # Cmd+K search across companies, metrics, learn content
      learn/                # Learn module components (LearnModule, LearnSection, LearnNav, etc.)
    hooks/
      useScoring.js         # localStorage persistence, sessions, streak, weak spots
      useTimer.js           # Countdown timer with pace milestones
      useKeyboardShortcuts.js # 1-5 score, Enter reveal, Esc back
      useLearnProgress.js   # Learn module progress tracking
      useTheme.js           # Dark mode toggle with localStorage persistence
    utils/
      format.js             # formatCurrency, extractNumericValue, getDeltaBand, shuffleArray
      scenarios.js          # mergeScenario (deep merge with path validation)
    App.jsx                 # Main orchestrator with React Router
    main.jsx                # Vite entry point with BrowserRouter
    index.css               # Tailwind import + design tokens (light + dark)
  index.html
  package.json
  vite.config.js
```

## Key Mechanics

### Commit-First Flow
Users must enter an answer before revealing the model answer:
- Quantitative (metric, adjustment, valuation): number input required
- Qualitative (risk, diagnostic, thesis): minimum 50 characters required
- After reveal: side-by-side comparison with delta bands (exact/close/off/way off)
- Keyword feedback for qualitative: shows which key factors the user identified

### Scoring & Persistence
- All scores stored in `localStorage` under key `forge-data`
- Schema: `{ sessions: [{date, companyId, duration, questions: [{type, score, delta, unit}]}], streak: {current, lastDate} }`
- Streak tracks consecutive practice days
- Weak spots surface when avg score < 3.5 with 2+ attempts

### Scenario System
- Overlay patches on base company data via `mergeScenario()`
- Path validation: throws if overlay references non-existent fields
- 5 scenarios: Coastal top customer leaves, Summit flat growth, Precision owner exits, BrightSmile founder departs, Apex IC reclassification

### Quick Screen Mode
- 60-second timer per company
- Shuffled company order
- Go/no-go decision with reasoning
- Results summary at end

### Navigation
- React Router with URL-based routing (/, /practice/:companyId, /progress, /learn, /quickfire)
- AppShell with collapsible sidebar (w-64 or w-16 icons-only)
- Mobile responsive with hamburger menu + overlay
- Cmd+K / Ctrl+K search modal

### Design System
- Material Design 3 tokens (light + dark mode)
- Fonts: Manrope (headlines), Inter (body), Material Symbols (icons)
- Glassmorphism header, ghost borders, surface elevation hierarchy
- Dark mode with localStorage persistence + system preference detection

## Question Types
| Type | Input Mode | Example |
|------|-----------|---------|
| metric | quantitative | "What is the adjusted EBITDA margin?" |
| adjustment | quantitative | "Walk through the EBITDA add-backs" |
| valuation | quantitative | "What multiple range is appropriate?" |
| risk | qualitative | "What are the key risks?" |
| diagnostic | qualitative | "What would you investigate further?" |
| thesis | qualitative | "Would you invest? Why or why not?" |

## Company Data
9 companies with full financials (2-year income statement, balance sheet, cash flow, key metrics):
- Summit Mechanical Services (HVAC, $32.5M)
- Coastal Fresh Foods (food distribution, $48.2M)
- Precision CNC Solutions (manufacturing, $12.8M)
- BrightSmile Dental Partners (dental rollup, $9.8M)
- Apex Last-Mile Logistics (delivery, $38.5M)
- TrueNorth Analytics (B2B SaaS, $14.2M)
- Ironclad Builders (commercial construction, $52.8M)
- Vitality Pet Wellness (veterinary rollup, $8.4M)
- Meridian Fulfillment Co. (e-commerce 3PL, $29.5M)

## Tech Stack
- Vite 8 + React 19 + Tailwind CSS v4
- React Router 7 for URL-based navigation
- Vitest + @testing-library/react for testing (104 tests across 9 test files)
- No TypeScript, no backend
- Responsive (mobile sidebar + desktop)

## Style Preferences
- NO em dashes anywhere. Use commas, periods, semicolons, or "..." instead.
- Tailwind CSS utility classes with design tokens
- Clean, professional financial UI
- Number formatting: $XM for currency, X% for percentages, Xx for multiples

## Dev Workflow
- `npm run dev` -- Vite dev server with HMR
- `npm test` -- run all Vitest tests
- `npm run test:watch` -- Vitest in watch mode
- `npm run build` -- production build

# currentDate
Today's date is 2026-03-22.
