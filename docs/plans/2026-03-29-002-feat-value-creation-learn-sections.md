---
title: "feat: Value Creation Learn Sections (Levers, Bridge, Playbooks, Roll-ups)"
type: feat
status: planned
date: 2026-03-29
---

# feat: Value Creation Learn Sections (Levers, Bridge, Playbooks, Roll-ups)

## Overview

Add four new interactive learning sections to Forge that teach the operationalization of value creation in lower-middle market PE. These sections transform Forge from a valuation + deal analysis trainer into a comprehensive PE operating system training tool. Users will learn to identify operational levers, build value creation bridges, sequence implementation plans, and understand roll-up economics.

All four sections use Forge's 9 existing companies as grounded examples. No new API dependencies. No backend changes. All data static. All interactivity client-side with localStorage persistence.

---

## Problem Statement / Motivation

Forge currently teaches deal evaluation (valuation, risk, thesis). But it doesn't teach the operational playbook that comes *after* you own the company. The gap:

1. **No lever-level understanding.** Users can identify risks but can't identify which of the 12 operational levers apply to a specific business. They don't know when to price, when to consolidate vendors, when to add capacity vs. when to cut costs.

2. **No return attribution.** Users can calculate entry multiples and exit multiples, but they don't know where value actually comes from. Is it revenue growth, margin expansion, multiple expansion, or debt paydown? How do they model each independently?

3. **No sequencing discipline.** Users learn about operational tactics (pricing, procurement, sales, etc.) but don't understand the 36-month arc: quick wins in months 1-6, optimization in 7-18, scaling in 19-36. No framework to order initiatives.

4. **No platform vs. bolt-on economics.** Users don't understand why a platform might be acquired at 7x but a bolt-on at 4.5x, or how that arbitrage compounds into IRR.

These sections address all four gaps. Taken together, they teach the "QB" role: the AI-native operations strategist who can look at a company and say "here's the lever we pull, here's how returns decompose, here's the 36-month playbook, here's where the next acquisition goes."

This directly supports the PE Operating daily block (45 min): 10 min studying levers, 10 min on bridge scenarios, 10 min on playbook sequencing, 15 min practice questions using these frameworks.

---

## Feature 1: Value Creation Levers (Interactive Lever Cards)

### What It Is

A deck of 12 interactive cards, one for each operational lever. Each card teaches when to deploy that lever, typical impact range, timeline, and red flags. Users see real-world application using Forge's 9 companies.

The 12 levers:
1. Pricing optimization (revenue lever)
2. Sales force effectiveness (revenue lever)
3. Channel expansion (revenue lever)
4. Cross-sell and upsell (revenue lever)
5. Procurement and vendor consolidation (margin lever)
6. Labor optimization (margin lever)
7. Process automation and technology (margin lever)
8. Facility and asset optimization (margin lever)
9. Management team upgrades (organizational lever)
10. Incentive alignment and KPI discipline (organizational lever)
11. Financial controls and reporting (organizational lever)
12. AI and software development (technology lever)

### Proposed Data Architecture

