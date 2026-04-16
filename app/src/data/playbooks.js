/**
 * Operating Playbooks -- 9 company-specific 36-month value creation playbooks.
 * Phase 3 of the Value Creation learning track. Each playbook decomposes the
 * post-close operating plan into three phases with concrete initiatives,
 * owners, timelines, resources, success metrics, and dependencies.
 *
 * Every initiative cross-references a lever from valueLevers.js via leverId.
 * Every companyId matches a canonical ID from companies.js.
 * Data integrity tests validate both at build time.
 *
 * Phases:
 *   months-1-6   -- Foundation & Quick Wins (the "Golden Year" front-load)
 *   months-7-18  -- Optimize & Scale
 *   months-19-36 -- Scale & Exit Prep
 */

export const PLAYBOOKS = [
  // ── SUMMIT MECHANICAL SERVICES ──────────────────────────────────────────
  {
    id: "summit-hvac-playbook",
    companyId: "summit-hvac",
    title: "Summit Mechanical Services: 36-Month Value Creation Playbook",
    description:
      "HVAC platform with founder-led operations. Playbook prioritizes: (1) pricing optimization, (2) sales effectiveness, (3) management upgrade, (4) add-on integration.",
    entryMetrics: {
      revenue: 32.5,
      adjustedEbitda: 5.5,
      adjustedEbitdaMargin: 16.9,
    },
    exitTargets: {
      revenue: "55-65",
      adjustedEbitdaMargin: "20-22%",
      moicTarget: "3.0-3.5x",
    },
    primaryLevers: [
      "pricing-optimization",
      "sales-effectiveness",
      "management-upgrades",
      "buy-and-build",
    ],
    timeline: {
      "months-1-6": {
        name: "Foundation & Quick Wins",
        focus: "Visibility + Revenue & Margin Levers",
        objectiveStatement:
          "Establish financial controls, implement pricing increase, begin sales process redesign, identify add-on targets.",
        initiatives: [
          {
            id: "summit-init-001",
            name: "Financial Reporting & Controls",
            leverId: "financial-controls",
            description:
              "Build monthly close process, establish KPI dashboard (revenue, gross margin, operating expenses by function). Replace informal owner reporting with institutional-grade financials.",
            owner: "CFO (hire)",
            timeline: "Months 1-2",
            startCondition: "Deal close",
            resources: "$50K internal setup + $30K/year consulting",
            successMetrics: [
              "Monthly close within 5 business days",
              "Dashboard updated weekly",
              "Variance analysis complete",
            ],
            dependencies: [],
          },
          {
            id: "summit-init-002",
            name: "Pricing Optimization",
            leverId: "pricing-optimization",
            description:
              "Benchmark HVAC pricing vs competitors by customer segment and service type. Identify price increase opportunities. Install dynamic discount governance so sales cannot override list price without review.",
            owner: "VP Sales",
            timeline: "Months 2-4",
            startCondition: "Weeks 1-2 of ownership",
            resources: "$15K consulting",
            successMetrics: [
              "Pricing study complete",
              "Price increase plan documented",
              "Rollout schedule set",
              "Discount governance policy live",
            ],
            dependencies: ["summit-init-001"],
          },
          {
            id: "summit-init-003",
            name: "Sales Process Redesign",
            leverId: "sales-effectiveness",
            description:
              "Document current sales process. Implement CRM (Pipedrive or similar). Design comp structure aligned to profitability, not just revenue volume.",
            owner: "VP Sales",
            timeline: "Months 2-6",
            startCondition: "Weeks 1-2",
            resources: "$25K CRM setup + $5K/year license + 100 hours internal",
            successMetrics: [
              "CRM live with 6-month pipeline",
              "Comp plan redesigned",
              "Sales playbook documented",
            ],
            dependencies: [],
          },
          {
            id: "summit-init-004",
            name: "CFO + VP Sales Recruitment",
            leverId: "management-upgrades",
            description:
              "Recruit CFO (full-time, board seat, equity) and strengthen VP Sales role (hire if needed or develop internal). Critical hires that unlock every other initiative.",
            owner: "PE partner",
            timeline: "Months 1-3",
            startCondition: "Deal close",
            resources: "Recruiting fees: $50K",
            successMetrics: [
              "CFO offer accepted",
              "VP Sales confirmed or plan to hire",
              "Equity structures agreed",
            ],
            dependencies: [],
          },
          {
            id: "summit-init-005",
            name: "Procurement Audit & Vendor Consolidation",
            leverId: "procurement",
            description:
              "Analyze HVAC equipment and supply spending. Consolidate vendors. Renegotiate contracts leveraging platform scale.",
            owner: "CFO / Operations",
            timeline: "Months 3-6",
            startCondition: "Month 2",
            resources: "50 hours internal + $10K consulting",
            successMetrics: [
              "Spend analysis complete",
              "Top 5 vendors identified",
              "RFP issued",
              "Contracts renegotiated",
            ],
            dependencies: ["summit-init-001"],
          },
        ],
        expectedValueCreation: {
          revenue: "+5% ($1.6M) from pricing, modest volume growth",
          ebitdaMargin: "+200-300 bps from pricing + procurement",
          ebitdaDollars: "$0.9M",
        },
      },
      "months-7-18": {
        name: "Optimize & Scale",
        focus: "Growth Platforms + Operational Efficiency",
        objectiveStatement:
          "Roll out sales process across team. Close first add-on. Automate back-office. Establish leading indicators.",
        initiatives: [
          {
            id: "summit-init-006",
            name: "First Add-On Acquisition & Integration",
            leverId: "buy-and-build",
            description:
              "Source, negotiate, and integrate first HVAC acquisition (competitor or adjacent services). Establish integration playbook for efficiency gains.",
            owner: "CEO + M&A partner",
            timeline: "Months 7-14",
            startCondition: "Month 6 planning complete",
            resources: "$250K advisory; 300 hours internal",
            successMetrics: [
              "Add-on LOI signed",
              "Systems integrated",
              "$1-2M revenue added",
              "Synergies quantified",
            ],
            dependencies: ["summit-init-001", "summit-init-004"],
          },
          {
            id: "summit-init-007",
            name: "Technology & Process Automation",
            leverId: "automation",
            description:
              "Implement job costing system. Automate scheduling and dispatching. Improve asset utilization across the fleet.",
            owner: "VP Operations (new role)",
            timeline: "Months 8-14",
            startCondition: "Month 6",
            resources: "$100K software + $50K integration",
            successMetrics: [
              "Job costing live",
              "Dispatching efficiency +15%",
              "Asset utilization improved",
            ],
            dependencies: ["summit-init-001"],
          },
          {
            id: "summit-init-008",
            name: "Labor Optimization & Team Development",
            leverId: "labor-optimization",
            description:
              "Standardize field technician training. Improve technician utilization. Develop internal management bench for succession.",
            owner: "VP Operations",
            timeline: "Months 9-18",
            startCondition: "Month 8",
            resources: "$75K for training program",
            successMetrics: [
              "Technician utilization improved 10%",
              "Field margins improved",
              "Succession plan for key roles",
            ],
            dependencies: ["summit-init-001", "summit-init-004"],
          },
        ],
        expectedValueCreation: {
          revenue:
            "+25% ($8M total, incl. add-on) from growth + add-on integration",
          ebitdaMargin: "+100-200 bps from operational leverage",
          ebitdaDollars: "$2.5M",
        },
      },
      "months-19-36": {
        name: "Scale & Exit Prep",
        focus: "Multiple Add-Ons + Platform Maturity",
        objectiveStatement:
          "Close 2nd/3rd add-ons. Build repeatable integration playbook. Achieve exit-ready ops and financials.",
        initiatives: [
          {
            id: "summit-init-009",
            name: "Multiple Add-On Acquisitions",
            leverId: "buy-and-build",
            description:
              "Close 2-3 additional bolt-on acquisitions. Refine integration playbook based on first deal. Achieve platform scale and market recognition.",
            owner: "CEO + M&A partner",
            timeline: "Months 19-36",
            startCondition: "First add-on successful",
            resources: "$100-150K advisory per deal",
            successMetrics: [
              "2-3 add-ons closed",
              "Playbook repeatable",
              "Revenue $50-60M",
              "Platform recognized",
            ],
            dependencies: ["summit-init-006"],
          },
          {
            id: "summit-init-010",
            name: "Channel Expansion & Geographic Growth",
            leverId: "channel-expansion",
            description:
              "Expand to adjacent geographies or service lines (plumbing, electrical). Develop channel partnerships.",
            owner: "VP Sales",
            timeline: "Months 24-36",
            startCondition: "Month 18 platform stability",
            resources: "$50K for market research + expansion",
            successMetrics: [
              "2nd geography identified",
              "Expansion revenue flowing",
            ],
            dependencies: ["summit-init-003"],
          },
        ],
        expectedValueCreation: {
          revenue: "+40-50% total reaching $55-65M",
          ebitdaMargin: "+50-100 bps from platform maturity",
          ebitdaDollars: "$5-6M",
        },
      },
    },
    goldenYearAnalysis: {
      year1Ebitda: "$0.9M",
      year1VsPlan: "72%",
      assessment:
        "Strong Golden Year. Quick wins (pricing, controls) front-loaded. Management in place by month 3. Add-on pipeline built in parallel. Risk: CFO hire delay pushes everything right.",
    },
    exercise: {
      prompt:
        "You just closed on Summit. The founder is staying for a 6-month transition. Would you deploy this playbook as written, or would you resequence? What is the single biggest execution risk in Year 1?",
      acceptanceCriteria: [
        "Identifies CFO hire as the gating dependency for financial controls and every downstream initiative",
        "Recognizes founder transition overlap as an opportunity to capture institutional knowledge before departure",
        "Flags pricing increase timing relative to customer relationship stability during ownership transition",
        "Considers whether sales comp redesign should precede or follow CRM implementation",
      ],
    },
  },

  // ── COASTAL FRESH FOODS ─────────────────────────────────────────────────
  {
    id: "coastal-foods-playbook",
    companyId: "coastal-foods",
    title: "Coastal Fresh Foods: 36-Month Value Creation Playbook",
    description:
      "Food distribution platform with compressed margins and high customer concentration. Playbook prioritizes: (1) gross margin recovery via procurement and route optimization, (2) customer diversification, (3) sales process, (4) technology-driven efficiency.",
    entryMetrics: {
      revenue: 48.2,
      adjustedEbitda: 3.9,
      adjustedEbitdaMargin: 8.1,
    },
    exitTargets: {
      revenue: "65-75",
      adjustedEbitdaMargin: "12-14%",
      moicTarget: "2.5-3.0x",
    },
    primaryLevers: [
      "procurement",
      "sales-effectiveness",
      "automation",
      "pricing-optimization",
    ],
    timeline: {
      "months-1-6": {
        name: "Foundation & Quick Wins",
        focus: "Margin Recovery + Financial Visibility",
        objectiveStatement:
          "Install financial controls, launch procurement renegotiation, begin route optimization study, reduce top-customer dependency risk.",
        initiatives: [
          {
            id: "coastal-init-001",
            name: "Financial Controls & Margin Visibility",
            leverId: "financial-controls",
            description:
              "Build product-level and route-level P&L. Identify which customers, routes, and products are margin-positive vs margin-dilutive. Second-gen family business likely lacks this granularity.",
            owner: "CFO (hire or fractional)",
            timeline: "Months 1-3",
            startCondition: "Deal close",
            resources: "$40K setup + fractional CFO $8K/month",
            successMetrics: [
              "Product-level margins visible",
              "Route-level P&L live",
              "Monthly close under 7 days",
            ],
            dependencies: [],
          },
          {
            id: "coastal-init-002",
            name: "Procurement & Vendor Renegotiation",
            leverId: "procurement",
            description:
              "Consolidate supplier base. Renegotiate freight contracts. Leverage volume for better terms on top 20 SKUs. Transportation costs are the stated margin pressure point.",
            owner: "VP Operations",
            timeline: "Months 2-5",
            startCondition: "Month 1 spend analysis",
            resources: "$20K consulting + 80 hours internal",
            successMetrics: [
              "Freight costs reduced 8-12%",
              "Top 20 SKU terms improved",
              "Supplier count reduced 20%",
            ],
            dependencies: ["coastal-init-001"],
          },
          {
            id: "coastal-init-003",
            name: "Customer Concentration Risk Mitigation",
            leverId: "sales-effectiveness",
            description:
              "Map customer concentration (22% top customer). Build pipeline of 10+ new mid-tier accounts. Diversify revenue base to reduce dependency.",
            owner: "VP Sales (hire)",
            timeline: "Months 2-6",
            startCondition: "Week 2",
            resources: "$30K recruiting + $15K CRM",
            successMetrics: [
              "Top customer below 18%",
              "5+ new accounts onboarded",
              "Pipeline of 15+ prospects",
            ],
            dependencies: [],
          },
        ],
        expectedValueCreation: {
          revenue: "+3-5% from new accounts",
          ebitdaMargin: "+200-300 bps from procurement + route optimization",
          ebitdaDollars: "$1.2M",
        },
      },
      "months-7-18": {
        name: "Optimize & Scale",
        focus: "Route Efficiency + Technology + Growth",
        objectiveStatement:
          "Deploy route optimization technology, expand product mix into higher-margin specialty categories, build sales team beyond founder relationships.",
        initiatives: [
          {
            id: "coastal-init-004",
            name: "Route Optimization & Fleet Technology",
            leverId: "automation",
            description:
              "Deploy route planning software (OptimoRoute or similar). Reduce delivery cost per stop. Improve fleet utilization and reduce deadhead miles.",
            owner: "VP Operations",
            timeline: "Months 7-12",
            startCondition: "Month 6 route P&L baseline",
            resources: "$80K software + $30K integration",
            successMetrics: [
              "Cost per delivery reduced 15%",
              "Fleet utilization up 20%",
              "Route density improved",
            ],
            dependencies: ["coastal-init-001"],
          },
          {
            id: "coastal-init-005",
            name: "Product Mix Expansion into Specialty Categories",
            leverId: "cross-sell-upsell",
            description:
              "Expand into higher-margin specialty and organic product lines. Leverage existing restaurant relationships to sell premium categories at better margins than commodity distribution.",
            owner: "VP Sales + Merchandising",
            timeline: "Months 8-16",
            startCondition: "Month 7",
            resources: "$50K for cold chain upgrades + sourcing",
            successMetrics: [
              "Specialty as % of revenue: 15% to 25%",
              "Gross margin on specialty >28%",
              "5+ new specialty suppliers",
            ],
            dependencies: ["coastal-init-003"],
          },
          {
            id: "coastal-init-006",
            name: "Warehouse Automation & WMS Upgrade",
            leverId: "automation",
            description:
              "Upgrade warehouse management system. Add pick-to-light or voice-pick technology. Reduce labor cost per order and error rates.",
            owner: "VP Operations",
            timeline: "Months 10-16",
            startCondition: "Month 9",
            resources: "$120K WMS + $60K pick technology",
            successMetrics: [
              "Pick accuracy >99.5%",
              "Labor cost per order reduced 20%",
              "Order processing time halved",
            ],
            dependencies: ["coastal-init-001"],
          },
        ],
        expectedValueCreation: {
          revenue: "+15-20% from specialty mix + new accounts",
          ebitdaMargin: "+200-300 bps from route + warehouse efficiency",
          ebitdaDollars: "$2.8M",
        },
      },
      "months-19-36": {
        name: "Scale & Exit Prep",
        focus: "Geographic Expansion + Platform Maturity",
        objectiveStatement:
          "Expand into adjacent metro, build institutional sales team, achieve exit-ready scale and profitability.",
        initiatives: [
          {
            id: "coastal-init-007",
            name: "Geographic Expansion (3rd Warehouse)",
            leverId: "channel-expansion",
            description:
              "Open third warehouse in adjacent metro to extend delivery radius. Replicate route density model from core markets.",
            owner: "CEO + VP Operations",
            timeline: "Months 20-30",
            startCondition: "Core market profitable at target margins",
            resources: "$300K lease + buildout + inventory",
            successMetrics: [
              "3rd facility operational",
              "Break-even within 9 months",
              "Route density matching core market within 18 months",
            ],
            dependencies: ["coastal-init-004"],
          },
          {
            id: "coastal-init-008",
            name: "Institutional Sales Team Build-Out",
            leverId: "sales-effectiveness",
            description:
              "Grow sales from 2 reps to 5. Move from founder-led selling to institutional process. Territory model with quota and pipeline management.",
            owner: "VP Sales",
            timeline: "Months 22-36",
            startCondition: "Month 20 CRM mature",
            resources: "$250K annual fully loaded (3 new reps)",
            successMetrics: [
              "5-rep team operational",
              "Pipeline >$10M",
              "Win rate >25%",
              "No single rep >30% of bookings",
            ],
            dependencies: ["coastal-init-003"],
          },
        ],
        expectedValueCreation: {
          revenue: "+35-55% total reaching $65-75M",
          ebitdaMargin: "+100-200 bps from scale leverage",
          ebitdaDollars: "$4.5-5.5M",
        },
      },
    },
    goldenYearAnalysis: {
      year1Ebitda: "$1.2M",
      year1VsPlan: "65%",
      assessment:
        "Moderate Golden Year. Procurement and route wins are fast but gross margin in food distribution is structurally thin. Upside depends on specialty mix shift, which takes 12+ months to ramp. Risk: top customer churn during transition.",
    },
    exercise: {
      prompt:
        "Coastal's top customer is 22% of revenue. The owner says the relationship is personal and won't transfer. How do you protect this revenue during transition, and what's your plan if the customer leaves in Month 3?",
      acceptanceCriteria: [
        "Addresses customer retention strategy during ownership transition (joint calls, contract extension, service guarantees)",
        "Quantifies the financial impact of losing 22% of revenue ($10.6M) on the investment thesis",
        "Proposes accelerated diversification timeline if top customer is at risk",
        "Considers whether the acquisition price should be adjusted for concentration risk",
      ],
    },
  },

  // ── PRECISION CNC SOLUTIONS ─────────────────────────────────────────────
  {
    id: "precision-cnc-playbook",
    companyId: "precision-manufacturing",
    title: "Precision CNC Solutions: 36-Month Value Creation Playbook",
    description:
      "High-margin precision manufacturer constrained by facility capacity and owner bandwidth. Playbook prioritizes: (1) capacity expansion, (2) management team build, (3) customer diversification away from 28% concentration, (4) automation.",
    entryMetrics: {
      revenue: 12.8,
      adjustedEbitda: 4.15,
      adjustedEbitdaMargin: 32.4,
    },
    exitTargets: {
      revenue: "22-28",
      adjustedEbitdaMargin: "28-32%",
      moicTarget: "3.5-4.0x",
    },
    primaryLevers: [
      "management-upgrades",
      "automation",
      "channel-expansion",
      "sales-effectiveness",
    ],
    timeline: {
      "months-1-6": {
        name: "Foundation & Quick Wins",
        focus: "Management Build + Capacity Planning",
        objectiveStatement:
          "Hire GM to relieve owner. Complete facility expansion study. Begin customer diversification. Install financial controls.",
        initiatives: [
          {
            id: "precision-init-001",
            name: "GM Hire to Relieve Owner-Operator",
            leverId: "management-upgrades",
            description:
              "Owner is the bottleneck on quoting, scheduling, and customer relationships. Hire a GM with CNC operations background to absorb day-to-day. Owner transitions to strategic/sales role.",
            owner: "PE partner",
            timeline: "Months 1-3",
            startCondition: "Deal close",
            resources: "$180K salary + $30K recruiting",
            successMetrics: [
              "GM hired and onboarded",
              "Owner freed from daily ops",
              "Quoting lead time maintained",
            ],
            dependencies: [],
          },
          {
            id: "precision-init-002",
            name: "Financial Controls & Job Costing",
            leverId: "financial-controls",
            description:
              "Implement job-level costing. Track margin by customer, part type, and machine. Currently run on spreadsheets and tribal knowledge.",
            owner: "Controller (hire)",
            timeline: "Months 1-4",
            startCondition: "Deal close",
            resources: "$25K ERP module + $15K consulting",
            successMetrics: [
              "Job costing live for all active jobs",
              "Margin by customer visible",
              "Monthly close under 5 days",
            ],
            dependencies: [],
          },
          {
            id: "precision-init-003",
            name: "Facility Expansion Study",
            leverId: "automation",
            description:
              "Current single facility is at 85%+ utilization. Commission study: expand in place vs. lease second facility. Include automation equipment ROI analysis.",
            owner: "GM + PE partner",
            timeline: "Months 3-6",
            startCondition: "Month 2",
            resources: "$20K engineering study",
            successMetrics: [
              "Expansion plan selected",
              "Capex budget approved",
              "Timeline set for buildout",
            ],
            dependencies: ["precision-init-001"],
          },
        ],
        expectedValueCreation: {
          revenue: "+5% from reduced quoting bottleneck",
          ebitdaMargin: "Maintain 30%+ (margin protection, not expansion)",
          ebitdaDollars: "$0.4M",
        },
      },
      "months-7-18": {
        name: "Optimize & Scale",
        focus: "Capacity Expansion + Customer Diversification",
        objectiveStatement:
          "Execute facility expansion. Add 2-3 new customer verticals. Reduce top-customer concentration from 28% to under 20%.",
        initiatives: [
          {
            id: "precision-init-004",
            name: "Facility Expansion & New Equipment",
            leverId: "automation",
            description:
              "Execute chosen expansion plan. Add 3-4 new CNC machines with 5-axis capability. Target 50% capacity increase. Prioritize multi-axis machines that unlock new part families.",
            owner: "GM + VP Operations",
            timeline: "Months 7-14",
            startCondition: "Expansion plan approved",
            resources: "$1.2M capex (machines + buildout)",
            successMetrics: [
              "Expansion complete",
              "Capacity increased 50%",
              "New machine types operational",
            ],
            dependencies: ["precision-init-003"],
          },
          {
            id: "precision-init-005",
            name: "Customer Diversification & New Verticals",
            leverId: "sales-effectiveness",
            description:
              "Hire first dedicated sales rep (owner currently does all selling). Target 2-3 new verticals adjacent to aerospace/medical (defense, energy, semiconductor). Reduce 28% customer concentration.",
            owner: "Sales rep (hire) + Owner",
            timeline: "Months 8-18",
            startCondition: "Month 7",
            resources: "$120K fully loaded (sales rep) + $15K marketing",
            successMetrics: [
              "Top customer below 20%",
              "2+ new verticals producing revenue",
              "Pipeline of $3M+",
            ],
            dependencies: ["precision-init-001"],
          },
          {
            id: "precision-init-006",
            name: "Quality & Certification Expansion",
            leverId: "channel-expansion",
            description:
              "Add ITAR registration for defense work. Pursue NADCAP accreditation for special processes. Certifications unlock higher-margin, stickier contract work.",
            owner: "Quality Manager + GM",
            timeline: "Months 10-18",
            startCondition: "Month 9",
            resources: "$40K consulting + audit fees",
            successMetrics: [
              "ITAR registered",
              "NADCAP audit scheduled",
              "Defense RFQs received",
            ],
            dependencies: ["precision-init-002"],
          },
        ],
        expectedValueCreation: {
          revenue: "+40-60% from capacity + new customers",
          ebitdaMargin: "Slight margin compression during ramp (-100-200 bps), recovers by month 18",
          ebitdaDollars: "$2.0M",
        },
      },
      "months-19-36": {
        name: "Scale & Exit Prep",
        focus: "Platform Scale + Automation + Exit Positioning",
        objectiveStatement:
          "Achieve $22M+ revenue. Implement lights-out automation on high-volume parts. Position as a specialty platform for premium exit multiple.",
        initiatives: [
          {
            id: "precision-init-007",
            name: "Lights-Out Automation for High-Volume Parts",
            leverId: "ai-software",
            description:
              "Implement robotic loading and automated inspection on top 10 high-volume part families. Enables 24/7 production on repeat jobs, freeing skilled machinists for complex work.",
            owner: "VP Operations",
            timeline: "Months 20-30",
            startCondition: "Capacity expansion complete",
            resources: "$400K robotics + integration",
            successMetrics: [
              "Top 10 parts running lights-out",
              "Labor cost per part reduced 40%",
              "Machine utilization >85%",
            ],
            dependencies: ["precision-init-004"],
          },
          {
            id: "precision-init-008",
            name: "Bolt-On Acquisition Opportunity",
            leverId: "buy-and-build",
            description:
              "Evaluate 1-2 smaller CNC shops for acquisition. Target shops with complementary capabilities (Swiss turning, EDM) or customer bases. Apply integration playbook from platform ops.",
            owner: "PE partner + GM",
            timeline: "Months 24-36",
            startCondition: "Core ops stable at scale",
            resources: "$100K advisory per deal",
            successMetrics: [
              "1 acquisition closed",
              "Revenue $25M+",
              "Capabilities expanded",
            ],
            dependencies: ["precision-init-001", "precision-init-004"],
          },
        ],
        expectedValueCreation: {
          revenue: "+70-120% total reaching $22-28M",
          ebitdaMargin: "Recovery to 28-32% at scale",
          ebitdaDollars: "$4.5-5.5M",
        },
      },
    },
    goldenYearAnalysis: {
      year1Ebitda: "$0.4M",
      year1VsPlan: "35%",
      assessment:
        "Weak Golden Year by design. This is a capacity-constrained business; value creation is back-loaded to months 7-18 when expansion delivers. Year 1 is about de-risking the owner dependency and planning the buildout. Patient capital thesis.",
    },
    exercise: {
      prompt:
        "Precision has 32% EBITDA margins but is capacity-constrained at one facility. A $1.2M expansion would add 50% capacity. Would you fund this from operating cash flow or leverage? What's the risk if demand doesn't materialize?",
      acceptanceCriteria: [
        "Analyzes the capex payback period against incremental revenue and margin contribution",
        "Considers leverage vs cash flow tradeoff given already strong margins",
        "Identifies demand risk: new capacity without contracted customers is speculative",
        "Notes that customer diversification should run in parallel to de-risk the expansion",
      ],
    },
  },

  // ── BRIGHTSMILE DENTAL PARTNERS ─────────────────────────────────────────
  {
    id: "bright-dental-playbook",
    companyId: "bright-dental",
    title: "BrightSmile Dental Partners: 36-Month Value Creation Playbook",
    description:
      "Dental roll-up at scale inflection point. Non-clinical founder-operator model with employed dentists. Playbook prioritizes: (1) same-store growth via patient volume and mix, (2) de novo + acquisition to reach 10+ locations, (3) central services platform, (4) dentist recruitment pipeline.",
    entryMetrics: {
      revenue: 9.8,
      adjustedEbitda: 2.5,
      adjustedEbitdaMargin: 25.5,
    },
    exitTargets: {
      revenue: "25-35",
      adjustedEbitdaMargin: "22-25%",
      moicTarget: "3.5-4.5x",
    },
    primaryLevers: [
      "buy-and-build",
      "sales-effectiveness",
      "incentive-alignment",
      "automation",
    ],
    timeline: {
      "months-1-6": {
        name: "Foundation & Quick Wins",
        focus: "Same-Store Revenue Growth + Acquisition Pipeline",
        objectiveStatement:
          "Optimize patient flow and scheduling at existing 5 locations. Build M&A pipeline for next 3-5 acquisitions. Centralize back-office functions.",
        initiatives: [
          {
            id: "bright-init-001",
            name: "Patient Volume & Scheduling Optimization",
            leverId: "sales-effectiveness",
            description:
              "Audit scheduling efficiency across 5 locations. Reduce no-show rate (industry avg 15-20%). Implement automated reminders and waitlist management. Target 10% more patients per chair per day.",
            owner: "Regional Manager",
            timeline: "Months 1-4",
            startCondition: "Deal close",
            resources: "$15K scheduling software + $10K marketing",
            successMetrics: [
              "No-show rate below 10%",
              "Chair utilization up 10%",
              "Same-store revenue +8%",
            ],
            dependencies: [],
          },
          {
            id: "bright-init-002",
            name: "Central Services Platform Build",
            leverId: "automation",
            description:
              "Centralize billing, credentialing, HR, and procurement across 5 locations. Single RCM (revenue cycle management) platform. Reduces per-location admin overhead by 30%.",
            owner: "COO / Founder",
            timeline: "Months 1-5",
            startCondition: "Deal close",
            resources: "$60K RCM platform + $25K integration",
            successMetrics: [
              "Single billing platform live",
              "Credentialing centralized",
              "Admin headcount per location reduced",
            ],
            dependencies: [],
          },
          {
            id: "bright-init-003",
            name: "Dentist Compensation Redesign",
            leverId: "incentive-alignment",
            description:
              "Align dentist comp to production + quality metrics, not just collections. Introduce tiered production bonuses. Critical for retention as the platform scales; employed-dentist model lives or dies on comp design.",
            owner: "Founder + HR",
            timeline: "Months 2-4",
            startCondition: "Month 1 baseline data",
            resources: "$10K consulting (comp benchmarking)",
            successMetrics: [
              "New comp plan rolled out",
              "Dentist satisfaction survey >80%",
              "Production per dentist up 5%",
            ],
            dependencies: [],
          },
          {
            id: "bright-init-004",
            name: "M&A Pipeline Development",
            leverId: "buy-and-build",
            description:
              "Build pipeline of 15-20 acquisition targets (solo practices, 1-2 dentist offices, $500K-$2M revenue). Screen for geographic fit, patient mix, and seller motivation.",
            owner: "Founder + PE partner",
            timeline: "Months 2-6",
            startCondition: "Month 1",
            resources: "$20K broker relationships + $10K marketing",
            successMetrics: [
              "20+ targets identified",
              "5+ NDAs signed",
              "2+ LOIs issued",
            ],
            dependencies: [],
          },
        ],
        expectedValueCreation: {
          revenue: "+8-12% same-store ($0.8-1.2M)",
          ebitdaMargin: "+100-200 bps from centralization",
          ebitdaDollars: "$0.5M",
        },
      },
      "months-7-18": {
        name: "Optimize & Scale",
        focus: "Acquisition Execution + Platform Integration",
        objectiveStatement:
          "Close 3-5 acquisitions. Integrate onto central platform. Reach 8-10 locations. Hire regional management layer.",
        initiatives: [
          {
            id: "bright-init-005",
            name: "Acquisition Execution (3-5 Practices)",
            leverId: "buy-and-build",
            description:
              "Close 3-5 dental practice acquisitions at 4-5x EBITDA. Integrate each onto central billing, scheduling, and procurement platform within 90 days. Multiple arbitrage: buy at 4-5x, platform trades at 7-8x.",
            owner: "Founder + M&A partner",
            timeline: "Months 7-18",
            startCondition: "Pipeline mature",
            resources: "$150K advisory + legal per deal",
            successMetrics: [
              "3-5 practices acquired",
              "Integration within 90 days each",
              "Revenue $18-25M",
              "Retention >90% (patients + staff)",
            ],
            dependencies: ["bright-init-002", "bright-init-004"],
          },
          {
            id: "bright-init-006",
            name: "Dentist Recruitment Pipeline",
            leverId: "management-upgrades",
            description:
              "Build repeatable dentist recruitment funnel (dental school relationships, job boards, referral bonuses). Scaling from 8 to 20+ dentists requires a pipeline, not ad hoc hiring.",
            owner: "HR lead (hire)",
            timeline: "Months 8-18",
            startCondition: "Month 7",
            resources: "$80K recruiting (in-house recruiter)",
            successMetrics: [
              "Pipeline of 10+ candidates",
              "Time-to-fill under 60 days",
              "Offer acceptance rate >70%",
            ],
            dependencies: ["bright-init-003"],
          },
          {
            id: "bright-init-007",
            name: "Revenue Mix Optimization (High-Value Services)",
            leverId: "cross-sell-upsell",
            description:
              "Increase production of high-margin services (implants, Invisalign, cosmetic) across all locations. Training program for associate dentists. Marketing spend on high-value procedures.",
            owner: "Clinical Director + Marketing",
            timeline: "Months 10-18",
            startCondition: "Month 9",
            resources: "$30K training + $20K marketing",
            successMetrics: [
              "High-value services as % of revenue: 15% to 25%",
              "Per-patient revenue up 12%",
              "3+ dentists trained on implants",
            ],
            dependencies: ["bright-init-001"],
          },
        ],
        expectedValueCreation: {
          revenue: "+80-150% from acquisitions + same-store growth",
          ebitdaMargin: "Slight compression during integration (-100 bps), recovers",
          ebitdaDollars: "$3.5M",
        },
      },
      "months-19-36": {
        name: "Scale & Exit Prep",
        focus: "Platform Maturity + De Novo + Exit Positioning",
        objectiveStatement:
          "Reach 12-15 locations. Launch de novo strategy. Achieve exit-ready scale with institutional management and repeatable integration playbook.",
        initiatives: [
          {
            id: "bright-init-008",
            name: "De Novo Location Launch",
            leverId: "channel-expansion",
            description:
              "Open 2-3 de novo locations in underserved suburban markets. Lower cost than acquisition ($200-300K per location vs $500K-1M). Longer ramp but higher long-term margin.",
            owner: "VP Operations + Real Estate",
            timeline: "Months 20-34",
            startCondition: "Integration playbook proven",
            resources: "$250K per de novo",
            successMetrics: [
              "2-3 de novos opened",
              "Break-even within 12 months each",
              "Patient acquisition cost <$150",
            ],
            dependencies: ["bright-init-005"],
          },
          {
            id: "bright-init-009",
            name: "Regional Management Layer",
            leverId: "management-upgrades",
            description:
              "Hire 2 regional managers (each overseeing 5-7 locations). Founder transitions from operator to CEO/strategist. Institutional management required for 12+ location platform.",
            owner: "Founder",
            timeline: "Months 22-30",
            startCondition: "10+ locations operating",
            resources: "$300K annual (2 regional managers)",
            successMetrics: [
              "Regional managers hired",
              "Founder time on ops <20%",
              "Location-level P&L ownership delegated",
            ],
            dependencies: ["bright-init-005"],
          },
        ],
        expectedValueCreation: {
          revenue: "+150-250% total reaching $25-35M",
          ebitdaMargin: "Stabilize at 22-25% at platform scale",
          ebitdaDollars: "$5.5-8.0M",
        },
      },
    },
    goldenYearAnalysis: {
      year1Ebitda: "$0.5M",
      year1VsPlan: "40%",
      assessment:
        "Moderate Golden Year. Same-store optimization is fast but small on a $9.8M base. The real value creation is acquisition-driven in months 7-18. Year 1 is about building the platform (central services, pipeline, comp) that makes scaled M&A possible. Risk: dentist attrition during comp redesign.",
    },
    exercise: {
      prompt:
        "BrightSmile's founder is non-clinical (pure operator). That's rare in dental. Is this a strength or a risk? How does it change the playbook vs a founder-dentist model?",
      acceptanceCriteria: [
        "Identifies the non-clinical model as a strength for scalability (no single-provider dependency)",
        "Notes the risk: employed dentists can leave, and the founder cannot step in clinically",
        "Recognizes that comp design and culture are even more critical without a clinical founder",
        "Considers how the non-clinical model affects acquisition integration (no ego clash with acquired dentists)",
      ],
    },
  },

  // ── APEX LAST-MILE LOGISTICS ────────────────────────────────────────────
  {
    id: "apex-logistics-playbook",
    companyId: "apex-logistics",
    title: "Apex Last-Mile Logistics: 36-Month Value Creation Playbook",
    description:
      "Last-mile delivery facing post-COVID normalization with -8.6% revenue decline and 35% customer concentration. Playbook prioritizes: (1) customer diversification to survive, (2) margin recovery via route density and labor model, (3) technology investment, (4) selective growth.",
    entryMetrics: {
      revenue: 38.5,
      adjustedEbitda: 4.55,
      adjustedEbitdaMargin: 11.8,
    },
    exitTargets: {
      revenue: "45-55",
      adjustedEbitdaMargin: "14-16%",
      moicTarget: "2.5-3.0x",
    },
    primaryLevers: [
      "sales-effectiveness",
      "labor-optimization",
      "automation",
      "pricing-optimization",
    ],
    timeline: {
      "months-1-6": {
        name: "Foundation & Quick Wins",
        focus: "Stabilize Revenue + Protect Margins",
        objectiveStatement:
          "Reduce customer concentration risk. Lock in contract renewals. Audit labor model (employees vs ICs). Install financial visibility.",
        initiatives: [
          {
            id: "apex-init-001",
            name: "Top Customer Contract Protection",
            leverId: "sales-effectiveness",
            description:
              "35% customer concentration is existential. Renegotiate contract with extended term, volume commitments, and pricing escalators. Parallel-path: begin diversification immediately.",
            owner: "CEO + PE partner",
            timeline: "Months 1-3",
            startCondition: "Deal close",
            resources: "$20K legal review",
            successMetrics: [
              "Contract extended 2+ years",
              "Volume floor established",
              "Annual price escalator included",
            ],
            dependencies: [],
          },
          {
            id: "apex-init-002",
            name: "Customer Diversification Sprint",
            leverId: "sales-effectiveness",
            description:
              "Hire VP Sales focused on enterprise accounts outside top customer. Target furniture, appliance, and fitness equipment retailers. Goal: get top customer below 25% within 12 months.",
            owner: "VP Sales (hire)",
            timeline: "Months 2-6",
            startCondition: "Week 2",
            resources: "$150K fully loaded + $20K CRM",
            successMetrics: [
              "3+ new enterprise accounts signed",
              "Pipeline of $5M+",
              "Diversification trajectory visible",
            ],
            dependencies: [],
          },
          {
            id: "apex-init-003",
            name: "IC vs Employee Labor Model Audit",
            leverId: "labor-optimization",
            description:
              "80 independent contractors vs 210 employees. Audit IC classification risk (IRS scrutiny is rising). Model cost of converting ICs vs keeping hybrid. This is a legal and financial land mine if not addressed.",
            owner: "CFO + Legal",
            timeline: "Months 1-4",
            startCondition: "Deal close",
            resources: "$30K legal audit",
            successMetrics: [
              "IC risk quantified",
              "Conversion plan if needed",
              "Compliance documentation complete",
            ],
            dependencies: [],
          },
        ],
        expectedValueCreation: {
          revenue: "Stabilize (halt -8.6% decline), modest new account wins",
          ebitdaMargin: "+100-150 bps from pricing escalators",
          ebitdaDollars: "$0.5M",
        },
      },
      "months-7-18": {
        name: "Optimize & Scale",
        focus: "Route Density + Technology + Margin Recovery",
        objectiveStatement:
          "Deploy route optimization technology. Improve delivery density per route. Convert or formalize IC model. Grow new customer revenue to 20%+ of total.",
        initiatives: [
          {
            id: "apex-init-004",
            name: "Route Optimization & Density Improvement",
            leverId: "automation",
            description:
              "Deploy dynamic routing software. Increase stops per route per day. Reduce cost per delivery. Focus on metro markets where density is achievable.",
            owner: "VP Operations",
            timeline: "Months 7-12",
            startCondition: "Month 6",
            resources: "$100K software + $40K integration",
            successMetrics: [
              "Stops per route up 20%",
              "Cost per delivery down 15%",
              "Driver utilization improved",
            ],
            dependencies: ["apex-init-003"],
          },
          {
            id: "apex-init-005",
            name: "Pricing Model Overhaul",
            leverId: "pricing-optimization",
            description:
              "Move from per-delivery flat rate to zone-based + weight/size tiered pricing. White-glove premium for assembly and room-of-choice. Capture the value of complexity.",
            owner: "VP Sales + Finance",
            timeline: "Months 8-14",
            startCondition: "Route cost data available",
            resources: "$15K pricing study",
            successMetrics: [
              "New pricing live for new contracts",
              "Average revenue per delivery up 10%",
              "White-glove attach rate >30%",
            ],
            dependencies: ["apex-init-001", "apex-init-004"],
          },
          {
            id: "apex-init-006",
            name: "Fleet Technology & Tracking",
            leverId: "ai-software",
            description:
              "Real-time delivery tracking for customers. ETA windows. Photo proof of delivery. API integration for enterprise accounts. Table stakes for competing with Amazon-level expectations.",
            owner: "CTO (hire or fractional)",
            timeline: "Months 9-16",
            startCondition: "Month 8",
            resources: "$150K development + $40K/year SaaS",
            successMetrics: [
              "Real-time tracking live",
              "Customer satisfaction up 15%",
              "API integrations with 3+ enterprise accounts",
            ],
            dependencies: [],
          },
        ],
        expectedValueCreation: {
          revenue: "+10-15% from new accounts + pricing uplift",
          ebitdaMargin: "+200-300 bps from route density + pricing",
          ebitdaDollars: "$2.5M",
        },
      },
      "months-19-36": {
        name: "Scale & Exit Prep",
        focus: "Market Expansion + Platform Value",
        objectiveStatement:
          "Expand to 2 new metro markets. Build platform technology story. Achieve exit-ready diversification and margin profile.",
        initiatives: [
          {
            id: "apex-init-007",
            name: "New Metro Market Expansion",
            leverId: "channel-expansion",
            description:
              "Launch operations in 2 new metro markets. Asset-light entry: lease trucks, hire local drivers, use proven routing technology. Replicate unit economics from core markets.",
            owner: "CEO + VP Operations",
            timeline: "Months 20-32",
            startCondition: "Core market margins at target",
            resources: "$400K per market (fleet + labor + warehouse)",
            successMetrics: [
              "2 new markets launched",
              "Break-even within 9 months",
              "Route density matching core within 15 months",
            ],
            dependencies: ["apex-init-004"],
          },
          {
            id: "apex-init-008",
            name: "Customer Concentration Below 20%",
            leverId: "sales-effectiveness",
            description:
              "Continue diversification push. Target: no single customer above 20% of revenue. Build a portfolio of 15-20 enterprise accounts.",
            owner: "VP Sales",
            timeline: "Months 19-36",
            startCondition: "Ongoing",
            resources: "$100K/year sales team expansion",
            successMetrics: [
              "Top customer below 20%",
              "15+ active enterprise accounts",
              "Revenue $45-55M",
            ],
            dependencies: ["apex-init-002"],
          },
        ],
        expectedValueCreation: {
          revenue: "+17-43% total reaching $45-55M",
          ebitdaMargin: "+100-200 bps from scale",
          ebitdaDollars: "$4.0-5.5M",
        },
      },
    },
    goldenYearAnalysis: {
      year1Ebitda: "$0.5M",
      year1VsPlan: "30%",
      assessment:
        "Weak Golden Year. This is a turnaround thesis, not a growth thesis. Year 1 is about stopping the bleeding (revenue decline, concentration risk, IC exposure). Value creation is back-loaded to route optimization and pricing power in months 7-18. Risk: top customer leaves before diversification completes.",
    },
    exercise: {
      prompt:
        "Apex has 80 independent contractors and 210 employees. If the IRS reclassifies the ICs as employees, what's the financial impact? How does this change your investment thesis?",
      acceptanceCriteria: [
        "Quantifies the cost increase from IC-to-employee conversion (benefits, payroll tax, workers comp -- typically 25-35% cost increase on IC spend)",
        "Assesses impact on EBITDA margin and whether the deal still works at adjusted margins",
        "Considers whether IC risk should be priced into the acquisition (lower entry multiple or escrow)",
        "Notes that IC reclassification risk is a sector-wide trend, not unique to Apex",
      ],
    },
  },

  // ── TRUENORTH ANALYTICS ─────────────────────────────────────────────────
  {
    id: "truenorth-saas-playbook",
    companyId: "truenorth-saas",
    title: "TrueNorth Analytics: 36-Month Value Creation Playbook",
    description:
      "High-growth SaaS with strong retention but burning cash on customer acquisition. Playbook prioritizes: (1) unit economics improvement (CAC payback, LTV/CAC), (2) expansion revenue, (3) product-led growth, (4) path to profitability.",
    entryMetrics: {
      revenue: 14.2,
      adjustedEbitda: 3.0,
      adjustedEbitdaMargin: 21.1,
    },
    exitTargets: {
      revenue: "30-40",
      adjustedEbitdaMargin: "25-30%",
      moicTarget: "4.0-5.0x",
    },
    primaryLevers: [
      "pricing-optimization",
      "sales-effectiveness",
      "cross-sell-upsell",
      "ai-software",
    ],
    timeline: {
      "months-1-6": {
        name: "Foundation & Quick Wins",
        focus: "Unit Economics + Expansion Revenue",
        objectiveStatement:
          "Improve CAC payback, launch expansion pricing, build CS-driven upsell motion. Preserve growth rate while improving efficiency.",
        initiatives: [
          {
            id: "truenorth-init-001",
            name: "Pricing Tier Restructure",
            leverId: "pricing-optimization",
            description:
              "Restructure from 2 tiers (Starter/Enterprise) to 3 tiers with usage-based components. Add compliance framework modules as paid add-ons (HIPAA, PCI-DSS). Capture value from power users currently on flat-rate plans.",
            owner: "VP Product + VP Sales",
            timeline: "Months 1-4",
            startCondition: "Deal close",
            resources: "$20K pricing research + $30K engineering",
            successMetrics: [
              "New pricing live",
              "Module attach rate >30%",
              "ARPU up 15%",
            ],
            dependencies: [],
          },
          {
            id: "truenorth-init-002",
            name: "CS-Driven Expansion Revenue Motion",
            leverId: "cross-sell-upsell",
            description:
              "Redesign CS comp to include NRR targets. Train CSMs on expansion selling (seat upgrades, module attach, annual prepay). 92% recurring revenue with 115% NRR means expansion is the highest-leverage motion available.",
            owner: "VP CS (hire if needed)",
            timeline: "Months 2-5",
            startCondition: "Month 1",
            resources: "$15K training + comp plan redesign",
            successMetrics: [
              "NRR improved to 120%+",
              "Expansion revenue 25%+ of new ARR",
              "CSM quotas set and tracked",
            ],
            dependencies: ["truenorth-init-001"],
          },
          {
            id: "truenorth-init-003",
            name: "CAC Payback Improvement",
            leverId: "sales-effectiveness",
            description:
              "Audit marketing spend by channel. Kill underperforming channels. Shift budget to high-conversion channels (content, SEO, partner referrals). Target: CAC payback under 18 months.",
            owner: "VP Marketing",
            timeline: "Months 1-6",
            startCondition: "Deal close",
            resources: "Reallocation of existing budget",
            successMetrics: [
              "CAC payback under 18 months",
              "Marketing efficiency ratio improved 20%",
              "Channel-level ROI visible",
            ],
            dependencies: [],
          },
        ],
        expectedValueCreation: {
          revenue: "+15-20% from pricing + expansion",
          ebitdaMargin: "+200-400 bps from efficiency gains",
          ebitdaDollars: "$1.0M",
        },
      },
      "months-7-18": {
        name: "Optimize & Scale",
        focus: "Product-Led Growth + Enterprise Motion",
        objectiveStatement:
          "Launch self-serve PLG funnel for SMB. Build enterprise sales team for $50K+ ACV deals. Ship AI features that create competitive moat.",
        initiatives: [
          {
            id: "truenorth-init-004",
            name: "Product-Led Growth Funnel",
            leverId: "channel-expansion",
            description:
              "Build self-serve signup, free trial, and in-product upgrade flow. PLG captures SMB market without sales team cost. Targets companies with <500 employees doing SOC 2 for the first time.",
            owner: "VP Product + VP Engineering",
            timeline: "Months 7-14",
            startCondition: "Pricing restructure complete",
            resources: "$150K engineering investment",
            successMetrics: [
              "Self-serve funnel live",
              "Trial-to-paid conversion >8%",
              "PLG contributing 20% of new logos",
            ],
            dependencies: ["truenorth-init-001"],
          },
          {
            id: "truenorth-init-005",
            name: "Enterprise Sales Team",
            leverId: "sales-effectiveness",
            description:
              "Hire 3-4 enterprise AEs targeting $50K+ ACV deals. Dedicated pre-sales engineer. Enterprise deals have 3x better unit economics than SMB but longer sales cycles.",
            owner: "VP Sales",
            timeline: "Months 8-16",
            startCondition: "Month 7",
            resources: "$500K fully loaded (team + tools)",
            successMetrics: [
              "Enterprise pipeline >$3M",
              "3+ enterprise deals closed",
              "Average ACV >$60K",
            ],
            dependencies: ["truenorth-init-003"],
          },
          {
            id: "truenorth-init-006",
            name: "AI-Powered Compliance Automation",
            leverId: "ai-software",
            description:
              "Ship AI features: automated evidence collection, policy generation, continuous monitoring. These are the moat. Compliance is a perfect AI use case (structured, repetitive, high-stakes). Competitors without AI will be commoditized.",
            owner: "VP Engineering + CTO",
            timeline: "Months 8-18",
            startCondition: "Month 7",
            resources: "$200K engineering + $50K AI infrastructure",
            successMetrics: [
              "3+ AI features shipped",
              "Time-to-compliance reduced 40%",
              "Feature as top-3 sales differentiator",
            ],
            dependencies: [],
          },
        ],
        expectedValueCreation: {
          revenue: "+40-60% from PLG + enterprise + expansion",
          ebitdaMargin: "+100-200 bps (enterprise margins offset PLG investment)",
          ebitdaDollars: "$3.5M",
        },
      },
      "months-19-36": {
        name: "Scale & Exit Prep",
        focus: "Rule of 40 + Strategic Positioning",
        objectiveStatement:
          "Achieve Rule of 40 (growth rate + EBITDA margin). Position for premium SaaS exit multiple. Consider strategic acquirer outreach.",
        initiatives: [
          {
            id: "truenorth-init-007",
            name: "International Expansion (GDPR/UK)",
            leverId: "channel-expansion",
            description:
              "Expand compliance platform to GDPR and UK Cyber Essentials frameworks. International expansion with zero incremental infrastructure (cloud-native, fully remote team).",
            owner: "VP Product + VP Sales",
            timeline: "Months 20-30",
            startCondition: "Core platform stable",
            resources: "$100K product localization + $80K sales",
            successMetrics: [
              "GDPR module live",
              "10+ international customers",
              "International revenue 10%+ of total",
            ],
            dependencies: ["truenorth-init-006"],
          },
          {
            id: "truenorth-init-008",
            name: "Strategic Partnership & Channel Sales",
            leverId: "channel-expansion",
            description:
              "Build partner program with MSPs, IT consultancies, and audit firms. Channel partners refer deals at zero CAC. Revenue share model.",
            owner: "VP Partnerships (hire)",
            timeline: "Months 22-36",
            startCondition: "Product-market fit proven in enterprise",
            resources: "$120K (VP Partnerships + program build)",
            successMetrics: [
              "10+ active partners",
              "Channel contributing 15% of new ARR",
              "Partner-sourced deals at <50% of direct CAC",
            ],
            dependencies: ["truenorth-init-005"],
          },
        ],
        expectedValueCreation: {
          revenue: "+110-180% total reaching $30-40M ARR",
          ebitdaMargin: "+200-400 bps reaching 25-30%",
          ebitdaDollars: "$7-10M",
        },
      },
    },
    goldenYearAnalysis: {
      year1Ebitda: "$1.0M",
      year1VsPlan: "45%",
      assessment:
        "Moderate Golden Year. Pricing and expansion revenue are fast wins. But SaaS value creation is fundamentally a compounding story; the real payoff is years 2-3 when PLG, enterprise, and AI features compound into NRR and growth rate. Risk: founders resist pricing changes that slow logo growth.",
    },
    exercise: {
      prompt:
        "TrueNorth's founders want growth equity and to keep majority control. How does this change your playbook compared to a full buyout? What governance rights do you need to protect your investment?",
      acceptanceCriteria: [
        "Identifies the tension between growth equity (minority) and operational control needed to execute the playbook",
        "Specifies governance rights: board seat, veto on major hires, budget approval, information rights",
        "Notes that growth equity playbooks lean harder on product/market forces and lighter on operational restructuring",
        "Considers alignment mechanisms: founder vesting acceleration tied to milestones, not just time",
      ],
    },
  },

  // ── IRONCLAD BUILDERS ───────────────────────────────────────────────────
  {
    id: "ironclad-construction-playbook",
    companyId: "ironclad-construction",
    title: "Ironclad Builders: 36-Month Value Creation Playbook",
    description:
      "Regional GC with strong government backlog and aging founder. Playbook prioritizes: (1) succession and management upgrade, (2) bonding capacity expansion, (3) project selection discipline, (4) technology for estimating and project management.",
    entryMetrics: {
      revenue: 52.8,
      adjustedEbitda: 4.85,
      adjustedEbitdaMargin: 9.2,
    },
    exitTargets: {
      revenue: "70-85",
      adjustedEbitdaMargin: "11-13%",
      moicTarget: "2.5-3.0x",
    },
    primaryLevers: [
      "management-upgrades",
      "financial-controls",
      "pricing-optimization",
      "automation",
    ],
    timeline: {
      "months-1-6": {
        name: "Foundation & Quick Wins",
        focus: "Succession + Financial Controls + Bonding",
        objectiveStatement:
          "Execute founder transition plan. Upgrade financial reporting for project-level profitability. Begin bonding capacity expansion process.",
        initiatives: [
          {
            id: "ironclad-init-001",
            name: "CEO Succession & Management Upgrade",
            leverId: "management-upgrades",
            description:
              "Founder (age 63) stays for 12-month transition. Hire or promote COO to take over daily operations. Hire VP of Preconstruction to improve estimating accuracy. These are the two most critical hires.",
            owner: "PE partner + Founder",
            timeline: "Months 1-4",
            startCondition: "Deal close",
            resources: "$100K recruiting fees",
            successMetrics: [
              "COO hired and onboarded",
              "VP Preconstruction hired",
              "Founder transition plan documented",
            ],
            dependencies: [],
          },
          {
            id: "ironclad-init-002",
            name: "Project-Level Financial Controls",
            leverId: "financial-controls",
            description:
              "Implement job costing and WIP (work-in-progress) reporting at the project level. Construction margins are made or lost in change order management and cost tracking. Currently relies on founder's judgment.",
            owner: "CFO + Controller",
            timeline: "Months 1-5",
            startCondition: "Deal close",
            resources: "$50K ERP upgrade (Sage or Procore financials)",
            successMetrics: [
              "WIP reports produced monthly",
              "Change order tracking systematic",
              "Project-level margins visible within 48 hours",
            ],
            dependencies: [],
          },
          {
            id: "ironclad-init-003",
            name: "Bonding Capacity Expansion",
            leverId: "financial-controls",
            description:
              "Current bonding limit: $25M per project. PE backing + improved financials should unlock $40-50M bonding. Larger projects have better margins (less competition, longer duration, higher barriers).",
            owner: "CFO + Surety broker",
            timeline: "Months 3-6",
            startCondition: "Month 2 financials upgraded",
            resources: "$15K surety advisory",
            successMetrics: [
              "Bonding capacity increased to $40M+",
              "Surety relationship upgraded",
              "2+ large project bids submitted",
            ],
            dependencies: ["ironclad-init-002"],
          },
        ],
        expectedValueCreation: {
          revenue: "Minimal (backlog-driven, no quick revenue wins)",
          ebitdaMargin: "+100-150 bps from change order discipline",
          ebitdaDollars: "$0.6M",
        },
      },
      "months-7-18": {
        name: "Optimize & Scale",
        focus: "Project Selection + Estimating + Technology",
        objectiveStatement:
          "Improve bid-to-win ratio. Deploy estimating technology. Pursue larger projects enabled by bonding increase. Reduce rework costs.",
        initiatives: [
          {
            id: "ironclad-init-004",
            name: "Estimating & Preconstruction Upgrade",
            leverId: "automation",
            description:
              "Implement BIM-integrated estimating. Historical cost database for benchmarking. Improve bid accuracy (currently winning low-margin bids; losing high-margin ones due to conservative estimating).",
            owner: "VP Preconstruction",
            timeline: "Months 7-14",
            startCondition: "VP Precon onboarded",
            resources: "$80K software + $30K training",
            successMetrics: [
              "Bid accuracy within 3% of actual",
              "Win rate on target projects up 20%",
              "Decline rate on bad-margin projects up",
            ],
            dependencies: ["ironclad-init-001"],
          },
          {
            id: "ironclad-init-005",
            name: "Project Selection Discipline",
            leverId: "pricing-optimization",
            description:
              "Formalize go/no-go framework for bidding. Score projects on margin potential, owner relationship, complexity, and bonding impact. Stop bidding on margin-dilutive work just to maintain revenue.",
            owner: "COO + VP Preconstruction",
            timeline: "Months 8-14",
            startCondition: "Month 7",
            resources: "Internal (process, not tools)",
            successMetrics: [
              "Go/no-go framework in use",
              "Average project margin improved 200 bps",
              "Backlog quality score tracked",
            ],
            dependencies: ["ironclad-init-001", "ironclad-init-004"],
          },
          {
            id: "ironclad-init-006",
            name: "Project Management Technology",
            leverId: "automation",
            description:
              "Deploy Procore or similar PM platform across all active projects. Real-time cost tracking, RFI management, subcontractor coordination. Reduce rework and schedule overruns.",
            owner: "COO + IT",
            timeline: "Months 9-16",
            startCondition: "Month 8",
            resources: "$60K Procore + $25K rollout",
            successMetrics: [
              "All active projects on platform",
              "RFI response time halved",
              "Rework costs reduced 25%",
            ],
            dependencies: ["ironclad-init-002"],
          },
        ],
        expectedValueCreation: {
          revenue: "+15-25% from larger projects + improved win rate",
          ebitdaMargin: "+150-250 bps from project selection + rework reduction",
          ebitdaDollars: "$2.5M",
        },
      },
      "months-19-36": {
        name: "Scale & Exit Prep",
        focus: "Larger Projects + Specialization + Exit",
        objectiveStatement:
          "Pursue $30-50M projects. Build specialized capabilities (healthcare, data center). Achieve exit-ready scale with institutional management.",
        initiatives: [
          {
            id: "ironclad-init-007",
            name: "Specialization in High-Margin Verticals",
            leverId: "channel-expansion",
            description:
              "Develop deep expertise in 1-2 high-margin verticals (healthcare, data center, or life sciences). Specialized GCs command premium pricing and face less competition.",
            owner: "COO + BD lead",
            timeline: "Months 20-34",
            startCondition: "Estimating and PM platforms mature",
            resources: "$50K training + certifications",
            successMetrics: [
              "2+ specialized projects won",
              "Specialized project margins 200+ bps above average",
              "Reputation established in vertical",
            ],
            dependencies: ["ironclad-init-004"],
          },
          {
            id: "ironclad-init-008",
            name: "Subcontractor Relationship Management",
            leverId: "procurement",
            description:
              "Formalize preferred sub program. Negotiate volume discounts and priority scheduling. Strong sub relationships are the GC's real competitive advantage; the builder who gets the best subs wins.",
            owner: "VP Operations",
            timeline: "Months 22-36",
            startCondition: "PM platform mature",
            resources: "$20K program build",
            successMetrics: [
              "Preferred sub list formalized",
              "Sub pricing 5-10% below market",
              "Schedule reliability improved 15%",
            ],
            dependencies: ["ironclad-init-006"],
          },
        ],
        expectedValueCreation: {
          revenue: "+33-60% total reaching $70-85M",
          ebitdaMargin: "+100-200 bps from specialization premium",
          ebitdaDollars: "$4.5-6.0M",
        },
      },
    },
    goldenYearAnalysis: {
      year1Ebitda: "$0.6M",
      year1VsPlan: "35%",
      assessment:
        "Weak Golden Year by necessity. Construction is a backlog-driven business; you can't accelerate revenue already under contract. Year 1 value is change order discipline and management upgrade. The real payoff comes when better estimating and project selection flow through in months 7-18. Risk: founder departs before knowledge transfer is complete.",
    },
    exercise: {
      prompt:
        "Ironclad's founder is 63 and has all the government relationships in his head. How do you capture institutional knowledge before he leaves? What happens if he exits early?",
      acceptanceCriteria: [
        "Proposes systematic relationship documentation and joint introductions during transition period",
        "Identifies the risk of government relationship concentration in one person",
        "Considers earn-out or consulting arrangement to extend founder engagement",
        "Notes that government work often has formal qualification processes that transfer with the company, not the person",
      ],
    },
  },

  // ── VITALITY PET WELLNESS ───────────────────────────────────────────────
  {
    id: "vitality-vet-playbook",
    companyId: "vitality-vet",
    title: "Vitality Pet Wellness: 36-Month Value Creation Playbook",
    description:
      "Early-stage vet roll-up with strong unit economics and a wellness plan model driving 65% recurring revenue. Playbook prioritizes: (1) prove the acquisition integration playbook, (2) scale from 3 to 8-10 clinics, (3) wellness plan penetration, (4) central services build.",
    entryMetrics: {
      revenue: 8.4,
      adjustedEbitda: 2.15,
      adjustedEbitdaMargin: 25.6,
    },
    exitTargets: {
      revenue: "22-30",
      adjustedEbitdaMargin: "22-25%",
      moicTarget: "4.0-5.0x",
    },
    primaryLevers: [
      "buy-and-build",
      "cross-sell-upsell",
      "incentive-alignment",
      "automation",
    ],
    timeline: {
      "months-1-6": {
        name: "Foundation & Quick Wins",
        focus: "Same-Store Growth + Integration Playbook",
        objectiveStatement:
          "Optimize wellness plan penetration at existing clinics. Document the integration playbook. Build M&A pipeline. Centralize back-office.",
        initiatives: [
          {
            id: "vitality-init-001",
            name: "Wellness Plan Penetration Optimization",
            leverId: "cross-sell-upsell",
            description:
              "Wellness plans are the business model moat (65% recurring revenue, 2% customer concentration). Push penetration from current level toward 40%+ of active patients. Train front desk on enrollment. Add puppy/kitten auto-enroll at first visit.",
            owner: "Practice Manager + Marketing",
            timeline: "Months 1-5",
            startCondition: "Deal close",
            resources: "$10K marketing + $5K training",
            successMetrics: [
              "Wellness plan penetration up 10%",
              "Auto-enroll at first visit live",
              "Recurring revenue % maintained above 65%",
            ],
            dependencies: [],
          },
          {
            id: "vitality-init-002",
            name: "Central Services & Back-Office Build",
            leverId: "automation",
            description:
              "Centralize billing, procurement, HR, and scheduling across 3 clinics. Single PIMS (Practice Information Management System). This must work at 3 clinics before scaling to 10.",
            owner: "COO / Founder",
            timeline: "Months 1-4",
            startCondition: "Deal close",
            resources: "$40K PIMS upgrade + $15K integration",
            successMetrics: [
              "Single PIMS across all clinics",
              "Centralized procurement",
              "Admin cost per clinic reduced 25%",
            ],
            dependencies: [],
          },
          {
            id: "vitality-init-003",
            name: "Vet Compensation & Retention Model",
            leverId: "incentive-alignment",
            description:
              "Design comp model that retains vets through scale. Production-based comp with quality bonuses. Equity participation for lead vets at each location. Vet retention is the #1 risk in vet roll-ups.",
            owner: "Founder + HR",
            timeline: "Months 2-5",
            startCondition: "Month 1",
            resources: "$10K comp benchmarking",
            successMetrics: [
              "Comp model redesigned",
              "Vet satisfaction >85%",
              "Zero vet departures in Year 1",
            ],
            dependencies: [],
          },
          {
            id: "vitality-init-004",
            name: "M&A Pipeline for Clinic Acquisitions",
            leverId: "buy-and-build",
            description:
              "Build pipeline of 10-15 target clinics in suburban Atlanta. Screen for: solo vet wanting to retire, $1-3M revenue, good location, transferable patient base.",
            owner: "Founder + PE partner",
            timeline: "Months 2-6",
            startCondition: "Month 1",
            resources: "$15K broker relationships",
            successMetrics: [
              "15+ targets identified",
              "5+ NDAs signed",
              "2+ LOIs issued",
            ],
            dependencies: [],
          },
        ],
        expectedValueCreation: {
          revenue: "+10% same-store from wellness plan growth",
          ebitdaMargin: "+100-200 bps from centralization",
          ebitdaDollars: "$0.4M",
        },
      },
      "months-7-18": {
        name: "Optimize & Scale",
        focus: "Acquisition Execution + Platform Build",
        objectiveStatement:
          "Close 3-5 clinic acquisitions. Integrate each within 60 days using proven playbook. Reach 6-8 clinics. Maintain vet retention.",
        initiatives: [
          {
            id: "vitality-init-005",
            name: "Clinic Acquisitions (3-5 Practices)",
            leverId: "buy-and-build",
            description:
              "Close 3-5 clinic acquisitions at 5-7x EBITDA. Integrate onto central PIMS, billing, and procurement within 60 days each. Roll out wellness plan model to acquired clinics. Multiple arbitrage: buy at 5-7x, platform valued at 10-12x.",
            owner: "Founder + M&A partner",
            timeline: "Months 7-18",
            startCondition: "Pipeline mature + playbook proven",
            resources: "$100K advisory + legal per deal",
            successMetrics: [
              "3-5 clinics acquired",
              "Integration within 60 days each",
              "Patient retention >90%",
              "Vet retention >85%",
            ],
            dependencies: ["vitality-init-002", "vitality-init-004"],
          },
          {
            id: "vitality-init-006",
            name: "Wellness Plan Rollout to Acquired Clinics",
            leverId: "cross-sell-upsell",
            description:
              "Deploy Vitality wellness plan model at each acquired clinic. This is the key integration value driver: acquired clinics typically have 0% wellness plan penetration. Converting 20-30% of their patients to wellness plans transforms their recurring revenue profile.",
            owner: "Practice Manager + Regional Lead",
            timeline: "Months 8-18",
            startCondition: "Post-acquisition day 30",
            resources: "$5K per clinic (marketing + training)",
            successMetrics: [
              "Wellness plan penetration >20% within 6 months of acquisition",
              "Recurring revenue at acquired clinics >40%",
              "Patient visit frequency up 15%",
            ],
            dependencies: ["vitality-init-005"],
          },
          {
            id: "vitality-init-007",
            name: "Veterinarian Recruitment Pipeline",
            leverId: "management-upgrades",
            description:
              "Build sustainable vet recruitment funnel. Relationships with UGA, Auburn, and Florida vet schools. Mentorship program for new grads. Scaling from 7 to 15+ vets requires a pipeline.",
            owner: "HR (hire)",
            timeline: "Months 9-18",
            startCondition: "Month 8",
            resources: "$60K (recruiter + vet school program)",
            successMetrics: [
              "Pipeline of 8+ candidates",
              "Time-to-fill under 45 days",
              "New grad mentorship program launched",
            ],
            dependencies: ["vitality-init-003"],
          },
        ],
        expectedValueCreation: {
          revenue: "+100-150% from acquisitions + same-store growth",
          ebitdaMargin: "Compression during integration (-100-200 bps), stabilizes",
          ebitdaDollars: "$3.0M",
        },
      },
      "months-19-36": {
        name: "Scale & Exit Prep",
        focus: "Platform Maturity + Regional Dominance",
        objectiveStatement:
          "Reach 8-10 clinics. Achieve regional brand recognition. Build institutional management layer. Exit-ready platform.",
        initiatives: [
          {
            id: "vitality-init-008",
            name: "Additional Acquisitions + De Novo",
            leverId: "buy-and-build",
            description:
              "Close 2-3 more acquisitions plus 1-2 de novo clinics in underserved suburban markets. De novo clinics cost less ($150-200K) but take 12-18 months to ramp.",
            owner: "Founder + M&A partner",
            timeline: "Months 20-34",
            startCondition: "Integration playbook repeatable",
            resources: "$100K per acquisition + $175K per de novo",
            successMetrics: [
              "8-10 total clinics",
              "Revenue $22-30M",
              "Regional brand established",
            ],
            dependencies: ["vitality-init-005"],
          },
          {
            id: "vitality-init-009",
            name: "Regional Management Layer",
            leverId: "management-upgrades",
            description:
              "Hire regional manager to oversee 8-10 clinics. Founder transitions from operator to CEO. Required for institutional-quality exit and next phase of growth.",
            owner: "Founder",
            timeline: "Months 24-30",
            startCondition: "7+ clinics operating",
            resources: "$150K annual (regional manager)",
            successMetrics: [
              "Regional manager hired",
              "Founder time on clinic ops <15%",
              "Clinic-level P&L accountability delegated",
            ],
            dependencies: ["vitality-init-005"],
          },
        ],
        expectedValueCreation: {
          revenue: "+160-260% total reaching $22-30M",
          ebitdaMargin: "Stabilize at 22-25%",
          ebitdaDollars: "$5.0-7.0M",
        },
      },
    },
    goldenYearAnalysis: {
      year1Ebitda: "$0.4M",
      year1VsPlan: "30%",
      assessment:
        "Weak Golden Year, but this is a roll-up thesis by design. Year 1 builds the foundation (playbook, central services, pipeline) that makes years 2-3 acquisition-driven value creation possible. The wellness plan model is the unique insight; rolling it into acquired clinics is the compounding engine. Risk: $8.4M revenue is below typical $10M LMM threshold, so entry execution risk is higher.",
    },
    exercise: {
      prompt:
        "Vitality is at $8.4M revenue, below the typical $10M LMM threshold. Does this change how you structure the deal? What additional protections do you need at this size?",
      acceptanceCriteria: [
        "Identifies the sub-scale risk: smaller platform means less margin for error on acquisitions",
        "Considers deal structure adjustments: higher equity check, milestone-based earnout, founder rollover",
        "Notes that sub-$10M platforms need faster path to scale to justify LMM fund economics",
        "Evaluates whether the wellness plan model creates enough differentiation to offset size risk",
      ],
    },
  },

  // ── MERIDIAN FULFILLMENT CO. ────────────────────────────────────────────
  {
    id: "meridian-fulfillment-playbook",
    companyId: "meridian-fulfillment",
    title: "Meridian Fulfillment Co.: 36-Month Value Creation Playbook",
    description:
      "Growing 3PL competing with Amazon FBA and ShipBob. Already invested in warehouse automation. Playbook prioritizes: (1) technology differentiation, (2) customer mix optimization, (3) 4th facility launch, (4) margin expansion through automation ROI.",
    entryMetrics: {
      revenue: 29.5,
      adjustedEbitda: 4.65,
      adjustedEbitdaMargin: 15.8,
    },
    exitTargets: {
      revenue: "50-65",
      adjustedEbitdaMargin: "18-21%",
      moicTarget: "3.0-3.5x",
    },
    primaryLevers: [
      "ai-software",
      "automation",
      "sales-effectiveness",
      "pricing-optimization",
    ],
    timeline: {
      "months-1-6": {
        name: "Foundation & Quick Wins",
        focus: "Technology Moat + Customer Economics Visibility",
        objectiveStatement:
          "Build customer-level P&L visibility. Optimize pricing by order profile. Invest in technology that differentiates from commodity 3PLs.",
        initiatives: [
          {
            id: "meridian-init-001",
            name: "Customer-Level Profitability Analysis",
            leverId: "financial-controls",
            description:
              "Build P&L by customer. Identify which DTC brands are profitable vs margin-dilutive. 3PL margins are notoriously opaque at the customer level; the business likely has 20% of customers generating 80% of profit.",
            owner: "CFO + Analytics",
            timeline: "Months 1-3",
            startCondition: "Deal close",
            resources: "$25K analytics build",
            successMetrics: [
              "Customer-level P&L live",
              "Bottom 10% customers identified",
              "Pricing action plan for unprofitable accounts",
            ],
            dependencies: [],
          },
          {
            id: "meridian-init-002",
            name: "Pricing Optimization by Order Profile",
            leverId: "pricing-optimization",
            description:
              "Move from flat per-order pricing to tiered model based on: pick complexity, weight/size, SLA (same-day vs 2-day), returns handling. Capture the value of complexity and speed.",
            owner: "VP Sales + Finance",
            timeline: "Months 2-5",
            startCondition: "Customer P&L available",
            resources: "$15K pricing analysis",
            successMetrics: [
              "New pricing model deployed for new contracts",
              "Revenue per order up 8-12%",
              "Returns handling priced separately",
            ],
            dependencies: ["meridian-init-001"],
          },
          {
            id: "meridian-init-003",
            name: "WMS & Automation ROI Assessment",
            leverId: "automation",
            description:
              "Company has invested heavily in warehouse automation. Assess ROI: is the automation delivering projected throughput and labor savings? Identify gaps and optimization opportunities.",
            owner: "VP Operations + CTO",
            timeline: "Months 1-4",
            startCondition: "Deal close",
            resources: "$20K operations consulting",
            successMetrics: [
              "Automation ROI quantified",
              "Optimization opportunities identified",
              "Throughput benchmarked vs industry",
            ],
            dependencies: [],
          },
        ],
        expectedValueCreation: {
          revenue: "+5-8% from pricing uplift",
          ebitdaMargin: "+150-250 bps from pricing + automation optimization",
          ebitdaDollars: "$0.8M",
        },
      },
      "months-7-18": {
        name: "Optimize & Scale",
        focus: "4th Facility + Technology Platform + Customer Growth",
        objectiveStatement:
          "Open 4th warehouse facility. Build technology platform that differentiates from commodity 3PLs. Grow mid-market brand portfolio.",
        initiatives: [
          {
            id: "meridian-init-004",
            name: "4th Warehouse Facility Launch",
            leverId: "channel-expansion",
            description:
              "Open 4th facility in strategic location (Southeast or Midwest) to reduce shipping zones and enable 2-day ground to 90%+ of US population. This is the stated use of PE capital.",
            owner: "VP Operations + Real Estate",
            timeline: "Months 7-14",
            startCondition: "Location selected, lease signed",
            resources: "$500K buildout + $200K automation + $150K inventory",
            successMetrics: [
              "Facility operational",
              "2-day coverage expanded to 90%+",
              "Break-even within 9 months",
            ],
            dependencies: ["meridian-init-003"],
          },
          {
            id: "meridian-init-005",
            name: "AI-Powered Demand Forecasting & Inventory Optimization",
            leverId: "ai-software",
            description:
              "Build predictive demand forecasting for brands. AI-driven inventory placement across 4 facilities to minimize shipping cost. This is the technology moat: commodity 3PLs cannot offer this.",
            owner: "CTO + Data team",
            timeline: "Months 8-16",
            startCondition: "4th facility data flowing",
            resources: "$150K engineering + $30K AI infrastructure",
            successMetrics: [
              "Demand forecast accuracy >85%",
              "Inventory placement optimized across 4 facilities",
              "Average shipping cost per order reduced 12%",
            ],
            dependencies: ["meridian-init-004"],
          },
          {
            id: "meridian-init-006",
            name: "Mid-Market Brand Sales Push",
            leverId: "sales-effectiveness",
            description:
              "Shift customer mix toward mid-market DTC brands ($5-50M revenue). They have more complex needs, higher willingness to pay, and longer contracts than SMB brands. Build enterprise sales team.",
            owner: "VP Sales + 2 AEs (hire)",
            timeline: "Months 8-18",
            startCondition: "Month 7",
            resources: "$250K fully loaded (VP Sales + 2 AEs)",
            successMetrics: [
              "5+ mid-market brands signed",
              "Average contract value >$200K/year",
              "Customer concentration below 15%",
            ],
            dependencies: ["meridian-init-002"],
          },
        ],
        expectedValueCreation: {
          revenue: "+30-45% from 4th facility + new customers",
          ebitdaMargin: "+100-200 bps from automation + customer mix",
          ebitdaDollars: "$3.0M",
        },
      },
      "months-19-36": {
        name: "Scale & Exit Prep",
        focus: "Platform Technology Story + Scale",
        objectiveStatement:
          "Position as a technology-differentiated 3PL. Grow to $50M+ revenue. Build the narrative for a premium exit multiple vs commodity 3PLs.",
        initiatives: [
          {
            id: "meridian-init-007",
            name: "Brand Dashboard & Self-Service Portal",
            leverId: "ai-software",
            description:
              "Build customer-facing analytics dashboard: real-time inventory, shipping performance, returns analytics, demand forecasting insights. Brands manage their fulfillment like a SaaS product. This flips the narrative from 3PL (commodity) to tech-enabled logistics (premium).",
            owner: "CTO + Product team",
            timeline: "Months 20-30",
            startCondition: "AI forecasting platform stable",
            resources: "$120K engineering",
            successMetrics: [
              "Dashboard live for all customers",
              "Self-service features reducing support tickets 30%",
              "Customer NPS up 15 points",
            ],
            dependencies: ["meridian-init-005"],
          },
          {
            id: "meridian-init-008",
            name: "5th Facility or Strategic Acquisition",
            leverId: "buy-and-build",
            description:
              "Evaluate: open 5th facility vs acquire a regional 3PL for instant geographic coverage and customer base. Acquisition adds revenue faster; organic adds better margins.",
            owner: "CEO + PE partner",
            timeline: "Months 24-36",
            startCondition: "4 facilities profitable",
            resources: "$150K advisory (if acquisition)",
            successMetrics: [
              "Revenue $50-65M",
              "National coverage achieved",
              "Platform scale for premium exit",
            ],
            dependencies: ["meridian-init-004"],
          },
        ],
        expectedValueCreation: {
          revenue: "+70-120% total reaching $50-65M",
          ebitdaMargin: "+100-200 bps from technology premium + scale",
          ebitdaDollars: "$5.5-8.0M",
        },
      },
    },
    goldenYearAnalysis: {
      year1Ebitda: "$0.8M",
      year1VsPlan: "42%",
      assessment:
        "Moderate Golden Year. Pricing optimization and automation ROI are quick wins. But the 4th facility investment in months 7-14 temporarily compresses margins before paying off. The technology moat (AI forecasting, brand dashboard) is the unique thesis element but takes 12-18 months to mature. Risk: Amazon FBA pricing pressure commoditizes the market faster than technology differentiation can offset.",
    },
    exercise: {
      prompt:
        "Meridian competes with Amazon FBA and ShipBob. What's the long-term defensibility of a mid-market 3PL? When does this business get commoditized, and how does your playbook prevent that?",
      acceptanceCriteria: [
        "Identifies technology (AI forecasting, brand dashboard) as the only sustainable differentiator vs commodity 3PLs",
        "Notes that mid-market focus avoids direct Amazon FBA competition (FBA optimizes for SMB, not complex mid-market needs)",
        "Considers the risk that ShipBob or Deliverr could move upmarket and compete directly",
        "Evaluates whether the technology investment is fast enough to build a moat before commoditization",
      ],
    },
  },
];

// ── INITIATIVE TEMPLATES ──────────────────────────────────────────────────
// Generic templates for the 100-day plan builder (deferred to Phase 3.5)
export const INITIATIVE_TEMPLATES = {
  "100-day-plan": {
    description:
      "First 100 days post-close. Focus: quick wins + foundation-setting.",
    structure: [
      {
        week: "1-2",
        focus: "Financial controls & data gathering",
        sample:
          "Hire CFO, establish close calendar, benchmark KPIs",
      },
      {
        week: "3-4",
        focus: "Pricing & cost opportunity validation",
        sample:
          "Pricing study launch, vendor audit start",
      },
      {
        week: "5-8",
        focus: "Process documentation & quick wins",
        sample:
          "Sales playbook, comp redesign, first price increase",
      },
      {
        week: "9-14",
        focus: "Systems implementation & hiring",
        sample:
          "CRM go-live, VP Sales offer, procurement RFPs",
      },
    ],
  },
};
