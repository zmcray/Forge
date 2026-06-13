# Forge TODOs

## Completed

### React Router / Multi-page Navigation
Added react-router-dom with routes: `/`, `/practice/:companyId`, `/progress`, `/learn`, `/quickfire`. Browser back/forward and bookmarkable URLs work. Practice sessions use URL params with optional `?scenario=` query string.

### Additional Company Scenarios
Added 2 new scenario overlays (total now 5):
- BrightSmile: Founder Departure (key-person risk, succession gap)
- Apex: IC Reclassification (labor cost shock, margin compression)

### More Companies
Added 4 new company profiles (total now 9):
- TrueNorth Analytics (B2B SaaS, cybersecurity compliance, $14.2M)
- Ironclad Builders (commercial construction/GC, $52.8M)
- Vitality Pet Wellness (veterinary roll-up, $8.4M)
- Meridian Fulfillment Co. (e-commerce 3PL, $29.5M)

### Full Component Test Suite
Installed @testing-library/react + jsdom. 104 total tests across 9 test files:
- TimerBar (7 tests): rendering, progress, expired state, milestones
- DeltaDisplay (5 tests): rendering, null guards, unit formatting
- CommitInput (9 tests): quantitative/qualitative modes, char counting, callbacks
- FinancialTable (5 tests): all 4 statement views render correctly
- useTimer (4 tests): formatting, progress calculation, milestones, expiration
- useKeyboardShortcuts (3 tests): input ignore, score key detection
- useLearnProgress (12 tests): load/save, roundtrip, dedup, reset
- useScoring (7 tests): load/save, streak logic
- format utilities (52 tests): existing coverage

### Dark Mode Toggle
Added dark mode with full color token overrides, localStorage persistence, and system preference detection. Toggle in sidebar.

### Mobile Responsive Sidebar
Sidebar works on mobile with hamburger menu, overlay backdrop, and touch-friendly interactions.

### Search Functionality
Cmd+K / Ctrl+K opens search modal. Searches across companies (9), learn topics (10 subsections), and PE metrics (8 terms). Keyboard navigation (arrows + Enter).

### Deployment
Deployed to Vercel at https://forge-six-kappa.vercel.app/. SPA rewrite config in vercel.json. Auto-deploys on push to main.

### CI/CD Pipeline
GitHub Actions workflow (.github/workflows/ci.yml) runs tests and build on push to main and PRs. Node 20, npm ci, two jobs: test then build.

### Socratic Mode Toggle for Chat
Pill toggle in the chat drawer header (`Direct | Socratic`). Mode is a global user preference persisted in localStorage as `forge-chat-mode`. Direct mode keeps the existing concise-tutor prompt; Socratic mode swaps in a prompt that asks 1-2 probing questions per turn instead of giving answers (Khanmigo pattern). Mid-conversation flips insert an inline italic divider. Mid-stream flips let the in-flight response finish under the old prompt; the new mode applies on the next turn. `useChatMode` hook exports a `CHAT_MODES` constant. Per-subsection `socraticSuggestions` seeds were cut from this PR; will be tuned after observing real Socratic-mode usage. Shipped as part of MCR-16.

### Extend Chat to Practice Mode
Chat drawer now opens from `/practice/:companyId` with a company-specific PE analysis prompt, full financial context, red/green flags, analysis questions, and Direct/Socratic mode support. Practice deep links hydrate company state from the URL before opening chat, so reloads and shared case URLs work.

### LLM-Generated Dynamic Scenarios
Added minimal v1 "Generate Random Company" flow. `/api/generate` uses Claude structured output with a fixed prompt, optional `FORGE_AUTH_TOKEN`, financial consistency checks, and one retry before returning warnings. Home shows a session-only generated case card that opens in the existing Practice flow.

---

## Remaining

### State Management
Consider React Context or Zustand if prop drilling becomes unwieldy. Currently manageable with hooks + prop passing.
**Priority:** P3 | **Effort:** M