```javascript
// app/src/data/valueLevers.js

export const valueLevers = [
  {
    id: "pricing-optimization",
    title: "Pricing Optimization",
    category: "revenue", // revenue, margin, organizational, technology
    oneLiner: "Increase price or improve price realization without losing volume.",
    whenToDeploy: [
      "Services business with fragmented/outdated pricing",
      "Market where transparency is low (customers don't compare prices)",
      "Historical pricing below market (discovered via benchmarking)"
    ],
    typicalImpact: {
      revenue: "10-20% uplift from pricing alone",
      ebitdaMargin: "300-700 bps",
      timeline: "6-12 months to full implementation"
    },
    businessTypeFit: {
      services: "Ideal. Price elasticity low; customer switching cost high.",
      manufacturing: "Good. Specialty products where pricing power exists.",
      saas: "Good. Tiered pricing; expansion pricing leverage.",
      distribution: "Difficult. Commoditized; transparent pricing."
    },
    redFlags: [
      "Market is commoditized (pricing power doesn't exist)",
      "Pricing is published/transparent (customers see competitors)",
      "Customer concentration >30% (one customer can force price down)",
      "Price elasticity is high (small increase loses material volume)"
    ],
    companyExamples: [
      {
        companyId: "summit",
        label: "Summit Mechanical Services",
        narrative: "HVAC services have regional pricing power. Market is fragmented; customers don't compare prices across providers. Opportunity: raise price 5-8% on next contract renewal cycles.",
        currentMetrics: {
          revenue: "$32.5M",
          ebitdaMargin: "18.5%",
          topCustomerPct: "12%"
        },
        opportunity: "5% price increase = $1.6M incremental revenue at 40% flow-through = $640K EBITDA"
      },
      {
        companyId: "truenorth",
        label: "TrueNorth Analytics",
        narrative: "SaaS with tiered pricing model. Expansion pricing lever: upsell existing customers to higher tiers. Also: new module pricing. Opportunity: raise price on tier 2 and add paid modules.",
        currentMetrics: {
          revenue: "$14.2M",
          ebitdaMargin: "22%",
          arpu: "$45K"
        },
        opportunity: "Price increase 10% on new deals + expand modules to 15% of base = $2.8M incremental ARR"
      }
    ],
    exercise: {
      type: "lever-identification",
      prompt: "You're buying a professional services firm with $30M revenue at 12% EBITDA margin. Benchmarking shows competitors run 18% margins. Would you prioritize pricing optimization? Why or why not? What would you look for in diligence?",
      acceptanceCriteria: [
        "Identifies pricing power as primary lever (vs. cost cutting)",
        "Notes need for benchmarking data",
        "Mentions customer concentration risk",
        "Considers customer churn risk from price increase"
      ]
    }
  },
  {
    id: "sales-effectiveness",
    title: "Sales Force Effectiveness",
    category: "revenue",
    oneLiner: "Improve sales productivity, deal size, and win rate through process, tools, and talent upgrades.",
    whenToDeploy: [
      "Direct sales model with CRM adoption <50%",
      "Sales compensation not aligned to value drivers",
      "Sales cycle >6 months with no clear pipeline visibility",
      "VP Sales role is weak or absent"
    ],
    typicalImpact: {
      revenue: "15-30% revenue growth without proportional headcount increase",
      ebitdaMargin: "200-400 bps (improved sales leverage)",
      timeline: "6-12 months (compensation redesign, CRM, playbook rollout)"
    },
    businessTypeFit: {
      services: "Excellent. Direct sales model; compensation drives behavior.",
      saas: "Excellent. GTM optimization is high-ROI.",
      distribution: "Limited. Sales model is often transactional (order-taking).",
      manufacturing: "Good. Account management and cross-sell opportunities."
    },
    redFlags: [
      "Sales leader resists change or is politically protected",
      "Pipeline visibility is weak (no forecast discipline)",
      "Compensation tied to revenue volume, not profitability or product mix",
      "High sales turnover (>30% annually)",
      "Sales cost of acquisition is rising while win rate falls"
    ],
    companyExamples: [
      {
        companyId: "apex",
        label: "Apex Last-Mile Logistics",
        narrative: "B2B logistics sales. Sales model is relationship-driven but lacks process discipline. Opportunity: build sales playbook, implement Salesforce, align comp to profitability (not just volume).",
        currentMetrics: {
          revenue: "$38.5M",
          ebitdaMargin: "11%",
          salesHeadcount: "8"
        },
        opportunity: "20% sales productivity lift = $7.7M incremental revenue at 15% flow-through = $1.2M EBITDA. Comp redesign cost: $50-75K."
      },
      {
        companyId: "precision",
        label: "Precision CNC Solutions",
        narrative: "Manufacturing. Sales model is project-based with long cycle. Opportunity: improve proposal process, add technical sales engineer, shorten cycle from 6 months to 4 months.",
        currentMetrics: {
          revenue: "$12.8M",
          ebitdaMargin: "16%",
          salesCycleMonths: "6"
        },
        opportunity: "25% sales cycle reduction = ability to close more deals per salesperson per year = 15% revenue lift"
      }
    ],
    exercise: {
      type: "lever-decision",
      prompt: "You're evaluating a services company where the founder/CEO is the only rainmaker. Revenue grew 15% YoY but founder is exhausted. Sales team doesn't close deals without founder involvement. Do you prioritize sales effectiveness or management upgrades first? Why?",
      acceptanceCriteria: [
        "Recognizes key-person risk as blocker to sales effectiveness",
        "Notes that sales playbook won't help if founder is sole closer",
        "Identifies management upgrade as prerequisite",
        "Considers hiring VP Sales before scaling process"
      ]
    }
  },
  {
    id: "channel-expansion",
    title: "Channel Expansion",
    category: "revenue",
    oneLiner: "Add new distribution channels, markets, or customer segments to existing offering.",
    whenToDeploy: [
      "Repeatable offering (not custom)",
      "Significant geographic white space",
      "Underserved market segment with similar needs",
      "Partner ecosystem exists (resellers, integrators, affiliates)"
    ],
    typicalImpact: {
      revenue: "15-50% uplift over 2-3 years",
      ebitdaMargin: "Flat to -100bp (channel takes lower margin)",
      timeline: "12-24 months (partner identification, enablement, ramp)"
    },
    businessTypeFit: {
      services: "Good. Repeatable service packages; geographic expansion.",
      saas: "Excellent. Reseller model; system integrator partnerships.",
      distribution: "Excellent. New geographies; new customer segments.",
      manufacturing: "Limited. Channel model less applicable to direct manufacturing."
    },
    redFlags: [
      "Current direct sales model has high margin; channel margin erodes unit economics",
      "Channel conflict with existing direct sales (internal cannibalization risk)",
      "Partner enablement cost underestimated (assumes low-touch model)",
      "No proven repeatable offering (customization kills channel model)"
    ],
    companyExamples: [
      {
        companyId: "brightsmile",
        label: "BrightSmile Dental Partners",
        narrative: "Roll-up platform. Base lever is acquisition + integration. Secondary lever: channel expansion via licensing model (let non-acquired operators use BrightSmile tech for fee). Opportunity: develop licensing playbook.",
        currentMetrics: {
          revenue: "$9.8M",
          ebitdaMargin: "20%",
          locations: "8"
        },
        opportunity: "License to 20 additional operators over 3 years = $3-5M incremental revenue (high margin, low capex)"
      },
      {
        companyId: "coastal",
        label: "Coastal Fresh Foods",
        narrative: "Food distribution. Geographic expansion: acquire distributor in adjacent metro area or add supply chain partnership. Opportunity: leverage parent procurement power to support partner.",
        currentMetrics: {
          revenue: "$48.2M",
          ebitdaMargin: "8%",
          geographies: "1 (Southeast)"
        },
        opportunity: "Expansion to 2nd geography within 3 years = $15-20M incremental revenue"
      }
    ],
    exercise: {
      type: "channel-analysis",
      prompt: "A SaaS platform has built a strong direct sales GTM ($10M ARR, $20M entry). They're considering reseller partnerships for SMB segment. What due diligence would you do? What could go wrong?",
      acceptanceCriteria: [
        "Identifies channel conflict risk (direct vs. reseller)",
        "Notes partner enablement and support cost",
        "Mentions partner margin requirement (25-40% typically)",
        "Asks about contract terms and churn risk"
      ]
    }
  },
  {
    id: "cross-sell-upsell",
    title: "Cross-Sell and Upsell",
    category: "revenue",
    oneLiner: "Expand revenue from existing customer base by selling additional products or higher-tier offerings.",
    whenToDeploy: [
      "Recurring revenue model (SaaS, subscriptions, contracts)",
      "Low product adoption (customer uses only 30% of platform)",
      "Tiered pricing with room to move customers upmarket",
      "Modular offerings where bundles haven't been sold"
    ],
    typicalImpact: {
      revenue: "20-40% uplift over 2-3 years (from expansion alone)",
      ebitdaMargin: "High (incremental margin on existing customer base)",
      timeline: "6-12 months to structure offerings; 2-3 years for full ramp"
    },
    businessTypeFit: {
      services: "Good. Upsell to higher-tier service packages.",
      saas: "Excellent. Native to SaaS model; net revenue retention driver.",
      distribution: "Limited. Cross-sell harder in transactional model.",
      manufacturing: "Limited. Less applicable."
    },
    redFlags: [
      "Low product adoption (if customers don't use current offering, adding features won't help)",
      "Weak customer success function (no CSM accountability for expansion)",
      "Product quality issues (customers won't upgrade if core product is broken)",
      "CSM team too small to support expansion initiatives",
      "No usage data to identify expansion opportunities"
    ],
    companyExamples: [
      {
        companyId: "truenorth",
        label: "TrueNorth Analytics",
        narrative: "SaaS platform with tiered pricing (Starter, Professional, Enterprise) and modular add-ons. Current penetration: 60% of customers on Starter tier; only 20% have purchased add-ons. Opportunity: move 30% of Starter to Professional and sell add-ons to 50% of base.",
        currentMetrics: {
          arpu: "$45K",
          arpu_starter: "$25K",
          arpu_professional: "$75K",
          addOnPenetration: "20%"
        },
        opportunity: "Move 30% of Starter to Professional + grow add-on penetration to 50% = 35-45% NRR expansion"
      },
      {
        companyId: "vitality",
        label: "Vitality Pet Wellness",
        narrative: "Veterinary roll-up with core wellness services. Cross-sell opportunity: dental, orthopedic surgery, behavioral training, nutrition consulting. Opportunity: build bundled wellness packages.",
        currentMetrics: {
          revenue: "$8.4M",
          locationCount: "6",
          servicesPerLocation: "1-2"
        },
        opportunity: "Expand services per location to 3-4; increase ARPU by 25-40%"
      }
    ],
    exercise: {
      type: "expansion-modeling",
      prompt: "A B2B SaaS company has $20M ARR with 40% gross margin. Net revenue retention is 105% (3% churn, 8% expansion). You want to accelerate expansion from 8% to 12%. What levers would you pull? What's the cost?",
      acceptanceCriteria: [
        "Identifies CSM hiring, product discovery, and packaging as levers",
        "Notes that expansion requires product adoption and customer health first",
        "Calculates incremental NRR impact ($800K additional ARR)",
        "Mentions customer segmentation (not all customers are expansion-ready)"
      ]
    }
  },
  {
    id: "procurement",
    title: "Procurement and Vendor Consolidation",
    category: "margin",
    oneLiner: "Reduce cost of goods sold or vendor spend through consolidation, negotiation, and operational discipline.",
    whenToDeploy: [
      "High COGS or vendor spend (>30% of revenue)",
      "Redundant or fragmented supplier base",
      "Lack of spend visibility or centralized purchasing",
      "Supplier relationships inherited from founder era (not optimized)"
    ],
    typicalImpact: {
      revenue: "None (cost lever, not revenue)",
      ebitdaMargin: "5-15% cost reduction on spend category (200-1000 bps margin impact)",
      timeline: "3-6 months (spend analysis, RFP, contract negotiation)"
    },
    businessTypeFit: {
      services: "Good if labor outsourced; limited if pure professional services.",
      manufacturing: "Excellent. COGS is largest line item.",
      saas: "Limited unless infrastructure costs are high.",
      distribution: "Excellent. COGS is 80-90% of revenue."
    },
    redFlags: [
      "Single vendor (consolidation increases risk)",
      "Supplier relationship carries embedded value (switching cost very high)",
      "Quality variability risk (price is lowest but quality suffers)",
      "Long-term contracts locked in (limited flexibility for 3-5 years)",
      "Volume too small to attract better vendors"
    ],
    companyExamples: [
      {
        companyId: "coastal",
        label: "Coastal Fresh Foods",
        narrative: "Food distributor. COGS is 88% of revenue. Supplier base: 15+ regional vendors + 3 national suppliers. Opportunity: consolidate to 2-3 national suppliers; leverage parent company volume.",
        currentMetrics: {
          revenue: "$48.2M",
          cogs: "$42.4M",
          cogsPct: "88%"
        },
        opportunity: "Negotiate 3-5% cost reduction on COGS = $1.3-2.1M EBITDA. Cost: 50-100 hours procurement work."
      },
      {
        companyId: "meridian",
        label: "Meridian Fulfillment Co.",
        narrative: "3PL. Largest cost is labor (warehouse ops, sorting, packing), followed by transportation and facilities. Opportunity: automation for picking/sorting + 3PL network consolidation.",
        currentMetrics: {
          revenue: "$29.5M",
          laborCost: "$7.4M",
          laborPct: "25%"
        },
        opportunity: "Automate 20% of manual labor + consolidate carrier network = $1.5-2M cost savings"
      }
    ],
    exercise: {
      type: "procurement-plan",
      prompt: "You acquire a $50M manufacturing company with 35% COGS, 20% operating expenses, 45% EBITDA margin. Benchmarking shows competitors at 30% COGS. Lay out a 6-month procurement optimization plan. What are your quick wins? What's the incremental EBITDA?",
      acceptanceCriteria: [
        "Identifies spend analysis and vendor audit as first step",
        "Notes volume aggregation opportunity with other portfolio companies",
        "Calculates 5% COGS reduction = $2.5M incremental EBITDA",
        "Mentions implementation cost and timeline"
      ]
    }
  },
  {
    id: "labor-optimization",
    title: "Labor Optimization",
    category: "margin",
    oneLiner: "Reduce labor cost through process re-engineering, automation, and organizational redesign.",
    whenToDeploy: [
      "High labor cost as % of revenue (>35% for non-professional services)",
      "Manual back-office processes (AP, HR, payroll, data entry)",
      "Low utilization in service business (billable hours <60%)",
      "Organizational redundancy (duplicate roles across locations)"
    ],
    typicalImpact: {
      revenue: "None (cost lever)",
      ebitdaMargin: "10-25% labor cost reduction (200-500 bps margin)",
      timeline: "6-12 months (time-and-motion study, process mapping, implementation)"
    },
    businessTypeFit: {
      services: "Excellent. Labor is 40-60% of cost.",
      manufacturing: "Good. Labor optimization opportunity via automation.",
      saas: "Limited unless significant outsourced labor.",
      distribution: "Good. Warehouse labor optimization."
    },
    redFlags: [
      "High employee morale (too aggressive cuts damage culture)",
      "Talent shortage in market (labor optimization leads to turnover)",
      "Change management capability weak (reorg stalls)",
      "Automation fantasy (assuming automation takes out 50% of labor without phased implementation)",
      "Manual tasks are contextual/exception-driven (hard to automate)"
    ],
    companyExamples: [
      {
        companyId: "brightsmile",
        label: "BrightSmile Dental Partners",
        narrative: "Dental roll-up. Labor is 50% of revenue (clinicians, hygienists, front office). Opportunity: standardize scheduling, shared administrative services (insurance, billing), shared lab capacity across locations.",
        currentMetrics: {
          revenue: "$9.8M",
          laborCost: "$4.9M",
          laborPct: "50%"
        },
        opportunity: "Consolidate admin and back-office across 8 locations = $400-600K labor savings (shared CFO, shared HR, centralized billing)"
      },
      {
        companyId: "meridian",
        label: "Meridian Fulfillment Co.",
        narrative: "3PL fulfillment. Labor-intensive. Current process: manual sorting, hand-picked orders, spreadsheet-based inventory. Opportunity: implement WMS (warehouse management system), automate high-volume SKUs.",
        currentMetrics: {
          revenue: "$29.5M",
          laborCost: "$7.4M",
          laborPct: "25%"
        },
        opportunity: "WMS implementation + picking automation = 15-20% labor cost reduction = $1.1-1.5M EBITDA. Cost: $150-250K for WMS + integration."
      }
    ],
    exercise: {
      type: "labor-strategy",
      prompt: "A services company has 80 employees, 35% labor cost, 18% EBITDA margin. Founder says 'our people are our competitive advantage; we can't cut.' How would you approach labor optimization here?",
      acceptanceCriteria: [
        "Focuses on utilization and leverage, not headcount cuts",
        "Identifies admin/back-office consolidation vs. billable talent",
        "Proposes leveraging new hires into specialist roles (not generalists)",
        "Mentions risk of talent loss and mitigation"
      ]
    }
  },
  {
    id: "automation",
    title: "Process Automation and Technology",
    category: "margin",
    oneLiner: "Improve operational efficiency through systems implementation, automation, and digitization of manual workflows.",
    whenToDeploy: [
      "Multiple locations with no centralized systems",
      "Legacy systems or spreadsheet-based operations",
      "Manual workflows with no real-time visibility",
      "High transaction volume with low automation",
      "Change management capability exists in organization"
    ],
    typicalImpact: {
      revenue: "1-3% uplift from improved service, working capital release",
      ebitdaMargin: "15-30% operational efficiency improvement (300-700 bps)",
      timeline: "12-24 months (especially for ERP implementation)"
    },
    businessTypeFit: {
      services: "Good. Back-office efficiency; time tracking; resource allocation.",
      manufacturing: "Excellent. ERP, supply chain, inventory management.",
      saas: "Good. Infrastructure, monitoring, automation of customer operations.",
      distribution: "Excellent. WMS, inventory, logistics optimization."
    },
    redFlags: [
      "Scope creep (ERP starts as 'let's automate AP' and becomes 'let's rewrite entire business')",
      "Weak change management (poor adoption leads to wasted investment)",
      "Data migration failures (dirty data in old system breaks new system)",
      "Cost overruns (implementation budgets commonly 50-100% over initial estimate)",
      "Over-reliance on consultants (expensive, slow handoff)"
    ],
    companyExamples: [
      {
        companyId: "meridian",
        label: "Meridian Fulfillment Co.",
        narrative: "3PL with 5 facilities. No centralized WMS. Orders arrive via email/phone; warehouse staff use spreadsheets; no real-time inventory visibility. Opportunity: implement modern WMS.",
        currentMetrics: {
          revenue: "$29.5M",
          facilities: "5",
          systemsMaturity: "Low (spreadsheets)"
        },
        opportunity: "WMS implementation = 15% efficiency improvement + 20% inventory reduction = $1.5M EBITDA uplift. Cost: $200-300K + internal resources."
      },
      {
        companyId: "precision",
        label: "Precision CNC Solutions",
        narrative: "Manufacturing. Systems: legacy ERP (1990s software), manual job tracking, paper-based quality control. Opportunity: modernize ERP, implement IoT monitoring, real-time quality tracking.",
        currentMetrics: {
          revenue: "$12.8M",
          systemsAge: "20+ years"
        },
        opportunity: "ERP modernization + quality tracking = 10-15% efficiency improvement + 5% quality improvement = $300-500K EBITDA + reduced scrap."
      }
    ],
    exercise: {
      type: "systems-decision",
      prompt: "A $40M manufacturing company operates on a 1990s ERP system. Modernizing will cost $500K and take 18 months. What questions would you ask to decide if it's worth it? What's your decision framework?",
      acceptanceCriteria: [
        "Identifies current cost of legacy system (errors, workarounds, labor)",
        "Calculates payback period (efficiency gains vs. investment)",
        "Mentions change management and adoption risk",
        "Notes that modernization enables growth (scalability)"
      ]
    }
  },
  {
    id: "facility-optimization",
    title: "Facility and Asset Optimization",
    category: "margin",
    oneLiner: "Reduce real estate, facility, and asset costs through consolidation, improved utilization, and working capital optimization.",
    whenToDeploy: [
      "Multiple locations with low utilization or redundancy",
      "High inventory relative to industry standard",
      "Excess office or warehouse space",
      "Long-term real estate contracts with above-market rates"
    ],
    typicalImpact: {
      revenue: "Flat (cost lever) or slight uplift if capacity reduction improves customer service",
      ebitdaMargin: "10-30% real estate cost reduction + 15-35% inventory reduction (200-600 bps)",
      timeline: "6-18 months (especially for consolidation)"
    },
    businessTypeFit: {
      services: "Good if multi-location; limited if customer-facing (local presence needed).",
      manufacturing: "Excellent. Factory footprint optimization.",
      saas: "Limited (no physical footprint).",
      distribution: "Excellent. Warehouse consolidation."
    },
    redFlags: [
      "Employee impact high (local job losses damage morale)",
      "Customer proximity requirements (consolidation kills service model)",
      "Inventory reduction too aggressive (stockouts damage sales)",
      "Operating leases with long terms (exit costs high)"
    ],
    companyExamples: [
      {
        companyId: "meridian",
        label: "Meridian Fulfillment Co.",
        narrative: "3PL with 5 regional facilities. Some are under-utilized. Opportunity: consolidate to 3 hubs using network modeling software; reduce headcount by centralizing sort operations.",
        currentMetrics: {
          facilities: "5",
          avgUtilization: "65%",
          facilitySquareFeet: "150,000"
        },
        opportunity: "Consolidate to 3 hubs, improve utilization to 85% = $600K annual facility cost savings. Cost: $150K transition; risk of service disruption."
      },
      {
        companyId: "coastal",
        label: "Coastal Fresh Foods",
        narrative: "Food distributor with 3 distribution centers. DC1 is 40% utilized. Opportunity: consolidate DC1 into DC2 and DC3; renegotiate lease on DC1.",
        currentMetrics: {
          facilities: "3",
          dcUsage: "DC1: 40%, DC2: 90%, DC3: 85%"
        },
        opportunity: "Close DC1 = $200K annual real estate savings. Risk: customer service window impacts."
      }
    ],
    exercise: {
      type: "consolidation-analysis",
      prompt: "A company operates 4 distribution centers (150K total sqft). Utilization: 70%, 85%, 90%, 60% respectively. Current real estate cost: $1.5M annually. Consolidate to 2 centers or 3? What's your analysis?",
      acceptanceCriteria: [
        "Calculates utilization impact of consolidation",
        "Notes service level implications (delivery windows, customer proximity)",
        "Identifies transition costs (relocation, IT, staffing)",
        "Considers ongoing operational complexity"
      ]
    }
  },
  {
    id: "management-upgrades",
    title: "Management Team Upgrades",
    category: "organizational",
    oneLiner: "Hire or upgrade C-suite roles (CFO, COO, VP Sales, etc.) to close capability gaps and accelerate execution.",
    whenToDeploy: [
      "Capability gaps: no CFO, weak sales leader, no operations discipline",
      "Execution at scale requires professional management (founder-led ceiling reached)",
      "Add-on integration requires dedicated exec (COO or integration lead)",
      "Growth strategy requires specific expertise (VP Sales for SaaS GTM, VP Ops for manufacturing)"
    ],
    typicalImpact: {
      revenue: "Variable (good hire can drive 20-50% of total value creation)",
      ebitdaMargin: "Variable (improves execution across all levers)",
      timeline: "2-4 months to hire; 3-6 months to ramp and show impact"
    },
    businessTypeFit: {
      services: "Excellent. CFO, COO, VP Sales upgrade high-ROI.",
      manufacturing: "Excellent. VP Ops, supply chain leader critical.",
      saas: "Excellent. VP Sales, VP Product essential.",
      distribution: "Good. VP Ops, VP Procurement upgrade."
    },
    redFlags: [
      "Cultural mismatch (hire is strong but doesn't fit founder-led culture)",
      "Weak authority granted (hire reports to founder without real decision-making power)",
      "Poor onboarding (hire dropped in without support, left confused)",
      "Founder doesn't truly want to scale (hire threatens founder autonomy)",
      "Turnover of hired talent (revolving door of execs)"
    ],
    companyExamples: [
      {
        companyId: "summit",
        label: "Summit Mechanical Services",
        narrative: "HVAC founder/operator. Has grown to $32.5M but lacks financial controls. Opportunity: hire CFO to build finance function, standardized reporting, cash forecasting.",
        currentMetrics: {
          revenue: "$32.5M",
          founder_rule: "Yes"
        },
        opportunity: "CFO hire ($200-250K cost + 6% of exit value as equity sweetener) can unlock 5-10% EBITDA through cost control and working capital management."
      },
      {
        companyId: "brightsmile",
        label: "BrightSmile Dental Partners",
        narrative: "Dental roll-up at 8 locations. Needs COO to standardize operations, integrate new locations, and build systems. Founder/Dentist can't scale beyond clinical leadership.",
        currentMetrics: {
          revenue: "$9.8M",
          locations: "8",
          operationalMaturity: "Low"
        },
        opportunity: "COO hire ($250-300K) can improve unit economics by 200-300 bps through standardization and integration playbook."
      }
    ],
    exercise: {
      type: "hiring-strategy",
      prompt: "A $50M manufacturing company has strong founder/CEO but no VP Ops or supply chain leader. You want to pursue procurement optimization and facility consolidation. Do you hire before or after deal close? What role? What spec?",
      acceptanceCriteria: [
        "Recognizes that execution requires dedicated leader",
        "Recommends hiring in first 90 days post-close",
        "Specifies VP Ops or VP Supply Chain (not generic COO)",
        "Notes founder needs to delegate authority"
      ]
    }
  },
  {
    id: "incentive-alignment",
    title: "Incentive Alignment and KPI Discipline",
    category: "organizational",
    oneLiner: "Redesign compensation and establish clear KPIs to align management behavior to value creation priorities.",
    whenToDeploy: [
      "Compensation not linked to value drivers (e.g., sales incentive is 'close deals' not 'profitable deals')",
      "No KPI visibility or discipline (no shared metrics, no cadence)",
      "Organizational silos (Finance, Operations, HR don't share goals)",
      "Founder-led compensation is ad-hoc or political"
    ],
    typicalImpact: {
      revenue: "2-5% uplift from behavior alignment",
      ebitdaMargin: "100-200 bps (via profitability focus)",
      timeline: "1-3 months to design; 6 months to stabilize"
    },
    businessTypeFit: {
      services: "Excellent. Compensation drives sales and margin behavior.",
      manufacturing: "Good. Production efficiency and quality metrics important.",
      saas: "Excellent. Compensation should drive retention, not just new ARR.",
      distribution: "Good. Cost discipline and service level balance."
    },
    redFlags: [
      "Too many KPIs (>5 per role means none are real priorities)",
      "Gaming metrics (people optimizing for metric, not outcome)",
      "Data quality poor (metrics are estimated, not measured)",
      "Weak governance (no monthly review, no accountability)",
      "Comp budget explodes (incentives not capped, unsustainable)"
    ],
    companyExamples: [
      {
        companyId: "apex",
        label: "Apex Last-Mile Logistics",
        narrative: "Sales comp is 100% commission on revenue. Result: salespeople chase high-volume but low-margin accounts. Opportunity: redesign to 60% revenue + 40% profitability/quality (customer NPS, on-time %)",
        currentMetrics: {
          revenue: "$38.5M",
          ebitdaMargin: "11%"
        },
        opportunity: "Comp redesign shifts sales focus from volume to profitability = 200-300 bps EBITDA margin improvement."
      },
      {
        companyId: "truenorth",
        label: "TrueNorth Analytics",
        narrative: "Sales comp incentivizes new logo acquisition; customer success has no expansion incentive. Result: low net revenue retention (105%), high churn. Opportunity: redesign comp to incentivize retention and expansion.",
        currentMetrics: {
          arpu: "$45K",
          nrr: "105%"
        },
        opportunity: "Align CS and Sales comp to NRR; move target to 115% NRR = $2M additional ARR over 2 years."
      }
    ],
    exercise: {
      type: "compensation-design",
      prompt: "Design sales compensation for a $30M SaaS company. Target is 15% revenue growth + 3% price increase + 110% NRR. Sales team is 12 people (5 enterprise, 7 SMB). How would you structure comp?",
      acceptanceCriteria: [
        "Separates new logo, expansion, and retention into distinct comp lines",
        "Balances upside potential (people are motivated) with downside cap",
        "Includes team-based component for collaboration",
        "Specifies metrics and frequency of payout"
      ]
    }
  },
  {
    id: "financial-controls",
    title: "Reporting and Financial Controls",
    category: "organizational",
    oneLiner: "Build standardized financial reporting, audit controls, and visibility into business operations.",
    whenToDeploy: [
      "No standardized reporting (founder-led, no CFO)",
      "No internal controls on spend (founder approves everything)",
      "Cash position unclear (no forecast, no working capital discipline)",
      "Exit approaching (need clean audits, control environment)"
    ],
    typicalImpact: {
      revenue: "None (hygiene lever, not growth)",
      ebitdaMargin: "1-2% uplift from working capital optimization and cost visibility",
      timeline: "2-4 months to establish baseline; 6 months to mature"
    },
    businessTypeFit: {
      services: "Important. Working capital and cash conversion critical.",
      manufacturing: "Important. Inventory control and variance tracking.",
      saas: "Important. Unit economics and CAC/LTV tracking.",
      distribution: "Critical. Inventory and payables management."
    },
    redFlags: [
      "Reporting delays (monthly close takes 2+ weeks)",
      "No variance analysis (actuals vs. forecast never reconciled)",
      "Data integrity issues (numbers change month-to-month for unexplained reasons)",
      "No follow-up on items (controls exist but nobody owns enforcement)",
      "Burden too high (reporting becomes compliance exercise, not strategic tool)"
    ],
    companyExamples: [
      {
        companyId: "summit",
        label: "Summit Mechanical Services",
        narrative: "Founder runs business on gut feel; tax accountant does year-end close. No monthly P&L, no cash forecast, no job costing. Opportunity: monthly close, variance analysis, job profitability tracking.",
        currentMetrics: {
          revenue: "$32.5M",
          reportingCadence: "Annually"
        },
        opportunity: "Establish monthly close + job costing = visibility into which job types are profitable, which customers are loss-leaders = 2-3% margin improvement via mix shift."
      },
      {
        companyId: "meridian",
        label: "Meridian Fulfillment Co.",
        narrative: "No inventory control system. Inventory is estimated; shrinkage unknown. Cash position unclear. Opportunity: implement monthly inventory close, working capital KPI (days payable, days inventory).",
        currentMetrics: {
          revenue: "$29.5M",
          inventoryControl: "None"
        },
        opportunity: "Reduce inventory by 15% through visibility + working capital release of $500K."
      }
    ],
    exercise: {
      type: "controls-design",
      prompt: "You acquire a $50M company with no monthly close, no budget, no variance analysis. Budget to build: $0-50K per year (not overspend). Design a 12-month controls build program. What's in Month 1? What's in Month 12?",
      acceptanceCriteria: [
        "Month 1: establish baseline, monthly close process, chart of accounts",
        "Month 3: variance analysis and KPI dashboard",
        "Month 6: departmental budgeting, cost center accountability",
        "Month 12: rolling forecast, working capital KPI, cash management"
      ]
    }
  },
  {
    id: "ai-software",
    title: "AI and Software Development",
    category: "technology",
    oneLiner: "Identify and build custom AI systems and software that create competitive advantage and operational leverage.",
    whenToDeploy: [
      "Software creates competitive advantage in your vertical (not commoditized)",
      "Build cost now affordable ($50-200K with AI-assisted development)",
      "Problem is repetitive and data-driven (ideal for AI/automation)",
      "Adoption risk manageable (customer-facing or internal tool, not entire business model)"
    ],
    typicalImpact: {
      revenue: "2-5% from pricing/product, 5-10% from cross-sell (new feature)",
      ebitdaMargin: "15-30% productivity uplift in specific function (100-300 bps)",
      timeline: "8-12 weeks to MVP; 6 months to mature; continuous innovation"
    },
    businessTypeFit: {
      services: "Excellent. Pricing engine, sales automation, customer engagement.",
      manufacturing: "Excellent. Supply chain forecasting, inventory optimization.",
      saas: "Excellent. AI-powered feature set; retention tools.",
      distribution: "Good. Route optimization, demand forecasting, inventory."
    },
    redFlags: [
      "Adoption weak (build cool software that nobody uses)",
      "Vertical too niche (addressable market too small to justify investment)",
      "Code quality poor (AI-generated code with technical debt)",
      "Build cost balloon (scope creep makes 'small project' into 6-month effort)",
      "Build time too long (market changes; software becomes irrelevant)"
    ],
    companyExamples: [
      {
        companyId: "brightsmile",
        label: "BrightSmile Dental Partners",
        narrative: "Platform needs patient engagement and scheduling optimization. Opportunity: build AI-powered patient communication system and smart scheduling (balances hygienist/dentist capacity, patient preferences, location traffic).",
        currentMetrics: {
          revenue: "$9.8M",
          locations: "8"
        },
        opportunity: "AI scheduling system: $75K build cost, 10% improvement in utilization = $100K annual EBITDA. Payback: 9 months."
      },
      {
        companyId: "meridian",
        label: "Meridian Fulfillment Co.",
        narrative: "3PL needs demand forecasting and inventory optimization. Opportunity: build AI model that predicts order patterns and suggests rebalancing across 5 facilities (prevents stockouts, reduces inventory holding).",
        currentMetrics: {
          revenue: "$29.5M",
          facilities: "5"
        },
        opportunity: "AI forecasting system: $100K build cost, 15% inventory reduction + 5% service improvement = $400K EBITDA uplift. Payback: 3 months."
      }
    ],
    exercise: {
      type: "software-decision",
      prompt: "A $50M services firm wants to build an AI pricing engine that adjusts pricing by customer segment and contract type. Build cost: $120K, estimated ROI: $500K annual EBITDA uplift. What diligence would you do? Go/no-go?",
      acceptanceCriteria: [
        "Identifies business case validation (pricing analysis, customer response risk)",
        "Notes adoption/change management cost (training, support)",
        "Considers technical risk (data quality, model accuracy)",
        "Calculates payback period (12 months is acceptable for this project)",
        "Specifies decision gate (pilot vs. full rollout)"
      ]
    }
  }
];
```

