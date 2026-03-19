# Forge TODOs

## React Router / Multi-page Navigation
Add React Router for proper URL-based routing (home, practice/:companyId, progress, learn, quickfire).
Currently all views are managed via useState. Router would enable browser back/forward, bookmarkable URLs, and deep linking to specific companies or scenarios.
**Priority:** P2 | **Effort:** M (human) / S (CC)

## Additional Company Scenarios
Build out more scenario overlays beyond the 3 starters (coastal-top-customer-leaves, summit-flat-growth, precision-owner-exits). Good candidates:
- BrightSmile: what if the founder leaves (non-clinical operator risk)
- Apex: what if the IC contractor model gets reclassified
- Cross-company: macro scenarios (recession, interest rate spike)
**Priority:** P2 | **Effort:** M (human) / S (CC)

## More Companies
Add 3-5 more company profiles to increase practice variety. Target industries: SaaS, professional services, construction/trades, e-commerce/DTC, healthcare IT.
**Priority:** P3 | **Effort:** L (human) / M (CC)

## Full Component Test Suite
Current tests cover utilities and scoring helpers (60 tests). Missing: React component rendering tests (QuestionCard, FinancialTable, DeltaDisplay, TimerBar, etc.) and hook integration tests (useTimer, useKeyboardShortcuts). Requires @testing-library/react + jsdom setup.
**Priority:** P2 | **Effort:** M (human) / S (CC)

## Deployment
Set up deployment pipeline. Options: Vercel (simplest for Vite + React), Netlify, or GitHub Pages. No backend required since everything is client-side with localStorage.
**Priority:** P2 | **Effort:** S (human) / S (CC)
