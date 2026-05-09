---
title: Forge ... PE fluency engine
product: forge
mode: NEW
scope: project
type: internal
created: 2026-04-29
version: 1
status: shipped
council_mode: selective
linear_initiative: not-applicable-single-project-scope
linear_project: ca010233-45c6-490c-b4f3-019be819aed2
linear_issues:
  - MCR-14
  - MCR-15
  - MCR-16
  - MCR-17
  - MCR-18
  - MCR-19
  - MCR-93
  - MCR-94
  - MCR-95
  - MCR-96
  - MCR-97
  - MCR-98
  - MCR-99
  - MCR-100
linear_milestones:
  M1: 0d575e4b-52f0-4493-9626-cea57cb341ea
  M2: 8b87bde6-1c82-4572-9496-3081324b3204
  M3: 6f751068-91b9-4aa9-9181-f2eaafb23047
  M4: da173a79-432f-42ce-86b2-3999fa7e6573
project_registry: collection://32de047b-ad2d-48cd-97ef-ba9eb6a7a557
notion_page: https://www.notion.so/344e3aa05a83812cbdd2c125329f6494
author: Zachary McRay
---

# Forge ... PE fluency engine

> Backfill PRD. Forge has been Tier-2 daily-driven for weeks without a formal strategic frame. This is the first PRD it has ever had.

## 1. Press Release

**Forge: McRay Group's PE fluency engine.**

Forge takes Zack from "reads CIMs slowly" to "walks any partner through a full deal arc, from financials through operational decomposition to AI deployment plan to 90-day roadmap, fluently and with dollar estimates, in a live conversation." Daily commit-first reps with AI-graded feedback compound into PE-table credibility. Nine LMM scenarios, scenario overlays, a Learn module that maps directly to the practice flow, plus the strategic kicker: Stage 2 and Stage 3 modules turn deal analysis into AI-deployment recommendations and 90-day implementation plans, the consulting wedge no other PE training tool delivers.

> "Before Forge I'd need a week with a CIM to feel ready for a real partner conversation. Now I run reps in 15 minutes and walk in with a complete operational + AI playbook on the deal."
>
> ... Zack McRay, McRay Group

## 2. Problem Statement

> McRay Group's principal needs PE deal analysis fluency at conversational speed because every imminent Jaguar / VanCoe / Plains Capital engagement runs on credibility at the deal-table level. Today he reads CIMs slowly, calculates ad hoc, and has no structured environment to compound reps or to walk a partner through the full arc, from financials through operational decomposition to AI deployment plan to 90-day roadmap. With Forge, he gets a live, commit-first practice tool with AI-graded feedback that runs end-to-end deal arcs, captures fluency reps daily, and doubles as a portfolio proof point and demo asset in PE conversations.

**Beneficiary:** Zack as McRay Group's principal. Latent secondary beneficiary: PE associates / junior portfolio operators if Forge externalizes (out of MVP scope).

**Why now:**

The firm pivoted to consulting on 2026-04-03. First engagements (Andrea, Jaguar portcos) are imminent, and PE / real estate is emerging as the de facto vertical through warm relationships. Fluency at speed is the bottleneck between Zack and credible portco conversations. Forge has been shipping daily but has never had a PRD ... no Kill Conditions, no MVP cuts, no Decision Log. The Build Brief's Stage 2 + Stage 3 are the unshipped strategic kicker, and they aren't even in Linear backlog. Backfilling now closes the governance gap and forces an honest decision on the consulting wedge.

## 3. Mode

**Selective Expansion.**

Hold the existing baseline (commit-first, 9 scenarios, Learn v1, Bridge v1, scenario overlays). Cherry-pick which Brief vision items get promoted to MVP. Defer the rest with rationale. Pure Expansion would pretend Forge is a blank canvas; Hold would understate the moment and lock in the Stage 2 / Stage 3 gap permanently; Reduction is wrong for a healthy, daily-driven, growing tool. Selective Expansion is the honest ambition envelope.

## 4. Strategic Fit