### UI/UX

**Entry point:** New tab in Learn module nav: "Practice" | "Learn" | **"Levers"**

**List view (`/learn/levers`):** Grid of 12 lever tiles, organized by category (revenue, margin, organizational, technology). Each tile shows:
- Lever title + icon (color-coded by category)
- One-liner definition
- "Typical Impact" preview (e.g., "+300-700 bps margin")

**Lever detail view (`/learn/levers/:leverId`):**

```
+-------------------------------------------+
| Pricing Optimization                 1/12 |
| Increase price or improve price...        |
+-------------------------------------------+
|                                          |
| WHEN TO DEPLOY                           |
| * Services business with...              |
| * Market where transparency...           |
|                                          |
| TYPICAL IMPACT                           |
| Revenue uplift: 10-20%                   |
| EBITDA margin: +300-700 bps              |
| Timeline: 6-12 months                    |
|                                          |
| BUSINESS TYPE FIT                        |
| Services: Ideal                          |
| Manufacturing: Good                      |
| SaaS: Good                               |
| Distribution: Difficult                  |
|                                          |
| RED FLAGS                                |
| * Market is commoditized                 |
| * Pricing is published/transparent       |
|                                          |
+-------------------------------------------+
| APPLIED EXAMPLES                         |
|                                          |
| Summit Mechanical Services               |
| HVAC services, regional pricing power    |
| Opportunity: raise 5-8% on renewals      |
| Current margin: 18.5% -> Potential: 20%+ |
| [See Company ->]                         |
|                                          |
| TrueNorth Analytics                      |
| SaaS with tiered pricing                 |
| Opportunity: tier expansion pricing      |
| Current ARPU: $45K -> Potential: $50K+   |
| [See Company ->]                         |
|                                          |
+-------------------------------------------+
| EXERCISE                                 |
| You're buying a professional services    |
| firm with $30M revenue at 12% EBITDA...  |
| [Try This Exercise ->]                   |
+-------------------------------------------+
| [< Prev Lever]         [Next Lever >]    |
+-------------------------------------------+
```

