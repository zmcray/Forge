export const COMPANIES = [
  {
    id: "summit-hvac",
    name: "Summit Mechanical Services",
    industry: "HVAC / Mechanical Services",
    description: "Commercial HVAC installation and service provider serving the Southeast US. Founded 2008 by a former Carrier technician. 127 employees, 3 branch locations.",
    revenue: 32.5,
    context: "Owner looking to retire in 2-3 years. Recurring service contracts represent growing share of revenue.",
    incomeStatement: {
      years: [2024, 2025],
      revenue: [28.1, 32.5],
      cogs: [18.3, 20.8],
      grossProfit: [9.8, 11.7],
      sgaExpense: [5.2, 6.1],
      ownerComp: [1.8, 2.0],
      depreciation: [0.9, 1.1],
      amortization: [0.1, 0.1],
      interestExpense: [0.3, 0.3],
      otherIncome: [0.1, 0.2],
      netIncome: [1.6, 2.3],
      addBacks: { ownerPerks: 0.4, oneTimeExpenses: 0.3, aboveMarketRent: 0.2 }
    },
    balanceSheet: {
      cash: 1.8, ar: 4.2, inventory: 0.8, otherCurrentAssets: 0.3,
      ppe: 3.5, goodwill: 0, otherLtAssets: 0.2,
      ap: 2.1, currentDebt: 0.5, accruedExpenses: 1.2,
      ltDebt: 2.8, otherLtLiabilities: 0.4, equity: 3.8
    },
    cashFlow: {
      netIncome: 2.3, da: 1.2, changeWc: -0.4, capex: -1.5,
      debtPayments: -0.6, distributions: -1.0
    },
    keyMetrics: {
      ebitda: 4.6, adjustedEbitda: 5.5, ebitdaMargin: 14.2, adjustedEbitdaMargin: 16.9,
      grossMargin: 36.0, revenueGrowth: 15.7,
      recurringRevenuePct: 35, customerConcentration: 12,
      employeeCount: 127, avgRevenuePerEmployee: 0.256
    },
    redFlags: ["Owner compensation above market could mask true cost structure", "Revenue growth outpacing SGA growth -- is this sustainable or under-investing?"],
    greenFlags: ["35% recurring revenue from service contracts", "Low customer concentration at 12%", "Strong revenue growth at 15.7%", "Healthy gross margins for HVAC services"],
    questions: [
      {
        q: "What is Summit's adjusted EBITDA margin, and how does it compare to typical HVAC service companies (12-18%)?",
        hint: "Add back owner comp above market (~$800K excess), one-time expenses, and above-market rent to EBITDA",
        answer: "Adjusted EBITDA margin is ~16.9% ($5.5M on $32.5M revenue), which is solidly in the upper range for HVAC services. This suggests good operational efficiency.",
        type: "metric"
      },
      {
        q: "The owner takes $2M in compensation plus $400K in perks. If you replaced them with a GM at $250K, what would adjusted EBITDA look like?",
        hint: "Current owner cost: $2.4M. Replacement cost: $250K. Delta: $2.15M. Add to reported EBITDA.",
        answer: "Adjusted EBITDA with normalized management would be ~$6.35M ($4.6M + $2.15M owner adjustment + $0.3M one-time + $0.2M rent), yielding a 19.5% margin. This is the number a PE buyer would use for valuation.",
        type: "adjustment"
      },
      {
        q: "At a 6x adjusted EBITDA multiple (typical for HVAC services), what's the enterprise value? What does the equity value look like?",
        hint: "EV = EBITDA x multiple. Equity = EV - net debt. Net debt = total debt - cash.",
        answer: "EV = $5.5M x 6 = $33M. Net debt = ($0.5M + $2.8M) - $1.8M = $1.5M. Equity value ~ $31.5M. With the more aggressive $6.35M adjusted EBITDA: EV = $38.1M, equity ~ $36.6M.",
        type: "valuation"
      },
      {
        q: "What's the biggest risk you see in this business, and what would you investigate in due diligence?",
        hint: "Think about key-person risk, customer concentration, revenue quality, and the growth trajectory",
        answer: "Key-person risk is the #1 concern -- the founder IS the business and owner comp is $2.4M. Key DD questions: How dependent are customer relationships on the owner? Is the management team capable of operating independently? Are the service contracts transferable? Also worth investigating: is the 15.7% revenue growth organic or from new contracts that may not repeat?",
        type: "risk",
        keywords: ["key-person risk", "owner dependency", "management team", "service contracts", "organic growth", "customer relationships"]
      }
    ]
  },
  {
    id: "coastal-foods",
    name: "Coastal Fresh Foods",
    industry: "Food Distribution",
    description: "Regional specialty food distributor serving restaurants, hotels, and grocery chains in the Mid-Atlantic. Founded 1995, second-generation family business. 85 employees, 2 warehouses.",
    revenue: 48.2,
    context: "Second-gen owner wants to grow but lacks capital. Margins have been compressed by rising transportation costs. Considering PE partnership.",
    incomeStatement: {
      years: [2024, 2025],
      revenue: [45.8, 48.2],
      cogs: [36.6, 39.0],
      grossProfit: [9.2, 9.2],
      sgaExpense: [5.8, 6.3],
      ownerComp: [0.9, 0.9],
      depreciation: [1.1, 1.2],
      amortization: [0.0, 0.0],
      interestExpense: [0.5, 0.6],
      otherIncome: [0.0, 0.0],
      netIncome: [0.9, 0.2],
      addBacks: { ownerPerks: 0.2, oneTimeExpenses: 0.8, aboveMarketRent: 0.0 }
    },
    balanceSheet: {
      cash: 0.4, ar: 6.8, inventory: 3.2, otherCurrentAssets: 0.2,
      ppe: 5.5, goodwill: 0, otherLtAssets: 0.3,
      ap: 5.1, currentDebt: 1.2, accruedExpenses: 0.8,
      ltDebt: 4.8, otherLtLiabilities: 0.3, equity: 4.2
    },
    cashFlow: {
      netIncome: 0.2, da: 1.2, changeWc: -1.1, capex: -0.8,
      debtPayments: -0.5, distributions: -0.3
    },
    keyMetrics: {
      ebitda: 2.9, adjustedEbitda: 3.9, ebitdaMargin: 6.0, adjustedEbitdaMargin: 8.1,
      grossMargin: 19.1, revenueGrowth: 5.2,
      recurringRevenuePct: 60, customerConcentration: 22,
      employeeCount: 85, avgRevenuePerEmployee: 0.567
    },
    redFlags: ["Gross margin flat YoY despite 5% revenue growth -- cost pass-through issues", "Net income dropped 78% ($0.9M to $0.2M)", "Working capital consuming cash (AR + inventory growing faster than revenue)", "Customer concentration at 22% -- who is this?", "Low cash position ($0.4M) for a $48M revenue business"],
    greenFlags: ["60% recurring revenue from contracted accounts", "Revenue per employee of $567K is decent for distribution", "Steady top-line growth", "Asset-light potential if warehouses are leased"],
    questions: [
      {
        q: "Revenue grew 5.2% but net income dropped 78%. What's happening here and where would you dig in?",
        hint: "Look at gross margin (flat), SGA growth rate vs revenue growth rate, and the add-backs",
        answer: "Gross profit was flat ($9.2M both years) despite $2.4M more revenue -- meaning ALL the revenue growth was eaten by COGS increases. SGA also grew 8.6% vs 5.2% revenue growth. The $0.8M in one-time expenses also hit hard. This screams margin compression from input costs (likely transportation + product costs) that aren't being passed through to customers. First DD question: what are the contract terms with major customers? Can they reprice?",
        type: "diagnostic",
        keywords: ["gross margin", "margin compression", "COGS", "input costs", "SGA growth", "contract terms", "repricing"]
      },
      {
        q: "The business has $6.8M in AR on $48.2M revenue. What's the DSO and is it concerning?",
        hint: "DSO = (AR / Revenue) x 365. Compare to industry standard of 30-45 days for food distribution.",
        answer: "DSO = ($6.8M / $48.2M) x 365 = 51.5 days. This is above the industry standard of 30-45 days. Could indicate collection issues, customer payment terms that are too generous, or a concentration of AR with a few slow-paying customers. In DD, you'd want an AR aging schedule and to understand if that 22% customer concentration is also the slow payer.",
        type: "metric"
      },
      {
        q: "If a PE firm acquired this at 5x adjusted EBITDA and believed they could improve gross margin by 200 bps through pricing and procurement, what would the value creation look like?",
        hint: "200 bps on $48.2M revenue = incremental gross profit. Flow that through to EBITDA assuming fixed SGA.",
        answer: "200 bps improvement = $48.2M x 0.02 = $964K incremental gross profit. If SGA stays flat, that flows straight to EBITDA: $3.9M + $0.96M = $4.86M adjusted EBITDA. At the same 5x multiple, EV goes from $19.5M to $24.3M -- a $4.8M value creation from margin improvement alone. This is the classic PE playbook for distribution businesses.",
        type: "valuation"
      },
      {
        q: "Would you pursue this deal? What's your 30-second investment thesis -- or why would you pass?",
        hint: "Consider: margin profile, growth potential, risks, and what a PE firm could actually improve",
        answer: "It's a qualified yes with a clear thesis: recurring revenue base + fixable margin problem = classic PE value creation opportunity. The thesis is: (1) reprice contracts to pass through input cost increases, (2) optimize procurement/logistics to recover 200-400 bps of gross margin, (3) reduce customer concentration, (4) potentially bolt-on smaller regional distributors. The risk is that the margin compression may be structural (competitive dynamics) rather than fixable. DD focus: contract terms, competitive landscape, and whether that top customer has alternatives.",
        type: "thesis",
        keywords: ["recurring revenue", "margin improvement", "repricing", "procurement", "bolt-on", "customer concentration", "competitive dynamics"]
      }
    ]
  },
  {
    id: "precision-manufacturing",
    name: "Precision CNC Solutions",
    industry: "Contract Manufacturing / CNC Machining",
    description: "Precision CNC machining shop serving aerospace, medical device, and industrial customers. Founded 2001, owner-operator with deep technical expertise. 45 employees, single facility.",
    revenue: 12.8,
    context: "Highly profitable niche manufacturer. Owner wants to scale but constrained by facility capacity and his own bandwidth. ISO 13485 and AS9100 certified.",
    incomeStatement: {
      years: [2024, 2025],
      revenue: [11.2, 12.8],
      cogs: [6.5, 7.3],
      grossProfit: [4.7, 5.5],
      sgaExpense: [1.8, 2.0],
      ownerComp: [1.2, 1.4],
      depreciation: [0.6, 0.7],
      amortization: [0.0, 0.0],
      interestExpense: [0.2, 0.2],
      otherIncome: [0.0, 0.1],
      netIncome: [0.9, 1.3],
      addBacks: { ownerPerks: 0.3, oneTimeExpenses: 0.1, aboveMarketRent: 0.15 }
    },
    balanceSheet: {
      cash: 0.9, ar: 2.1, inventory: 0.6, otherCurrentAssets: 0.1,
      ppe: 4.8, goodwill: 0, otherLtAssets: 0.8,
      ap: 0.8, currentDebt: 0.3, accruedExpenses: 0.5,
      ltDebt: 1.8, otherLtLiabilities: 0.2, equity: 5.7
    },
    cashFlow: {
      netIncome: 1.3, da: 0.7, changeWc: -0.3, capex: -1.2,
      debtPayments: -0.4, distributions: -0.8
    },
    keyMetrics: {
      ebitda: 3.6, adjustedEbitda: 4.15, ebitdaMargin: 28.1, adjustedEbitdaMargin: 32.4,
      grossMargin: 43.0, revenueGrowth: 14.3,
      recurringRevenuePct: 45, customerConcentration: 28,
      employeeCount: 45, avgRevenuePerEmployee: 0.284
    },
    redFlags: ["28% customer concentration -- likely one aerospace OEM", "Owner IS the technical expertise -- extreme key-person risk", "CapEx heavy ($1.2M on $12.8M revenue = 9.4%) -- CNC equipment is expensive", "Single facility = single point of failure"],
    greenFlags: ["43% gross margins are exceptional for manufacturing", "ISO 13485 + AS9100 certifications are significant barriers to entry", "32.4% adjusted EBITDA margin is elite", "14.3% organic revenue growth"],
    questions: [
      {
        q: "Precision's gross margin is 43% -- almost unheard of in manufacturing. What explains this, and is it sustainable?",
        hint: "Think about what drives margins in contract manufacturing: certifications, complexity, competition, customer switching costs",
        answer: "The 43% gross margin reflects extreme specialization: aerospace and medical device machining requires expensive certifications (AS9100, ISO 13485), tight tolerances, and validated processes. Customers can't easily switch vendors because re-qualification takes months. This creates pricing power. It's sustainable as long as: (1) certifications are maintained, (2) technical talent stays, and (3) they don't commoditize by chasing lower-margin work to fill capacity.",
        type: "diagnostic",
        keywords: ["certifications", "switching costs", "pricing power", "specialization", "barriers to entry", "talent retention"]
      },
      {
        q: "CapEx is 9.4% of revenue ($1.2M). Is this maintenance CapEx or growth CapEx? Why does it matter for valuation?",
        hint: "Compare CapEx to depreciation. If CapEx >> depreciation, some is growth. This affects free cash flow and EBITDA-based valuations.",
        answer: "Depreciation is $0.7M vs CapEx of $1.2M, suggesting ~$0.7M is maintenance and ~$0.5M is growth CapEx (new machines to add capacity). This matters because buyers often value on EBITDA but need to haircut for maintenance CapEx to get true free cash flow. True unlevered FCF is closer to $3.45M ($4.15M adjusted EBITDA - $0.7M maintenance CapEx). A buyer paying 6-7x EBITDA should be thinking about the CapEx intensity ongoing.",
        type: "adjustment"
      },
      {
        q: "The 28% customer concentration is a red flag. How would you structure deal protections around this?",
        hint: "Think about escrows, earnouts, customer contract terms, and what happens if that customer leaves",
        answer: "Several options: (1) Earnout tied to retention of that customer post-close, (2) Escrow holdback that releases over 12-24 months if revenue from that customer stays above a threshold, (3) Require the owner to stay on for a transition period and actively relationship-manage that account, (4) In DD, verify the length and terms of the supply agreement -- is it a long-term contract or purchase-order-based? A 28% customer who buys on POs with no contract is very different from one locked into a 3-year supply agreement.",
        type: "risk",
        keywords: ["earnout", "escrow", "customer retention", "contract terms", "transition period", "purchase orders"]
      },
      {
        q: "If you were pitching this deal to investors, what's your 60-second thesis and how do you address the key-person risk?",
        hint: "Focus on the moat (certifications), growth opportunity, and a realistic plan for de-risking the owner dependency",
        answer: "Thesis: Precision CNC is a high-margin, certification-moated manufacturer with 14% organic growth, operating at capacity. The play is: (1) invest in facility expansion to unlock pent-up demand, (2) hire a technical director and COO to de-risk the owner dependency over 18 months, (3) diversify the customer base by targeting adjacent regulated industries (defense, energy), (4) potential add-on acquisitions of smaller shops for their customer books and machinists. Address key-person risk head-on: owner rolls equity and stays for 2-3 years in a technical advisory role while we build the management layer. Target: 2.5-3x MOIC in 4-5 years through a combination of EBITDA growth and multiple expansion.",
        type: "thesis",
        keywords: ["certification moat", "facility expansion", "key-person risk", "management layer", "customer diversification", "add-on acquisitions", "equity rollover"]
      }
    ]
  },
  {
    id: "bright-dental",
    name: "BrightSmile Dental Partners",
    industry: "Healthcare Services / Dental",
    description: "Multi-location dental practice group with 5 offices across suburban markets. Founded 2015 through a single practice acquisition, expanded via de novo and acquisition. 62 employees, 8 dentists.",
    revenue: 9.8,
    context: "Fast-growing dental roll-up reaching a scale inflection point. Founder (a former dental practice management consultant) is non-clinical -- a pure operator model with employed dentists.",
    incomeStatement: {
      years: [2024, 2025],
      revenue: [7.4, 9.8],
      cogs: [3.4, 4.4],
      grossProfit: [4.0, 5.4],
      sgaExpense: [2.5, 3.4],
      ownerComp: [0.4, 0.5],
      depreciation: [0.4, 0.5],
      amortization: [0.2, 0.3],
      interestExpense: [0.3, 0.4],
      otherIncome: [0.1, 0.1],
      netIncome: [0.3, 0.4],
      addBacks: { ownerPerks: 0.1, oneTimeExpenses: 0.5, aboveMarketRent: 0.0 }
    },
    balanceSheet: {
      cash: 0.6, ar: 1.4, inventory: 0.3, otherCurrentAssets: 0.2,
      ppe: 2.8, goodwill: 3.2, otherLtAssets: 0.5,
      ap: 0.7, currentDebt: 0.8, accruedExpenses: 0.6,
      ltDebt: 4.2, otherLtLiabilities: 0.3, equity: 2.4
    },
    cashFlow: {
      netIncome: 0.4, da: 0.8, changeWc: -0.2, capex: -0.6,
      debtPayments: -0.5, distributions: -0.2
    },
    keyMetrics: {
      ebitda: 1.9, adjustedEbitda: 2.5, ebitdaMargin: 19.4, adjustedEbitdaMargin: 25.5,
      grossMargin: 55.1, revenueGrowth: 32.4,
      recurringRevenuePct: 70, customerConcentration: 3,
      employeeCount: 62, avgRevenuePerEmployee: 0.158
    },
    redFlags: ["$3.2M goodwill on balance sheet from acquisitions -- overpay risk?", "SGA grew 36% vs 32% revenue growth -- overhead creeping", "Leverage: $5.0M total debt on $2.5M adjusted EBITDA = 2.0x", "32% revenue growth includes inorganic (acquisitions) -- what's organic?", "One-time expenses of $500K -- what are these? Acquisition costs they want to add back?"],
    greenFlags: ["55% gross margins typical of high-quality dental", "70% recurring patient revenue", "3% customer concentration -- highly diversified patient base", "Non-clinical founder model is scalable", "Dental is recession-resistant"],
    questions: [
      {
        q: "Revenue grew 32.4% but how much is organic vs. acquisition-driven? Why does this distinction matter enormously for valuation?",
        hint: "Think about what a buyer is really paying for. Organic growth compounds; acquired growth costs money to buy.",
        answer: "This is critical. If they acquired a practice mid-year that contributes $1.5M annually, same-store organic growth might only be ~12%. A buyer valuing this at 8-10x EBITDA (typical for dental roll-ups at scale) needs to know: am I paying for a growth machine or for purchased revenue? Organic growth = higher quality and commands a higher multiple. In DD, you'd want same-store revenue growth by location and a waterfall showing what revenue each acquisition contributed and when.",
        type: "diagnostic",
        keywords: ["organic growth", "same-store growth", "acquisition-driven", "inorganic", "growth quality", "revenue waterfall"]
      },
      {
        q: "They want to add back $500K in 'one-time expenses.' What's your skepticism level and what would you ask?",
        hint: "In a roll-up model, 'one-time' acquisition costs may actually be recurring if the growth strategy depends on continued acquisitions",
        answer: "High skepticism. In a company whose strategy IS acquisitions, deal costs, integration costs, and transition expenses are arguably part of the recurring cost structure, not one-time. If they plan to keep acquiring, these costs will keep appearing. You'd ask: (1) Break out the $500K -- what exactly is it? (2) How many acquisitions are planned in the next 2 years? (3) What were 'one-time' costs in 2024? If the answer is also $300-500K, it's not one-time -- it's the cost of doing business.",
        type: "adjustment"
      },
      {
        q: "With $5M in debt and $2.5M adjusted EBITDA, leverage is 2.0x. For a dental roll-up seeking PE capital to accelerate growth, is this comfortable?",
        hint: "Healthcare services can typically support 3-4x leverage. But consider the growth stage and cash flow stability.",
        answer: "2.0x leverage is actually conservative for a dental roll-up with 70% recurring revenue. Dental practices are famously predictable cash flow businesses -- patients come back every 6 months. Most PE-backed dental platforms operate at 3-4x leverage comfortably. The question is whether adding leverage to fund acquisitions makes sense given the 25.5% EBITDA margin and cash flow profile. With $2.5M EBITDA and a target of 3.5x, they could support ~$8.75M in debt -- an additional $3.75M of acquisition firepower.",
        type: "risk",
        keywords: ["leverage capacity", "recurring revenue", "cash flow stability", "acquisition firepower", "debt service coverage", "roll-up leverage"]
      },
      {
        q: "A PE firm offers to invest $10M for 60% of the company at an implied 8x adjusted EBITDA valuation ($20M EV). Is the founder getting a good deal?",
        hint: "Work backwards: What's the founder's pre-money equity? What does post-money look like? What's the founder giving up vs getting?",
        answer: "At $20M EV with $5M net debt, equity value = $15M. The PE firm puts in $10M for 60%, implying post-money equity of $16.67M. Founder keeps 40% = $6.67M in equity value. But pre-money, the founder's equity was $15M - $5M debt = $10M. So the founder is going from 100% of $10M to 40% of... potentially much more. The bet is: if they use the $10M to grow to $6-8M EBITDA in 3-4 years and exit at 10-12x (platform premium), the company is worth $60-96M. Founder's 40% = $24-38M. Classic 'smaller slice of a much bigger pie' play. It's a good deal IF the growth thesis works.",
        type: "valuation"
      }
    ]
  },
  {
    id: "apex-logistics",
    name: "Apex Last-Mile Logistics",
    industry: "Transportation & Logistics",
    description: "Last-mile delivery company specializing in white-glove delivery of heavy/bulky items (furniture, appliances, fitness equipment) for e-commerce retailers. Founded 2017. 210 employees + 80 independent contractors. Fleet of 65 box trucks across 4 metro markets.",
    revenue: 38.5,
    context: "Explosive growth during and after COVID. Now facing normalization as e-commerce growth slows. Key question: is the growth rate sustainable or was it a pull-forward?",
    incomeStatement: {
      years: [2024, 2025],
      revenue: [42.1, 38.5],
      cogs: [30.3, 28.1],
      grossProfit: [11.8, 10.4],
      sgaExpense: [6.2, 6.5],
      ownerComp: [0.6, 0.6],
      depreciation: [1.8, 2.0],
      amortization: [0.0, 0.0],
      interestExpense: [0.7, 0.8],
      otherIncome: [0.1, 0.1],
      netIncome: [2.6, 0.6],
      addBacks: { ownerPerks: 0.15, oneTimeExpenses: 0.4, aboveMarketRent: 0.0 }
    },
    balanceSheet: {
      cash: 1.2, ar: 5.8, inventory: 0.1, otherCurrentAssets: 0.4,
      ppe: 8.5, goodwill: 0, otherLtAssets: 0.3,
      ap: 3.2, currentDebt: 2.1, accruedExpenses: 1.8,
      ltDebt: 6.5, otherLtLiabilities: 0.8, equity: 1.9
    },
    cashFlow: {
      netIncome: 0.6, da: 2.0, changeWc: 0.8, capex: -2.5,
      debtPayments: -1.2, distributions: -0.3
    },
    keyMetrics: {
      ebitda: 4.0, adjustedEbitda: 4.55, ebitdaMargin: 10.4, adjustedEbitdaMargin: 11.8,
      grossMargin: 27.0, revenueGrowth: -8.6,
      recurringRevenuePct: 55, customerConcentration: 35,
      employeeCount: 210, avgRevenuePerEmployee: 0.183
    },
    redFlags: ["Revenue DECLINED 8.6% -- is this a trend or a correction?", "35% customer concentration -- one major e-commerce retailer", "CapEx intensive: $2.5M (6.5% of revenue) for fleet maintenance/expansion", "High leverage: $8.6M total debt on $4.55M adjusted EBITDA = 1.9x", "IC contractor model may face regulatory reclassification risk", "SGA grew 4.8% despite revenue declining -- can't cut costs fast enough?", "Equity is only $1.9M -- thin cushion"],
    greenFlags: ["White-glove last-mile is harder to displace than standard delivery", "Working capital improved (positive $0.8M change) -- getting paid faster", "Infrastructure (fleet, routes, driver network) is a real asset", "Four metro markets provide geographic diversification"],
    questions: [
      {
        q: "Revenue declined 8.6% while SGA grew 4.8%. What does this tell you about the business's cost structure, and what would you model going forward?",
        hint: "Think about operating leverage -- in logistics, fixed costs are high. What happens to margins if revenue keeps declining?",
        answer: "This is negative operating leverage in action. Logistics has high fixed costs (fleet leases, facility costs, base staff) that don't shrink with revenue. SGA growing while revenue falls means margins are getting squeezed from both sides. If revenue drops another 10%, EBITDA could get cut in half because the fixed cost base stays. You'd want to model: (1) a stabilization case where revenue flatlines, (2) a continued decline case at -5-10%/year, and (3) understand which costs are truly variable vs. fixed. The key question: is this a COVID normalization (one-time reset) or a structural shift?",
        type: "diagnostic",
        keywords: ["operating leverage", "fixed costs", "margin compression", "cost structure", "variable vs fixed", "COVID normalization"]
      },
      {
        q: "35% customer concentration with a single e-commerce retailer. How does this change your valuation approach?",
        hint: "Think about risk-adjusted multiples, scenario analysis, and what protections you'd need",
        answer: "This is a deal-breaker for many buyers and at minimum requires a significant discount. 35% concentration means: if that customer leaves, EBITDA goes from $4.55M to potentially negative (given the fixed cost base). Approach: (1) Apply a lower multiple (maybe 4x vs 5-6x for diversified logistics), (2) Structure a significant earnout tied to customer retention, (3) In DD, get the contract terms -- is it a 3-year MSA or at-will? (4) Run a 'customer leaves' scenario: can the business survive on the remaining 65% of revenue? At 27% gross margins with this fixed cost structure, the answer is probably no in the short term.",
        type: "risk",
        keywords: ["risk-adjusted multiple", "earnout", "contract terms", "scenario analysis", "customer leaves", "valuation discount"]
      },
      {
        q: "Free cash flow: Net income $0.6M + D&A $2.0M + WC improvement $0.8M - CapEx $2.5M = $0.9M. Is this business actually generating cash?",
        hint: "Compare FCF to EBITDA. Look at the conversion ratio and what's eating the cash.",
        answer: "Barely. $0.9M FCF on $4.55M adjusted EBITDA is only 20% cash conversion -- terrible. The culprits: $2.5M in CapEx (trucks wear out and need replacing) and $1.2M in debt service. After distributions ($0.3M), there's almost nothing left. This is a capital-intensive business masquerading as a service business. The EBITDA looks decent but it doesn't translate to cash you can actually extract. A buyer needs to understand: is the $2.5M CapEx maintenance or growth? If it's mostly maintenance, true free cash flow to equity is minimal.",
        type: "metric"
      },
      {
        q: "Given everything you see, would you invest? At what price? Or would you walk away?",
        hint: "Balance the infrastructure value against the declining revenue, customer concentration, and capital intensity",
        answer: "I'd walk away or require a steep discount. Here's why: (1) declining revenue with no clear floor, (2) 35% customer concentration with high fixed costs, (3) poor FCF conversion means EBITDA is misleading, (4) the IC contractor model is a regulatory time bomb. If I HAD to make an offer, it would be 3-3.5x adjusted EBITDA ($13.7-15.9M EV) with a heavy earnout component. But honestly, the risk/reward doesn't work -- there are better deals in this space. This is a good example of a business that screens well on top-line metrics but falls apart when you dig into the cash flow and risk profile.",
        type: "thesis",
        keywords: ["declining revenue", "customer concentration", "FCF conversion", "capital intensity", "contractor risk", "walk away", "steep discount"]
      }
    ]
  }
];
