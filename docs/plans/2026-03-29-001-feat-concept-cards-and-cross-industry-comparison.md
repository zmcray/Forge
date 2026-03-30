---
title: "feat: Concept Cards & Cross-Industry Risk Comparison"
type: feat
status: planned
date: 2026-03-29
---

# feat: Concept Cards & Cross-Industry Risk Comparison

## Overview

Add two complementary learning features to Forge that transform it from a pure practice tool into a study + practice system. Concept Cards teach PE financial mechanics one topic at a time with company-grounded examples. Cross-Industry Comparison lets users see how the same risk or dynamic plays out differently across industries using Forge's existing 9-company dataset.

Both features live under the existing `/learn` route and reuse existing data structures. No new API dependencies. No backend changes.

## Problem Statement / Motivation

Forge currently has two modes: Practice (question-by-question drill on individual companies) and Learn (static content with 3 sections, 10 subsections). The gap:

1. **No concept-level study.** A user who doesn't understand EBITDA add-backs has no way to study that concept in isolation before hitting it in practice. The Learn module covers topics but doesn't connect them to the actual company data.

2. **No cross-company thinking.** Practice is always single-company. But the real PE skill is pattern recognition: seeing how customer concentration risk looks different in a food distributor vs. a SaaS company vs. a 3PL. Forge has 9 companies across diverse industries but no way to compare them.

These features directly support the PE Learning daily block (45 min): 15 min studying a concept card, then 20 min of Forge reps where that concept appears in context.

## Feature 1: Concept Cards

### What It Is

A deck of single-topic reference cards, each covering one PE financial mechanic. Each card has:
- **Concept name and one-line definition** (e.g., "EBITDA Add-backs: Adjustments that normalize earnings to reflect true operating performance")
- **Why it matters in PE** (2-3 sentences on how this concept affects deal evaluation)
- **How to spot it** (what to look for in financials, red flags, rules of thumb)
- **Live examples from Forge companies** (pull real numbers from `companies.js` to illustrate)
- **Practice prompt** (a single question the user can answer, grounded in a specific company, that tests this concept)
- **Reference card output** (after studying, the user can "save" a personal summary... stored in localStorage alongside scoring data)

### Proposed Card Topics (Month One: 8 Cards)

| # | Topic | Companies Referenced | Key Numbers |
|---|-------|---------------------|-------------|
| 1 | EBITDA Add-backs | Summit (owner comp), Precision (one-time legal) | Specific add-back line items from company data |
| 2 | LBO Economics | TrueNorth (SaaS, low capex), Ironclad (heavy capex) | Revenue, EBITDA, implied debt capacity |
| 3 | Margin Drivers | Coastal (gross margin pressure), BrightSmile (labor leverage) | Gross/EBITDA margins Y1 vs Y2 |
| 4 | Cash Conversion | Meridian (working capital intensive), TrueNorth (SaaS cash flow) | FCF vs EBITDA, working capital changes |
| 5 | Customer Concentration | Coastal (top customer 38%), Apex (diversified) | Revenue breakdown, concentration % |
| 6 | Key-Person Risk | Summit (founder-operator), Precision (owner as sole estimator) | Revenue tied to individual, succession indicators |
| 7 | Valuation Multiples | TrueNorth (SaaS 8-10x) vs Summit (HVAC 5-7x) vs Meridian (3PL 6-8x) | TEV/EBITDA ranges by industry |
| 8 | Investment Thesis Structure | BrightSmile (roll-up thesis) vs Vitality (similar model, different vertical) | Growth rates, unit economics |

### Data Architecture

