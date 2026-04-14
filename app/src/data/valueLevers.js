/**
 * Value Creation Levers -- 15 operational levers for PE value creation.
 * Framework calibrated against 2026 institutional research (McKinsey, Bain,
 * BCG, Simon-Kucher). Each lever references real company data from
 * companies.js via canonical companyId. The exercise prompt feeds into LLM
 * grading with a model answer synthesized from acceptanceCriteria at render
 * time in LeverCard.jsx.
 *
 * Categories:
 *   revenue        -- top-line growth (pricing, sales, channel, cross-sell)
 *   margin         -- P&L and balance sheet efficiency
 *   organizational -- CEO alpha, incentives, controls
 *   technology     -- AI and software as competitive advantage
 *   strategic      -- multiple expansion, portfolio-level plays, positioning
 */
export const VALUE_LEVERS = [
  // -- REVENUE LEVERS -----------------------------------------------------

  {
    id: "pricing-optimization",
    title: "Pricing Optimization",
    category: "revenue",
    oneLiner:
      "Pricing as an operating system, not a one-time post-close event. Lowest-risk, fastest-impact lever in the PE toolkit.",
    whenToDeploy: [
      "Services or SaaS business with fragmented or outdated pricing",
      "Market where transparency is low (customers don't comparison-shop)",
      "Historical pricing below market, discovered via benchmarking",
      "Pricing power exists but has never been tested or systematized",
    ],
    typicalImpact: {
      revenue: "5-15% realization improvement",
      ebitdaMargin: "100-500 bps (Simon-Kucher 2025 benchmark)",
      timeline: "7-8 months average time to measurable P&L impact",
    },
    businessTypeFit: {
      services: "Ideal. Low elasticity and high switching costs.",
      manufacturing: "Good. Specialty products with pricing power.",
      saas: "Excellent. Tiered pricing and expansion pricing leverage.",
      distribution: "Difficult. Commoditized with transparent pricing.",
    },
    redFlags: [
      "Market is commoditized and pricing power doesn't exist",
      "Sales compensation tied to revenue volume, not margin realization -- reps will discount to close and perpetually undermine the strategy",
      "Customer concentration above 30% (one customer can force price down)",
      "Price elasticity is high and small increases lose material volume",
      "No dynamic discount governance -- sales can override list price without review",
    ],
    companyExamples: [
      {
        companyId: "summit-hvac",
        narrative:
          "HVAC services in a fragmented Southeast market with regional pricing power. Customers don't comparison-shop across providers; switching costs are high once service contracts are in place. Only 12% customer concentration gives room to push.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
        ],
        opportunity:
          "5% price increase on $32.5M = $1.6M incremental revenue at ~40% flow-through = $640K EBITDA. First step: install dynamic discount governance so the lift doesn't leak back out through sales overrides.",
      },
      {
        companyId: "truenorth-saas",
        narrative:
          "SaaS with 92% recurring revenue and NRR around 115%. Pricing lever is expansion pricing: move Starter customers upmarket and add paid modules. Compensation is the gating factor -- if CS isn't rewarded for expansion, it won't happen.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
        ],
        opportunity:
          "10% list increase on new deals + raise module attach to 50% = ~$2.8M incremental ARR over 18 months. Requires CS comp plan redesign tied to NRR.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "You're buying a professional services firm with $30M revenue at 12% EBITDA margin. Benchmarking shows competitors run 18% margins. Would you prioritize pricing optimization? Why or why not? What would you look for in diligence, and how would you avoid leakage?",
      acceptanceCriteria: [
        "Identifies pricing power as the primary lever before cost cutting",
        "Notes the need for pricing benchmarking data segmented by customer and service line",
        "Flags sales compensation structure as a leakage risk (reps discount to close)",
        "Considers customer concentration gating risk and churn mitigation",
      ],
    },
  },

  {
    id: "sales-effectiveness",
    title: "Sales Force Effectiveness",
    category: "revenue",
    oneLiner:
      "Deploy a Sales Operating System: redesign the motion so growth is profitable, not just loud.",
    whenToDeploy: [
      "Direct sales model with weak CRM adoption (below 50%)",
      "Sales compensation not aligned to gross margin or NRR",
      "Sales cycle over 6 months with no pipeline visibility",
      "Founder is the only rainmaker; no VP Sales or playbook",
      "Expense-to-Revenue ratio creeping above industry benchmark (14% cross-industry, up to 46% for cloud SaaS)",
    ],
    typicalImpact: {
      revenue: "15-30% growth without proportional headcount increase",
      ebitdaMargin: "400-1000 bps (Blue Ridge Partners 6-10% typical)",
      timeline: "9-18 months for comp redesign, CRM, and SDR pipeline rollout",
    },
    businessTypeFit: {
      services: "Excellent. Direct sales with high comp-to-behavior leverage.",
      saas: "Excellent. GTM optimization is consistently high-ROI.",
      distribution: "Limited. Sales is often transactional order-taking.",
      manufacturing: "Good. Account management and cross-sell opportunities.",
    },
    redFlags: [
      "Sales leader is politically protected and resists process discipline",
      "Pipeline forecast accuracy below 70%; no weekly cadence",
      "Compensation rewards volume over profitability or retention",
      "Sales turnover above 30% annually signals culture or comp issues",
      "High customer acquisition cost with falling win rate -- growth is unprofitable",
    ],
    companyExamples: [
      {
        companyId: "apex-logistics",
        narrative:
          "Last-mile logistics with revenue down 8.6% YoY and 35% concentration on one retailer. Classic volume-comp trap: sales chased the biggest logo and built a fragile book. Comp redesign + SDR pipeline to diversify is the unlock.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
        ],
        opportunity:
          "Rebuild sales motion: 60% revenue, 40% profitability weighting. Diversification target: no single customer above 20%. Lift: $1-1.5M EBITDA over 18 months.",
      },
      {
        companyId: "precision-manufacturing",
        narrative:
          "Contract CNC with 28% concentration on one aerospace OEM. Technical expertise sits with the owner; no sales playbook exists. SDR+technical-sales-engineer combo shortens cycle and diversifies the book.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
        ],
        opportunity:
          "Add technical sales engineer + structured proposal process. Shorten cycle from 6 to 4 months = 15% revenue throughput lift without adding quota-carrying reps.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "You're evaluating a services company where the founder is the only rainmaker. Revenue grew 15% YoY but the founder is exhausted. Sales team doesn't close deals without founder involvement. Do you prioritize sales effectiveness or management upgrades first? Why? What does the Expense-to-Revenue ratio tell you?",
      acceptanceCriteria: [
        "Recognizes founder key-person risk as the blocker to any sales program",
        "Notes that a sales playbook won't help if the founder remains the sole closer",
        "Identifies VP Sales hire as the prerequisite and sequences management upgrade first",
        "Uses Expense-to-Revenue ratio to diagnose whether current growth is profitable",
      ],
    },
  },

  {
    id: "channel-expansion",
    title: "Channel Expansion",
    category: "revenue",
    oneLiner:
      "Add distribution channels, markets, or segments to a proven offering -- scrutinize margin impact and channel conflict.",
    whenToDeploy: [
      "Repeatable offering that doesn't require heavy customization",
      "Significant geographic white space or underserved segment",
      "Partner ecosystem exists (resellers, integrators, affiliates)",
      "Direct motion has plateaued but core product is validated",
    ],
    typicalImpact: {
      revenue: "15-50% uplift over 2-3 years",
      ebitdaMargin: "Flat to -100 bps (channel takes lower margin)",
      timeline: "12-24 months for identification, enablement, and ramp",
    },
    businessTypeFit: {
      services: "Good. Repeatable service packages; geographic expansion.",
      saas: "Excellent. Reseller and system integrator partnerships.",
      distribution: "Excellent. New geographies and customer segments.",
      manufacturing: "Limited. Channel model less applicable to direct manufacturing.",
    },
    redFlags: [
      "Direct sales has high margin; channel partner margin erodes unit economics",
      "Channel conflict with existing direct sales creates internal cannibalization",
      "Partner enablement cost underestimated; assumes low-touch model incorrectly",
      "No proven repeatable offering; customization kills the channel model",
      "Typical 25-40% partner margin haircut not modeled into the investment case",
    ],
    companyExamples: [
      {
        companyId: "bright-dental",
        narrative:
          "Dental roll-up at 5 locations. Base lever is acquisition. Secondary: license the tech stack and back-office services to independent operators who don't want to sell. Asset-light channel play on top of the roll-up.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
        ],
        opportunity:
          "License platform to 20 operators over 3 years = $3-5M high-margin recurring revenue, no capex, no clinical risk.",
      },
      {
        companyId: "coastal-foods",
        narrative:
          "Regional food distributor in the Mid-Atlantic. Geographic expansion via adjacent-metro acquisition or supply chain partnership that leverages Coastal's procurement scale.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
        ],
        opportunity:
          "Expansion to second geography within 3 years = $15-20M incremental revenue. Requires capital and integration capacity.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "A SaaS platform has built a strong direct sales motion ($10M ARR, $20M entry value). They're considering reseller partnerships for SMB. What diligence would you do? What could go wrong? How do you model the 25-40% partner margin haircut?",
      acceptanceCriteria: [
        "Identifies channel conflict risk between direct sales and resellers",
        "Notes partner enablement, training, and ongoing support costs",
        "Models the partner margin haircut impact on unit economics",
        "Asks about contract terms and churn risk specific to reseller-sourced customers",
      ],
    },
  },

  {
    id: "cross-sell-upsell",
    title: "Cross-Sell and Upsell (NRR Expansion)",
    category: "revenue",
    oneLiner:
      "Expand existing accounts to drive NRR above 120%. The highest-leverage revenue play for recurring revenue businesses.",
    whenToDeploy: [
      "Recurring revenue model (SaaS, subscriptions, long-term contracts)",
      "Net Revenue Retention below 120% with expansion headroom",
      "Low product adoption (customer uses a fraction of what they pay for)",
      "Tiered pricing with customers stuck on entry-level plans",
      "CSM team sized to support expansion, not just retention",
    ],
    typicalImpact: {
      revenue: "20-40% uplift over 2-3 years from expansion alone",
      ebitdaMargin: "High incremental margin on existing customer base",
      timeline: "6-12 months to restructure offerings; 2-3 years for full ramp",
    },
    businessTypeFit: {
      services: "Good. Upsell to higher-tier service packages.",
      saas: "Excellent. NRR is the paramount exit metric.",
      distribution: "Limited. Harder in transactional models.",
      manufacturing: "Limited. Less applicable.",
    },
    redFlags: [
      "Low product adoption means adding features won't move the needle",
      "Weak customer success function with no accountability for expansion",
      "Product quality issues prevent customers from upgrading",
      "CSM team too small or compensated only on retention, not expansion",
      "No usage telemetry to identify expansion-ready accounts",
    ],
    companyExamples: [
      {
        companyId: "truenorth-saas",
        narrative:
          "Tiered SaaS with NRR around 115% (Good per SaaS Capital 2025 benchmark). Pushing to 125%+ (Top Performer tier) commands premium exit multiples. Headroom is real: Starter tier penetration and module attach rate.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
        ],
        opportunity:
          "Target: 115% -> 125% NRR over 24 months. Mechanism: 30% of Starter to Professional + module attach to 50%. Impact: $2M+ ARR, lower blended CAC, premium exit multiple.",
      },
      {
        companyId: "vitality-vet",
        narrative:
          "Veterinary clinic group with sticky wellness plan customers. Cross-sell dental, orthopedic, behavioral training. Existing patient relationships make expansion high-probability and low-CAC.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
        ],
        opportunity:
          "Expand services per location from 1-2 to 3-4. ARPU lift of 25-40% without net-new patient acquisition.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "A B2B SaaS company has $20M ARR with 40% gross margin. NRR is 105% (3% churn, 8% expansion). You want to move NRR from 105% to 120% (crossing from 'Needs Improvement' into 'Good'). What levers would you pull? What's the cost, and what's the valuation impact?",
      acceptanceCriteria: [
        "Identifies CSM hiring, product packaging, and usage-based expansion as primary levers",
        "Notes that expansion requires product adoption and customer health as prerequisites",
        "Calculates incremental ARR impact of NRR improvement ($3M+ over 24 months)",
        "Mentions that NRR tier movement drives exit multiple, not just ARR",
      ],
    },
  },

  // -- MARGIN LEVERS ------------------------------------------------------

  {
    id: "procurement",
    title: "Procurement and Vendor Consolidation",
    category: "margin",
    oneLiner:
      "Lowest-risk cost lever in the toolkit. Best quick-win: aggregate spend across the GP's portfolio via a Group Purchasing Organization.",
    whenToDeploy: [
      "High COGS or vendor spend (above 30% of revenue)",
      "Redundant or fragmented supplier base",
      "No spend visibility or centralized purchasing function",
      "Supplier relationships inherited from founder era and never reviewed",
      "GP has other portfolio companies in adjacent categories (GPO leverage available)",
    ],
    typicalImpact: {
      revenue: "None (cost lever, not revenue)",
      ebitdaMargin: "300-800 bps (3-8% total EBITDA uplift typical)",
      timeline: "6-18 months; 3-6 months for quick-win spend categories",
    },
    businessTypeFit: {
      services: "Good if labor is outsourced; limited for pure professional services.",
      manufacturing: "Excellent. COGS is the largest line item.",
      saas: "Limited unless infrastructure and tooling costs are high.",
      distribution: "Excellent. COGS is 80-90% of revenue.",
    },
    redFlags: [
      "Single vendor scenarios where consolidation increases supply risk",
      "Switching costs are high (embedded integrations, tooling, certifications)",
      "Quality variability risk: price leads but quality suffers",
      "Long-term contracts locked in for 3-5 years",
      "Volume too small on its own to attract better pricing (mitigated by GPO)",
    ],
    companyExamples: [
      {
        companyId: "coastal-foods",
        narrative:
          "Food distributor with gross margin at only 19.1%. COGS is roughly 81% of revenue. Supplier base is fragmented across regional and national vendors. Primary GPO candidate: aggregate with other food/logistics portfolio companies.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
        ],
        opportunity:
          "Negotiate 3-5% COGS reduction via GPO aggregation = $1.3-2.1M additional EBITDA. 6-month payback.",
      },
      {
        companyId: "meridian-fulfillment",
        narrative:
          "3PL with labor, transportation, and packaging as top spend categories. GPO leverage on shipping carriers and packaging materials is the fastest path. Labor automation is a second-order margin play.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
        ],
        opportunity:
          "Consolidate carrier network via GPO + automate 20% of sort/pack = $1.5-2M cost savings over 18 months.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "You acquire a $50M manufacturing company with 35% COGS, 20% operating expenses, and 45% EBITDA margin. Benchmarking shows competitors at 30% COGS. Lay out a 6-month procurement plan. What are your quick wins? What role does cross-portfolio aggregation play?",
      acceptanceCriteria: [
        "Identifies spend analysis and vendor audit as the first step",
        "Calls out cross-portfolio aggregation (GPO) as the primary quick-win lever",
        "Calculates 5% COGS reduction = ~$2.5M incremental EBITDA",
        "Mentions realistic 6-18 month payback and risks from switching costs",
      ],
    },
  },

  {
    id: "labor-optimization",
    title: "Labor Optimization (G&A Modernization)",
    category: "margin",
    oneLiner:
      "Maximize revenue per employee through shared services and productivity, not crude headcount cuts.",
    whenToDeploy: [
      "SG&A above 14% of revenue (US median is at a five-year high)",
      "Manual back-office processes (AP, HR, payroll, data entry)",
      "Low utilization in services (billable hours below 60%)",
      "Organizational redundancy across multi-location operations",
      "Revenue per employee tracking below vertical benchmark",
    ],
    typicalImpact: {
      revenue: "None (cost lever)",
      ebitdaMargin: "200-500 bps via structural SG&A reduction",
      timeline: "6-12 months for process mapping and shared services rollout",
    },
    businessTypeFit: {
      services: "Excellent. Labor is 40-60% of cost structure.",
      manufacturing: "Good. Automation and factory optimization.",
      saas: "Limited unless significant outsourced labor exists.",
      distribution: "Good. Warehouse and back-office optimization.",
    },
    redFlags: [
      "High employee morale where aggressive cuts damage culture",
      "Talent shortage in the local market creates retention risk",
      "Change management capability is weak and reorgs stall",
      "Automation fantasy: 50% labor reduction assumed without phased implementation",
      "Manual tasks are contextual or exception-driven and hard to automate cleanly",
    ],
    companyExamples: [
      {
        companyId: "bright-dental",
        narrative:
          "Dental roll-up at 5 locations. Revenue per employee of $158K is below the professional services benchmark ($200K+). Shared services (billing, insurance, HR) across locations is a clean consolidation play.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Revenue per Employee", path: "keyMetrics.avgRevenuePerEmployee" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
        ],
        opportunity:
          "Consolidate admin and back-office = $400-600K labor savings. Target: lift rev-per-employee from $158K toward $200K.",
      },
      {
        companyId: "meridian-fulfillment",
        narrative:
          "3PL with 145 employees across 3 warehouses. Revenue per employee of $203K is decent but trails best-in-class 3PLs ($250K+). Manual sorting and spreadsheet inventory are the productivity drag.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
          { label: "Revenue per Employee", path: "keyMetrics.avgRevenuePerEmployee" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
        ],
        opportunity:
          "WMS + picking automation = 15-20% labor cost reduction = $1.1-1.5M EBITDA. Investment: $150-250K. Payback: 12 months.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "A services company has 80 employees, 35% labor cost, and 18% EBITDA margin. The founder says 'our people are our competitive advantage; we can't cut.' How would you approach labor optimization while respecting the culture? What benchmark do you use?",
      acceptanceCriteria: [
        "Focuses on revenue per employee as the benchmark, not raw headcount",
        "Identifies admin and back-office consolidation vs. billable talent",
        "Proposes shared services model for finance, HR, and procurement",
        "Addresses culture risk with retention packages and transparent communication",
      ],
    },
  },

  {
    id: "automation",
    title: "Process Automation and Core Technology",
    category: "margin",
    oneLiner:
      "Modernize ERP and core systems. Mature data governance is the non-negotiable prerequisite for any AI deployment downstream.",
    whenToDeploy: [
      "Multiple locations with no centralized systems",
      "Legacy ERP or spreadsheet-based operations",
      "Manual workflows with no real-time visibility",
      "High transaction volume with low automation",
      "Change management capability exists in the organization",
    ],
    typicalImpact: {
      revenue: "1-3% uplift from improved service and working capital release",
      ebitdaMargin: "400-1200 bps (4-12% EBITDA uplift typical)",
      timeline: "12-24 months for ERP implementations",
    },
    businessTypeFit: {
      services: "Good. Back-office efficiency, time tracking, resource allocation.",
      manufacturing: "Excellent. ERP, supply chain, inventory management.",
      saas: "Good. Infrastructure, monitoring, customer operations automation.",
      distribution: "Excellent. WMS, inventory, logistics optimization.",
    },
    redFlags: [
      "Scope creep: ERP starts as 'automate AP' and becomes 'rewrite the business'",
      "Weak change management leads to poor adoption and wasted investment",
      "Data migration failures: dirty data in old system breaks the new one",
      "Cost overruns: implementation budgets commonly run 50-100% over estimate",
      "Attempting AI deployment over legacy systems without data governance first -- catastrophic failure mode",
    ],
    companyExamples: [
      {
        companyId: "meridian-fulfillment",
        narrative:
          "3PL with 3 facilities and no centralized WMS. Orders arrive via email; warehouse uses spreadsheets; no real-time inventory. Textbook WMS implementation candidate, and a prerequisite for any AI demand forecasting later.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
        ],
        opportunity:
          "WMS implementation = 15% efficiency + 20% inventory reduction = $1.5M EBITDA. Cost: $200-300K. Unlocks the AI forecasting lever downstream.",
      },
      {
        companyId: "precision-manufacturing",
        narrative:
          "CNC manufacturer with 1990s ERP, manual job tracking, paper QC. Modernization is the base lever; also unblocks IoT monitoring and real-time quality tracking as follow-ons.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
        ],
        opportunity:
          "ERP modernization + quality tracking = 10-15% efficiency + 5% quality improvement = $300-500K EBITDA + reduced scrap. Enables exit-ready financial data.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "A $40M manufacturing company operates on a 1990s ERP. Modernizing will cost $500K and take 18 months. What questions decide if it's worth it? Why is this not just a cost exercise?",
      acceptanceCriteria: [
        "Identifies hidden costs of the legacy system (errors, workarounds, shadow IT)",
        "Calculates payback period comparing efficiency gains to investment",
        "Mentions change management and data governance as primary failure modes",
        "Frames ERP modernization as the prerequisite for AI and exit-ready data",
      ],
    },
  },

  {
    id: "facility-optimization",
    title: "Throughput and Facility Optimization",
    category: "margin",
    oneLiner:
      "Optimize throughput within existing facilities before consolidating. Consolidation carries high operational risk.",
    whenToDeploy: [
      "Multi-location operation with uneven utilization",
      "Throughput below theoretical capacity (manufacturing)",
      "High inventory relative to industry standard",
      "Long-term real estate contracts at above-market rates",
      "Capacity utilization below 70% across the network",
    ],
    typicalImpact: {
      revenue: "Flat to 3% uplift if throughput improves service levels",
      ebitdaMargin: "200-600 bps from real estate and inventory efficiency",
      timeline: "6-18 months; throughput wins are faster than consolidation",
    },
    businessTypeFit: {
      services: "Good if multi-location; limited if customer-facing.",
      manufacturing: "Excellent. Factory throughput is the primary lever.",
      saas: "Limited (no physical footprint).",
      distribution: "Excellent. Warehouse throughput and network design.",
    },
    redFlags: [
      "Employee impact high; local job losses damage morale in multi-site ops",
      "Customer proximity requirements (consolidation kills service SLAs)",
      "Inventory reduction too aggressive causes stockouts and lost revenue",
      "Operating leases with long terms carry high exit costs",
      "Consolidation modeled without stress-testing delivery SLAs",
    ],
    companyExamples: [
      {
        companyId: "meridian-fulfillment",
        narrative:
          "3PL with 3 regional facilities (NJ, TX, NV). Before consolidating, evaluate throughput wins in each facility (pick rates, sort efficiency). Consolidation only if throughput can't close the gap without SLA risk.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
        ],
        opportunity:
          "Throughput optimization first = $400-600K savings without consolidation risk. Consolidation to 2 hubs as phase 2 if throughput gap remains.",
      },
      {
        companyId: "precision-manufacturing",
        narrative:
          "Single facility with CNC equipment. Throughput optimization (cycle time, setup reduction, capacity utilization) unlocks capacity without capex. Most reliable margin lever for single-site manufacturers.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
        ],
        opportunity:
          "10-15% throughput improvement = 10-15% revenue capacity unlock at current cost base = 300-500 bps margin expansion.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "A manufacturer runs one facility at 72% capacity utilization. Competitors run at 85%. Would you consolidate, invest in automation, or chase throughput optimization first? What's the risk profile of each?",
      acceptanceCriteria: [
        "Sequences throughput optimization before consolidation or automation",
        "Identifies cycle time, setup reduction, and bottleneck management as first moves",
        "Notes that throughput wins flow directly to margin without capex",
        "Calculates capacity unlock at current cost base",
      ],
    },
  },

  {
    id: "working-capital",
    title: "Working Capital Optimization",
    category: "margin",
    oneLiner:
      "Unlock 5-10% of sales as free cash in the first 100 days through DSO, DPO, and DIO discipline.",
    whenToDeploy: [
      "Days Sales Outstanding exceeds vertical benchmark (30-45 days SaaS, 45-60 manufacturing, 60-90 construction)",
      "Inventory growing faster than revenue",
      "Bloated AR with no collections discipline or dunning automation",
      "Cash position below 30-day runway while growing",
      "No working capital KPI in monthly reporting cadence",
    ],
    typicalImpact: {
      revenue: "None (balance sheet lever)",
      ebitdaMargin: "Indirect. Free cash release typically 5-10% of sales.",
      timeline: "30-100 days for DSO and DPO; 6-12 months for DIO via inventory discipline",
    },
    businessTypeFit: {
      services: "Good. DSO reduction via milestone billing.",
      manufacturing: "Excellent. DIO reduction is the primary lever.",
      saas: "Good. Annual upfront billing + automated dunning.",
      distribution: "Excellent. Inventory management is existential.",
    },
    redFlags: [
      "Strategic customer relationships where aggressive DSO reduction damages trust",
      "DPO extension that breaks critical supplier relationships",
      "DIO reduction leading to stockouts and lost sales",
      "No forecasting system to support just-in-time inventory",
      "Retainage/holdback mechanisms masking the real cash position (construction)",
    ],
    companyExamples: [
      {
        companyId: "coastal-foods",
        narrative:
          "Food distributor flagged for working capital consuming cash: AR and inventory growing faster than revenue, cash down to $0.4M on $48.2M revenue. Classic case where DSO and DIO discipline unlocks material liquidity.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Accounts Receivable", path: "balanceSheet.ar" },
          { label: "Inventory", path: "balanceSheet.inventory" },
          { label: "Cash", path: "balanceSheet.cash" },
        ],
        opportunity:
          "15% inventory reduction + 10-day DSO improvement = $2-3M cash release. Self-funds growth initiatives without new capital.",
      },
      {
        companyId: "ironclad-construction",
        narrative:
          "Commercial GC with $8.4M AR on $52.8M revenue = ~58 days DSO, at the bottom of the construction benchmark (60-90). Retainage management and approval layer optimization are the unlocks.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Accounts Receivable", path: "balanceSheet.ar" },
          { label: "Cash", path: "balanceSheet.cash" },
          { label: "Long-term Debt", path: "balanceSheet.ltDebt" },
        ],
        opportunity:
          "Accelerate retainage collection + tighten approval layers = $2-3M working capital release. Use proceeds to deleverage.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "A $40M manufacturer is growing 20% YoY but has a cash crunch. DSO is 75 days (benchmark: 50), DIO is 90 days (benchmark: 60), DPO is 30 days (benchmark: 45). What's your 100-day working capital plan? What's the cash unlock?",
      acceptanceCriteria: [
        "Calculates the target cash unlock from each metric improvement",
        "Sequences quick wins (DSO automation, DPO extension) before DIO (which requires forecasting)",
        "Notes supplier relationship risk from aggressive DPO extension",
        "Identifies working capital release as self-funding for growth",
      ],
    },
  },

  // -- ORGANIZATIONAL LEVERS ----------------------------------------------

  {
    id: "management-upgrades",
    title: "Management Team Upgrades (CEO Alpha)",
    category: "organizational",
    oneLiner:
      "Top-quintile CEOs deliver 9-16% higher TSR. 60-70% of PE-backed portcos change CEO in the holding period -- usually within 24 months.",
    whenToDeploy: [
      "Capability gaps: no CFO, weak sales leader, no operations discipline",
      "Founder-led ceiling reached; execution can't scale without professional management",
      "Add-on integration requires dedicated exec (COO or integration lead)",
      "Growth strategy requires specific expertise (VP Sales for SaaS GTM, VP Ops for manufacturing)",
      "Operator CFO needed -- someone who owns the value creation plan, not just reporting",
    ],
    typicalImpact: {
      revenue: "Variable. Top-quintile CEO drives 9-16% TSR outperformance.",
      ebitdaMargin: "Variable. Improves execution velocity across all other levers.",
      timeline: "2-4 months to hire; 3-6 months to show impact",
    },
    businessTypeFit: {
      services: "Excellent. Operator CFO and CRO upgrades are high-ROI.",
      manufacturing: "Excellent. VP Ops and supply chain leader are critical.",
      saas: "Excellent. CRO and VP Product are existential.",
      distribution: "Good. VP Ops and VP Procurement upgrades pay off.",
    },
    redFlags: [
      "Cultural mismatch: strong hire but doesn't fit founder-led culture",
      "Weak authority granted: hire reports to founder without decision-making power",
      "Poor onboarding: hire dropped in without support and leaves confused",
      "Founder doesn't truly want to scale; hire threatens founder autonomy",
      "Turnover of hired talent signals culture or compensation issues",
      "Hiring a generic COO when the thesis requires a specialist (VP Ops, CRO, CFO)",
    ],
    companyExamples: [
      {
        companyId: "summit-hvac",
        narrative:
          "Founder-operator with $32.5M revenue, no CFO, owner comp above market. Prime candidate for an Operator CFO hire -- someone who architects the VCP, not just closes the books.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
        ],
        opportunity:
          "Operator CFO hire (~$200-250K fully loaded) unlocks 5-10% EBITDA improvement through cost control, working capital discipline, and VCP ownership.",
      },
      {
        companyId: "bright-dental",
        narrative:
          "Dental roll-up at 5 locations with aggressive acquisition playbook but no COO. Non-clinical founder can scale only so far without dedicated operational leadership.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
        ],
        opportunity:
          "COO hire (~$250-300K) improves unit economics by 200-300 bps through standardization and integration discipline.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "A $50M manufacturing company has a strong founder/CEO but no VP Ops or supply chain leader. You want to pursue procurement and facility optimization. Do you hire before or after deal close? What's the spec? Why does 'VP Ops' matter over 'generic COO'?",
      acceptanceCriteria: [
        "Recognizes that operational execution requires a dedicated specialist, not a generalist",
        "Recommends hiring within the first 90 days post-close",
        "Specifies VP Ops or VP Supply Chain with specific mandate",
        "Notes that founder must delegate real authority for the hire to succeed",
      ],
    },
  },

  {
    id: "incentive-alignment",
    title: "Incentive Alignment and KPI Discipline",
    category: "organizational",
    oneLiner:
      "Tie 40-60% of management incentives to operational KPIs (NRR, cash conversion, unit economics), not just EBITDA.",
    whenToDeploy: [
      "Compensation not linked to value drivers (sales comp rewards volume over margin)",
      "No KPI visibility or discipline; no shared metrics across functions",
      "Organizational silos: Finance, Operations, and HR don't share goals",
      "Founder-led compensation is ad hoc or political",
      "Management incentives weighted 100% to EBITDA, ignoring operational KPIs",
    ],
    typicalImpact: {
      revenue: "2-5% uplift from behavior alignment",
      ebitdaMargin: "100-200 bps via profitability and retention focus",
      timeline: "1-3 months to design; 6 months to stabilize behavior",
    },
    businessTypeFit: {
      services: "Excellent. Compensation drives sales and margin behavior directly.",
      manufacturing: "Good. Production efficiency and quality metrics matter.",
      saas: "Excellent. Comp should drive NRR, not just new ARR.",
      distribution: "Good. Cost discipline and service level balance.",
    },
    redFlags: [
      "Too many KPIs (more than 5 per role means none are real priorities)",
      "Gaming metrics: people optimize for the metric, not the outcome",
      "Data quality poor; metrics are estimated, not measured",
      "Weak governance: no monthly review, no accountability",
      "Uncapped incentives where comp budget explodes on upside",
    ],
    companyExamples: [
      {
        companyId: "apex-logistics",
        narrative:
          "Last-mile logistics with revenue down 8.6% and 35% customer concentration. Sales comp is likely volume-weighted, reinforcing bad account selection. Classic comp redesign opportunity.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
        ],
        opportunity:
          "Comp redesign: 60% revenue, 40% operational KPIs (margin tier, on-time rate, customer NPS) = 200-300 bps EBITDA margin improvement over 12 months.",
      },
      {
        companyId: "truenorth-saas",
        narrative:
          "SaaS with 115% NRR but sales comp likely rewards new logos; CS has no expansion incentive. Realign CS and Sales to NRR target to capture expansion potential.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
        ],
        opportunity:
          "Tie 50% of CS and 40% of Sales comp to NRR target of 125%. Impact: $2M+ ARR expansion over 2 years plus premium exit multiple.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "Design sales compensation for a $30M SaaS company. Target: 15% revenue growth, 3% price realization, 120% NRR. Sales team is 12 people (5 enterprise, 7 SMB). How do you structure comp with 40-60% tied to operational KPIs?",
      acceptanceCriteria: [
        "Separates new logo, expansion, and retention into distinct comp lines",
        "Ties 40-60% of variable comp to operational KPIs (NRR, margin, CAC)",
        "Balances upside potential with downside cap to stay within budget",
        "Includes team-based component for sales/CS collaboration",
      ],
    },
  },

  {
    id: "financial-controls",
    title: "Reporting, Controls, and Exit Readiness",
    category: "organizational",
    oneLiner:
      "Not hygiene -- exit readiness. Clean QoE directly drives exit multiple. Delayed closes and opaque inventory are deal killers.",
    whenToDeploy: [
      "No standardized monthly reporting (founder-led, no CFO)",
      "No internal controls on spend (founder approves everything)",
      "Cash position unclear; no rolling forecast or working capital discipline",
      "Exit approaching; clean audits and control environment required",
      "Prior QoE review flagged data integrity or variance analysis gaps",
    ],
    typicalImpact: {
      revenue: "None directly (governance lever)",
      ebitdaMargin: "100-200 bps from working capital optimization and cost visibility",
      timeline: "2-4 months for baseline; 6 months to mature; 18-24 months for exit-ready",
    },
    businessTypeFit: {
      services: "Important. Working capital and cash conversion are critical.",
      manufacturing: "Important. Inventory control and variance tracking.",
      saas: "Important. Unit economics and CAC/LTV tracking.",
      distribution: "Critical. Inventory and payables management.",
    },
    redFlags: [
      "Monthly close takes 2+ weeks -- deal killer in QoE diligence",
      "No variance analysis; actuals vs. forecast never reconciled",
      "Data integrity issues: numbers change month-to-month without explanation",
      "No follow-up on controls findings; nobody owns enforcement",
      "Reporting becomes compliance exercise, not a strategic management tool",
    ],
    companyExamples: [
      {
        companyId: "summit-hvac",
        narrative:
          "Owner runs business on gut feel. No monthly P&L, no cash forecast, no job costing. Classic founder-era gap where basic controls produce rapid visibility wins and start the exit-readiness clock.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
        ],
        opportunity:
          "Monthly close + job-level costing = visibility into profitable vs. loss-leader work = 200-300 bps margin via mix shift. Also the first step toward clean QoE.",
      },
      {
        companyId: "meridian-fulfillment",
        narrative:
          "3PL with inventory estimation gaps. Cash position is not forecast. Pre-exit, this is a multi-million dollar valuation risk: buyers discount heavily for data integrity issues.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Inventory", path: "balanceSheet.inventory" },
          { label: "Cash", path: "balanceSheet.cash" },
        ],
        opportunity:
          "Monthly inventory close + working capital KPIs = clean QoE data + $500K working capital release. Valuation impact at exit: avoids a 0.5-1.0x multiple haircut.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "You acquire a $50M company with no monthly close, no budget, and no variance analysis. Budget: $0-50K per year. Design a 12-month controls build program. Why is this really about exit readiness, not just reporting hygiene?",
      acceptanceCriteria: [
        "Month 1: baseline monthly close, chart of accounts, basic variance",
        "Months 3-6: KPI dashboard, departmental budgets, cost center accountability",
        "Months 6-12: rolling forecast, working capital KPIs, cash management",
        "Explicitly connects controls maturity to exit multiple via QoE diligence risk",
      ],
    },
  },

  // -- TECHNOLOGY LEVER ---------------------------------------------------

  {
    id: "ai-software",
    title: "AI and Software: Deploy, Reshape, Invent",
    category: "technology",
    oneLiner:
      "BCG 2026 framework: Deploy (horizontal tools), Reshape (functional transformation), Invent (new business models). Digital-first portcos earn 2x ROIC vs. laggards.",
    whenToDeploy: [
      "Core systems already modernized (data governance is a prerequisite)",
      "Software creates competitive advantage in the vertical",
      "Problem is repetitive, data-driven, and measurable",
      "Adoption risk is manageable (internal tool before customer-facing)",
      "Build cost affordable with AI-assisted development ($50-200K for internal tools)",
    ],
    typicalImpact: {
      revenue: "2-10% from pricing/product and cross-sell",
      ebitdaMargin: "100-300 bps for Deploy; up to 15-30% function-level productivity for Reshape",
      timeline: "Deploy: weeks. Reshape: 6-12 months. Invent: 12-24 months.",
    },
    businessTypeFit: {
      services: "Excellent. Pricing engines, sales automation, customer engagement.",
      manufacturing: "Excellent. Supply chain forecasting, inventory optimization.",
      saas: "Excellent. AI-powered features as retention and expansion drivers.",
      distribution: "Good. Route optimization, demand forecasting, inventory.",
    },
    redFlags: [
      "Attempting to deploy over legacy systems without data governance -- catastrophic failure",
      "Adoption weak: building software nobody uses internally",
      "Vertical too niche: addressable market too small to justify investment",
      "AI-generated code with unaddressed technical debt",
      "Scope creep: 'small project' turns into 6-month engineering effort",
      "Confusing Deploy (tooling) with Reshape (workflow redesign) -- they have very different cost profiles",
    ],
    companyExamples: [
      {
        companyId: "bright-dental",
        narrative:
          "Dental platform with multi-location scheduling complexity. Reshape play: AI-powered patient communication and smart scheduling redesigns the front-desk workflow end-to-end, not just a copilot on top.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
        ],
        opportunity:
          "AI scheduling reshape: $150K build + change management, 12-15% utilization improvement = $200K+ annual EBITDA. Unlocks front-desk labor redeployment.",
      },
      {
        companyId: "meridian-fulfillment",
        narrative:
          "3PL with demand forecasting gaps. Reshape play: AI demand model predicts order patterns and rebalances inventory across 3 facilities. Depends on WMS implementation first (data governance prerequisite).",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
        ],
        opportunity:
          "AI forecasting: $100K build, 15% inventory reduction + 5% service improvement = $400K EBITDA. Only works if WMS is in place first.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "A $50M services firm wants to build an AI pricing engine (Reshape play). Build cost: $120K. Estimated ROI: $500K annual EBITDA. The CEO says 'we can build it over the weekend with Claude.' What diligence would you do? What's your go/no-go framework?",
      acceptanceCriteria: [
        "Identifies whether the core data infrastructure and CRM are clean enough to support the model",
        "Distinguishes Deploy (copilot on existing workflow) from Reshape (redesigning the workflow)",
        "Notes change management and adoption cost as often exceeding build cost",
        "Calculates payback period and specifies pilot-before-full-rollout decision gate",
      ],
    },
  },

  // -- STRATEGIC LEVERS ---------------------------------------------------

  {
    id: "buy-and-build",
    title: "Buy-and-Build and M&A Integration",
    category: "strategic",
    oneLiner:
      "Multiple arbitrage through add-on acquisitions. 40-74% of PE deal activity. Buy sub-scale targets cheap, integrate into higher-multiple platform.",
    whenToDeploy: [
      "Fragmented market with many sub-scale targets",
      "Platform company has scalable back-office and integration capability",
      "Cost and revenue synergies are identifiable pre-close",
      "Multiple arbitrage spread is material (platform at 10x, add-ons at 5-6x)",
      "Integration leader (COO or dedicated integration exec) is in place",
    ],
    typicalImpact: {
      revenue: "30-100% growth per platform cycle, driven by add-on revenue",
      ebitdaMargin: "200-500 bps from cost synergies + multiple arbitrage at exit",
      timeline: "6-12 months per add-on; 18-36 months for full integration",
    },
    businessTypeFit: {
      services: "Excellent. Consolidate fragmented regional or vertical operators.",
      manufacturing: "Good. Industrial roll-ups in tool and parts categories.",
      saas: "Good. Product or geographic consolidation.",
      distribution: "Excellent. Geographic and category expansion.",
    },
    redFlags: [
      "Overpaying for add-ons eliminates the arbitrage margin",
      "Integration failures: disjointed ERP, disparate sales comp, culture clashes",
      "Inability to sunset Transitional Service Agreements (TSAs) on time",
      "Over-leverage: debt-funded acquisitions erode at higher interest rates",
      "No dedicated integration leader -- the deal closes but value creation stalls",
      "Cultural misalignment between founder-led targets and corporate platform",
    ],
    companyExamples: [
      {
        companyId: "bright-dental",
        narrative:
          "Dental roll-up with 5 locations and $3.2M in goodwill from prior acquisitions. Fragmented dental market with thousands of sub-scale targets. Platform has scale advantages (procurement, insurance, tech).",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Goodwill", path: "balanceSheet.goodwill" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
        ],
        opportunity:
          "Add 10-15 clinics over 3 years at 5-6x EBITDA, integrate into 8-9x platform valuation = multiple arbitrage spread of 3x on $1.5M incremental EBITDA per add-on.",
      },
      {
        companyId: "vitality-vet",
        narrative:
          "Veterinary roll-up at 3 locations with $1.6M in goodwill. Vet market is even more fragmented than dental. Platform is early-stage but has the founder-operator DNA for aggressive consolidation.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Goodwill", path: "balanceSheet.goodwill" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
        ],
        opportunity:
          "Grow from 3 to 12 locations over 4 years. Multiple arbitrage + cost synergies (shared clinical back-office, procurement) = 2-3x MOIC acceleration.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "You own a $10M EBITDA platform company at a 9x multiple. You're looking at a $2M EBITDA add-on at 5.5x. Integration cost is $500K and 12 months. Walk through the multiple arbitrage math and the top 3 integration risks.",
      acceptanceCriteria: [
        "Calculates multiple arbitrage: $2M at 5.5x ($11M) vs. $2M at 9x ($18M) = $7M instant value minus integration cost",
        "Identifies integration risks: ERP and data, sales comp, culture, TSA dependency",
        "Notes the carrying cost of add-on debt and interest rate sensitivity",
        "Discusses who owns integration -- dedicated leader vs. existing ops team",
      ],
    },
  },

  {
    id: "esg-sustainability",
    title: "ESG and Sustainability",
    category: "strategic",
    oneLiner:
      "Mature ESG practices earn a verified 6-7% exit multiple uplift. Energy efficiency and supply chain transparency are the operational unlocks.",
    whenToDeploy: [
      "Energy-intensive operations (fleet, warehouses, manufacturing)",
      "Supply chain with material ESG exposure (labor, sourcing, emissions)",
      "Institutional or strategic acquirers likely at exit (they pay premiums for ESG data)",
      "Sustainability-linked finance available (lower cost of debt tied to targets)",
      "Regulatory pressure imminent (EU CSRD, SEC climate disclosure)",
    ],
    typicalImpact: {
      revenue: "Flat to 2% uplift from customer preference and contract wins",
      ebitdaMargin: "100-300 bps from energy efficiency and waste reduction",
      timeline: "6-18 months operational; 2-3 years to realize exit multiple uplift",
    },
    businessTypeFit: {
      services: "Limited. Primarily governance and reporting-focused.",
      manufacturing: "Excellent. Energy, waste, and supply chain all in scope.",
      saas: "Limited. Governance and data privacy dominate.",
      distribution: "Excellent. Fleet emissions and warehouse energy are material.",
    },
    redFlags: [
      "Greenwashing: claims without measurement or third-party verification",
      "ESG treated as compliance checkbox, not operational program",
      "No baseline measurement -- can't demonstrate improvement to acquirers",
      "Sustainability initiatives not tied to P&L outcomes (pure cost, no return)",
      "Regulatory blind spots in cross-border operations",
    ],
    companyExamples: [
      {
        companyId: "apex-logistics",
        narrative:
          "Last-mile logistics with 65 box trucks across 4 metros. Fleet emissions are the dominant ESG exposure. EV fleet transition + route optimization hit cost and sustainability simultaneously.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
          { label: "Capex", path: "cashFlow.capex" },
        ],
        opportunity:
          "Phased EV fleet + AI route optimization = 15-20% fuel cost reduction + emissions story for exit. Sustainability-linked debt lowers cost of capital by 25-50 bps.",
      },
      {
        companyId: "ironclad-construction",
        narrative:
          "Commercial GC with 40% government contract mix. Government RFPs increasingly require ESG disclosures and sustainable building certifications (LEED, WELL). ESG maturity is a contract-winning lever, not just reporting.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
        ],
        opportunity:
          "Build LEED/WELL certification capability = win 10-15% more government RFPs = $5-8M annual revenue uplift. Exit multiple impact: 0.5-1.0x expansion at sale.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "A $40M regional trucking company has 50 diesel trucks and wants to explore ESG as a value creation lever. The CFO thinks it's a cost without return. How do you frame the business case? What's the specific path to a 6-7% exit multiple uplift?",
      acceptanceCriteria: [
        "Connects ESG to operational metrics: fuel cost, maintenance, insurance rates",
        "Identifies sustainability-linked finance as cost-of-capital lever",
        "Notes that strategic acquirers (and secondary sponsors) pay premiums for verified ESG data",
        "Frames ESG as customer-driven revenue (contract wins) and defensive (regulatory risk mitigation)",
      ],
    },
  },
];

export const LEVER_CATEGORIES = {
  revenue: {
    id: "revenue",
    label: "Revenue Levers",
    description: "Grow the top line through pricing, sales, channels, and expansion.",
  },
  margin: {
    id: "margin",
    label: "Margin Levers",
    description:
      "Expand margins through cost structure, procurement, operational leverage, and working capital.",
  },
  organizational: {
    id: "organizational",
    label: "Organizational Levers",
    description: "Upgrade management, incentives, and controls to enable execution.",
  },
  technology: {
    id: "technology",
    label: "Technology Levers",
    description: "Build software and AI that create competitive advantage.",
  },
  strategic: {
    id: "strategic",
    label: "Strategic Levers",
    description: "Multiple expansion through M&A, portfolio-level plays, and positioning.",
  },
};
