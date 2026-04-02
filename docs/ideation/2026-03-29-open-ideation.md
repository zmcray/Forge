---
date: 2026-03-29
topic: open-ideation
focus: open-ended
---

# Ideation: Forge Improvement Ideas

## Codebase Context

**Project shape:** React 19 + Vite 8 + Tailwind CSS v4 PE deal analysis practice tool. No TypeScript, no backend (Vercel serverless for LLM eval only). 9 companies with full financials, 6 question types, commit-first learning flow. 104 Vitest tests. Material Design 3 tokens with dark mode.

**Notable patterns:** localStorage persistence (forge-data, forge-theme, forge-learn-progress), state/dispatch context split for scoring, scenario overlays via mergeScenario with path validation, LLM grading via Anthropic Claude Haiku for qualitative answers.

**Key gaps identified:**
- `buildCompanyContext.js` sends only 3 fields (name, industry, revenue) to the LLM grader, severely limiting feedback quality
- LLM feedback (gaps, strengths, suggestions) is discarded on component unmount; only numeric score persisted
- Committed answer text is ephemeral React state; no persistence or retrospective review
- Mid-session page reload drops all practice state (PracticeRedirect bounces to home)
- `getWeakSpots()` detects weak question types but never drives session composition
- Questions lack stable IDs, making per-question trajectory tracking impossible
- 4 of 9 companies have no scenario overlays

**Planned features (approved, not yet built):** Concept Cards (8 cards as Learn subsections), Cross-Industry Risk Comparison (4 comparisons at /learn/compare).

**User context:** Zack McRay, daily 45-min PE study blocks (15 min concept study, 20 min Forge reps, 5 min review/notes). Career transition to PE/independent sponsor. Uses Obsidian as thinking layer.

## Ranked Ideas

### 1. Persist LLM Feedback (Gaps, Strengths, Suggestions)
**Description:** The LLM evaluation returns `{ score, strengths, gaps, suggestion }` but only `aiScore` is saved to localStorage via `addScore`. The diagnostic text is discarded on component unmount. Persist the full feedback object alongside scores in the `forge-data` schema. Surface aggregate gap patterns in ProgressDashboard (e.g., "You consistently miss leverage calculation in valuation questions").
**Rationale:** Every ideation sub-agent flagged this independently (5 of 6). It is the highest-leverage single change: the LLM is already doing expensive diagnostic work on every qualitative answer, and the output is thrown away. Persisting it unlocks spaced repetition, gap pattern analysis, coach voice, and deal memo synthesis downstream.
**Downsides:** localStorage grows faster. Each qualitative answer adds ~500 bytes of feedback text. At 10 questions/day for a year, that is ~1.8MB. Manageable but may eventually need a retention policy.
**Confidence:** 95%
**Complexity:** Low
**Status:** Unexplored

### 2. Enrich buildCompanyContext for LLM Grading
**Description:** `buildCompanyContext.js` is 4 lines returning `"Summit Mechanical Services (HVAC, $32.5M revenue)"`. The LLM grading an answer about EBITDA add-backs has zero visibility into the actual financials. Expand to include: adjusted EBITDA, EBITDA margin, customer concentration, revenue growth, top 2 red flags, and scenario delta (if applicable via `_scenarioName` and `_scenarioDescription`).
**Rationale:** Garbage in, garbage out. The LLM cannot give company-specific feedback without company data. This is a 30-minute fix that immediately improves every LLM evaluation in the system. The scenario-aware variant is especially important because scenario questions are the highest-difficulty questions and currently get the worst LLM context.
**Downsides:** Slightly more tokens per eval call (~200 extra input tokens). At $0.002/call with Haiku, negligible cost impact.
**Confidence:** 95%
**Complexity:** Low
**Status:** Unexplored

### 3. Answer Text Persistence + Retrospective Review
**Description:** `committedText` lives in QuestionCard local state and vanishes on unmount. Store answer text in localStorage alongside scores. Enable a "Review Past Sessions" view where users re-read their reasoning against model answers and LLM feedback with fresh eyes. This is the foundation for deal memo export, Obsidian integration, and progress journaling.
**Rationale:** Without answer text, the progress dashboard measures frequency and score trends but cannot reveal whether thinking is actually changing. The highest-value PE learning loop is reading your past reasoning with fresh eyes. A score of 3/5 from 2 weeks ago is meaningless without the text that generated it.
**Downsides:** localStorage grows significantly. Needs a retention policy (e.g., keep last 30 days of answer text, archive scores only for older sessions). Adds ~200 bytes per answer.
**Confidence:** 85%
**Complexity:** Medium
**Status:** Unexplored

### 4. Session Restore on Page Reload
**Description:** Mid-session page reload drops all practice state (selected company, answered questions, LLM results, timer) and redirects to home via `PracticeRedirect`. Save a session draft to `sessionStorage` on each answer event. Re-hydrate on mount if a draft exists. Clear on session close via `closeSummary`.
**Rationale:** In a 45-minute daily study block, losing 20 minutes of work to a tab crash or accidental reload is a session-killer. The URL already encodes companyId and scenario; the missing piece is question phase state and LLM results.
**Downsides:** Restoring LLM results means they need to be serialized. Question shuffle order needs to be stored or deterministic. Moderate complexity in state rehydration logic.
**Confidence:** 80%
**Complexity:** Medium
**Status:** Unexplored

