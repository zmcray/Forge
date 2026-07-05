# Curriculum Gaps: Deal Process, QoE, Sources & Uses, Debt Structuring, Downside Drills

---
Created: 2026-07-05
Flow: standard
Tier: 2
Linear Project: Forge
Linear Issue: (created at kickoff, see PR)
Task: Build the five curriculum gaps identified in the 2026-07-04 principal-level curriculum review
---

## Context

The accuracy pass (PR #50) fixed everything wrong in the existing curriculum. This plan builds what is *missing*, per the review: (1) QoE content with a "find what's wrong with this EBITDA" drill, (2) sources & uses in the LBO math, (3) deal process content (sourcing through close), (4) debt structuring, (5) downside-case discipline.

Design constraints:
- All new content uses EXISTING block types only (`text`, `metricTable`, `lineItemTable`, `exercise`, `companyData`, `notes`). No component changes.
- Every number below is pre-verified by script. Execution agents write prose around pinned numbers; they do not derive new ones.
- No em dashes anywhere. Conventional commits. All commands from `app/`.
- After each workstream: `npm test` must be green (watch for tests asserting section/subsection counts or question shapes).

## Numeric anchors (verified 2026-07-05)

**Coastal QoE (WS1):** NI walk 2024 to 2025 (0.9 to 0.2, delta -0.7): SGA -0.5, depreciation -1.0, interest -0.1, other income +0.9. Reported EBITDA 2.9 INCLUDES the +0.9 one-time other income (EBITDA = NI + D + A + I). QoE-adjusted: 2.9 - 0.9 = 2.0 operating EBITDA, + 1.0 legit add-backs = ~3.0 vs the claimed 3.9 (a 23% haircut). At 5x: EV 19.5 claimed vs 15.0 QoE, a $4.5M price gap. Depreciation doubled (1.1 to 2.1) against only 0.8 capex and 5.5 gross PPE: unexplained, could be useful-life change, prior-year capex catch-up, or book/tax conflation; a QoE would demand the fixed asset register.

**Sources & Uses on TrueNorth deal (WS2):** Uses: 18.0 purchase EV + 0.5 transaction fees (~2.75%) + 0.2 financing fees (~2% of debt) + 0.3 minimum cash = 19.0. Sources: 10.8 debt + 8.2 sponsor equity. Real MOIC = 47.0 / 8.2 = 5.7x vs the 6.5x headline (fees cost most of a turn).

**Downside drills (WS2):** (a) TrueNorth bear: zero growth, exit 5x: EV 15.0, equity 12.2, MOIC 12.2/7.2 = 1.7x. (b) 4H base deal bear: EBITDA 5.0 falls 20% to 4.0, exit 5x (one turn compression): EV 20, debt 8, equity 12, MOIC 12/15 = 0.8x. Equity LOSES money on a -20% EBITDA move. Leverage cuts both ways.

**Summit DSCR (WS4):** Adjusted EBITDA 5.5, maintenance capex ~1.5. At 3.0x leverage (16.5 debt, 9% rate, 7-yr straight-line am): service = 2.36 principal + 1.49 interest = 3.85; DSCR = (5.5-1.5)/3.85 = 1.04x. FAILS the 1.25x standard. At 2.5x (13.75 debt): service = 1.96 + 1.24 = 3.20; DSCR = 4.0/3.20 = exactly 1.25x. Lesson: amortization schedule, not the leverage multiple, is the binding constraint.

## Workstreams (sequential; all but WS1's companies.js edit touch learnContent.js)

### WS1: QoE subsection 3E + Coastal drill — model: OPUS
- New learnContent subsection `s3e` "3E. Quality of Earnings" in Section 3: what a QoE is (sell-side vs buy-side, who pays), proof of cash, the EBITDA quality bridge, the other-income trap, D&A anomalies, revenue recognition checks. Worked Coastal example using the pinned NI walk and the 2.9 to 2.0 to 3.0 bridge. lineItemTable of common QoE adjustments. Ends with qualitative exercise: run the quality check on Coastal's claimed $3.9M.
- companies.js: add `coastal-foods-q5` (type diagnostic, keywords) asking the trainee to find what is wrong with the $3.9M adjusted EBITDA; model answer = pinned bridge. Add two Coastal redFlags: the $0.9M other income inside EBITDA, and the D&A doubling against $0.8M capex.
- Update any test that asserts Coastal question count; run full suite.

### WS2: Sources & Uses + downside drills in Section 4 — model: OPUS
- In `s4b` (LBO Economics), after the MOIC exercise: new "reality check" text + metricTable with the pinned S&U, explicitly framed as a refinement of the stylized 7.2 equity number (do NOT alter the existing calculationExercises). State the 5.7x vs 6.5x fee drag.
- New qualitative exercise in `s4b`: TrueNorth bear case (pinned: 1.7x).
- In `s4-rtn` (4H Return Analysis): new downside exercise on the same base deal (pinned: 0.8x MOIC at -20% EBITDA and 5x exit), with model answer teaching that leverage is symmetric and a thesis needs a survivable bear case, plus what a broken-deal post-mortem asks.

### WS3: New Section 5 "Deal Process & Execution" — model: SONNET
Four subsections, prose frameworks, qualitative exercises, no new numbers beyond cross-references:
- 5A Sourcing & Screening: proprietary vs brokered flow, teaser/CIM anatomy, IOI (what it contains, non-binding), funnel math culture (100 looks : 10 IOIs : 2 LOIs : 1 close).
- 5B LOI & Exclusivity: binding vs non-binding terms, price AND structure, exclusivity as the seller's biggest concession, re-trading norms and reputation.
- 5C Diligence Workstreams: who does what (QoE firm, legal, insurance, background), the databook, confirmatory vs exploratory DD, cross-reference 3E for QoE mechanics and 3C for the NWC peg.
- 5D Purchase Agreement & Close: reps and warranties, indemnification caps/baskets/survival, escrow vs R&W insurance, closing mechanics, cross-reference the 3C peg.
Each subsection: objectives, skillTags, timeEstimate, suggestedQuestions, at least one exercise with a model answer, notes block. Match existing subsection structure exactly.

### WS4: Debt structuring subsection 4J — model: OPUS
- New subsection appended to Section 4 (id `s4-debt`, title "4J. Financing the Deal") so no relabeling of 4A-4I.
- Content: the LMM capital stack (senior bank, unitranche, mezzanine, seller note, SBA 7(a) with $5M cap and personal guarantee context, rollover equity) as a metricTable with typical pricing and position; covenants (leverage, fixed-charge/DSCR); the pinned Summit DSCR worked example (3.0x fails at 1.04x, 2.5x passes at exactly 1.25x); why seller notes signal seller confidence; quantitative exercise computing the 2.5x DSCR, qualitative exercise structuring Summit's stack.

### WS5: Verification — model: OPUS
Fresh agent recomputes every numeric claim in the new content against companies.js and the pinned anchors, checks block-type validity against existing renderer expectations (grep the Learn components for handled block types), checks cross-references (3E, 3C, 4G section ids), runs full suite, and reports pass/fail per claim. Fix anything it finds before final commit.

### Integration (me)
- Update AGENTS.md learnContent architecture line (sections/subsection counts).
- Final test + build, commit sequence, PR, CI watch.

## Model rationale
Opus where content must derive-and-tie against live data or where finance nuance is load-bearing (WS1, WS2, WS4, WS5). Sonnet for WS3 which is prose frameworks against a fixed outline. Haiku nowhere: no purely mechanical work large enough to justify a handoff.

## Outcome
(filled at wrap)