**Flywheel served:** Consulting + Products (cross-cutting). Forge's primary leverage is direct on Consulting ... Zack's PE fluency translates to faster CIM reads, more credible PE-table conversations, and a working demo asset in warm PE outreach. Latent product candidacy: Forge is the most plausible internal tool to externalize (PE training programs, junior-associate onboarding) if/when the firm decides to productize.

**Leverage hypothesis:** Forge is the daily fluency gym for the PE side of McRay Group. Each rep compounds. The Brief's Stage 2 + Stage 3 are the strategic kicker, bridging from "Zack reads financials" to "Zack walks Tim/Jordan/Thomas through a complete deal arc including AI deployment plan and 90-day roadmap." That is the consulting wedge in PE conversations: not just analyzing the deal, but recommending the operational AI play. No other PE practice tool does this.

**Build vs buy:** No off-the-shelf option. Generic finance trainers (CFI, Wall Street Prep) teach concepts, not commit-first reps with AI feedback. PE-specific training (M&I, ASM) is content-only, no tooling. Building captures the wedge and produces reusable IP that becomes consulting deliverables.

**Closed-loop signal:** Reps reveal weak question types, drive Learn module priorities. Each scenario built becomes a real-world reference for client conversations. The CLAUDE.md Compound Learnings file already shows the pattern. Indirectly: portfolio proof for skeptical PE buyers ... "we built a PE-grade analysis tool ourselves, here's the live URL."

## 5. Features

| Feature | Status | Milestone | Linear |
|---|---|---|---|
| F1: Stage 1 practice engine (9 scenarios + commit-first + 6 question types + LLM feedback + 5 overlays) | MVP | M1 | MCR-14, MCR-15 |
| F2: Persistent scoring, streaks, weak-spot detection, dashboard | MVP | M1 | shipped, in PRD only |
| F3: Quick Fire screening mode (60-sec go/no-go) | MVP | M1 | shipped, in PRD only |
| F4: Learn module v1 (Sections 1-2) | MVP | M1 | shipped, in PRD only |
| F5: Value Creation Bridge v1 | MVP | M1 | shipped, in PRD only |
| F6: Cross-feature support (Cmd+K, dark mode, mobile responsive, tests, CI) | MVP | M1 | shipped, in PRD only |
| F7: LLM Chat for concept deep dives | MVP | M2 | MCR-16 |
| F8: Socratic Mode toggle for chat | MVP | M2 | MCR-17 |
| F9: Value Creation Bridge full module closeout | MVP | M2 | MCR-18 |
| F10: Learn module Section 3 (DD Deep-Dive) | MVP | M2 | MCR-93 |
| F11: Learn module micro-exercises tied to real data | MVP | M2 | MCR-94 |
| F12: New data layers per company (operations, aiOpportunities, implementationContext) | MVP | M3 | MCR-95 |
| F13: Stage 2A Process Decomposition exercise | MVP | M3 | MCR-96 |
| F14: Stage 2B AI Opportunity Identification + ranking | MVP | M3 | MCR-97 |
| D1: Stage 3A Solution Classification | Defer | M4 | MCR-98 |
| D2: Stage 3B 90-Day Implementation Roadmap builder | Defer | M4 | MCR-99 |
| D3: LLM-Generated Dynamic Scenarios | Defer | M4 (with Kill condition) | MCR-19 |
| D4: Granola integration for session capture | Defer | M4 | MCR-100 |

## 6. Success Criteria

**Quantitative:**

- 3+ Forge sessions per week (Mon + Fri PE Learning workblock + 1 ad hoc) sustained over rolling 4-week windows
- Median session length 15-30 minutes
- Question accuracy delta improving over rolling 4-week window (visible in dashboard weak-spot trend)
- 9 canonical scenarios with complete Stage 2 data layers (operations + aiOpportunities + implementationContext) by end-July 2026
- LLM cost per active week under $30

**Qualitative:**