```javascript
// app/src/data/conceptCards.js

export const conceptCards = [
  {
    id: "ebitda-addbacks",
    title: "EBITDA Add-backs",
    oneLiner: "Adjustments that normalize earnings to reflect true operating performance.",
    whyItMatters: "Add-backs directly impact enterprise value. A $500K add-back at 6x multiple = $3M of value created (or destroyed if the buyer disagrees). Aggressive add-backs are the #1 source of post-close disputes in LMM deals.",
    howToSpot: [
      "Look for owner compensation above market rate (common in founder-led businesses)",
      "One-time expenses that recur suspiciously often",
      "Related-party transactions (rent, consulting fees to family)",
      "Pro forma adjustments with no historical basis"
    ],
    redFlags: [
      "Add-backs exceed 30% of reported EBITDA",
      "More than 3 categories of adjustments",
      "No documentation or third-party validation"
    ],
    companyExamples: [
      {
        companyId: "summit",
        label: "Summit Mechanical Services",
        narrative: "Owner compensation is ${summit.adjustments.ownerComp} above market rate for a GM. This is the most common and defensible add-back in founder-led HVAC businesses.",
        // Reference: pulls from companies.js at render time
        dataPoints: ["adjustments.ownerComp", "ebitda.reported", "ebitda.adjusted"]
      },
      {
        companyId: "precision",
        label: "Precision CNC Solutions",
        narrative: "One-time legal fees of ${precision.adjustments.legal} from a patent dispute. Defensible if truly non-recurring, but check: has Precision had legal fees in prior years?",
        dataPoints: ["adjustments.legal", "ebitda.reported", "ebitda.adjusted"]
      }
    ],
    practicePrompt: {
      companyId: "summit",
      question: "Summit's owner takes $450K in total comp. Market rate for a GM in this geography and industry is $200K. Walk through how you'd handle this add-back and what questions you'd ask in diligence.",
      questionType: "adjustment"
    },
    userNotes: null // Populated by user, persisted in localStorage
  },
  // ... 7 more cards
];
```

### UI/UX

**Entry point:** New tab in the Learn module nav: "Practice" | "Learn" | **"Concepts"**

**Card layout:**
```
+------------------------------------------+
| EBITDA Add-backs                    1/8   |
| Adjustments that normalize earnings...    |
+------------------------------------------+
|                                          |
| WHY IT MATTERS IN PE                     |
| Add-backs directly impact enterprise...  |
|                                          |
| HOW TO SPOT IT                           |
| * Look for owner compensation above...   |
| * One-time expenses that recur...        |
|                                          |
| RED FLAGS                                |
| * Add-backs exceed 30% of reported...    |
|                                          |
+------------------------------------------+
| LIVE EXAMPLES                            |
|                                          |
| Summit Mechanical Services               |
| Owner comp add-back: $250K               |
| Reported EBITDA: $4.2M -> Adj: $4.45M   |
| "Most common add-back in founder-led..." |
|                                          |
| Precision CNC Solutions                  |
| One-time legal: $180K                    |
| Reported EBITDA: $1.8M -> Adj: $1.98M   |
| "Defensible if truly non-recurring..."   |
+------------------------------------------+
| PRACTICE                                 |
| [Try This Question ->]                   |
+------------------------------------------+
| MY NOTES                                 |
| [editable textarea, auto-saves]          |
+------------------------------------------+
| [< Prev]                    [Next >]     |
+------------------------------------------+
```

**Navigation:** Left/right arrows, keyboard (arrow keys), or swipe on mobile. Card counter shows position (1/8).

**"Try This Question" button:** Routes to `/practice/:companyId` with the specific question pre-selected. After answering, a "Back to Concept Card" link returns to the card.

**"My Notes" section:** Free-form textarea at the bottom of each card. Auto-saves to localStorage under a new key `forge-concepts`. This is where the user writes their own reference summary after studying. The act of writing is the learning.

### Persistence

```javascript
// localStorage key: forge-concepts
{
  cards: {
    "ebitda-addbacks": {
      notes: "Add-backs normalize EBITDA. Key: owner comp, one-time, related party...",
      lastStudied: "2026-04-01T08:45:00Z",
      practiceAttempted: true
    },
    // ...
  }
}
```

### Routing

- `/learn/concepts` ... card list/grid view (all 8 cards as tiles)
- `/learn/concepts/:cardId` ... single card view