**Exercise interaction:**
- User types response (min 50 chars, commit-first)
- After reveal: see acceptance criteria checklist
- Check off items as user reviews their answer
- Self-score from 1-5

**Persistence:**
```javascript
// localStorage key: forge-levers
{
  levers: {
    "pricing-optimization": {
      notes: "Applied to Summit... key is regional pricing power...",
      exerciseAttempted: true,
      exerciseScore: 4,
      lastStudied: "2026-04-05T10:30:00Z"
    }
  }
}
```

### Routing

- `/learn/levers` ... lever list/grid
- `/learn/levers/:leverId` ... single lever detail

---

## Feature 2: Value Creation Bridge (Interactive Waterfall Calculator)

### What It Is

An interactive visualization of how PE returns decompose into four drivers: EBITDA growth, multiple expansion, debt paydown, and entry equity. Users can adjust sliders for each lever and watch how total MOIC changes in real-time. Includes pre-built scenarios based on Forge's 9 companies.

### Data Architecture

```javascript
// app/src/data/valueBridge.js

export const bridgeScenarios = [
  {
    id: "alphaco-baseline",
    label: "AlphaCo Platform (Baseline)",
    description: "Conservative platform acquisition: modest revenue growth, margin flat, moderate multiple expansion, deleveraging.",
    companies: ["summit", "precision"], // companies this scenario is based on

    // Entry values
    entry: {
      revenue: 50,      // $M
      ebitda: 10,       // $M
      ebitdaMargin: 20, // %
      multiple: 6.0,    // EV/EBITDA
      enterpriseValue: 60,
      netDebt: 30,
      equity: 30
    },

    // Exit values (Year 5 default)
    exit: {
      revenue: 80,      // +60%
      ebitda: 16,       // +60%
      ebitdaMargin: 20, // flat
      multiple: 8.0,    // +2.0x expansion
      enterpriseValue: 128,
      netDebt: 10,      // paid down $20M
      equity: 118
    },

    // Decomposition (calculated)
    bridge: {
      entryEquity: 30,
      ebitdaGrowth: 36,      // (16-10) * 6.0 = 36
      multipleExpansion: 32, // (8.0-6.0) * 16 = 32
      debtPaydown: 20,       // 30-10 = 20
      exitEquity: 118,
      moic: 3.93             // 118/30
    },

    // For slider adjustment
    assumptions: {
      revenueCAGR: 9.8,      // 5-year CAGR
      marginExpansion: 0,    // bps change
      multipleExpansion: 2.0,
      debtPaydown: 20,
      holdPeriod: 5
    }
  },

  {
    id: "brightsmile-rollup",
    label: "BrightSmile Roll-up (Growth-Heavy)",
    description: "Platform acquisition with aggressive add-on strategy: 25% revenue CAGR, 200bp margin expansion, 1.5x multiple expansion.",
    companies: ["brightsmile"],

    entry: {
      revenue: 9.8,
      ebitda: 1.96,
      ebitdaMargin: 20,
      multiple: 6.0,
      enterpriseValue: 11.76,
      netDebt: 4,
      equity: 7.76
    },

    exit: {
      revenue: 39.2,     // +300% (4x at 25% CAGR over 5 years)
      ebitda: 8.82,      // +350%
      ebitdaMargin: 22.5, // +250bp
      multiple: 7.5,     // +1.5x expansion
      enterpriseValue: 66.15,
      netDebt: 2,        // deleveraged
      equity: 64.15
    },

    bridge: {
      entryEquity: 7.76,
      ebitdaGrowth: 47.16,      // (8.82-1.96) * 6.0
      multipleExpansion: 13.23, // 1.5 * 8.82
      debtPaydown: 2,
      exitEquity: 70.15,
      moic: 9.03
    },

    assumptions: {
      revenueCAGR: 25,
      marginExpansion: 250,
      multipleExpansion: 1.5,
      debtPaydown: 2,
      holdPeriod: 5
    }
  },

  // 5 more scenarios for Coastal, TrueNorth, Apex, Meridian, Ironclad
  // (same structure, different numbers)
];

export const calculateBridge = (entry, exit, assumptions) => {
  // Given entry/exit values, calculate bridge decomposition
  const ebitdaDelta = exit.ebitda - entry.ebitda;
  const ebitdaGrowth = ebitdaDelta * entry.multiple;

  const multipleExpansion = (exit.multiple - entry.multiple) * exit.ebitda;

  const debtPaydown = entry.netDebt - exit.netDebt;

  const entryEquity = entry.enterpriseValue - entry.netDebt;
  const exitEquity = exit.enterpriseValue - exit.netDebt;

  const moic = exitEquity / entryEquity;

  return {
    entryEquity,
    ebitdaGrowth,
    multipleExpansion,
    debtPaydown,
    exitEquity,
    moic,
    attributionPcts: {
      ebitdaGrowth: ebitdaGrowth / (exitEquity - entryEquity),
      multipleExpansion: multipleExpansion / (exitEquity - entryEquity),
      debtPaydown: debtPaydown / (exitEquity - entryEquity)
    }
  };
};
```