- Zack reports faster CIM-to-thesis time in real PE conversations
- Forge becomes a cited reference in PE meetings ("we built a tool that does this") in 2+ early consulting conversations
- Compound learnings flow back into McRay Group operations playbook on a sustained cadence

**Leverage realized (internal):**

- 1+ live PE conversation where Forge directly informs the deal analysis (Tim, Jordan, or Thomas) by end-Q3 2026
- Stage 2 module ships before first paid Jaguar portco engagement
- Forge demo cited as a differentiator in 2+ early consulting conversations

## 7. Kill Conditions

We kill or radically rescope Forge if any of the following hold:

- Forge sessions drop below 1 per week for 4 consecutive weeks (signal: not actually being used)
- Stage 2 build cost exceeds 60 hours of focused work without shipping F13 or F14
- LLM cost per month exceeds $150 with no offsetting consulting revenue path
- After M3 ships, no real PE conversation actually leverages Forge's Stage 2 outputs (signal: Forge is a learning vehicle but not a consulting wedge ... refactor to learning-only or sunset)
- Compound time-to-fluency in real CIM reads does not measurably improve over a 90-day window post-M3 (signal: reps aren't translating)

## 8. Out of Scope

- Public / external version (PE training programs, junior-associate onboarding). Hybrid path; locked Internal for v1. Future PRD if/when the firm decides to externalize.
- Live deal mode (paste a real CIM, run analysis on it instead of canonical scenarios). The most ambitious bridge from "practice" to "production tool." Future PRD.
- Mobile-native UI. Web-responsive only via existing AppShell.
- Voice input or output.
- Multi-user collaboration (Zack works solo on deals).
- Non-LMM company profiles (mid-market enterprise, public companies, very small businesses). 9 LMM scenarios is the canonical depth.
- Custom LLM fine-tuning. Base Anthropic models + system prompt are sufficient for MVP.
- Integration with external CRMs or deal pipelines.

## 9. Dependencies

**Hard dependencies (cannot ship without):**

- Anthropic API access with sufficient rate limits for daily session volume ... [status: shipped via Vercel serverless]
- Vercel deployment + GitHub Actions CI ... [status: shipped]
- The 9 canonical company financial datasets ... [status: shipped]

**Soft dependencies (harder without, but possible):**

- Granola integration for session capture (D4 deferred). Manual compound-learnings capture works in the meantime.
- Bridge full module closeout (F9, MCR-18). Bridge v1 ships independently of Stage 2.

**Assumptions (if broken, trigger Kill Conditions):**

- Zack's PE Learning workblock cadence holds (Mon/Fri) at meaningful frequency
- First engagements (Andrea, Jaguar portcos) materialize and create real-world validation surface
- Anthropic pricing remains within current cost envelope
- LLM quality on PE-specific concepts is at or above current baseline

## 10. Feature Details

### F1: Stage 1 practice engine (SHIPPED)

**Description:** 9 LMM company scenarios with full 2-year financials, 6 question types (metric, adjustment, valuation, risk, diagnostic, thesis), commit-first analysis flow that locks the user's answer before reveal, side-by-side comparison with delta bands (exact / close / off / way off) for quantitative answers, LLM-graded structured feedback for qualitative answers (score, strengths, gaps, suggestion), and 5 scenario overlays (top customer leaves, founder departure, IC reclassification, owner exit, flat growth) that toggle parameter variations on the canonical companies.

**Cagan Risk Assessment (retrospective):**

- **Value:** Validated. Daily use over multiple weeks proves the rep loop has pull.
- **Usability:** Validated. Commit-first UX has shipped, been refined, and survived adversarial review (per CLAUDE.md compound learnings 2026-04-14).
- **Feasibility:** Resolved. Vite + React + Vercel serverless + Anthropic Haiku stack performs at production quality.
- **Viability:** Resolved at current scale. Cost envelope monitored. Internal-only deployment removes external scaling risk.

**Linear:** MCR-14 (9 scenarios, Done), MCR-15 (commit-first flow, Done).

### F2: Persistent scoring, streaks, weak-spot detection, dashboard (SHIPPED)

**Description:** All scoring data persists in localStorage under `forge-data`. Schema captures sessions (date, companyId, duration, per-question score / delta / unit), streak (current + last date), and surfaces a ProgressDashboard with mastery cards, weak-spot focus areas (avg score below 3.5 with 2+ attempts), accuracy trends, and module-level progress.

**Cagan Risk Assessment (retrospective):** All four risks resolved. Validated by real use; LMM-relevant analytics; clean React + localStorage implementation with round-trip tests; no external dependencies.

**Linear:** shipped, no Linear issue (see Decision Log: shipped baseline backfill kept in PRD only).

### F3: Quick Fire screening mode (SHIPPED)

**Description:** 60-second timed go / no-go decision per company in shuffled order. Forces fast-pattern recognition; mirrors the "first 15 minutes of a CIM review" PE workflow. Results summary at end captures decision rationale per company.

**Cagan Risk Assessment (retrospective):** All resolved. UX is well-received in daily reps. Pattern is reusable for future Stage 2 quick-recognition exercises.

**Linear:** shipped, no Linear issue (see Decision Log: shipped baseline backfill kept in PRD only).

### F4: Learn module v1 (Sections 1-2) (SHIPPED)

**Description:** Three-section, ten-subsection learn module with 11 components in `src/components/learn/`. Covers the Brief's Section 1 (the three financial statements: P&L, balance sheet, cash flow with PE-buyer's lens) and Section 2 (first-pass screening metrics). Includes per-lesson notes, progress tracking, and content from `src/data/learnContent.js`.