Fits within existing `/learn` route structure. LearnModule nav gets a third tab.

---

## Feature 2: Cross-Industry Risk Comparison

### What It Is

A comparison mode where the user picks a risk type and sees how it manifests across 2-3 companies in different industries. Side-by-side data, different contexts, same underlying dynamic. Builds the "I've seen this pattern before" muscle.

### Comparison Topics (Month One: 4 Comparisons)

| # | Risk/Dynamic | Companies | What's Different |
|---|-------------|-----------|-----------------|
| 1 | Customer Concentration | Coastal (food dist, 38% top customer), Apex (delivery, diversified), TrueNorth (SaaS, ARR-based) | Same risk, totally different severity and mitigation |
| 2 | Key-Person / Founder Risk | Summit (HVAC, founder as rainmaker), Precision (CNC, owner as sole estimator), BrightSmile (dental, founder as clinician) | Different flavors: sales vs. technical vs. clinical dependency |
| 3 | Growth vs. Margin Tension | TrueNorth (SaaS, burning cash to grow), BrightSmile (roll-up, growing via acquisition), Ironclad (construction, margin pressure from scale) | Three different growth models with different margin implications |
| 4 | Working Capital Intensity | Meridian (3PL, inventory + receivables), Coastal (food dist, perishable inventory), TrueNorth (SaaS, negative working capital) | Same line items, wildly different dynamics by business model |

### Data Architecture

```javascript
// app/src/data/comparisons.js

export const comparisons = [
  {
    id: "customer-concentration",
    title: "Customer Concentration Risk",
    subtitle: "Same risk, different severity across three business models",
    riskType: "risk",
    description: "Customer concentration is the #1 deal-killer in LMM PE. But what counts as 'concentrated' varies wildly by industry. A food distributor with 38% in one customer is a different risk than a SaaS company with 20% ARR in one account.",
    companies: ["coastal", "apex", "truenorth"],
    dataPointsToCompare: [
      {
        label: "Top Customer Revenue %",
        paths: {
          coastal: "metrics.topCustomerPct",
          apex: "metrics.topCustomerPct",
          truenorth: "metrics.topCustomerPct"
        }
      },
      {
        label: "Revenue",
        paths: {
          coastal: "financials.revenue",
          apex: "financials.revenue",
          truenorth: "financials.revenue"
        }
      },
      {
        label: "EBITDA Margin",
        paths: {
          coastal: "metrics.ebitdaMargin",
          apex: "metrics.ebitdaMargin",
          truenorth: "metrics.ebitdaMargin"
        }
      }
    ],
    analysisPrompts: [
      "Which company's concentration risk concerns you most, and why?",
      "How would you structure earn-out or holdback provisions differently for each?",
      "If the top customer left tomorrow, which company survives? Which doesn't?"
    ],
    keyInsight: "Concentration risk isn't just about the percentage. It's about switching costs, contract duration, and how quickly the revenue can be replaced. Coastal's 38% is existential because food distribution contracts are short-cycle. TrueNorth's 20% is lower risk because SaaS contracts have 12-month terms and high switching costs."
  },
  // ... 3 more comparisons
];
```

### UI/UX

**Entry point:** New tab in Learn nav: "Practice" | "Learn" | "Concepts" | **"Compare"**

**List view (`/learn/compare`):** 4 tiles, each showing the comparison title, subtitle, and the 3 company logos/names.

**Comparison view (`/learn/compare/:comparisonId`):**