### UI/UX

**Entry point:** New tab in Learn nav: "Practice" | "Learn" | "Levers" | **"Bridge"**

**Scenario list view (`/learn/bridge`):**
- 7 pre-built scenarios as cards
- Each shows: scenario name, companies involved, summary metrics (entry revenue, entry MOIC target)
- Users click to open interactive bridge

**Bridge calculator view (`/learn/bridge/:scenarioId`):**

```
+----------------------------------------------+
| AlphaCo Platform (Baseline)                  |
| Conservative acquisition: 3.93x MOIC target  |
+----------------------------------------------+
|                                              |
| ENTRY METRICS (Year 0)                       |
| Revenue: $50M    EBITDA: $10M (20%)          |
| Multiple: 6.0x   Enterprise Value: $60M      |
| Net Debt: $30M   Entry Equity: $30M          |
|                                              |
+----------------------------------------------+
| EXIT ASSUMPTIONS (Year 5) - Adjust Sliders   |
|                                              |
| Revenue Growth CAGR                          |
| [====o-----] 9.8% (Change to: ___%)          |
| Target: $80M revenue                         |
|                                              |
| EBITDA Margin Expansion                      |
| [-----o----] 0 bps (Change to: ___ bps)      |
| Baseline: 20% margin                         |
|                                              |
| Multiple Expansion                           |
| [===o------] +2.0x (6.0x -> 8.0x)            |
| (Change to: ___._ x)                         |
|                                              |
| Debt Paydown                                 |
| [====o-----] $20M (30M -> 10M)               |
| (Change to: $___M)                           |
|                                              |
+----------------------------------------------+
| REAL-TIME WATERFALL CHART                    |
|                                              |
|         $30M                                 |
|         |                                    |
|         +-- Entry Equity: $30M               |
|         |                                    |
|         +-- EBITDA Growth: +$36M             |
|         |                                    |
|         +-- Multiple Expansion: +$32M        |
|         |                                    |
|         +-- Debt Paydown: +$20M              |
|         |                                    |
|         = Exit Equity: $118M                 |
|                                              |
| MOIC: 3.93x    IRR (5-year): 32%             |
|                                              |
+----------------------------------------------+
| RETURN ATTRIBUTION                           |
|                                              |
| EBITDA Growth:       $36M (30.5%)            |
| Multiple Expansion:  $32M (27.1%)            |
| Debt Paydown:        $20M (16.9%)            |
| Entry Equity:        $30M (25.4%)            |
|                                              |
+----------------------------------------------+
| SENSITIVITY ANALYSIS                         |
|                                              |
| What if revenue grows only 5% CAGR?          |
| -> Exit EBITDA: $14M (vs $16M)               |
| -> Exit Equity: $100M (vs $118M)             |
| -> MOIC: 3.33x (vs 3.93x)                    |
|                                              |
| What if multiple contracts to 7.5x?          |
| -> Exit Equity: $100M (vs $118M)             |
| -> MOIC: 3.33x (vs 3.93x)                    |
|                                              |
+----------------------------------------------+
| EXERCISE                                     |
|                                              |
| Challenge: Adjust sliders to hit 4.5x MOIC   |
| (Clue: You can trade one lever for another)  |
|                                              |
| [Check Your Answer]                          |
|                                              |
+----------------------------------------------+
| [< Prev Scenario]      [Next Scenario >]     |
+----------------------------------------------+
```

**Slider behavior:**
- Real-time recalculation as user adjusts
- Waterfall chart updates immediately
- MOIC, IRR, and attribution percentages recalculate
- Sensitivity analysis shows impact of small changes

**Persistence:**
```javascript
// localStorage key: forge-bridge
{
  scenarios: {
    "alphaco-baseline": {
      customAssumptions: {
        revenueCAGR: 12, // user modified from 9.8%
        marginExpansion: 100,
        multipleExpansion: 2.0,
        debtPaydown: 20
      },
      exerciseAttempted: true,
      exerciseScore: 5,
      lastVisited: "2026-04-06T14:00:00Z"
    }
  }
}
```

### Exercise Types

1. **Forward bridge:** "Hit 4.5x MOIC; adjust sliders as needed."
2. **Reverse bridge:** "Your entry is $30M. You need 3.0x MOIC. Revenue grows at 15% CAGR. What must margin expand to?"
3. **Sensitivity:** "If revenue misses 25% (grows 5% instead of 20%), can you still hit 3.0x?"
4. **Attribution:** "In this bridge, which lever contributes the most to MOIC? Why?"

### Routing

- `/learn/bridge` ... scenario list
- `/learn/bridge/:scenarioId` ... interactive calculator

---

## Feature 3: Operating Playbooks / 100-Day Plans

### What It Is

An interactive framework that teaches sequencing of operational initiatives across a 36-month hold period. Users learn the "Golden Year" concept (50-80% of value creation front-loaded to Year 1) and can build or customize a 100-day plan for a given company.

### Data Architecture