**Cagan Risk Assessment (retrospective):** Validated. Content production was the lift; engineering pattern is now reusable for Section 3 and micro-exercises.

**Linear:** shipped, no Linear issue (see Decision Log: shipped baseline backfill kept in PRD only).

### F5: Value Creation Bridge v1 (SHIPPED)

**Description:** Initial Bridge UX with scenario set covering core PE value-creation levers. Per CLAUDE.md compound learnings (2026-04-14), Phase 2 of Bridge shipped with BridgeList, scenarios with debt-paydown lever, and plan-case scenario rendering. Adversarial review (Codex) caught 3 P1/P2 bugs that 5 Claude reviewers missed.

**Cagan Risk Assessment (retrospective):** Mostly resolved at v1 scope. F9 (full module closeout in M2) addresses the remaining content gap.

**Linear:** shipped, no Linear issue (see Decision Log: shipped baseline backfill kept in PRD only). Note: drift between MCR-18 (full module, Backlog) and shipped Bridge v1 was resolved by re-scoping MCR-18 to "remainder beyond v1." Decision Log captures the split.

### F6: Cross-feature support (SHIPPED)

**Description:** Cmd+K search across companies / metrics / Learn content; dark mode toggle (`useTheme`); mobile-responsive AppShell with collapsible sidebar and hamburger; per-lesson notes (`useNotes`); 15 test files via Vitest covering scoring logic, data integrity, LLM eval client, utility functions, timer behavior, and component rendering; GitHub Actions CI on push/PR to main.

**Cagan Risk Assessment (retrospective):** Resolved. Test coverage flagged as a strength in adversarial reviews.

**Linear:** shipped, no Linear issue (see Decision Log: shipped baseline backfill kept in PRD only).

### F7: LLM Chat for concept deep dives (IN FLIGHT)

**Description:** Chat drawer in the lesson view that lets the user ask follow-up questions on any concept on screen. Answers are tailored to the current scenario, the user's prior interactions in the session, and the lesson context. Suggested questions per topic. Reference: `docs/plans/2026-03-30-001-feat-llm-chat-concept-deep-dives-plan.md`.

**Cagan Risk Assessment:**

- **Value:** High. Beta interviews and self-observation show "I don't understand X" is the #1 friction point in current Forge sessions.
- **Usability:** High. Chat UX is well-known pattern; main risk is users not realizing the chat is context-aware.
- **Feasibility:** High. Anthropic API + system prompt + Forge session state. No new infrastructure beyond what Stage 1 already uses.
- **Viability:** Medium. LLM cost per session is the main concern; need to monitor token use and possibly cap.

