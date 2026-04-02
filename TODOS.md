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

---

## Remaining

### State Management
Consider React Context or Zustand if prop drilling becomes unwieldy. Currently manageable with hooks + prop passing.
**Priority:** P3 | **Effort:** M

### LLM-Generated Dynamic Scenarios
Use Claude API to generate novel company profiles and scenario variations on demand. Requires API key setup.
**Priority:** P3 | **Effort:** L

### Socratic Mode Toggle for Chat
Add a Direct/Socratic toggle to the chat drawer. Socratic mode asks guiding questions ("What do you think depreciation represents?") instead of giving direct answers. Research shows this produces deeper learning (Khanmigo pattern). Requires careful prompt engineering to avoid frustrating users who just want a quick explanation. Depends on: LLM Chat feature ships first.
**Priority:** P2 | **Effort:** S

### Extend Chat to Practice Mode
Make the chat drawer available on /practice/:companyId pages. Context builder injects full company financials instead of lesson content. Users analyzing a company can ask follow-up questions ("Is 12% customer concentration risky for food distribution?") without leaving Forge. Needs different suggested questions per company and a larger context window (~2000 tokens for full financials). Depends on: LLM Chat feature ships first.
**Priority:** P2 | **Effort:** M