```javascript
// app/src/data/playbooks.js

export const playbooks = [
  {
    id: "summit-hvac-playbook",
    company: "summit",
    title: "Summit Mechanical Services: 36-Month Value Creation Playbook",
    description: "HVAC platform with founder-led operations. Playbook prioritizes: (1) pricing optimization, (2) sales effectiveness, (3) management upgrade, (4) add-on integration.",

    timeline: {
      "months-1-6": {
        name: "Foundation & Quick Wins",
        focus: "Visibility + Revenue & Margin Levers",
        objectiveStatement: "Establish financial controls, implement pricing increase, begin sales process redesign, identify add-on targets.",
        initiatives: [
          {
            id: "initiative-001",
            name: "Financial Reporting & Controls",
            lever: "financial-controls",
            description: "Build monthly close process, establish KPI dashboard (revenue, gross margin, operating expenses by function).",
            owner: "CFO (hire)",
            timeline: "Months 1-2",
            startCondition: "Deal close",
            resources: "$50K (internal setup) + $30K/year consulting",
            successMetrics: ["Monthly close within 5 business days", "Dashboard updated weekly", "Variance analysis complete"],
            dependencies: []
          },
          {
            id: "initiative-002",
            name: "Pricing Optimization",
            lever: "pricing-optimization",
            description: "Benchmark HVAC pricing vs competitors; identify price increase opportunities by customer segment and service type.",
            owner: "VP Sales",
            timeline: "Months 2-4",
            startCondition: "Weeks 1-2 of ownership",
            resources: "$15K consulting",
            successMetrics: ["Pricing study complete", "Price increase plan documented", "Rollout schedule set"],
            dependencies: ["initiative-001"]
          },
          {
            id: "initiative-003",
            name: "Sales Process Redesign",
            lever: "sales-effectiveness",
            description: "Document current sales process; implement CRM (Pipedrive or similar); design comp structure aligned to profitability.",
            owner: "VP Sales",
            timeline: "Months 2-6",
            startCondition: "Weeks 1-2",
            resources: "$25K CRM setup + $5K/year license + 100 hours internal",
            successMetrics: ["CRM live with 6 months pipeline", "Comp plan redesigned", "Sales playbook documented"],
            dependencies: []
          },
          {
            id: "initiative-004",
            name: "CFO + VP Sales Recruitment",
            lever: "management-upgrades",
            description: "Recruit CFO (full-time, board seat, equity) and strengthen VP Sales role (hire if needed or develop internal).",
            owner: "PE partner",
            timeline: "Months 1-3",
            startCondition: "Deal close",
            resources: "Recruiting fees: $50K",
            successMetrics: ["CFO offer accepted", "VP Sales confirmed or plan to hire", "Equity structures agreed"],
            dependencies: []
          },
          {
            id: "initiative-005",
            name: "Procurement Audit & Vendor Consolidation",
            lever: "procurement",
            description: "Analyze HVAC equipment and supply spending; consolidate vendors; renegotiate contracts.",
            owner: "CFO / Operations",
            timeline: "Months 3-6",
            startCondition: "Month 2",
            resources: "50 hours internal + $10K consulting",
            successMetrics: ["Spend analysis complete", "Top 5 vendors identified", "RFP issued", "Contracts renegotiated"],
            dependencies: ["initiative-001"]
          }
        ],
        expectedValueCreation: {
          revenue: "+5% ($1.6M) from pricing, modest volume growth",
          ebitdaMargin: "+200-300 bps from pricing + procurement",
          ebitdaDollars: "$0.9M"
        }
      },

      "months-7-18": {
        name: "Optimize & Scale",
        focus: "Growth Platforms + Operational Efficiency",
        objectiveStatement: "Roll out sales playbook + CRM across team; close first add-on; automate back-office; establish leading indicators.",
        initiatives: [
          {
            id: "initiative-006",
            name: "First Add-On Acquisition & Integration",
            lever: "sales-effectiveness",
            description: "Source, negotiate, and integrate first HVAC acquisition (competitor or adjacent services). Establish integration playbook for efficiency gains.",
            owner: "CEO + M&A partner",
            timeline: "Months 7-14",
            startCondition: "Month 6 planning complete",
            resources: "$250K advisory; 300 hours internal",
            successMetrics: ["Add-on LOI signed", "Systems integrated", "$1-2M revenue added", "Synergies quantified"],
            dependencies: ["initiative-001", "initiative-004"]
          },
          {
            id: "initiative-007",
            name: "Technology & Process Automation",
            lever: "automation",
            description: "Implement job costing system; automate scheduling and dispatching; improve asset utilization.",
            owner: "VP Operations (new role)",
            timeline: "Months 8-14",
            startCondition: "Month 6",
            resources: "$100K software + $50K integration",
            successMetrics: ["Job costing live", "Dispatching efficiency +15%", "Asset utilization improved"],
            dependencies: ["initiative-001"]
          },
          {
            id: "initiative-008",
            name: "Labor Optimization & Team Development",
            lever: "labor-optimization",
            description: "Standardize field technician training; improve technician utilization; develop internal management bench.",
            owner: "VP Operations",
            timeline: "Months 9-18",
            startCondition: "Month 8",
            resources: "$75K for training program",
            successMetrics: ["Technician utilization improved 10%", "Field margins improved", "Succession plan for key roles"],
            dependencies: ["initiative-001", "initiative-004"]
          }
        ],
        expectedValueCreation: {
          revenue: "+25% ($8M total, incl. add-on) from growth + add-on integration",
          ebitdaMargin: "+100-200 bps from operational leverage",
          ebitdaDollars: "$2.5M"
        }
      },

      "months-19-36": {
        name: "Scale & Exit Prep",
        focus: "Multiple Add-Ons + Platform Maturity",
        objectiveStatement: "Close 2nd/3rd add-ons; build repeatable integration playbook; achieve exit-ready ops and financials.",
        initiatives: [
          {
            id: "initiative-009",
            name: "Multiple Add-On Acquisitions",
            lever: "sales-effectiveness",
            description: "Close 2-3 additional bolt-on acquisitions; refine integration playbook based on first deal; achieve platform scale.",
            owner: "CEO + M&A partner",
            timeline: "Months 19-36",
            startCondition: "First add-on successful",
            resources: "$100-150K advisory per deal",
            successMetrics: ["2-3 add-ons closed", "Playbook repeatable", "Revenue $50-60M", "Platform recognized"],
            dependencies: ["initiative-006"]
          },
          {
            id: "initiative-010",
            name: "Channel Expansion & Geographic Growth",
            lever: "channel-expansion",
            description: "Expand to adjacent geographies or service lines (plumbing, electrical); develop channel partnerships.",
            owner: "VP Sales",
            timeline: "Months 24-36",
            startCondition: "Month 18 platform stability",
            resources: "$50K for market research + expansion",
            successMetrics: ["2nd geography identified", "Expansion revenue flowing"],
            dependencies: ["initiative-003"]
          }
        ],
        expectedValueCreation: {
          revenue: "+40-50% total (add-ons + organic) reaching $55-65M",
          ebitdaMargin: "+50-100 bps from platform maturity",
          ebitdaDollars: "$5-6M"
        }
      }
    },

    goldenYearAnalysis: {
      year1_ebitda: "$0.9M (cumulative from months 1-6 + ramp)",
      year1_vs_plan: "72% of 3-year EBITDA uplift = strong Golden Year",
      assessment: "Plan is realistic: quick wins (pricing, controls) front-loaded; management in place by month 3; add-on pipeline being built in parallel."
    }
  },

  // 8 more playbooks for other companies
  // (Coastal, Precision, BrightSmile, Apex, TrueNorth, Ironclad, Vitality, Meridian)
];

export const initiativeTemplates = {
  "100-day-plan": {
    description: "First 100 days post-close. Focus: quick wins + foundation-setting.",
    structure: [
      { week: "1-2", focus: "Financial controls & data gathering", sample: "Hire CFO, establish close calendar, benchmark KPIs" },
      { week: "3-4", focus: "Pricing & cost opportunity validation", sample: "Pricing study launch, vendor audit start" },
      { week: "5-8", focus: "Process documentation & quick wins", sample: "Sales playbook, comp redesign, first price increase" },
      { week: "9-14", focus: "Systems implementation & hiring", sample: "CRM go-live, VP Sales offer, procurement RFPs" }
    ]
  }
};
```

### UI/UX

**Entry point:** New tab in Learn nav: "Practice" | "Learn" | "Levers" | "Bridge" | **"Playbooks"**

**Playbook list view (`/learn/playbooks`):**
- 9 company playbooks as cards
- Each shows: company, industry, entry revenue, planned exit revenue (3-5 year target), value creation target (e.g., "$0.9M to $5M EBITDA")
- Users click to open interactive playbook

**Playbook detail view (`/learn/playbooks/:playbookId`):**

```
+------------------------------------------+
| Summit Mechanical Services                |
| 36-Month Value Creation Playbook          |
+------------------------------------------+
|                                          |
| OVERVIEW                                 |
| Entry: $32.5M revenue, 18.5% margin      |
| Target: $60M+ revenue, 22%+ margin       |
| Playbook: Pricing + Growth + M&A         |
|                                          |
| MONTHS 1-6: FOUNDATION & QUICK WINS      |
| Expected EBITDA: +$0.9M                  |
|                                          |
| [Initiative Card]                        |
| Financial Reporting & Controls           |
| Owner: CFO (hire)                        |
| Timeline: Months 1-2                     |
| Resources: $50K setup + $30K/year        |
| Metrics: Monthly close in 5 biz days     |
| [View Details ->]                        |
|                                          |
| [Initiative Card]                        |
| Pricing Optimization                     |
| Owner: VP Sales                          |
| Timeline: Months 2-4                     |
| Resources: $15K consulting               |
| [View Details ->]                        |
|                                          |
| [Add Custom Initiative ->]                |
|                                          |
+------------------------------------------+
| MONTHS 7-18: OPTIMIZE & SCALE            |
| Expected EBITDA: +$2.5M cumulative       |
|                                          |
| [Initiative Cards...]                    |
|                                          |
+------------------------------------------+
| MONTHS 19-36: SCALE & EXIT PREP          |
| Expected EBITDA: +$5-6M cumulative       |
|                                          |
| [Initiative Cards...]                    |
|                                          |
+------------------------------------------+
| GOLDEN YEAR ANALYSIS                     |
| Year 1 EBITDA: $0.9M / Total 3-yr gain: $1.2M  |
| % of plan realized in Year 1: 72%        |
| Assessment: Strong. Quick wins + ...     |
|                                          |
+------------------------------------------+
| BUILD YOUR OWN 100-DAY PLAN               |
| [Start from template ->]                 |
+------------------------------------------+
```