```
+----------------------------------------------------------+
| Customer Concentration Risk                               |
| Same risk, different severity across three business models|
+----------------------------------------------------------+
|                                                          |
| [Description paragraph]                                  |
|                                                          |
+------------------+------------------+--------------------+
| Coastal Fresh    | Apex Last-Mile   | TrueNorth         |
| Food Dist, $48M  | Delivery, $39M   | B2B SaaS, $14M    |
+------------------+------------------+--------------------+
| Top Customer: 38%| Top Customer: 12%| Top Customer: 20% |
| Revenue: $48.2M  | Revenue: $38.5M  | Revenue: $14.2M   |
| EBITDA Margin: 8%| EBITDA Margin:11%| EBITDA Margin: 22%|
+------------------+------------------+--------------------+
|                                                          |
| THINK ABOUT IT                                           |
|                                                          |
| > Which company's concentration risk concerns you most?  |
|   [Your answer here...                              ]    |
|   [Reveal Insight ->]                                    |
|                                                          |
| > How would you structure earn-out provisions?           |
|   [Your answer here...                              ]    |
|   [Reveal Insight ->]                                    |
|                                                          |
+----------------------------------------------------------+
| KEY INSIGHT                                              |
| [Hidden until user attempts at least 1 prompt]           |
| "Concentration risk isn't just about the percentage..."  |
+----------------------------------------------------------+
| [< Prev Comparison]              [Next Comparison >]     |
+----------------------------------------------------------+
```

**Interaction flow:**
1. User reads the description and scans the side-by-side data
2. User types a response to one or more analysis prompts (commit-first, same pattern as Practice)
3. "Reveal Insight" shows the key insight for that comparison
4. Key Insight section unlocks after at least one prompt is attempted

**Side-by-side data table:** Pulls real numbers from `companies.js` at render time. Uses the same `FinancialTable.jsx` formatting utilities (formatCurrency, etc.). Responsive: on mobile, cards stack vertically instead of 3-column.

**Analysis prompts:** These are NOT scored. They're reflective writing. User types, reveals insight, thinks about the gap. The value is the thinking, not the grade. Responses persist in localStorage for review.

### Persistence

```javascript
// localStorage key: forge-comparisons
{
  comparisons: {
    "customer-concentration": {
      responses: {
        0: "Coastal concerns me most because...",
        1: "For Coastal I'd want a 12-month holdback..."
      },
      insightRevealed: true,
      lastVisited: "2026-04-03T09:00:00Z"
    }
  }
}
```

### Routing

- `/learn/compare` ... comparison list/grid
- `/learn/compare/:comparisonId` ... single comparison view

---

## Technical Approach

### Files to Create

| File | Description |
|------|-------------|
| `app/src/data/conceptCards.js` | 8 concept card definitions with company references |
| `app/src/data/comparisons.js` | 4 cross-industry comparison definitions |
| `app/src/components/learn/ConceptCard.jsx` | Single concept card view |
| `app/src/components/learn/ConceptList.jsx` | Grid of all concept cards |
| `app/src/components/learn/ComparisonView.jsx` | Side-by-side comparison with analysis prompts |
| `app/src/components/learn/ComparisonList.jsx` | Grid of all comparisons |
| `app/src/hooks/useConceptProgress.js` | localStorage persistence for concept notes + study tracking |
| `app/src/hooks/useComparisonProgress.js` | localStorage persistence for comparison responses |

### Files to Modify

| File | Changes |
|------|---------|
| `app/src/App.jsx` | Add routes: `/learn/concepts`, `/learn/concepts/:cardId`, `/learn/compare`, `/learn/compare/:comparisonId` |
| `app/src/components/learn/LearnNav.jsx` (or equivalent) | Add "Concepts" and "Compare" tabs |
| `app/src/components/AppShell.jsx` | Add nav items for Concepts and Compare (or nest under Learn) |

### Key Implementation Notes

1. **Data references, not duplication.** Concept cards and comparisons reference company IDs and data paths. At render time, resolve against the live `companies.js` data. If company data changes, cards automatically reflect it.

2. **Reuse existing components.** `FinancialTable.jsx` formatting utilities, `CommitInput.jsx` for analysis prompts (textarea mode with char counter), design tokens and dark mode.

3. **No API calls.** Both features are fully client-side. All data is in `companies.js` + the new data files. No LLM evaluation for comparison prompts (reflective, not graded).

4. **Progressive disclosure.** Key insights are hidden until the user attempts a prompt. This prevents passive reading.

