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

---

## Remaining

### Deployment
Set up deployment pipeline. Options: Vercel (simplest for Vite + React), Netlify, or GitHub Pages. No backend required since everything is client-side with localStorage.
**Priority:** P2 | **Effort:** S

### State Management
Consider React Context or Zustand if prop drilling becomes unwieldy. Currently manageable with hooks + prop passing.
**Priority:** P3 | **Effort:** M

### LLM-Generated Dynamic Scenarios
Use Claude API to generate novel company profiles and scenario variations on demand. Requires API key setup.
**Priority:** P3 | **Effort:** L

### CI/CD Pipeline
GitHub Actions for automated testing and deployment on push/PR.
**Priority:** P3 | **Effort:** S
