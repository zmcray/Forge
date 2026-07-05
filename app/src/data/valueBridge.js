/**
 * Value Creation Bridge scenarios.
 *
 * Seven hand-crafted PE investment scenarios, each illustrating a distinct
 * value creation thesis. Entry/exit states are math-consistent (EV = EBITDA
 * * multiple) and verified by data integrity tests. Bridge decomposition is
 * always derived via calculateBridge() at render time, never stored here.
 *
 * Each scenario links to one canonical company from companies.js for
 * narrative flavor. The numbers are hypothetical investment models, not
 * the real company state.
 */
export const BRIDGE_SCENARIOS = [
  // -- 1. BASELINE PLATFORM (services) --------------------------------
  {
    id: "services-platform",
    label: "Services Platform (Baseline)",
    thesis: "Conservative platform acquisition in a fragmented services market",
    description:
      "The textbook PE playbook. Buy a founder-led services business at 6x, professionalize ops and management, grow organically at GDP+, refinance out the founder debt, exit at a premium multiple once the business can run without the founder.",
    companyId: "summit-hvac",
    relatedQuestions: [
      { companyId: "summit-hvac", questionId: "summit-hvac-q1" },
      { companyId: "summit-hvac", questionId: "summit-hvac-q3" },
    ],
    keyLesson:
      "The baseline return: a 3x MOIC is achievable with modest 9% growth, ~310 bps of margin expansion, and a turn and a half of multiple expansion. Every driver contributes; nothing heroic.",
    entry: {
      revenue: 32.5,
      ebitda: 5.5,
      ebitdaMargin: 16.9,
      multiple: 6.0,
      enterpriseValue: 33.0,
      netDebt: 8.0,
    },
    exit: {
      revenue: 50.0,
      ebitda: 10.0,
      ebitdaMargin: 20.0,
      multiple: 7.5,
      enterpriseValue: 75.0,
      netDebt: 2.0,
    },
    assumptions: {
      revenueCAGR: 9.0,
      marginExpansion: 310, // bps
      multipleExpansion: 1.5,
      debtPaydown: 6,
      holdPeriod: 5,
    },
    sliderRanges: {
      revenueCAGR: { min: 0, max: 18, step: 0.5 },
      marginExpansion: { min: -200, max: 600, step: 25 },
      multipleExpansion: { min: -1.5, max: 3, step: 0.25 },
      debtPaydown: { min: 0, max: 8, step: 0.5 },
    },
    exerciseTarget: {
      moic: 4.0,
      prompt: "Hit 4.0x MOIC. The plan case delivers 3.0x. Which lever gives you the extra turn?",
      hint: "Multiple expansion has the most leverage on a services business with a healthy ebitda base. Or you can trade some margin for more growth.",
    },
  },

  // -- 2. DENTAL ROLL-UP (growth-heavy) --------------------------------
  {
    id: "dental-rollup",
    label: "Dental Roll-Up (Growth Heavy)",
    thesis: "Platform + aggressive add-on acquisitions in a fragmented vertical",
    description:
      "Buy a small platform with scalable back-office, then stack add-ons at lower multiples than the platform trades at. Multiple arbitrage (buy at 5x, own at 7.5x) is the core economics. Debt grows to fund M&A. Revenue CAGR is inorganic.",
    companyId: "bright-dental",
    relatedQuestions: [
      { companyId: "bright-dental", questionId: "bright-dental-q1" },
      { companyId: "bright-dental", questionId: "bright-dental-q4" },
    ],
    keyLesson:
      "Roll-ups rewrite the return math. Debt paydown goes negative (new debt for M&A), but EBITDA growth from add-ons and multiple arbitrage dominate. 7.5x MOIC is realistic for top-quartile execution.",
    entry: {
      revenue: 10.0,
      ebitda: 2.0,
      ebitdaMargin: 20.0,
      multiple: 6.0,
      enterpriseValue: 12.0,
      netDebt: 4.0,
    },
    exit: {
      revenue: 40.0,
      ebitda: 8.8,
      ebitdaMargin: 22.0,
      multiple: 7.5,
      enterpriseValue: 66.0,
      netDebt: 6.0,
    },
    assumptions: {
      revenueCAGR: 32.0,
      marginExpansion: 200,
      multipleExpansion: 1.5,
      debtPaydown: -2, // debt increases due to M&A
      holdPeriod: 5,
    },
    sliderRanges: {
      revenueCAGR: { min: 5, max: 50, step: 1 },
      marginExpansion: { min: -100, max: 500, step: 25 },
      multipleExpansion: { min: 0, max: 3, step: 0.25 },
      debtPaydown: { min: -10, max: 10, step: 0.5 },
    },
    exerciseTarget: {
      moic: 10.0,
      prompt: "Push this roll-up to 10x MOIC. What combination of organic growth and multiple arbitrage gets you there?",
      hint: "Roll-ups compound. If you push revenue CAGR above 35% AND expand margins 300 bps, you will get there without needing multiple expansion to do all the work.",
    },
  },

  // -- 3. MARGIN TURNAROUND (low-margin distributor) -------------------
  {
    id: "margin-turnaround",
    label: "Margin Turnaround (Low-Margin Distributor)",
    thesis: "Undermanaged business with material margin expansion opportunity",
    description:
      "Coastal Foods' real EBITDA margin is only 8%, below what a disciplined operator can wring out of specialty distribution. The PE thesis: professional procurement, repricing with cost pass-through, route optimization. Revenue grows slowly but margin expands ~300 bps, a big move in a thin-margin industry. The equity return comes mostly from margin expansion and deleveraging, not top-line growth.",
    companyId: "coastal-foods",
    relatedQuestions: [
      { companyId: "coastal-foods", questionId: "coastal-foods-q3" },
      { companyId: "coastal-foods", questionId: "coastal-foods-q4" },
    ],
    keyLesson:
      "Low-margin businesses are high-leverage margin expansion plays. Every 100 bps of margin on a $50M revenue base is $0.5M of EBITDA, which at a 6x multiple is $3M of EV. Margin is the cheapest way to create value when growth is hard.",
    entry: {
      revenue: 50.0,
      ebitda: 4.0,
      ebitdaMargin: 8.0,
      multiple: 5.0,
      enterpriseValue: 20.0,
      netDebt: 12.0,
    },
    exit: {
      revenue: 60.0,
      ebitda: 6.6,
      ebitdaMargin: 11.0,
      multiple: 6.5,
      enterpriseValue: 42.9,
      netDebt: 4.0,
    },
    assumptions: {
      revenueCAGR: 3.7,
      marginExpansion: 300,
      multipleExpansion: 1.5,
      debtPaydown: 8,
      holdPeriod: 5,
    },
    sliderRanges: {
      revenueCAGR: { min: 0, max: 15, step: 0.5 },
      marginExpansion: { min: 0, max: 1000, step: 25 },
      multipleExpansion: { min: 0, max: 3, step: 0.25 },
      debtPaydown: { min: 0, max: 12, step: 0.5 },
    },
    exerciseTarget: {
      moic: 8.0,
      prompt: "The plan case delivers roughly 5x. Push it to 8x. Which lever has the most leverage?",
      hint: "Watch the margin expansion slider. 300 bps is the plan; 500-600 bps is world-class in distribution and lifts MOIC dramatically, especially combined with a little more growth or exit multiple.",
    },
  },

  // -- 4. SaaS MULTIPLE EXPANSION --------------------------------------
  {
    id: "saas-multiple-expansion",
    label: "SaaS Multiple Expansion",
    thesis: "Grow ARR and stickiness; let the multiple do the heavy lifting",
    description:
      "Small founder-run software businesses without institutional process still change hands in the mid-single digits of EBITDA; at $45M ARR with a rule-of-40 profile, buyers pay 10x+ (or price off ARR outright). Grow the business 3x through GTM investment and NRR expansion, and the multiple re-rates with scale, stickiness, and process maturity.",
    companyId: "truenorth-saas",
    relatedQuestions: [
      { companyId: "truenorth-saas", questionId: "truenorth-saas-q3" },
      { companyId: "truenorth-saas", questionId: "truenorth-saas-q6" },
    ],
    keyLesson:
      "In SaaS, the multiple IS the return. Multiple expansion often contributes more to MOIC than EBITDA growth, a result that stuns first-time PE investors. Model it explicitly or you will underestimate every SaaS deal.",
    entry: {
      revenue: 15.0,
      ebitda: 3.0,
      ebitdaMargin: 20.0,
      multiple: 5.0,
      enterpriseValue: 15.0,
      netDebt: 2.0,
    },
    exit: {
      revenue: 45.0,
      ebitda: 11.25,
      ebitdaMargin: 25.0,
      multiple: 10.0,
      enterpriseValue: 112.5,
      netDebt: 0.0,
    },
    assumptions: {
      revenueCAGR: 25.0,
      marginExpansion: 500,
      multipleExpansion: 5.0,
      debtPaydown: 2,
      holdPeriod: 5,
    },
    sliderRanges: {
      revenueCAGR: { min: 10, max: 40, step: 1 },
      marginExpansion: { min: 0, max: 1000, step: 25 },
      multipleExpansion: { min: 0, max: 8, step: 0.25 },
      debtPaydown: { min: 0, max: 2, step: 0.25 },
    },
    exerciseTarget: {
      moic: 10.0,
      prompt: "The plan case already delivers ~8.7x. Push to 10x without taking multiple expansion beyond the plan's 5 turns. Can fundamentals alone close the gap?",
      hint: "SaaS rewards margin discipline. Push margin toward 28% and revenue CAGR toward 30% and the MOIC is there without touching the exit multiple.",
    },
  },

  // -- 5. CASH COW / DEBT PAYDOWN --------------------------------------
  {
    id: "cash-cow-deleveraging",
    label: "Cash Cow (Debt Paydown Play)",
    thesis: "Buy a mature, slow-growing cash flow with heavy leverage; pay it down",
    description:
      "The classic 1980s LBO. Buy at 5x EBITDA with 3.5x of debt and 1.5x of equity. Growth is almost flat. The business throws off cash year after year, which goes to debt service. Equity grows mechanically as debt falls. No heroics, just patience and a sturdy P&L.",
    companyId: "apex-logistics",
    relatedQuestions: [
      { companyId: "apex-logistics", questionId: "apex-logistics-q3" },
      { companyId: "apex-logistics", questionId: "apex-logistics-q4" },
    ],
    keyLesson:
      "Leverage is a return amplifier. A mature, unexciting business with 70% debt financing can still deliver 4x equity just by paying down the debt. This is why LBOs work on businesses that look 'boring' from a growth perspective.",
    entry: {
      revenue: 40.0,
      ebitda: 4.0,
      ebitdaMargin: 10.0,
      multiple: 5.0,
      enterpriseValue: 20.0,
      netDebt: 14.0,
    },
    exit: {
      revenue: 42.0,
      ebitda: 5.0,
      ebitdaMargin: 11.9,
      multiple: 5.5,
      enterpriseValue: 27.5,
      netDebt: 2.0,
    },
    assumptions: {
      revenueCAGR: 1.0,
      marginExpansion: 190,
      multipleExpansion: 0.5,
      debtPaydown: 12,
      holdPeriod: 5,
    },
    sliderRanges: {
      revenueCAGR: { min: -5, max: 10, step: 0.5 },
      marginExpansion: { min: -200, max: 400, step: 25 },
      multipleExpansion: { min: -1, max: 2, step: 0.25 },
      debtPaydown: { min: 0, max: 14, step: 0.5 },
    },
    exerciseTarget: {
      moic: 5.0,
      prompt: "This plan hits 4.25x. Get to 5x without growing the top line by more than 3% CAGR. How?",
      hint: "Maximum debt paydown is the answer. If the business can pay off 13 of 14 debt, you are close. A little multiple expansion helps.",
    },
  },

  // -- 6. DISTRESSED OPS TURNAROUND ------------------------------------
  {
    id: "distressed-turnaround",
    label: "Distressed Ops Turnaround",
    thesis: "Buy cheap at a distressed multiple; stabilize and re-rate",
    description:
      "The construction business is underearning on legacy management. You acquire at a distressed multiple (4x), spend 12-18 months professionalizing ops, fixing bid discipline, and tightening SG&A. As the business stabilizes, it re-rates to a normal multiple. Big returns from multiple expansion at the exit, but only if the operational fix actually takes.",
    companyId: "ironclad-construction",
    relatedQuestions: [
      { companyId: "ironclad-construction", questionId: "ironclad-construction-q3" },
      { companyId: "ironclad-construction", questionId: "ironclad-construction-q6" },
    ],
    keyLesson:
      "Distressed buys earn their return at exit, not during the hold. You pay a low multiple because the business is broken; you get the multiple expansion only after you fix it. If the fix fails, the multiple stays low and the return is mediocre.",
    entry: {
      revenue: 50.0,
      ebitda: 4.0,
      ebitdaMargin: 8.0,
      multiple: 4.0,
      enterpriseValue: 16.0,
      netDebt: 6.0,
    },
    exit: {
      revenue: 60.0,
      ebitda: 7.8,
      ebitdaMargin: 13.0,
      multiple: 6.0,
      enterpriseValue: 46.8,
      netDebt: 2.0,
    },
    assumptions: {
      revenueCAGR: 3.7,
      marginExpansion: 500,
      multipleExpansion: 2.0,
      debtPaydown: 4,
      holdPeriod: 5,
    },
    sliderRanges: {
      revenueCAGR: { min: 0, max: 15, step: 0.5 },
      marginExpansion: { min: 0, max: 800, step: 25 },
      multipleExpansion: { min: 0, max: 4, step: 0.25 },
      debtPaydown: { min: 0, max: 6, step: 0.5 },
    },
    exerciseTarget: {
      moic: 5.5,
      prompt: "The plan delivers 4.5x. Push to 5.5x. What does the distressed opportunity reward most?",
      hint: "Margin expansion and multiple re-rating are the two levers that matter. Distressed buys rarely grow the top line aggressively.",
    },
  },

  // -- 7. GROWTH EQUITY / MINIMAL LEVERAGE -----------------------------
  {
    id: "growth-equity",
    label: "Growth Equity (Minimal Leverage)",
    thesis: "High-quality asset, pay a premium, use growth equity structure",
    description:
      "Precision CNC is a top-of-line specialty manufacturer with 32% EBITDA margins and 43% gross margins. Buying at 7x is a premium but justified by quality. Minimal debt, minimal financial engineering. The return comes from riding an excellent operator's organic growth plus a market re-rating as the business scales.",
    companyId: "precision-manufacturing",
    relatedQuestions: [
      { companyId: "precision-manufacturing", questionId: "precision-manufacturing-q2" },
      { companyId: "precision-manufacturing", questionId: "precision-manufacturing-q4" },
    ],
    keyLesson:
      "Quality businesses trade at premium multiples for a reason. Growth equity sacrifices leverage-driven returns in exchange for lower risk and higher-quality cash flows. The MOIC is lower (2.5-3x is realistic), but the probability of achieving it is much higher.",
    entry: {
      revenue: 15.0,
      ebitda: 5.0,
      ebitdaMargin: 33.3,
      multiple: 7.0,
      enterpriseValue: 35.0,
      netDebt: 2.0,
    },
    exit: {
      revenue: 28.0,
      ebitda: 10.0,
      ebitdaMargin: 35.7,
      multiple: 9.0,
      enterpriseValue: 90.0,
      netDebt: 0.0,
    },
    assumptions: {
      revenueCAGR: 13.3,
      marginExpansion: 240,
      multipleExpansion: 2.0,
      debtPaydown: 2,
      holdPeriod: 5,
    },
    sliderRanges: {
      revenueCAGR: { min: 5, max: 25, step: 0.5 },
      marginExpansion: { min: -200, max: 500, step: 25 },
      multipleExpansion: { min: 0, max: 4, step: 0.25 },
      debtPaydown: { min: 0, max: 2, step: 0.25 },
    },
    exerciseTarget: {
      moic: 3.5,
      prompt: "This quality business delivers 2.7x in the plan case. Can you hit 3.5x? What is the honest way to get there?",
      hint: "You need both strong organic growth (top of the range) AND a meaningful multiple re-rating. Quality businesses do not leverage up.",
    },
  },
];

export const BRIDGE_SCENARIO_IDS = BRIDGE_SCENARIOS.map((s) => s.id);