5. **Mobile responsive.** Concept cards are single-column (already works). Comparison 3-column grid stacks to vertical on mobile (use existing Tailwind responsive breakpoints).

6. **Keyboard nav.** Left/right arrows cycle through cards and comparisons. Enter to reveal. Same patterns as existing practice mode.

### localStorage Schema Extension

Current keys: `forge-data` (scoring), `forge-theme` (dark mode)

New keys:
- `forge-concepts` (concept card notes + study tracking)
- `forge-comparisons` (comparison responses + insight reveals)

No migration needed. New keys are independent.

---

## Acceptance Criteria

### Concept Cards

- [ ] 8 concept cards accessible at `/learn/concepts`
- [ ] Each card shows: title, definition, why it matters, how to spot it, red flags, live company examples with real numbers, practice prompt link, notes textarea
- [ ] Company examples pull real numbers from `companies.js` (not hardcoded)
- [ ] "Try This Question" routes to the correct company practice with the right question
- [ ] "My Notes" textarea auto-saves to localStorage
- [ ] Keyboard navigation (left/right arrows) between cards
- [ ] Card counter shows position (e.g., "3/8")
- [ ] Study date tracked per card in localStorage
- [ ] Dark mode supported
- [ ] Mobile responsive

### Cross-Industry Comparison

- [ ] 4 comparisons accessible at `/learn/compare`
- [ ] Side-by-side data table with real numbers from `companies.js`
- [ ] 2-3 analysis prompts per comparison with commit-first pattern (type before revealing insight)
- [ ] Key Insight hidden until at least 1 prompt attempted
- [ ] Responses persist in localStorage
- [ ] 3-column layout on desktop, stacked on mobile
- [ ] Keyboard navigation between comparisons
- [ ] Dark mode supported

### Integration

- [ ] Learn nav updated with "Concepts" and "Compare" tabs
- [ ] All existing tests pass (104 tests)
- [ ] New tests for concept card rendering and comparison data resolution
- [ ] Build output size stays reasonable (no new dependencies)

---

## Implementation Order

**Phase 1: Concept Cards (estimate: 2 sessions)**
1. Create `conceptCards.js` data file with 8 cards (data-heavy, can do 4 first then 4)
2. Build `ConceptList.jsx` grid and `ConceptCard.jsx` view
3. Add `useConceptProgress.js` hook
4. Wire routes and nav tabs
5. Tests

**Phase 2: Cross-Industry Comparison (estimate: 2 sessions)**
1. Create `comparisons.js` data file with 4 comparisons
2. Build `ComparisonList.jsx` grid and `ComparisonView.jsx`
3. Add `useComparisonProgress.js` hook
4. Wire routes and nav tabs
5. Tests

**Phase 3: Polish (estimate: 1 session)**
1. Mobile responsive QA
2. Dark mode QA
3. Keyboard nav
4. "Try This Question" deep-link flow tested end-to-end

---

## Scope Boundaries (Not in Scope)

- LLM grading of comparison responses (reflective only, no API calls)
- Spaced repetition / review scheduling (future enhancement)
- User-created concept cards (future enhancement)
- More than 8 cards or 4 comparisons in V1
- Sharing/exporting notes (future enhancement)
- Integration with the LLM evaluation feature (separate plan, can compose later)

---

## Success Metrics

- User studies 2-3 concept cards per week during PE Learning block
- User attempts all 4 comparisons within first month
- Notes field has content (user is actively writing, not just reading)
- Practice performance on related question types improves after concept card study (track via scoring data)
- Feature gets used in the 45-min daily rhythm: 15 min concept card, 20 min Forge reps, 5 min review/notes

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 1 | CLEAR | mode: HOLD_SCOPE, 0 critical gaps |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | -- | -- |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | CLEAR | 2 issues (DRY extractions), 0 critical gaps |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | -- | -- |

**VERDICT:** CEO + ENG CLEARED -- ready to implement.