### 5. Spaced Repetition Queue from Weak Spots
**Description:** `getWeakSpots()` already identifies question types averaging below 3.5 across 2+ attempts. But the home screen only shows this passively in `WeakSpotCard`. Add a "Focus Session" button that pre-selects the worst company + question type combination and surfaces it as "Today's Recommended Drill." Uses existing scoring timestamps + a simple decay function (due after 3 days if score < 3, after 7 days if score 3-4, never if score 5).
**Rationale:** Transforms the app from "pick what you feel like" to "the app tells you where to spend the next 45 minutes." No new data collection; all signal already exists in localStorage. Combined with idea #1 (LLM gap persistence), the decay function can factor in which concepts the user keeps missing, not just numeric scores.
**Downsides:** Requires adding stable `id` fields to each question in `companies.js` (~54 questions across 9 companies). The decay function needs tuning. Risk of over-rotation toward weaknesses at the expense of maintaining strengths.
**Confidence:** 75%
**Complexity:** Medium
**Status:** Unexplored

### 6. Deal Memo Export + Obsidian Vault Integration
**Description:** After a session, use the LLM to synthesize all committed answers + LLM feedback into a structured 1-page deal memo: Executive Summary, Key Metrics, EBITDA Bridge, Risks, Thesis, Recommendation. Export as copyable markdown or vault-ready Obsidian note with frontmatter (`date`, `company`, `tags: [#pe-analysis, #industry]`, `status: seed`). Targets the `Sessions/` folder in Zack's Obsidian vault.
**Rationale:** Ties practice to the actual analyst deliverable format. Closes the loop between Forge reps and the Obsidian vault where conviction compounds. Also serves as a portfolio showcase demonstrating the integration layer between practice tool and personal knowledge system.
**Downsides:** Depends on answer text persistence (#3) being implemented first. Additional LLM call per session (~$0.003). Obsidian integration is writing a file format, not an API call, so it is a "copy to clipboard in Obsidian format" rather than a direct write.
**Confidence:** 80%
**Complexity:** Medium
**Status:** Unexplored

### 7. Argument Attack Mode (LLM Devil's Advocate)
**Description:** After scoring 3+ on a thesis or risk question, offer an optional "Challenge" button. The LLM generates a 2-3 sentence counter-argument targeting specific weaknesses in the user's answer. The user can then revise their position or defend it. A new `attack` phase in QuestionCard's state machine, triggered conditionally. Simulates IC partner pushback.
**Rationale:** Most novel idea in the set. Trains a fundamentally different PE skill (defending analysis under pressure) that no other practice tool offers. Uses existing LLM infrastructure with one additional Haiku call on strong answers only. Cost: ~$0.002 per attack, only on qualitative questions scoring 3+.
**Downsides:** UX needs careful design to avoid feeling punitive. The counter-argument quality depends on rich company context (idea #2). Only applicable to qualitative question types (risk, diagnostic, thesis).
**Confidence:** 70%
**Complexity:** Medium
**Status:** Unexplored

## Compounding Note

Ideas 1-3 form a foundation layer. Persist feedback (#1) + rich context (#2) + answer text (#3) are all Low-Medium complexity and together they unlock everything downstream: spaced repetition (#5) reads the persisted gaps, deal memo export (#6) reads the persisted answers, and argument attack (#7) benefits from the richer LLM context. Ship 1-3 as a single batch for maximum leverage.

## Rejection Summary

| # | Idea | Reason Rejected |
|---|------|-----------------|
| 1 | LLM Shared Component Extraction | Already in plan (eng review approved) |
| 2 | Cross-Company Comparison Mode | Already the planned feature (concept cards + compare) |
| 3 | Concept Cards as Mid-Question Reference | Already planned; mid-question variant deferred |
| 4 | LLM-Generated Company Variants | High complexity; LLM JSON output validation unreliable for financial data |
| 5 | Scenario Builder with Impact Preview | High complexity for modest user value vs. manual authoring |
| 6 | Scenario Branching ("What Happens Next") | Novel but scope explosion; better as a future mode |
| 7 | Two-Axis Rating (process + accuracy) | Adds UX complexity; single score is simpler and sufficient |
| 8 | Question-Level Pacing Signal | Low leverage; 15-min timer already provides urgency |
| 9 | Quantitative Calibration History | Subsumed by answer text persistence + per-question tracking |
| 10 | Session Intent Setting | Approximated by spaced repetition queue |
| 11 | Velocity-Aware Difficulty Calibration | Complex adaptive system for marginal gain |
| 12 | Financial Anomaly Injection | Creative forensic reading exercise but niche; hard to validate correctness |
| 13 | Company Data as JSON + Validator Script | Refactor with low user-facing value |
| 14 | Per-Company Completion Badges | Small enhancement; better as a TODO |
| 15 | Concept Connection During Reveal | Depends on concept cards being built first |
| 16 | Persistent LLM Coach Voice | Subsumed by idea #1 (gap persistence enables this downstream) |
| 17 | Financial Red Flag Detector | Interesting active pattern-recognition mode; deferred to post-V1 |
| 18 | Timed Deal Memo Mode | Interesting variant of #6 but adds timer complexity |

## Session Log
- 2026-03-29: Initial open-ended ideation. 6 ideation agents (pain/friction, unmet capabilities, inversion/automation, assumption-breaking, leverage/compounding, edge/power-user). 45 raw ideas generated, 25 after dedupe, 7 survivors. Foundation batch (ideas 1-3) identified as highest-leverage starting point.
