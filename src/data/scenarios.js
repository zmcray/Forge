// Scenario overlays that modify base company data.
// Each scenario patches specific fields and provides new questions.
// The mergeScenario function validates all patch paths exist in the base.

export const SCENARIOS = [
  {
    id: "coastal-top-customer-leaves",
    companyId: "coastal-foods",
    name: "Top Customer Leaves",
    description: "Coastal's largest customer (22% of revenue) switches to a competitor. How does this change the deal?",
    patches: {
      revenue: 37.6, // $48.2M * (1 - 0.22)
      incomeStatement: {
        revenue: [28.1, 37.6],
        cogs: [22.5, 30.4],
        grossProfit: [5.6, 7.2],
        netIncome: [0.9, -1.8],
      },
      keyMetrics: {
        customerConcentration: 15,
        adjustedEbitda: 1.7,
        adjustedEbitdaMargin: 4.5,
        revenueGrowth: -22.0,
      },
    },
    questions: [
      {
        type: "risk",
        q: "Coastal just lost its top customer (22% of revenue). What is the immediate financial impact and what are the biggest risks going forward?",
        hint: "Think about fixed vs. variable costs and what happens to margins when revenue drops but overhead stays.",
        answer: "Immediate impact: Revenue drops from $48.2M to ~$37.6M. But COGS is largely variable (food costs), so gross profit drops proportionally. The real pain is in SG&A, which is mostly fixed. Adjusted EBITDA collapses from $3.9M to ~$1.7M. Margin drops from 8.1% to 4.5%. At these margins, debt service becomes dangerous. Leverage goes from 1.5x to 3.5x. The business is no longer bankable. Key risks: (1) Other customers may follow if the competitor offers better pricing. (2) Supplier terms may tighten as volume drops. (3) Morale and retention of sales/delivery staff.",
        keywords: ["fixed costs", "SG&A", "leverage", "debt service", "margins", "supplier"],
      },
      {
        type: "valuation",
        q: "Before the customer loss, Coastal was valued at 4-5x adjusted EBITDA ($15.6-19.5M). What is the appropriate valuation now?",
        hint: "Consider whether the remaining EBITDA is sustainable and what multiple a buyer would pay for a declining, low-margin distributor.",
        answer: "Post-loss adjusted EBITDA of $1.7M at a reduced multiple of 3-4x (distressed discount) = $5.1-6.8M. This is a 65% decline in enterprise value from a 22% revenue loss. The multiple compression reflects: (1) Declining revenue trajectory scares buyers. (2) 4.5% margins leave zero room for error. (3) The customer loss proves concentration risk was real. A buyer might pay even less, demanding a sub-3x multiple for a turnaround situation. The business is now a distressed asset, not a PE platform.",
        keywords: ["multiple compression", "distressed", "concentration risk", "enterprise value"],
      },
    ],
  },
  {
    id: "summit-flat-growth",
    companyId: "summit-hvac",
    name: "Growth Goes Flat",
    description: "Summit's 15.7% revenue growth flattens to 0%. The HVAC market has saturated in their region. What changes?",
    patches: {
      revenue: 28.1,
      incomeStatement: {
        revenue: [28.1, 28.1],
        cogs: [18.3, 18.5],
        grossProfit: [9.8, 9.6],
        netIncome: [1.6, 1.4],
      },
      keyMetrics: {
        revenueGrowth: 0,
        ebitda: 3.8,
        adjustedEbitda: 4.6,
        ebitdaMargin: 13.5,
        adjustedEbitdaMargin: 16.4,
      },
    },
    questions: [
      {
        type: "thesis",
        q: "Summit was attractive partly because of 15.7% growth. With flat revenue, would you still invest? What would your thesis be?",
        hint: "Growth was one factor. Think about what else Summit has going for it, and whether there are levers to reignite growth.",
        answer: "You could still invest, but the thesis changes completely. Without organic growth, the value creation plan shifts to: (1) Margin expansion through operational improvements (currently 16.4% adjusted, could push toward 20% with better procurement and routing). (2) Add-on acquisitions of smaller HVAC shops to grow inorganically. (3) Increasing recurring service contract mix (currently 35%, push to 50%+). The risk is that without growth, you are buying a cash-flow business, not a growth story. The multiple should come down from 5-6x to 4-5x. At $4.6M adjusted EBITDA and 4.5x, TEV is ~$20.7M. Doable, but the returns depend entirely on execution, not tailwinds.",
        keywords: ["margin expansion", "add-on acquisitions", "recurring revenue", "multiple compression", "operational improvements"],
      },
      {
        type: "diagnostic",
        q: "What questions would you ask management about why growth stopped? What data would you need?",
        hint: "Is it a market problem, a capacity problem, or a competitive problem? Each has different implications.",
        answer: "Key questions: (1) Is the overall HVAC market in the Southeast flat, or is Summit losing share? Need market data. (2) Are they capacity-constrained (can't hire enough techs) or demand-constrained (fewer projects)? (3) What happened to the sales pipeline? Is it the same volume but smaller projects? (4) Are competitors winning on price or service? (5) Has the service contract renewal rate changed? Data needed: monthly revenue by segment (install vs. service), win/loss records on bids, employee headcount trend, competitor pricing intel, service contract churn rate.",
        keywords: ["market share", "capacity", "pipeline", "competitors", "service contracts", "churn"],
      },
    ],
  },
  {
    id: "precision-owner-exits",
    companyId: "precision-manufacturing",
    name: "Owner Exits in 6 Months",
    description: "Precision's owner/founder announces they're leaving in 6 months, not the planned 2-year transition. How does this change the risk profile?",
    patches: {
      context: "Owner/founder is leaving in 6 months due to health reasons. No formal succession plan. The owner personally manages the top 3 customer relationships (28% concentration) and oversees all quality control.",
    },
    questions: [
      {
        type: "risk",
        q: "The owner is leaving in 6 months instead of 2 years. They manage the top customer relationships and oversee quality. What are the immediate risks and how would you mitigate them?",
        hint: "Think about key person risk across three dimensions: customer relationships, operational knowledge, and employee morale.",
        answer: "Critical risks: (1) Customer retention: The top customer (28% of revenue) has a personal relationship with the owner. Without a warm handoff, that relationship is at risk. Mitigation: Start customer introductions immediately, ideally with the owner present. Get contracts extended or renewed before the transition. (2) Quality control: If the owner is the quality gatekeeper, defect rates could spike. Mitigation: Document QC processes, hire a quality manager immediately, consider ISO certification. (3) Employee morale: In a 42-person shop, the founder leaving is seismic. Key machinists might leave. Mitigation: Retention bonuses for critical employees, transparent communication. (4) Pricing: Does the owner set pricing by instinct? If so, you need to systematize it before they leave. Timeline is extremely tight. 6 months is not enough for a clean transition in a founder-dependent business.",
        keywords: ["customer retention", "key person risk", "quality control", "employee retention", "transition", "documentation"],
      },
      {
        type: "valuation",
        q: "How should the accelerated owner departure affect the purchase price? What deal structure protections would you want?",
        hint: "Think about the incremental risk vs. the base case. What's the probability-weighted downside?",
        answer: "The accelerated departure should reduce the offer price by 10-20% (from ~5x to 4-4.5x adjusted EBITDA). At $4.15M adjusted EBITDA, that's $16.6-18.7M vs. the base case of $20.8M. Deal structure protections: (1) Earnout tied to customer retention (especially the 28% customer) for 18 months post-close. (2) Consulting agreement with the owner for 12 months post-close (even if part-time). (3) Holdback or escrow of 10-15% of purchase price released after 12-month customer and revenue benchmarks. (4) Reps and warranties specifically covering customer relationships and quality certifications. (5) Consider hiring a GM 3 months pre-close so there's overlap with the owner.",
        keywords: ["earnout", "holdback", "consulting agreement", "reps and warranties", "GM hire", "escrow"],
      },
    ],
  },
];