**Interactive builder (`/learn/playbooks/:playbookId/build-100-day`):**
- Template shows structure
- User drag-and-drops initiatives from a pool into weeks 1-2, 3-4, 5-8, 9-14
- System validates dependencies (e.g., can't do sales process redesign before hiring VP Sales)
- User saves custom plan to localStorage
- Exercise: compare user's sequencing vs. expert ordering

**Initiative detail modal:**
- Shows full initiative description, lever, owner, timeline, resources, success metrics, dependencies
- User can add custom initiative (name, lever, timeline, description)
- Add/remove from playbook

### Persistence

```javascript
// localStorage key: forge-playbooks
{
  playbooks: {
    "summit-hvac-playbook": {
      customInitiatives: [
        {
          id: "custom-001",
          name: "Customer Segmentation Study",
          lever: "pricing-optimization",
          timeline: "Months 2-3",
          description: "..."
        }
      ],
      hundredDayPlan: [
        { week: "1-2", initiatives: ["initiative-001", "initiative-004"] },
        { week: "3-4", initiatives: ["initiative-002", "initiative-003"] }
      ],
      exerciseAttempted: true,
      exerciseScore: 4,
      lastVisited: "2026-04-07T09:00:00Z"
    }
  }
}
```

### Routing

- `/learn/playbooks` ... playbook list
- `/learn/playbooks/:playbookId` ... playbook detail + timeline view
- `/learn/playbooks/:playbookId/build-100-day` ... interactive 100-day builder

---

## Feature 4: Roll-Up & Platform Strategy

### What It Is

An interactive framework that teaches platform vs. bolt-on economics, integration playbooks, when roll-ups fail, and how to design multi-acquisition strategies.

### Data Architecture

```javascript
// app/src/data/rollupStrategies.js

export const rollupFramework = {
  keyInsights: [
    "Platform (initial acquisition) typically bought at 7-8x multiple; bolt-on (add-on) at 4-5x",
    "Multiple arbitrage can create significant value (buy add-on at 4x, integrate, sell roll-up at 7-8x)",
    "Integration playbook is critical: standardize ops, consolidate back-office, extract 300-500 bps of margin",
    "Platform selection is 70% of success: must have stable ops, strong brand, proven playbook"
  ],

  platformVsBoltOnEconomics: {
    platform: {
      entryMultiple: "6.5-7.5x",
      rationale: "Higher quality ops, brand, scale, margin. Lower execution risk.",
      characteristics: ["Founder-era pain points fixed", "Repeatable model", "Proven management", "$10-50M revenue"],
      examples: ["brightsmile", "vitality"] // roll-up platforms in Forge
    },
    boltOn: {
      entryMultiple: "4.0-5.0x",
      rationale: "Owner-operator business. Underperforming. Needs consolidation benefit to justify price.",
      characteristics: ["Founder-operator leads", "Fragmented ops", "Local footprint", "$1-10M revenue"],
      examples: ["summit", "precision"] // in different scenario, could be bolt-ons
    },
    valueCreationArbitrage: {
      mechanism: "Buy at 4.5x, integrate (add 300-500 bps margin), sell at 8x = 80% more enterprise value",
      calculation: "$10M EBITDA bolt-on at 4.5x = $45M; after integration = $13M EBITDA at 8x = $104M; gain = $59M on $45M investment"
    }
  },

  integrationPlaybook: {
    "100-day-integration": [
      {
        phase: "Days 1-14",
        name: "Visibility & Stabilization",
        tasks: [
          "Establish weekly leadership sync (platform + add-on CEO + CFO)",
          "Baseline financial metrics for add-on (revenue, margin, working capital)",
          "Identify quick wins (procurement consolidation, duplicate roles)",
          "Confirm existing customer/vendor relationships are stable"
        ],
        goal: "Zero churn from acquisition; no operational disruption"
      },
      {
        phase: "Days 15-50",
        name: "Back-Office Consolidation",
        tasks: [
          "Finance: consolidate GL, close calendar, roll up reporting",
          "Procurement: consolidate vendors, run e-auctions for category spend",
          "HR: align comp, benefits, roles across platform + add-on",
          "IT: network, email, phone consolidation (if applicable)"
        ],
        goal: "$200-500K annual savings from consolidation"
      },
      {
        phase: "Days 51-100",
        name: "Operational Standardization",
        tasks: [
          "Document add-on's processes vs. platform standard",
          "Identify deltas (pricing, product/service offering, customer segments)",
          "Plan 90-day rollout of platform standard to add-on",
          "Establish KPI dashboard (both entities reporting to same framework)"
        ],
        goal: "Playbook refined for next add-on acquisition"
      }
    ],

    commonMistakes: [
      {
        mistake: "Immediate forced integration (fire add-on CEO, consolidate ops Day 1)",
        risk: "Key employee/customer churn; operational disruption",
        mitigation: "Keep add-on CEO for 90 days; run parallel processes; integrate gradually"
      },
      {
        mistake: "Overstating synergies in acquisition model (assumed $500K savings, realize $100K)",
        risk: "Acquisition thesis breaks; MOIC misses plan",
        mitigation: "Bottom-up synergy identification in diligence; conservative assumptions; track delivery vs. plan"
      },
      {
        mistake: "Ignoring cultural differences (platform is growth-oriented, add-on is cost-focused)",
        risk: "Cultural clash; friction; turnover",
        mitigation: "Explicit cultural integration plan; unified comp model; shared incentives"
      },
      {
        mistake: "No playbook rigor (each add-on integrated differently)",
        risk: "Playbook doesn't improve; integration gets slower + costlier",
        mitigation: "Standardize 100-day plan; measure against playbook; refine after each deal"
      },
      {
        mistake: "Scaling too fast (Platform acquires 3 add-ons in 18 months)",
        risk: "Management bandwidth overloaded; integration quality drops",
        mitigation: "Pace M&A to match integration capacity; hire dedicated integration lead after 1st deal"
      },
      {
        mistake: "Platform deteriorates during integration (CEO distracted, core business stalls)",
        risk: "Platform revenue/margin decline; entire strategy falls apart",
        mitigation: "Hire COO or M&A lead to own integration; CEO focus stays on platform"
      },
      {
        mistake: "Add-on was bad business masked by founder hustle (marginal unit economics)",
        risk: "No amount of integration fixes bad business; capital wasted",
        mitigation: "Unit economics deep dive in diligence; margin benchmarking vs. comps"
      }
    ]
  }
};

export const rollupCaseStudies = [
  {
    id: "brightsmile-case",
    company: "brightsmile",
    title: "BrightSmile Roll-Up Case Study",
    entryStrategy: "Acquire single high-performing dental practice as platform; build playbook; scale to 8+ locations.",

    platform: {
      name: "BrightSmile (Platform)",
      size: "$2.5M revenue, 25% EBITDA margin",
      entryMultiple: "7.0x",
      entryPrice: "$17.5M",
      entryEquity: "$8.5M (after $9M debt)"
    },

    acquisitions: [
      {
        sequence: "Year 1, Q3",
        target: "Acquired: SmileCo Dental (2-location practice)",
        size: "$1.2M revenue, 15% EBITDA margin",
        entryMultiple: "4.5x",
        price: "$5.4M",
        synergies: {
          description: "Consolidate back-office (HR, billing, operations); leverage BrightSmile brand; upgrade clinician comp.",
          yearOne: "$150K (back-office consolidation)",
          yearTwo: "$300K (full year + margin improvement)"
        },
        timeline: "100-day integration; 6-month ramp"
      },
      {
        sequence: "Year 2, Q1",
        target: "Acquired: DentalMax (3-location practice)",
        size: "$2.0M revenue, 18% EBITDA margin",
        entryMultiple: "4.0x",
        price: "$8.0M",
        synergies: {
          description: "Apply refined playbook; consolidate 2nd cohort; shared supply chain.",
          yearOne: "$250K",
          yearTwo: "$500K"
        }
      },
      {
        sequence: "Year 3, Q2",
        target: "Acquired: PearlDental (1-location, distressed)",
        size: "$0.8M revenue, 10% EBITDA margin",
        entryMultiple: "3.5x",
        price: "$2.8M",
        synergies: {
          description: "Turnaround: margin lift + referral network cross-sell.",
          yearOne: "$100K",
          yearTwo: "$200K"
        }
      }
    ],

    exitScenario: {
      year: "Year 5",
      revenue: "$9.8M (3.9x platform on 25% CAGR)",
      ebitda: "$2.0M (20% margin, mid-point)",
      exitMultiple: "7.5x",
      enterpriseValue: "$15.0M",
      equityValue: "$6.0M (after $9M debt paid down to $3M)",
      entryEquity: "$8.5M",
      moic: "0.7x (NEGATIVE RETURN)"
    },

    analysis: "This case study shows a failed roll-up: excessive debt at entry, too little margin expansion, add-ons underperform. Used as cautionary tale in Forge.",
    lesson: "Roll-up success requires: (1) Strong platform economics, (2) Clear margin arbitrage in add-ons, (3) Proven playbook, (4) Disciplined pacing."
  },

  // 2 more case studies (Vitality, custom)
];

export const rollupStrategy = [
  {
    id: "brightsmile-3-acq-strategy",
    label: "BrightSmile: 3-Acquisition Roll-Up Strategy",
    target: "brightsmile",
    objective: "Scale from 8 to 20+ locations; build leading regional dental platform; achieve 4x MOIC.",

    phase1: {
      name: "Platform Selection & Stabilization",
      duration: "Months 1-6",
      focus: "Build playbook on platform; establish repeatable model",
      keyMetrics: ["Margin improvement plan: 20% -> 22%", "Back-office cost structure established", "Clinician comp redesigned"]
    },

    phase2: {
      name: "First Add-On (Focus on Consolidation Benefits)",
      duration: "Months 7-15",
      target: "2-4 location practice, 15-18% margin",
      entryMultiple: "4.5x",
      synergies: ["$150K back-office", "$100K procurement", "$75K clinician optimization"],
      timeline: "100-day playbook"
    },

    phase3: {
      name: "Playbook Refinement + Second Add-On",
      duration: "Months 16-24",
      target: "3-5 location practice, 18% margin",
      entryMultiple: "4.2x (lower, as playbook de-risks)",
      notes: "Faster integration (refined playbook); higher synergy capture"
    },

    phase4: {
      name: "Platform Maturity & Exit Optimization",
      duration: "Months 25-36",
      focus: "20+ locations, 22%+ margin, repeatable playbook",
      exitMultiple: "8.0x (premium for scale + playbook)"
    },

    exitProjection: {
      revenue: "$15-18M (5x platform + add-ons)",
      ebitda: "$3.0-3.5M (20% margin)",
      exitValue: "$24-28M (at 8x)",
      entryEquity: "$8.5M",
      moic: "2.8-3.3x"
    }
  }
];
```

### UI/UX

**Entry point:** New tab in Learn nav: "Practice" | "Learn" | "Levers" | "Bridge" | "Playbooks" | **"Roll-ups"**

**Overview view (`/learn/rollup`):**
- Key insights card (multiple arbitrage mechanics)
- Platform vs. bolt-on comparison table
- 7 common pitfalls (expandable cards)

**Case study view (`/learn/rollup/case/:caseId`):**

```
+-------------------------------------------+
| BrightSmile Roll-Up Case Study            |
| Platform: Dental practices consolidation  |
+-------------------------------------------+
|                                          |
| ENTRY THESIS                             |
| Platform: $2.5M revenue, 25% margin      |
| Entry multiple: 7.0x = $17.5M            |
| Strategy: Scale via 3-5 add-ons          |
|                                          |
+-------------------------------------------+
| ACQUISITION TIMELINE                      |
|                                          |
| Year 1 Q3: SmileCo Dental                |
| 2 locations, $1.2M rev, 15% margin      |
| Entry: 4.5x = $5.4M                     |
| Synergies: $150K Year 1, $300K Year 2   |
| [View Details ->]                        |
|                                          |
| Year 2 Q1: DentalMax                     |
| 3 locations, $2.0M rev, 18% margin      |
| Entry: 4.0x = $8.0M                     |
| Synergies: $250K Y1, $500K Y2            |
| [View Details ->]                        |
|                                          |
| Year 3 Q2: PearlDental                   |
| 1 location, $0.8M rev, 10% margin       |
| Entry: 3.5x = $2.8M (turnaround)        |
| Synergies: $100K Y1, $200K Y2            |
| [View Details ->]                        |
|                                          |
+-------------------------------------------+
| EXIT SCENARIO (Year 5)                    |
|                                          |
| Revenue: $9.8M (3.9x platform CAGR)      |
| EBITDA: $2.0M (20% margin)               |
| Exit multiple: 7.5x                      |
| Enterprise value: $15.0M                 |
| Entry equity: $8.5M                      |
| MOIC: 0.7x (NEGATIVE!)                   |
|                                          |
+-------------------------------------------+
| ANALYSIS & LESSONS                        |
|                                          |
| What went wrong?                         |
| 1. Entry debt too high ($9M)             |
| 2. Margin expansion underperformed       |
| 3. Add-on quality worse than expected    |
| 4. Paced too fast (3 deals in 3 years)   |
|                                          |
| Key lesson: Roll-up success requires     |
| strong platform, clear synergies,        |
| disciplined pacing, and management       |
| capacity. This deal had none of those.   |
|                                          |
+-------------------------------------------+
```

**Strategy builder (`/learn/rollup/build/:companyId`):**
- Users select a Forge company as platform
- Build custom acquisition roadmap (Year 1, 2, 3 targets)
- Drag-and-drop other Forge companies as potential bolt-ons
- System validates economics (entry multiple, synergies, pacing)
- Calculate exit MOIC based on assumptions

### Persistence

```javascript
// localStorage key: forge-rollup
{
  strategies: {
    "brightsmile-custom": {
      platform: "brightsmile",
      acquisitions: [
        { year: 1, target: "precision", entryMultiple: 4.5, synergies: 200 },
        { year: 2, target: "summit", entryMultiple: 4.2, synergies: 300 }
      ],
      exerciseAttempted: true,
      exerciseScore: 4,
      lastVisited: "2026-04-08T11:30:00Z"
    }
  }
}
```

### Routing

- `/learn/rollup` ... overview + key insights
- `/learn/rollup/framework` ... platform vs. bolt-on mechanics
- `/learn/rollup/pitfalls` ... 7 common mistakes
- `/learn/rollup/case/:caseId` ... case study detail
- `/learn/rollup/build/:companyId` ... strategy builder

---

## Technical Approach

### Files to Create

| File | Description |
|------|-------------|
| `app/src/data/valueLevers.js` | 12 lever definitions with company examples |
| `app/src/data/valueBridge.js` | Bridge scenarios and calculation utilities |
| `app/src/data/playbooks.js` | 36-month playbooks for 9 companies |
| `app/src/data/rollupStrategies.js` | Roll-up framework, case studies, strategy builder |
| `app/src/components/learn/LeverCard.jsx` | Single lever detail view |
| `app/src/components/learn/LeverList.jsx` | Grid of all 12 levers |
| `app/src/components/learn/BridgeCalculator.jsx` | Interactive waterfall chart + sliders |
| `app/src/components/learn/PlaybookTimeline.jsx` | 36-month timeline visualization |
| `app/src/components/learn/PlaybookBuilder.jsx` | Interactive 100-day plan drag-and-drop |
| `app/src/components/learn/RollupCaseStudy.jsx` | Case study detail view |
| `app/src/components/learn/RollupBuilder.jsx` | Strategy builder (platform + bolt-ons) |
| `app/src/hooks/useValueLeverProgress.js` | localStorage for lever notes + exercises |
| `app/src/hooks/useBridgeProgress.js` | localStorage for bridge scenarios + custom assumptions |
| `app/src/hooks/usePlaybookProgress.js` | localStorage for playbook customization + 100-day plans |
| `app/src/hooks/useRollupProgress.js` | localStorage for roll-up strategies + exercises |

### Files to Modify

| File | Changes |
|------|---------|
| `app/src/App.jsx` | Add routes: `/learn/levers`, `/learn/levers/:leverId`, `/learn/bridge`, `/learn/bridge/:scenarioId`, `/learn/playbooks`, `/learn/playbooks/:playbookId`, `/learn/playbooks/:playbookId/build-100-day`, `/learn/rollup`, `/learn/rollup/:section` |
| `app/src/components/learn/LearnNav.jsx` | Add tabs: "Levers", "Bridge", "Playbooks", "Roll-ups" |

### Key Implementation Notes

1. **Recharts for visualization.** Use Recharts `ComposedChart` for waterfall visualization of bridge (bars + waterfall connector lines). Already in package.json.

2. **Data references, not duplication.** All data files reference company IDs. At render time, pull live company metrics from `companies.js`. Updates to company data automatically cascade.

3. **Drag-and-drop for playbook builder and roll-up builder.** Use React Beautiful DND (add to package.json) for drag-and-drop UX.

4. **Slider component for bridge calculator.** Use Tailwind range input or Recharts Slider for interactive parameter adjustment.

5. **No LLM evaluation.** All exercises are self-scored (user enters answer, check-off acceptance criteria, self-score 1-5). No API calls.

6. **Mobile responsive.** Single-column layout for cards. Timeline on mobile is scrollable horizontally or collapses to summary view. Charts responsive (use Recharts auto-sizing).

7. **Dark mode supported.** All components follow existing dark mode pattern.

### localStorage Schema Extension

Current keys: `forge-data`, `forge-theme`, `forge-concepts` (from Concept Cards), `forge-comparisons` (from Comparisons)

New keys:
- `forge-levers` (lever notes + exercise tracking)
- `forge-bridge` (bridge scenarios + custom assumptions)
- `forge-playbooks` (playbook customization + 100-day plans)
- `forge-rollup` (roll-up strategies + exercises)

No migration needed. New keys are independent.

---

## Acceptance Criteria

### Value Creation Levers

- [ ] 12 lever cards accessible at `/learn/levers`
- [ ] Each card shows: category, definition, when to deploy, typical impact, business fit, red flags, 2+ company examples
- [ ] Company examples pull real metrics from `companies.js`
- [ ] Exercise: user responds to lever identification prompt, self-scores against acceptance criteria
- [ ] Lever notes textarea auto-saves to localStorage
- [ ] Keyboard navigation (left/right arrows) between levers
- [ ] Lever counter shows position (e.g., "3/12")
- [ ] Dark mode supported
- [ ] Mobile responsive

### Value Creation Bridge

- [ ] 7 bridge scenarios accessible at `/learn/bridge`
- [ ] Interactive waterfall chart updates real-time as user adjusts sliders
- [ ] Sliders for: revenue CAGR, margin expansion, multiple expansion, debt paydown
- [ ] Real-time MOIC and IRR calculation
- [ ] Return attribution breakdown (EBITDA growth, multiple expansion, debt paydown %)
- [ ] Sensitivity analysis (what-if scenarios)
- [ ] Exercise: "Hit 4.5x MOIC" or "Reverse bridge" problem
- [ ] User can customize assumptions; custom scenarios persist in localStorage
- [ ] Pre-built scenarios based on 9 Forge companies
- [ ] Dark mode supported
- [ ] Recharts waterfall chart is responsive

### Operating Playbooks

- [ ] 9 playbooks accessible at `/learn/playbooks` (one per company)
- [ ] Each playbook shows: 36-month arc (months 1-6, 7-18, 19-36)
- [ ] Each initiative has: name, lever, owner, timeline, resources, success metrics, dependencies
- [ ] Golden Year analysis visible (Year 1 progress vs. 3-year plan)
- [ ] Exercise: "Build your own 100-day plan" using interactive builder
- [ ] Drag-and-drop to sequence initiatives across 4 time periods (weeks 1-2, 3-4, 5-8, 9-14)
- [ ] System validates dependencies (can't do sales redesign before hiring VP Sales)
- [ ] User can add custom initiatives
- [ ] User's 100-day plan saved to localStorage
- [ ] Timeline view is scrollable and responsive
- [ ] Dark mode supported

### Roll-Up & Platform Strategy

- [ ] Overview page at `/learn/rollup` with key insights, platform vs. bolt-on comparison, 7 pitfalls
- [ ] 2-3 case studies accessible as expandable cards or detail pages
- [ ] Case study shows: platform entry, acquisition timeline, synergies, exit scenario, lessons
- [ ] Exercise: "Build your own 3-acquisition roll-up strategy"
- [ ] Strategy builder: select platform company, drag-and-drop bolt-on targets
- [ ] System calculates: entry multiples, synergy impact, revenue/EBITDA projections, exit MOIC
- [ ] Custom strategies saved to localStorage
- [ ] Dark mode supported
- [ ] Mobile responsive

### Integration

- [ ] All routes properly nested under `/learn`
- [ ] LearnNav updated with 4 new tabs (Levers, Bridge, Playbooks, Roll-ups)
- [ ] All existing tests pass (104 tests + new tests for Value Creation sections)
- [ ] Build output size stays reasonable (Recharts adds ~80KB gzipped; manageable)
- [ ] No TypeScript, no backend changes

---

## Implementation Phases

**Phase 1: Value Creation Levers (estimate: 2-3 sessions)**
1. Create `valueLevers.js` data file with 12 levers + 2-3 company examples each
2. Build `LeverList.jsx` grid and `LeverCard.jsx` detail view
3. Add exercise UI component (commit-first, self-score)
4. Add `useValueLeverProgress.js` hook
5. Wire routes and nav
6. Tests

**Phase 2: Value Creation Bridge (estimate: 2-3 sessions)**
1. Create `valueBridge.js` data file with 7 scenarios + calculation utilities
2. Build `BridgeCalculator.jsx` with Recharts waterfall chart
3. Implement slider controls (revenue CAGR, margin, multiple, debt)
4. Real-time MOIC/IRR calculation
5. Sensitivity analysis (what-if scenarios)
6. Add `useBridgeProgress.js` hook
7. Tests

**Phase 3: Operating Playbooks (estimate: 2-3 sessions)**
1. Create `playbooks.js` with 9 company playbooks (months 1-6, 7-18, 19-36)
2. Build `PlaybookTimeline.jsx` for visualization
3. Implement initiative detail cards
4. Build `PlaybookBuilder.jsx` with drag-and-drop (React Beautiful DND)
5. Golden Year analysis component
6. Add `usePlaybookProgress.js` hook
7. Tests

**Phase 4: Roll-Up & Platform Strategy (estimate: 2 sessions)**
1. Create `rollupStrategies.js` with framework, case studies, pitfalls
2. Build case study detail pages and overview page
3. Build `RollupBuilder.jsx` for strategy customization
4. Add `useRollupProgress.js` hook
5. Tests

**Phase 5: Polish (estimate: 1 session)**
1. Mobile responsive QA (especially playbook timeline, bridge chart)
2. Dark mode QA
3. Keyboard nav
4. Integration testing (LearnNav tabs all work, routing, localStorage)

---

## Scope Boundaries (Not in Scope)

- LLM evaluation of exercise responses
- Spaced repetition / review scheduling
- User-created levers, playbooks, or scenarios
- Exporting playbooks as documents
- Sharing playbooks with other users
- More than 12 levers, 7 bridge scenarios, 9 playbooks, 2-3 case studies in V1
- Video content (text + interactive visualization only)
- Comparison across levers (e.g., "which lever creates more value?")

---

## Success Metrics

- User studies 2-3 levers per week during PE Operating block
- User builds a value creation bridge for all 7 scenarios within first month
- User customizes at least 2 playbooks (adds custom initiatives, builds 100-day plan)
- User attempts roll-up strategy builder and case study analysis
- Feature enables higher-quality value creation thesis work (students can articulate "here's the lever, here's the bridge, here's the 36-month playbook")
- Practice performance improves on value creation questions (measured via scoring data)

---

## Future Enhancements (Post-V1)

- Sensitivity analysis templates (Monte Carlo simulations)
- Lever interaction modeling (e.g., "pricing + sales effectiveness = synergy")
- LLM-evaluated exercise responses with feedback
- Playbook comparison (user playbook vs. expert vs. peer playbooks)
- Roll-up scenario modeling (3-5 year projections)
- Export playbook as Word doc
- Case study creation tool (user can document a real PE deal)
- Peer playbook sharing (anonymized)