**Linear:** [MCR-16](https://linear.app/mcraygroup/issue/MCR-16) (In Progress).

### F8: Socratic Mode toggle for chat (PLANNED)

**Description:** Direct / Socratic toggle in the chat drawer. Socratic mode asks guiding questions ("What do you think depreciation represents?") instead of giving direct answers. Khanmigo pattern. Depends on F7 shipping first.

**Cagan Risk Assessment:**

- **Value:** Medium-High. Socratic mode is pedagogically validated for retention; matches Forge's commit-first ethos.
- **Usability:** Medium. Toggle discoverability matters; default-state choice is the call (default-off is safer for first-time users; default-on for returning users may be the right ramp).
- **Feasibility:** High. Same infrastructure as F7; prompt engineering work.
- **Viability:** High. Same cost envelope as F7.

**Linear:** [MCR-17](https://linear.app/mcraygroup/issue/MCR-17) (Backlog).

### F9: Value Creation Bridge full module closeout (PLANNED)

**Description:** Complete the Bridge module beyond v1. Full coverage of PE value creation levers (revenue, margin, multiple expansion, leverage, M&A, talent / management upgrades) with scenario walkthroughs, lever-specific exercises, and connection to the Stage 1 question pool.

**Cagan Risk Assessment:**

- **Value:** High. Bridges from "read financials" to "understand value creation levers" ... matches Brief intent and consulting use case.
- **Usability:** Medium. Content-heavy; depends on existing lesson UX patterns.
- **Feasibility:** Medium. Content production is the lift, not engineering. Pattern from Bridge v1 is reusable.
- **Viability:** High. Pure leverage on existing Forge stack; no new infrastructure.

**Linear:** [MCR-18](https://linear.app/mcraygroup/issue/MCR-18) (Backlog, re-scoped to "remainder beyond v1" per Decision Log).

### F10: Learn module Section 3 (DD Deep-Dive) (NEW)

**Description:** Brief's Section 3 content: Revenue Quality (organic vs inorganic growth, cohort analysis, pricing power, contract terms), EBITDA Quality / add-back deep-dive (owner comp normalization, one-time vs recurring, related-party transactions, pro-forma adjustments), Working Capital & Cash Conversion, Leverage & Return Metrics (Net Debt / EBITDA, DSCR, EV/EBITDA multiple, implied equity value).

**Cagan Risk Assessment:**

- **Value:** High. DD lens is the actual PE-buyer mindset; closing the Learn module gap is foundational to everything in Stage 1+.
- **Usability:** High. Same pattern as Sections 1-2.
- **Feasibility:** High. Pure content + existing component pattern.
- **Viability:** High. Low cost, high leverage.

**Linear:** [MCR-93](https://linear.app/mcraygroup/issue/MCR-93) (Backlog, M2).

### F11: Learn module micro-exercises tied to real company data (NEW)

**Description:** Implement Brief's design principle: "every concept taught in the learn module should be exercised at least once before the user encounters it in stage one practice." Inline calc inputs in lessons referencing canonical company data (e.g., "Calculate Coastal Foods' gross margin," "Calculate DSO for Coastal Foods," "What's the owner-comp add-back for Summit?").

**Cagan Risk Assessment:**

- **Value:** High. Connects abstract concept to live data to muscle memory. Brief's pedagogical core.
- **Usability:** Medium. Requires inline calc inputs; can reuse the commit-first pattern from Stage 1.
- **Feasibility:** Medium. Some pattern reuse from Stage 1; some new exercise types.
- **Viability:** High.

**Linear:** [MCR-94](https://linear.app/mcraygroup/issue/MCR-94) (Backlog, M2).

### F12: New data layers per company (NEW)

**Description:** Three new properties on each company: `operations` (process maps for cost centers and revenue functions, including description, headcount, cost allocation, manual sub-processes, current tools, data quality assessment); `aiOpportunities` (scored assessment per process: feasibility H/M/L, EBITDA impact range, recommended tier 1/2/3, complexity notes, dependencies, risks); `implementationContext` (tech stack, IT capability none/basic/moderate, management openness, data infrastructure quality, regulatory constraints). Prerequisite for F13 and F14.

**Cagan Risk Assessment:**

- **Value:** Foundational. Without this, F13 and F14 cannot ship.
- **Usability:** N/A (data layer, not UX).
- **Feasibility:** Medium. Content production for 9 companies is the lift; data schema and validation pattern is straightforward.
- **Viability:** High. Once built, data is reusable across F13, F14, D1, D2, and in real client conversations.

**Linear:** [MCR-95](https://linear.app/mcraygroup/issue/MCR-95) (Backlog, M3).

### F13: Stage 2A Process Decomposition exercise (NEW)

**Description:** Present a P&L line item (e.g., COGS, SGA), ask the user to decompose it into operational activities (functions, approximate headcount, sub-processes). User commits free-text decomposition. Tool reveals the realistic process map for that company. User compares instincts against the revealed map. Scoring captures decomposition quality (functions identified, sub-processes named, scale calibration).

**Cagan Risk Assessment:**

- **Value:** Very High. The core consulting wedge. "I can read your P&L" is table stakes; "I can decompose your COGS into the actual operational activities and tell you what your humans are doing" is what wins PE consulting work. Direct addressable need for the leverage hypothesis.
- **Usability:** Medium. Free-text decomposition + reveal is an unfamiliar UX pattern. Risk: users freeze at the empty input. Mitigation: starter prompts, optional structure scaffold.
- **Feasibility:** Medium. Depends on F12 data layer being built. Engineering moderate (new exercise type, reveal pattern, comparison logic).
- **Viability:** High. Once built, data is reusable across all subsequent stages and in client conversations.

**Linear:** [MCR-96](https://linear.app/mcraygroup/issue/MCR-96) (Backlog, M3).

### F14: Stage 2B AI Opportunity Identification + ranking (NEW)

**Description:** After F13's process map reveal: "Which processes are AI automation candidates? Rank top 3 by EBITDA impact." User selects and ranks. Tool reveals a scored impact / feasibility matrix and grades the user's ranking against it. Scoring captures: did you correctly assess impact vs feasibility, did you account for company technical readiness, did you identify the right top priority.

**Cagan Risk Assessment:**

- **Value:** Very High. This is the consulting deliverable: "given a deal, here's the AI opportunity stack ranked by EBITDA impact." Directly mirrors what would be walked through with Tim, Jordan, or Thomas.
- **Usability:** Medium-High. Ranking UX is well-known (drag-rank or numbered selection); main risk is the impact / feasibility matrix being legible.
- **Feasibility:** Medium. Builds directly on F12 + F13. Engineering moderate.
- **Viability:** High. Reusable in real client work.

**Linear:** [MCR-97](https://linear.app/mcraygroup/issue/MCR-97) (Backlog, M3).

## 11. Deferred Features

| Feature | Why Deferred | Target Milestone | Linear |
|---|---|---|---|
| D1: Stage 3A Solution Classification (Tier 1/2/3) | Depends on F13 + F14 working. Defer until Stage 2 reps prove the pattern. Less directly leveraged in current PE-table conversations than Stage 2. | M4 | [MCR-98](https://linear.app/mcraygroup/issue/MCR-98) |
| D2: Stage 3B 90-Day Implementation Roadmap builder | Most expensive feature in the Brief. Depends on D1 being clean. UX is the easiest piece in the Brief to over-design. | M4 | [MCR-99](https://linear.app/mcraygroup/issue/MCR-99) |
| D3: LLM-Generated Dynamic Scenarios | Brief vision was canonical-deep, not infinite-shallow. Risk of dilution. Defer with Kill condition: if Stage 2 ships and dynamic scenarios still don't prove unique value vs the canonical 9, Kill in next Refresh. | M4 (with Kill condition) | [MCR-19](https://linear.app/mcraygroup/issue/MCR-19) |
| D4: Granola integration for session capture | Soft dependency from Brief. Not load-bearing for any MVP feature. Manual compound-learnings capture works in the meantime. Consider Kill if compound-learning workflow stays manual and works fine. | M4 | [MCR-100](https://linear.app/mcraygroup/issue/MCR-100) |

## 12. Killed Features

None in v1. Several features (D1, D2, D3, D4) carry explicit Kill conditions in their Defer rationale and will be re-evaluated at the next Refresh.

## 13. Milestones

**M1 ... Foundation (SHIPPED):**

- F1: Stage 1 practice engine
- F2: Persistent scoring + streaks + weak-spot dashboard
- F3: Quick Fire screening mode
- F4: Learn module v1 (Sections 1-2)
- F5: Value Creation Bridge v1
- F6: Cross-feature support (Cmd+K, dark mode, mobile responsive, tests, CI)

End-state: a working daily-driven Forge with full Stage 1 fluency loop, scoring, and Learn v1.

**M2 ... In-flight kicker (target: end-May 2026):**

- F7: LLM Chat for concept deep dives
- F8: Socratic Mode toggle
- F9: Bridge full module closeout
- F10: Learn module Section 3 (DD Deep-Dive)
- F11: Learn module micro-exercises tied to real data

End-state: Forge has in-flow tutoring (Direct + Socratic), Learn module is complete (Sections 1-3 + micro-exercises), Bridge module is fully shipped.

**M3 ... Consulting wedge / Stage 2 (target: end-July 2026):**

- F12: New data layers (operations, aiOpportunities, implementationContext)
- F13: Stage 2A Process Decomposition
- F14: Stage 2B AI Opportunity Identification

End-state: Forge bridges from analysis to operational AI deployment recommendations. The consulting wedge is live and ready for real PE conversations.

**M4 ... Post-MVP (undated):**

- D1: Stage 3A Solution Classification
- D2: Stage 3B 90-Day Implementation Roadmap
- D3: Dynamic Scenarios (with Kill condition)
- D4: Granola integration

## 14. Open Questions

- Should Forge externalize, and if so when? Hybrid path; Phase 1 locked Internal for v1. Future PRD if/when the firm decides to externalize. Trigger to consider: 2+ unsolicited inbound asks from PE training programs or junior-associate teams.
- Live deal mode (paste a real CIM, run analysis on it instead of canonical scenarios): build, defer, or kill? Captured as Out of Scope for v1; revisit if Stage 2 validates the consulting-wedge thesis and a real deal would benefit.
- Pricing model if Forge ever externalizes: out of scope, flagged for future.
- Compound-learnings auto-capture via Granola (D4): build it in M4, or keep manual indefinitely? Decide at next Refresh based on whether manual capture feels brittle.
- Dynamic Scenarios (D3 / MCR-19): does it earn its keep after Stage 2 ships? Carries an explicit Kill condition; decide at next Refresh.
- Default state for Socratic Mode (F8): off (safer first-time UX) or on (more ambitious learning posture)? Decide during F8 build.
- Should F12 data layers be built per-company in batches, or all 9 companies at once for one company first? Affects M3 sequencing and risk profile.

## 15. Decision Log

### 2026-04-29 ... initial creation

- **Mode:** NEW backfill. Forge_v2_Build_Brief.docx (March 18, 2026) is strategic source material, not a formal prior PRD. Treating as Forge's first PRD avoids drift detection overhead and produces a cleaner artifact.
- **Council mode:** Selective Expansion. Backfill on a live tool sits between Hold and Expansion; Selective Expansion is the honest envelope.
- **Type:** Internal. Forge serves Zack as McRay Group's principal; latent secondary beneficiary (PE associates if externalized) is out of scope for v1.
- **Customer locked:** Zack as McRay Group's principal. Press release and problem statement frame him as the primary user.
- **Strategic kicker locked:** Stage 2 (Process Decomposition + AI Opportunity ID) is the consulting wedge that differentiates Forge from generic PE practice tools. The press release explicitly elevates this.
- **Bridge drift acknowledged:** MCR-18 in Linear is in Backlog, but the CLAUDE.md compound learnings file (2026-04-14) shows Bridge Phase 2 shipped. Resolved by splitting: F5 (Bridge v1, shipped) vs F9 (Bridge full module closeout, in-flight). MCR-18 re-scoped to "remainder beyond v1."
- **Defer with Kill condition: D3 Dynamic Scenarios.** Rationale: Brief vision was canonical-deep, not infinite-shallow. If Stage 2 ships and dynamic scenarios still don't prove unique value vs the canonical 9, Kill in next Refresh.
- **Stage 3 deferred:** D1 + D2 (Solution Classification + 90-Day Roadmap builder) depend on Stage 2 validation. Most expensive features in the Brief; honest sequencing puts them post-MVP.
- **Aggressive timeline locked:** M2 by end-May 2026, M3 by end-July 2026. Reflects active prioritization in PE Learning workblock cadence.
- **Forward MVP count:** 8 features (F7-F14). Foundation milestone (M1, F1-F6) is shipped reality, not forward MVP. Under the 10-cap.
- **No outright Kills in v1.** All non-MVP work has rationale and (where relevant) Kill conditions tied to next Refresh.

### 2026-04-29 ... Initiative skipped (post-Phase 8 cleanup)

- **What:** Skipped creating a Linear Initiative for this PRD.
- **Why:** Linear's hierarchy has Initiatives as workspace-level strategic groupings of *multiple projects*. Forge is a single project. A single-project Initiative is a layer-of-one wrapper with no rollup value. The Caspian skill template incorrectly defaulted to "every PRD needs an Initiative"; the correct mapping is PRD ↔ Project for project-level scope, PRD ↔ Initiative only when multiple projects share a strategic theme (firm-level scope or cross-project bundles).
- **Approval:** User pushback during post-Phase-8 review.
- **Linear:** No Initiative created. Forge project (`ca010233-45c6-490c-b4f3-019be819aed2`) + 4 Milestones + 14 Issues are the complete hierarchy.
- **PRD section affected:** Frontmatter `linear_initiative` field changed from `none-manual-create-pending` to `not-applicable-single-project-scope`. Linear Forge project description updated to remove the pending-Initiative reference.
- **Future trigger for Initiative creation:** if Forge spawns multiple Linear projects (e.g., Forge web + Forge mobile + Forge enterprise), or if a multi-project strategic theme emerges (e.g., "PE consulting wedge" rolling up Forge + Palenque + a future deal-flow tool), revisit at next Refresh.

## 16. References

- [Forge_v2_Build_Brief.docx](../../Forge_v2_Build_Brief.docx) ... March 18, 2026 strategic build doc; primary source material for Phase 5 inventory and Phase 6 cuts
- [Forge PROJECT.md](../../PROJECT.md) ... project-level identity, milestones, build log
- [Forge CLAUDE.md](../../CLAUDE.md) ... build-time conventions, key decisions, compound learnings file
- [Linear: Forge project](https://linear.app/mcraygroup/project/forge-dcd24bc1248f) ... live build state
- [Notion: Project Registry entry for Forge](https://www.notion.so/344e3aa05a83812cbdd2c125329f6494) ... portfolio-level entry
- McRay Group context: `/Users/zacharymcray/Documents/Work/00_Context/McRayGroup.md` ... firm strategy and pipeline
- Caspian session file: `/40_OS/08_Memory/caspian-sessions/active/2026-04-29-forge-backfill.md`
- Brief context: Brief Sections 1A-1C teach the three financial statements with PE buyer's lens; Section 2 teaches first-pass screening metrics; Section 3 (3A revenue quality, 3B EBITDA quality with add-back deep-dive, 3C working capital, 3D leverage and return metrics) teaches DD lens. Sections 1-2 shipped in F4; Section 3 ships in F10.
