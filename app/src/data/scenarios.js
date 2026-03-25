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
  {
    id: "bright-founder-leaves",
    companyId: "bright-dental",
    name: "Founder Departure",
    description: "The founding dentist and clinical director announces retirement in 6 months. The business has no succession plan and 40% of patients specifically request him.",
    patches: {
      revenue: 8.3, // ~15% patient attrition from $9.8M
      context: "The founding dentist and clinical director is retiring in 6 months. No succession plan exists. He personally treats patients at 2 of the 5 locations and 40% of patients across the group specifically request him. The non-clinical founder/operator remains, but clinical leadership is gone.",
      incomeStatement: {
        revenue: [7.4, 8.3],
        cogs: [3.4, 4.0], // dental staff costs partially fixed
        grossProfit: [4.0, 4.3],
        netIncome: [0.3, -0.7],
      },
      keyMetrics: {
        ebitda: 1.0,
        adjustedEbitda: 1.6,
        ebitdaMargin: 12.0,
        adjustedEbitdaMargin: 19.3,
        grossMargin: 51.8,
        revenueGrowth: 12.2, // down from 32.4% to organic-only growth minus attrition
      },
      redFlags: [
        "$3.2M goodwill on balance sheet from acquisitions... overpay risk?",
        "SGA grew 36% vs 32% revenue growth. Overhead creeping",
        "Leverage: $5.0M total debt on $1.6M adjusted EBITDA = 3.1x. Dangerous.",
        "Founding clinical director retiring with no succession plan",
        "40% of patients request the departing dentist. Key-person risk is severe.",
        "Revenue drops ~15% from patient attrition; margins compress significantly",
      ],
    },
    questions: [
      {
        type: "risk",
        q: "The founding dentist is leaving in 6 months with no succession plan. 40% of patients specifically request him. What are the biggest risks and how would you mitigate them?",
        hint: "Think about patient retention, clinical quality, associate dentist morale, and the difference between clinical and operational leadership.",
        answer: "This is a severe key-person risk scenario, even though the non-clinical founder/operator stays. Critical risks: (1) Patient attrition: 40% of patients request this dentist. Even if only a third actually leave, that is a 13-15% revenue hit. Patients follow their dentist, especially for complex procedures. (2) Associate dentist retention: the other 7 dentists may view this as instability and start exploring options. Losing even 1-2 more dentists cascades the problem. (3) Clinical quality and culture: the founding dentist likely set clinical standards and mentored associates. Without him, quality may drift. (4) Referral network: if the departing dentist drove specialist referrals into the group, those dry up. Mitigation: (a) Hire a clinical director immediately, ideally with equity incentive. (b) Retention bonuses for all associate dentists locked to 18-month terms. (c) Patient communication plan to introduce new providers and build trust. (d) Negotiate a consulting agreement with the departing dentist for 6-12 months for warm handoffs.",
        keywords: ["patient attrition", "key-person risk", "associate retention", "clinical leadership", "succession plan", "referral network", "consulting agreement"],
      },
      {
        type: "valuation",
        q: "Pre-departure, BrightSmile was valued at 8x adjusted EBITDA ($20M EV). How does the founder departure change the valuation, and what deal structure would you propose?",
        hint: "Consider the EBITDA impact, multiple compression from increased risk, and creative structuring to protect against further attrition.",
        answer: "Adjusted EBITDA drops from $2.5M to ~$1.6M due to patient attrition. But the multiple also compresses because the risk profile is much worse. Instead of 8x (platform premium for a growing dental roll-up), you are looking at 5-6x for a business with clinical leadership risk and declining revenue. Valuation range: $1.6M x 5-6x = $8.0-9.6M, a 50-60% decline from the pre-departure $20M. Deal structure: (1) Earnout tied to patient retention rates at the departing dentist's two locations, measured quarterly for 24 months. (2) Escrow holdback of 15-20% of purchase price, released only if revenue stays above $7.5M in Year 1. (3) Require the departing dentist to sign a non-compete within a 25-mile radius. (4) Employment agreements with all associate dentists as a closing condition. (5) Consider structuring as a minority investment with a re-price mechanism if attrition exceeds projections.",
        keywords: ["multiple compression", "earnout", "patient retention", "escrow", "non-compete", "closing condition", "re-price"],
      },
      {
        type: "thesis",
        q: "Would you still invest in BrightSmile given the founder departure? If so, what is your revised thesis? If not, why not?",
        hint: "The underlying dental roll-up model may still work. Separate the clinical transition risk from the long-term platform value.",
        answer: "Conditional yes, but only at a steep discount and with significant structural protections. The revised thesis: (1) The non-clinical operator/founder remains, and the scalable DSO (dental service organization) model is intact. The playbook of acquiring practices, centralizing back-office, and driving efficiency still works. (2) Dental is still recession-resistant with 70% recurring revenue. Patients need cleanings regardless of who does them. (3) The departure forces a healthy transition. Building institutional clinical leadership (a real clinical director role) actually de-risks the business long-term. (4) At $8-10M EV vs. the prior $20M, you are buying at a distressed price with real upside if the transition succeeds. The risk: if 2-3 associate dentists also leave, the business enters a death spiral. You would need to lock in clinical talent before closing. This is a high-risk, high-reward situation. Only pursue if you have healthcare operating experience and can move fast on recruitment.",
        keywords: ["DSO model", "recession-resistant", "clinical director", "distressed pricing", "talent retention", "operating experience", "structural protections"],
      },
    ],
  },
  {
    id: "apex-ic-reclassification",
    companyId: "apex-logistics",
    name: "IC Reclassification",
    description: "A state labor board rules that Apex's independent contractor drivers must be reclassified as W-2 employees, increasing labor costs by approximately $3.2M annually.",
    patches: {
      context: "A state labor board has ruled that Apex's 80 independent contractor drivers must be reclassified as W-2 employees. This adds approximately $3.2M in annual labor costs (payroll taxes, benefits, workers comp, unemployment insurance). The ruling applies immediately but Apex has 90 days to comply. Other states where Apex operates may follow suit.",
      incomeStatement: {
        cogs: [30.3, 31.3], // $28.1M + $3.2M reclassification cost
        grossProfit: [11.8, 7.2],
        netIncome: [2.6, -2.6],
      },
      keyMetrics: {
        ebitda: 0.8,
        adjustedEbitda: 1.35,
        ebitdaMargin: 2.1,
        adjustedEbitdaMargin: 3.5,
        grossMargin: 18.7,
      },
      redFlags: [
        "Revenue DECLINED 8.6%. Is this a trend or a correction?",
        "35% customer concentration with one major e-commerce retailer",
        "CapEx intensive: $2.5M (6.5% of revenue) for fleet maintenance/expansion",
        "IC reclassification adds $3.2M in annual labor costs. EBITDA collapses.",
        "Other states may follow with similar rulings, compounding the cost increase",
        "Adjusted EBITDA margin drops to 3.5%. Debt service coverage is now critical.",
        "Total debt of $8.6M on $1.35M adjusted EBITDA = 6.4x leverage. Unsustainable.",
        "Equity is only $1.9M. Thin cushion with mounting losses.",
      ],
    },
    questions: [
      {
        type: "diagnostic",
        q: "The IC reclassification adds $3.2M in annual costs. Walk through the financial impact across the P&L and explain why this is so devastating for a logistics business.",
        hint: "Think about where the $3.2M comes from (payroll taxes, benefits, workers comp) and how it flows through COGS to EBITDA. Consider the fixed vs. variable cost dynamics.",
        answer: "The $3.2M breaks down roughly as: payroll taxes (~$1.2M at ~15% of IC labor costs), health benefits (~$1.0M at ~$1,000/month for 80 drivers), workers compensation insurance (~$600K, logistics is high-risk), and unemployment insurance + other statutory costs (~$400K). This flows directly into COGS, crushing gross margin from 27.0% to 18.7%. Because SGA and other fixed costs do not change, the impact flows almost dollar-for-dollar to EBITDA. EBITDA drops from $4.0M to $0.8M. Adjusted EBITDA goes from $4.55M to $1.35M. The business was already operating on thin margins with declining revenue. At 3.5% adjusted EBITDA margin, there is essentially zero room for any additional cost pressure. Debt service alone ($1.2M in annual payments) now exceeds adjusted EBITDA. The business is cash-flow negative on a levered basis.",
        keywords: ["payroll taxes", "benefits", "workers comp", "COGS increase", "margin compression", "debt service coverage", "cash-flow negative"],
      },
      {
        type: "risk",
        q: "Beyond the immediate $3.2M cost hit, what are the second-order risks from IC reclassification? Think about contagion, competitive dynamics, and operational changes.",
        hint: "Consider: other states, back-taxes and penalties, competitor positioning, driver management complexity, and the 35% customer concentration.",
        answer: "Second-order risks are potentially worse than the initial cost hit: (1) Regulatory contagion: Apex operates in 4 metro markets, likely across multiple states. If one state reclassifies, others will follow. The $3.2M could become $6-8M if all states adopt similar rulings. (2) Back-tax liability: the state may pursue back-taxes, penalties, and interest for prior years of misclassification. This could be a $2-5M retroactive hit. (3) Competitive dynamics: if competitors still use ICs (different state, different ruling), Apex is now at a structural cost disadvantage. Conversely, if the entire industry shifts, larger players with scale advantages win. (4) Operational complexity: W-2 employees require HR infrastructure, scheduling systems, performance management, and benefits administration that Apex may not have. (5) The 35% customer concentration becomes even more dangerous. That customer will demand the same delivery rates but Apex's costs just jumped 11%. If the customer pushes back on price increases, margins go to zero. (6) Driver retention paradox: some ICs preferred contractor status for flexibility and may quit rather than become employees.",
        keywords: ["regulatory contagion", "back-tax liability", "competitive disadvantage", "HR infrastructure", "customer pricing pressure", "driver retention", "multi-state risk"],
      },
      {
        type: "valuation",
        q: "Pre-reclassification, Apex was arguably worth 3-3.5x adjusted EBITDA ($13.7-15.9M). What is it worth now, and is there any scenario where you would still invest?",
        hint: "At $1.35M adjusted EBITDA, even a 5x multiple only gets you to $6.75M. But consider the infrastructure value and whether the cost structure can be fixed.",
        answer: "At face value, the business is nearly uninvestable. $1.35M adjusted EBITDA at 3-4x = $4.1-5.4M EV. With $8.6M in debt, equity value is deeply negative. This is a distressed situation. However, there are paths where an investment makes sense: (1) Distressed buyout: acquire the business from the lender at a steep discount (maybe $2-3M for the assets) after a debt restructuring or foreclosure. The fleet, routes, customer relationships, and driver network have real value. (2) Price increases: if Apex can pass through even 50% of the cost increase to customers, EBITDA recovers to ~$3.0M. The question is whether the 35% customer will accept an 8-10% rate increase. (3) Operational restructuring: optimize routes, reduce fleet size, renegotiate leases, cut SGA. Maybe recover $0.5-1.0M. (4) Industry thesis: if all last-mile carriers face the same IC reclassification, the entire industry reprices higher. First movers who adjust their cost structure survive and gain share from those who collapse. Bottom line: this is a restructuring play, not a traditional PE deal. Only pursue if you have logistics operating experience and can negotiate with both the lender and the key customer simultaneously.",
        keywords: ["distressed buyout", "negative equity", "price pass-through", "debt restructuring", "route optimization", "industry repricing", "restructuring play"],
      },
    ],
  },
];
