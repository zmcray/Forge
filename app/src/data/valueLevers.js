/**
 * Value Creation Levers -- 12 operational levers for PE value creation.
 * Each lever references real company data from companies.js via canonical companyId.
 * The exercise prompt feeds into LLM grading with a model answer synthesized
 * from acceptanceCriteria at render time in LeverCard.jsx.
 */
export const VALUE_LEVERS = [
  // -- REVENUE LEVERS -----------------------------------------------------

  {
    id: "pricing-optimization",
    title: "Pricing Optimization",
    category: "revenue",
    oneLiner: "Increase price or improve price realization without losing volume.",
    whenToDeploy: [
      "Services business with fragmented or outdated pricing",
      "Market where transparency is low (customers don't compare prices)",
      "Historical pricing below market, discovered via benchmarking",
      "Pricing power exists but has never been tested",
    ],
    typicalImpact: {
      revenue: "10-20% uplift from pricing alone",
      ebitdaMargin: "300-700 bps",
      timeline: "6-12 months to full implementation",
    },
    businessTypeFit: {
      services: "Ideal. Price elasticity low; customer switching cost high.",
      manufacturing: "Good. Specialty products where pricing power exists.",
      saas: "Good. Tiered pricing and expansion pricing leverage.",
      distribution: "Difficult. Commoditized with transparent pricing.",
    },
    redFlags: [
      "Market is commoditized and pricing power doesn't exist",
      "Pricing is published or transparent (customers see competitors)",
      "Customer concentration above 30% (one customer can force price down)",
      "Price elasticity is high (small increase loses material volume)",
    ],
    companyExamples: [
      {
        companyId: "summit-hvac",
        narrative:
          "HVAC services in a fragmented Southeast market. Customers don't comparison-shop across providers; switching costs are high once service contracts are in place. Opportunity: raise price 5-8% on next contract renewal cycles.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
        ],
        opportunity:
          "5% price increase on $32.5M revenue = $1.6M incremental at ~40% flow-through = $640K additional EBITDA. Low risk because customer concentration is only 12%.",
      },
      {
        companyId: "truenorth-saas",
        narrative:
          "Cybersecurity compliance SaaS with tiered pricing and 92% recurring revenue. Expansion pricing lever: upsell existing customers to higher tiers, add paid modules. Net revenue retention already at 115% signals headroom.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
        ],
        opportunity:
          "10% price increase on new deals + expand module attach rate to 50% of base = approximately $2.8M incremental ARR over 18 months.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "You're buying a professional services firm with $30M revenue at 12% EBITDA margin. Benchmarking shows competitors run 18% margins. Would you prioritize pricing optimization? Why or why not? What would you look for in diligence?",
      acceptanceCriteria: [
        "Identifies pricing power as the primary lever before cost cutting",
        "Notes the need for pricing benchmarking data across the customer base",
        "Flags customer concentration as a gating risk for price increases",
        "Considers customer churn risk from price increases and how to mitigate it",
      ],
    },
  },

  {
    id: "sales-effectiveness",
    title: "Sales Force Effectiveness",
    category: "revenue",
    oneLiner:
      "Improve sales productivity, deal size, and win rate through process, tools, and talent upgrades.",
    whenToDeploy: [
      "Direct sales model with weak CRM adoption (below 50%)",
      "Sales compensation not aligned to value drivers",
      "Sales cycle over 6 months with no clear pipeline visibility",
      "VP Sales role is weak, absent, or politically protected",
    ],
    typicalImpact: {
      revenue: "15-30% growth without proportional headcount increase",
      ebitdaMargin: "200-400 bps from improved sales leverage",
      timeline: "6-12 months for comp redesign, CRM, and playbook rollout",
    },
    businessTypeFit: {
      services: "Excellent. Direct sales; compensation drives behavior.",
      saas: "Excellent. GTM optimization is consistently high-ROI.",
      distribution: "Limited. Sales is often transactional order-taking.",
      manufacturing: "Good. Account management and cross-sell opportunities.",
    },
    redFlags: [
      "Sales leader resists change or is politically protected",
      "Pipeline visibility is weak with no forecast discipline",
      "Compensation tied to revenue volume, not profitability or product mix",
      "High sales turnover above 30% annually",
      "Sales cost of acquisition rising while win rate falls",
    ],
    companyExamples: [
      {
        companyId: "apex-logistics",
        narrative:
          "B2B last-mile logistics. Sales model is relationship-driven but lacks process discipline. 35% customer concentration on one major retailer signals weak diversification of the sales motion. Revenue declined 8.6% YoY.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
        ],
        opportunity:
          "20% sales productivity lift + diversification away from top customer = $7.7M incremental revenue at 15% flow-through = $1.2M EBITDA. Comp redesign cost: $50-75K.",
      },
      {
        companyId: "precision-manufacturing",
        narrative:
          "Contract CNC manufacturer. Sales is project-based with long cycles and 28% customer concentration on one aerospace OEM. Technical expertise sits with the owner; no sales playbook exists.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
        ],
        opportunity:
          "Add technical sales engineer, build proposal process, shorten sales cycle from 6 to 4 months = 15% revenue lift through higher deal throughput.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "You're evaluating a services company where the founder is the only rainmaker. Revenue grew 15% YoY but the founder is exhausted. Sales team doesn't close deals without founder involvement. Do you prioritize sales effectiveness or management upgrades first? Why?",
      acceptanceCriteria: [
        "Recognizes founder key-person risk as the blocker to any sales effectiveness program",
        "Notes that a sales playbook won't help if the founder remains the sole closer",
        "Identifies VP Sales hire or management upgrade as the prerequisite",
        "Considers the sequencing: hire first, then roll out process and tooling",
      ],
    },
  },

  {
    id: "channel-expansion",
    title: "Channel Expansion",
    category: "revenue",
    oneLiner:
      "Add new distribution channels, markets, or customer segments to an existing offering.",
    whenToDeploy: [
      "Repeatable offering (not custom work)",
      "Significant geographic white space remains",
      "Underserved market segment with similar needs",
      "Partner ecosystem exists (resellers, integrators, affiliates)",
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
      "Current direct sales model has high margin; channel margin erodes unit economics",
      "Channel conflict with existing direct sales creates internal cannibalization",
      "Partner enablement cost underestimated; assumes low-touch model incorrectly",
      "No proven repeatable offering; customization kills the channel model",
    ],
    companyExamples: [
      {
        companyId: "bright-dental",
        narrative:
          "Dental roll-up platform at 5 locations. Base lever is acquisition and integration. Secondary lever: channel expansion via a licensing model where independent operators use BrightSmile's tech stack and back-office services for a fee.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
        ],
        opportunity:
          "License platform to 20 additional operators over 3 years = $3-5M incremental revenue at high margin and low capex.",
      },
      {
        companyId: "coastal-foods",
        narrative:
          "Regional specialty food distributor concentrated in the Mid-Atlantic. Geographic expansion opportunity: acquire an adjacent distributor or build a supply chain partnership that leverages Coastal's procurement scale.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
        ],
        opportunity:
          "Expansion to a second geography within 3 years = $15-20M incremental revenue. Requires capital for acquisition or greenfield.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "A SaaS platform has built a strong direct sales motion ($10M ARR, $20M entry value). They're considering reseller partnerships for the SMB segment. What diligence would you do? What could go wrong?",
      acceptanceCriteria: [
        "Identifies channel conflict risk between direct sales and resellers",
        "Notes partner enablement, training, and support costs",
        "Mentions the typical 25-40% partner margin requirement and its impact on unit economics",
        "Asks about contract terms and churn risk specific to reseller-sourced customers",
      ],
    },
  },

  {
    id: "cross-sell-upsell",
    title: "Cross-Sell and Upsell",
    category: "revenue",
    oneLiner:
      "Expand revenue from existing customers by selling additional products or higher-tier offerings.",
    whenToDeploy: [
      "Recurring revenue model (SaaS, subscriptions, contracts)",
      "Low product adoption (customer uses only a fraction of the platform)",
      "Tiered pricing with headroom to move customers upmarket",
      "Modular offerings where bundles haven't been sold",
    ],
    typicalImpact: {
      revenue: "20-40% uplift over 2-3 years from expansion alone",
      ebitdaMargin: "High incremental margin on existing customer base",
      timeline: "6-12 months to structure offerings; 2-3 years for full ramp",
    },
    businessTypeFit: {
      services: "Good. Upsell to higher-tier service packages.",
      saas: "Excellent. Native to SaaS; net revenue retention driver.",
      distribution: "Limited. Cross-sell harder in transactional models.",
      manufacturing: "Limited. Less applicable.",
    },
    redFlags: [
      "Low product adoption means adding features won't help",
      "Weak customer success function with no CSM accountability for expansion",
      "Product quality issues prevent customers from upgrading",
      "CSM team too small to support expansion initiatives",
      "No usage data to identify expansion opportunities",
    ],
    companyExamples: [
      {
        companyId: "truenorth-saas",
        narrative:
          "SaaS platform with tiered pricing and net revenue retention of 115%. Expansion headroom remains: move Starter customers to Professional, increase module attach rates, and add paid integrations.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
        ],
        opportunity:
          "Move 30% of Starter customers to Professional tier and grow module attach to 50% = 35-45% NRR expansion over 24 months.",
      },
      {
        companyId: "vitality-vet",
        narrative:
          "Veterinary clinic group with core wellness services. Cross-sell opportunities: dental, orthopedic surgery, behavioral training, nutrition consulting. Existing patient relationships make expansion high-probability.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
        ],
        opportunity:
          "Expand services per location from 1-2 to 3-4 active service lines; increase ARPU by 25-40% without adding new patients.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "A B2B SaaS company has $20M ARR with 40% gross margin. Net revenue retention is 105% (3% churn, 8% expansion). You want to accelerate expansion from 8% to 12%. What levers would you pull? What's the cost?",
      acceptanceCriteria: [
        "Identifies CSM hiring, product discovery, and packaging as the primary expansion levers",
        "Notes that expansion requires product adoption and customer health first",
        "Calculates approximate incremental NRR impact ($800K additional ARR)",
        "Mentions customer segmentation since not all customers are expansion-ready",
      ],
    },
  },

  // -- MARGIN LEVERS ------------------------------------------------------

  {
    id: "procurement",
    title: "Procurement and Vendor Consolidation",
    category: "margin",
    oneLiner:
      "Reduce cost of goods sold or vendor spend through consolidation, negotiation, and operational discipline.",
    whenToDeploy: [
      "High COGS or vendor spend (above 30% of revenue)",
      "Redundant or fragmented supplier base",
      "Lack of spend visibility or centralized purchasing",
      "Supplier relationships inherited from the founder era without review",
    ],
    typicalImpact: {
      revenue: "None (cost lever, not revenue)",
      ebitdaMargin: "5-15% cost reduction on spend category, 200-1000 bps margin impact",
      timeline: "3-6 months for spend analysis, RFP, and contract negotiation",
    },
    businessTypeFit: {
      services: "Good if labor is outsourced; limited for pure professional services.",
      manufacturing: "Excellent. COGS is the largest line item.",
      saas: "Limited unless infrastructure costs are high.",
      distribution: "Excellent. COGS is 80-90% of revenue.",
    },
    redFlags: [
      "Single vendor scenario where consolidation increases supply risk",
      "Supplier relationship carries embedded value (switching cost very high)",
      "Quality variability risk if price leads but quality suffers",
      "Long-term contracts locked in for 3-5 years with limited flexibility",
      "Volume too small to attract better vendors",
    ],
    companyExamples: [
      {
        companyId: "coastal-foods",
        narrative:
          "Food distributor with gross margin of only 19.1%. COGS represents roughly 81% of revenue. Supplier base is fragmented across regional and national vendors. Consolidation opportunity is material.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
        ],
        opportunity:
          "Negotiate 3-5% cost reduction on COGS = $1.3-2.1M additional EBITDA. Implementation cost: 50-100 hours of procurement work.",
      },
      {
        companyId: "meridian-fulfillment",
        narrative:
          "3PL fulfillment. Largest costs are labor (warehouse ops, sorting, packing), transportation, and facilities. Procurement opportunity spans carrier consolidation and packaging materials.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
        ],
        opportunity:
          "Automate 20% of manual sort/pack labor + consolidate carrier network = $1.5-2M cost savings over 18 months.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "You acquire a $50M manufacturing company with 35% COGS, 20% operating expenses, and 45% EBITDA margin. Benchmarking shows competitors at 30% COGS. Lay out a 6-month procurement optimization plan. What are your quick wins? What's the incremental EBITDA?",
      acceptanceCriteria: [
        "Identifies spend analysis and vendor audit as the first step",
        "Notes volume aggregation opportunity with other portfolio companies",
        "Calculates 5% COGS reduction = approximately $2.5M incremental EBITDA",
        "Mentions implementation cost and realistic timeline for negotiation cycles",
      ],
    },
  },

  {
    id: "labor-optimization",
    title: "Labor Optimization",
    category: "margin",
    oneLiner:
      "Reduce labor cost through process re-engineering, automation, and organizational redesign.",
    whenToDeploy: [
      "High labor cost as percentage of revenue (above 35% outside professional services)",
      "Manual back-office processes (AP, HR, payroll, data entry)",
      "Low utilization in services business (billable hours below 60%)",
      "Organizational redundancy or duplicate roles across locations",
    ],
    typicalImpact: {
      revenue: "None (cost lever)",
      ebitdaMargin: "10-25% labor cost reduction = 200-500 bps margin",
      timeline: "6-12 months for time-and-motion study, mapping, implementation",
    },
    businessTypeFit: {
      services: "Excellent. Labor is 40-60% of cost structure.",
      manufacturing: "Good. Labor optimization via automation.",
      saas: "Limited unless significant outsourced labor exists.",
      distribution: "Good. Warehouse labor is the largest cost category.",
    },
    redFlags: [
      "High employee morale where aggressive cuts damage culture",
      "Talent shortage in the local market creates retention risk",
      "Change management capability is weak and reorgs stall",
      "Automation fantasy: assuming 50% labor reduction without phased implementation",
      "Manual tasks are contextual or exception-driven and hard to automate",
    ],
    companyExamples: [
      {
        companyId: "bright-dental",
        narrative:
          "Dental roll-up at 5 locations. Labor (clinicians, hygienists, front office) is the largest cost category. Shared services across locations (billing, insurance, HR) is a clean consolidation play.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
          { label: "Revenue per Employee", path: "keyMetrics.avgRevenuePerEmployee" },
        ],
        opportunity:
          "Consolidate admin and back-office across 5 locations = $400-600K labor savings via shared CFO, HR, and centralized billing.",
      },
      {
        companyId: "meridian-fulfillment",
        narrative:
          "3PL with 145 employees across 3 warehouses. Manual sorting, hand-picked orders, spreadsheet-based inventory. WMS implementation is the unlock; pick automation follows.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
          { label: "Revenue per Employee", path: "keyMetrics.avgRevenuePerEmployee" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
        ],
        opportunity:
          "WMS + picking automation = 15-20% labor cost reduction = $1.1-1.5M EBITDA. Cost: $150-250K for WMS and integration.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "A services company has 80 employees, 35% labor cost, and 18% EBITDA margin. The founder says 'our people are our competitive advantage; we can't cut.' How would you approach labor optimization here?",
      acceptanceCriteria: [
        "Focuses on utilization and leverage rather than headcount cuts",
        "Identifies admin and back-office consolidation vs. billable talent",
        "Proposes specialist roles over generalists for new hires",
        "Mentions talent loss risk and how to mitigate through retention packages",
      ],
    },
  },

  {
    id: "automation",
    title: "Process Automation and Technology",
    category: "margin",
    oneLiner:
      "Improve operational efficiency through systems implementation, automation, and digitization of manual workflows.",
    whenToDeploy: [
      "Multiple locations with no centralized systems",
      "Legacy systems or spreadsheet-based operations",
      "Manual workflows with no real-time visibility",
      "High transaction volume with low automation",
      "Change management capability exists in the organization",
    ],
    typicalImpact: {
      revenue: "1-3% uplift from improved service and working capital release",
      ebitdaMargin: "15-30% operational efficiency improvement = 300-700 bps",
      timeline: "12-24 months, especially for ERP implementations",
    },
    businessTypeFit: {
      services: "Good. Back-office efficiency, time tracking, resource allocation.",
      manufacturing: "Excellent. ERP, supply chain, inventory management.",
      saas: "Good. Infrastructure, monitoring, customer operations automation.",
      distribution: "Excellent. WMS, inventory, and logistics optimization.",
    },
    redFlags: [
      "Scope creep: ERP starts as 'automate AP' and becomes 'rewrite the business'",
      "Weak change management leads to poor adoption and wasted investment",
      "Data migration failures: dirty data in old system breaks the new one",
      "Cost overruns: implementation budgets commonly run 50-100% over estimate",
      "Over-reliance on consultants creates expensive, slow handoffs",
    ],
    companyExamples: [
      {
        companyId: "meridian-fulfillment",
        narrative:
          "3PL with 3 facilities (NJ, TX, NV). No centralized WMS. Orders arrive via email/phone; warehouse staff use spreadsheets; no real-time inventory visibility. Textbook WMS implementation candidate.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
        ],
        opportunity:
          "WMS implementation = 15% efficiency improvement + 20% inventory reduction = $1.5M EBITDA uplift. Cost: $200-300K plus internal resources.",
      },
      {
        companyId: "precision-manufacturing",
        narrative:
          "CNC manufacturer with legacy ERP from the 1990s, manual job tracking, and paper-based quality control. Modernization opportunity is large but carries change-management risk.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
        ],
        opportunity:
          "ERP modernization + quality tracking = 10-15% efficiency + 5% quality improvement = $300-500K EBITDA plus reduced scrap.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "A $40M manufacturing company operates on a 1990s ERP system. Modernizing will cost $500K and take 18 months. What questions would you ask to decide if it's worth it? What's your decision framework?",
      acceptanceCriteria: [
        "Identifies the current hidden cost of the legacy system (errors, workarounds, labor)",
        "Calculates payback period comparing efficiency gains to investment",
        "Mentions change management and adoption risk as the biggest failure mode",
        "Notes that modernization enables growth and scalability beyond cost savings",
      ],
    },
  },

  {
    id: "facility-optimization",
    title: "Facility and Asset Optimization",
    category: "margin",
    oneLiner:
      "Reduce real estate, facility, and asset costs through consolidation, utilization, and working capital optimization.",
    whenToDeploy: [
      "Multiple locations with low utilization or redundancy",
      "High inventory relative to industry standard",
      "Excess office or warehouse space",
      "Long-term real estate contracts with above-market rates",
    ],
    typicalImpact: {
      revenue: "Flat (cost lever); slight uplift if consolidation improves service",
      ebitdaMargin: "10-30% real estate cost reduction + 15-35% inventory reduction = 200-600 bps",
      timeline: "6-18 months, especially for physical consolidation",
    },
    businessTypeFit: {
      services: "Good if multi-location; limited if customer-facing.",
      manufacturing: "Excellent. Factory footprint optimization.",
      saas: "Limited (no physical footprint).",
      distribution: "Excellent. Warehouse consolidation.",
    },
    redFlags: [
      "Employee impact is high and local job losses damage morale",
      "Customer proximity requirements (consolidation kills service model)",
      "Inventory reduction too aggressive causes stockouts and lost sales",
      "Operating leases with long terms carry high exit costs",
    ],
    companyExamples: [
      {
        companyId: "meridian-fulfillment",
        narrative:
          "3PL with 3 regional facilities across NJ, TX, and NV. Utilization varies. Opportunity: network optimization software to evaluate whether consolidation to 2 facilities is feasible without sacrificing delivery SLAs.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
        ],
        opportunity:
          "Consolidate from 3 to 2 hubs, improve utilization to 85% = $600K annual facility savings. Cost: $150K transition; risk of service disruption.",
      },
      {
        companyId: "coastal-foods",
        narrative:
          "Food distributor with 2 warehouses in the Mid-Atlantic. Review utilization of each and renegotiate leases where rates exceed market. Working capital (AR, inventory) is also consuming cash.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
        ],
        opportunity:
          "Optimize 2-warehouse footprint and release working capital = $400-600K combined savings. Risk: customer service window impacts.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "A company operates 4 distribution centers totaling 150K square feet. Utilization: 70%, 85%, 90%, 60%. Current real estate cost: $1.5M annually. Consolidate to 2 centers or 3? What's your analysis?",
      acceptanceCriteria: [
        "Calculates post-consolidation utilization and whether it exceeds 90% capacity",
        "Notes service level implications (delivery windows, customer proximity)",
        "Identifies transition costs (relocation, IT, staffing, severance)",
        "Considers ongoing operational complexity and customer retention risk",
      ],
    },
  },

  // -- ORGANIZATIONAL LEVERS ----------------------------------------------

  {
    id: "management-upgrades",
    title: "Management Team Upgrades",
    category: "organizational",
    oneLiner:
      "Hire or upgrade C-suite roles to close capability gaps and accelerate execution.",
    whenToDeploy: [
      "Capability gaps: no CFO, weak sales leader, no operations discipline",
      "Execution at scale requires professional management beyond founder-led ceiling",
      "Add-on integration requires dedicated exec (COO or integration lead)",
      "Growth strategy requires specific expertise (VP Sales for SaaS, VP Ops for manufacturing)",
    ],
    typicalImpact: {
      revenue: "Variable. A good hire can drive 20-50% of total value creation.",
      ebitdaMargin: "Variable. Improves execution across all other levers.",
      timeline: "2-4 months to hire; 3-6 months to ramp and show impact",
    },
    businessTypeFit: {
      services: "Excellent. CFO, COO, and VP Sales upgrades are high-ROI.",
      manufacturing: "Excellent. VP Ops and supply chain leader are critical.",
      saas: "Excellent. VP Sales and VP Product are essential.",
      distribution: "Good. VP Ops and VP Procurement upgrades pay off.",
    },
    redFlags: [
      "Cultural mismatch: hire is strong but doesn't fit founder-led culture",
      "Weak authority granted: hire reports to founder without real decision-making power",
      "Poor onboarding: hire dropped in without support and leaves confused",
      "Founder doesn't truly want to scale; hire threatens founder autonomy",
      "Turnover of hired talent signals culture or compensation issues",
    ],
    companyExamples: [
      {
        companyId: "summit-hvac",
        narrative:
          "Founder-operator with $32.5M revenue but no CFO, no standardized reporting, and owner compensation above market. Classic profile where a professional CFO hire unlocks cost visibility and working capital discipline.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
        ],
        opportunity:
          "CFO hire (~$200-250K fully loaded) unlocks 5-10% EBITDA improvement through cost control and working capital management.",
      },
      {
        companyId: "bright-dental",
        narrative:
          "Dental roll-up at 5 locations with acquisition playbook but no COO. Non-clinical founder model is scalable, but standardization and integration discipline require dedicated operational leadership.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
        ],
        opportunity:
          "COO hire (~$250-300K) improves unit economics by 200-300 bps through standardization and integration playbook rollout.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "A $50M manufacturing company has a strong founder/CEO but no VP Ops or supply chain leader. You want to pursue procurement optimization and facility consolidation. Do you hire before or after deal close? What role? What spec?",
      acceptanceCriteria: [
        "Recognizes that operational execution requires a dedicated leader",
        "Recommends hiring within the first 90 days post-close",
        "Specifies VP Ops or VP Supply Chain, not a generic COO",
        "Notes that the founder needs to delegate real authority for the hire to succeed",
      ],
    },
  },

  {
    id: "incentive-alignment",
    title: "Incentive Alignment and KPI Discipline",
    category: "organizational",
    oneLiner:
      "Redesign compensation and establish clear KPIs to align management behavior to value creation priorities.",
    whenToDeploy: [
      "Compensation not linked to value drivers (e.g., sales comp rewards volume over profitability)",
      "No KPI visibility or discipline (no shared metrics, no cadence)",
      "Organizational silos where Finance, Operations, and HR don't share goals",
      "Founder-led compensation is ad hoc or political",
    ],
    typicalImpact: {
      revenue: "2-5% uplift from behavior alignment",
      ebitdaMargin: "100-200 bps via profitability focus",
      timeline: "1-3 months to design; 6 months to stabilize",
    },
    businessTypeFit: {
      services: "Excellent. Compensation drives sales and margin behavior directly.",
      manufacturing: "Good. Production efficiency and quality metrics matter.",
      saas: "Excellent. Comp should drive retention, not just new ARR.",
      distribution: "Good. Cost discipline and service level balance.",
    },
    redFlags: [
      "Too many KPIs (more than 5 per role means none are real priorities)",
      "Gaming metrics: people optimize for the metric, not the outcome",
      "Data quality is poor; metrics are estimated, not measured",
      "Weak governance: no monthly review, no accountability",
      "Comp budget explodes when incentives are uncapped",
    ],
    companyExamples: [
      {
        companyId: "apex-logistics",
        narrative:
          "Last-mile logistics with revenue declining 8.6% YoY and 35% customer concentration. Sales comp is likely volume-oriented, which reinforces bad account selection. Comp redesign is a direct lever.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
        ],
        opportunity:
          "Comp redesign: 60% revenue, 40% profitability and quality (on-time rate, margin tier) = 200-300 bps EBITDA margin improvement over 12 months.",
      },
      {
        companyId: "truenorth-saas",
        narrative:
          "SaaS with 115% NRR but sales comp likely incentivizes new logos. Customer success has no expansion incentive. Realigning CS and Sales comp to NRR captures the full expansion potential.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
        ],
        opportunity:
          "Align CS and Sales comp to NRR; move NRR target from 115% to 125% = approximately $2M additional ARR over 2 years.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "Design sales compensation for a $30M SaaS company. Target is 15% revenue growth, 3% price increase, and 110% NRR. Sales team is 12 people (5 enterprise, 7 SMB). How would you structure comp?",
      acceptanceCriteria: [
        "Separates new logo, expansion, and retention into distinct comp lines",
        "Balances upside potential with downside cap to stay within budget",
        "Includes team-based component to encourage collaboration between sales and CS",
        "Specifies metrics, measurement frequency, and payout cadence",
      ],
    },
  },

  {
    id: "financial-controls",
    title: "Reporting and Financial Controls",
    category: "organizational",
    oneLiner:
      "Build standardized financial reporting, audit controls, and visibility into business operations.",
    whenToDeploy: [
      "No standardized reporting (founder-led, no CFO)",
      "No internal controls on spend (founder approves everything)",
      "Cash position unclear with no forecast or working capital discipline",
      "Exit approaching, requiring clean audits and a control environment",
    ],
    typicalImpact: {
      revenue: "None (hygiene lever, not growth)",
      ebitdaMargin: "1-2% uplift from working capital optimization and cost visibility",
      timeline: "2-4 months to establish baseline; 6 months to mature",
    },
    businessTypeFit: {
      services: "Important. Working capital and cash conversion are critical.",
      manufacturing: "Important. Inventory control and variance tracking.",
      saas: "Important. Unit economics and CAC/LTV tracking.",
      distribution: "Critical. Inventory and payables management.",
    },
    redFlags: [
      "Reporting delays: monthly close takes 2+ weeks",
      "No variance analysis: actuals vs. forecast are never reconciled",
      "Data integrity issues: numbers change month-to-month without explanation",
      "No follow-up on controls findings; nobody owns enforcement",
      "Burden too high: reporting becomes compliance, not a strategic tool",
    ],
    companyExamples: [
      {
        companyId: "summit-hvac",
        narrative:
          "Owner runs business on gut feel; no monthly P&L, no cash forecast, no job-level costing. Classic founder-era gap where basic controls produce rapid visibility wins.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
        ],
        opportunity:
          "Establish monthly close and job costing = visibility into profitable vs. loss-leader job types = 200-300 bps margin improvement via mix shift.",
      },
      {
        companyId: "meridian-fulfillment",
        narrative:
          "3PL with working capital visibility gaps. No inventory control system; inventory is estimated. Cash position is not forecast. Basic controls release working capital immediately.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
        ],
        opportunity:
          "Monthly inventory close + working capital KPIs (DPO, DIO) = 15% inventory reduction and $500K working capital release.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "You acquire a $50M company with no monthly close, no budget, and no variance analysis. Budget to build: $0-50K per year. Design a 12-month controls build program. What's in Month 1? What's in Month 12?",
      acceptanceCriteria: [
        "Month 1: establish baseline, monthly close process, chart of accounts",
        "Month 3: variance analysis and KPI dashboard running",
        "Month 6: departmental budgeting and cost center accountability",
        "Month 12: rolling forecast, working capital KPIs, active cash management",
      ],
    },
  },

  // -- TECHNOLOGY LEVER ---------------------------------------------------

  {
    id: "ai-software",
    title: "AI and Software Development",
    category: "technology",
    oneLiner:
      "Build custom AI systems and software that create competitive advantage and operational leverage.",
    whenToDeploy: [
      "Software creates competitive advantage in the vertical (not commoditized)",
      "Build cost is now affordable ($50-200K with AI-assisted development)",
      "Problem is repetitive and data-driven (ideal for AI/automation)",
      "Adoption risk is manageable (internal tool, not entire business model)",
    ],
    typicalImpact: {
      revenue: "2-5% from pricing/product, 5-10% from new feature cross-sell",
      ebitdaMargin: "15-30% productivity uplift in specific function = 100-300 bps",
      timeline: "8-12 weeks to MVP; 6 months to mature; continuous innovation",
    },
    businessTypeFit: {
      services: "Excellent. Pricing engines, sales automation, customer engagement.",
      manufacturing: "Excellent. Supply chain forecasting, inventory optimization.",
      saas: "Excellent. AI-powered features and retention tools.",
      distribution: "Good. Route optimization, demand forecasting, inventory.",
    },
    redFlags: [
      "Adoption weak: build software that nobody uses",
      "Vertical too niche: addressable market too small to justify investment",
      "Code quality poor: AI-generated code with unaddressed technical debt",
      "Build cost balloon: scope creep turns 'small project' into a 6-month effort",
      "Build time too long: market changes and software becomes irrelevant",
    ],
    companyExamples: [
      {
        companyId: "bright-dental",
        narrative:
          "Dental platform with multi-location scheduling complexity. AI-powered patient communication and smart scheduling (balancing hygienist/dentist capacity, patient preferences, location traffic) is a clean internal tooling win.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
        ],
        opportunity:
          "AI scheduling system: $75K build cost, 10% utilization improvement = $100K annual EBITDA. Payback: 9 months.",
      },
      {
        companyId: "meridian-fulfillment",
        narrative:
          "3PL across 3 facilities with no centralized demand forecasting. AI model predicting order patterns and suggesting inventory rebalancing across facilities prevents stockouts and reduces inventory holding.",
        dataPoints: [
          { label: "Revenue", path: "revenue" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
        ],
        opportunity:
          "AI forecasting system: $100K build cost, 15% inventory reduction + 5% service improvement = $400K EBITDA uplift. Payback: 3 months.",
      },
    ],
    exercise: {
      type: "thesis",
      prompt:
        "A $50M services firm wants to build an AI pricing engine that adjusts pricing by customer segment and contract type. Build cost: $120K. Estimated ROI: $500K annual EBITDA uplift. What diligence would you do? Go/no-go?",
      acceptanceCriteria: [
        "Identifies business case validation (pricing analysis, customer response risk)",
        "Notes adoption and change management cost (training, support)",
        "Considers technical risk (data quality, model accuracy, ongoing maintenance)",
        "Calculates payback period and specifies a decision gate (pilot vs. full rollout)",
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
    description: "Expand margins through cost structure, procurement, and operational leverage.",
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
};
