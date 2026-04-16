export const DIFFICULTY_LABELS = { 1: "Beginner", 2: "Intermediate", 3: "Advanced" };

export const COMPANIES = [
  {
    id: "summit-hvac",
    difficulty: 1,
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
    difficulty: 2,
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
    difficulty: 2,
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
    difficulty: 1,
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
    difficulty: 3,
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
  },
  {
    id: "truenorth-saas",
    difficulty: 3,
    name: "TrueNorth Analytics",
    industry: "B2B SaaS / Cybersecurity Compliance",
    description: "Cloud-based cybersecurity compliance platform helping mid-market companies automate SOC 2, ISO 27001, and HIPAA audit readiness. Founded 2019 by two ex-Palo Alto Networks engineers. 68 employees, fully remote.",
    revenue: 14.2,
    context: "High-growth SaaS with strong retention metrics but burning cash to acquire customers. Founders seeking PE growth equity to fund sales expansion without giving up majority control.",
    incomeStatement: {
      years: [2024, 2025],
      revenue: [11.1, 14.2],
      cogs: [2.4, 3.1],
      grossProfit: [8.7, 11.1],
      sgaExpense: [5.8, 7.2],
      ownerComp: [0.6, 0.7],
      depreciation: [0.2, 0.3],
      amortization: [0.4, 0.5],
      interestExpense: [0.1, 0.1],
      otherIncome: [0.0, 0.1],
      netIncome: [1.6, 2.4],
      addBacks: { ownerPerks: 0.1, oneTimeExpenses: 0.3, aboveMarketRent: 0.0 }
    },
    balanceSheet: {
      cash: 2.8, ar: 1.9, inventory: 0.0, otherCurrentAssets: 0.4,
      ppe: 0.3, goodwill: 0, otherLtAssets: 3.2,
      ap: 0.5, currentDebt: 0.3, accruedExpenses: 1.4,
      ltDebt: 1.2, otherLtLiabilities: 0.8, equity: 4.4
    },
    cashFlow: {
      netIncome: 2.4, da: 0.8, changeWc: -0.6, capex: -0.4,
      debtPayments: -0.2, distributions: -0.5
    },
    keyMetrics: {
      ebitda: 2.6, adjustedEbitda: 3.0, ebitdaMargin: 18.3, adjustedEbitdaMargin: 21.1,
      grossMargin: 78.2, revenueGrowth: 27.9,
      recurringRevenuePct: 92, customerConcentration: 8,
      employeeCount: 68, avgRevenuePerEmployee: 0.209
    },
    redFlags: ["S&M spend is 38% of revenue ($5.4M embedded in SGA) and growing faster than revenue", "CAC payback period is ~20 months, above the 12-month SaaS benchmark", "Capitalized software costs ($3.2M in other LT assets) could mask true R&D spend", "Negative FCF after reinvestment. Cash position ($2.8M) gives ~6 months runway at current burn", "Two co-founders splitting CEO/CTO roles. Decision-making bottleneck?"],
    greenFlags: ["92% recurring revenue on annual contracts. Very high revenue visibility", "Net revenue retention of ~115%. Existing customers are expanding", "78% gross margins typical of best-in-class SaaS", "Low customer concentration at 8%. No single customer dependency", "Large and growing TAM. Compliance spending is non-discretionary"],
    questions: [
      {
        q: "TrueNorth's gross margin is 78%. What makes up COGS in a SaaS business and is this margin sustainable at scale?",
        hint: "SaaS COGS includes hosting/infrastructure, customer support, and implementation costs. Think about economies of scale.",
        answer: "COGS of $3.1M on $14.2M revenue likely includes: cloud hosting (~$1.2M), customer success/support team (~$1.4M), and third-party data/API costs (~$0.5M). The 78% gross margin is solid for B2B SaaS (benchmarks: 70-85%). At scale, hosting costs grow sub-linearly with revenue (cloud economics), and support can be leveraged with better tooling. Gross margin should improve to 80-82% as the company scales, which is a positive signal. The key risk is if they're underinvesting in customer success, which would show up as higher churn later.",
        type: "metric"
      },
      {
        q: "The company capitalizes $3.2M in software development costs. If you expensed 50% of that, how would it change EBITDA and your view of profitability?",
        hint: "Capitalized software is an accounting choice that boosts current-period EBITDA. Expensing it gives a truer picture of ongoing R&D investment.",
        answer: "If 50% of the $3.2M cumulative capitalized amount represents current-year capitalization (~$1.6M annually), expensing it would reduce EBITDA from $2.6M to $1.0M, dropping the EBITDA margin from 18.3% to ~7%. This is a common SaaS accounting issue. The adjusted EBITDA of $3.0M already looks reasonable, but a buyer should normalize for capitalization policy. Many PE firms use a 'cash EBITDA' metric that treats all R&D as an expense. The company may be less profitable than it appears. In DD, you'd want the capitalization policy, useful life assumptions, and comparison to peers.",
        type: "adjustment"
      },
      {
        q: "A typical B2B SaaS company at this scale trades at 4-6x ARR or 12-18x EBITDA. What valuation range makes sense and what drives the wide spread?",
        hint: "Consider growth rate, retention, gross margin, and Rule of 40 (growth rate + EBITDA margin).",
        answer: "ARR is ~$13.1M (92% of $14.2M). At 4-6x ARR: $52.4-78.6M. At 12-18x adjusted EBITDA ($3.0M): $36-54M. The wide range exists because: Rule of 40 score = 28% growth + 18% EBITDA margin = 46, which is above the 40 threshold and suggests premium valuation. However, negative FCF and the need for continued investment temper the multiple. A fair range is probably 5x ARR ($65.5M) for a growth equity deal where founders retain majority. Net debt = ($0.3M + $1.2M) - $2.8M = -$1.3M (net cash), so equity value ~ $66.8M. The key driver of the multiple is whether the 28% growth rate is sustainable or decelerating.",
        type: "valuation"
      },
      {
        q: "The CAC payback period is 20 months, well above the SaaS benchmark of 12 months. How concerning is this and what would you investigate?",
        hint: "CAC payback affects capital efficiency and cash burn. But also consider LTV/CAC ratio and whether payback improves as the product matures.",
        answer: "A 20-month payback is concerning but not fatal, depending on context. Key investigation areas: (1) What is the fully-loaded CAC? Is it inflated by early-stage brand building that will normalize? (2) What is the LTV/CAC ratio? With ~115% NRR and low churn, LTV could be 5-6x CAC, which is healthy despite the long payback. (3) Is payback improving quarter over quarter? If it was 24 months a year ago, the trend is positive. (4) What are the unit economics by customer segment? Enterprise customers may have longer payback but higher LTV. (5) Is the sales cycle lengthening due to market saturation or competitive pressure? The 20-month payback combined with negative FCF means this company needs capital to grow, which gives the PE investor leverage in negotiations.",
        type: "risk",
        keywords: ["CAC payback", "LTV/CAC ratio", "unit economics", "capital efficiency", "sales cycle", "customer acquisition cost"]
      },
      {
        q: "92% recurring revenue with 115% NRR sounds great, but what are the risks hiding beneath those headline metrics?",
        hint: "Think about cohort analysis, gross vs. net retention, logo churn, and whether expansion revenue is masking underlying churn.",
        answer: "Several risks can hide behind strong headline metrics: (1) High NRR can mask high gross churn. If 15% of customers leave but the remaining 85% expand by 35%, NRR is 115% but you're losing logos fast. Need gross retention (should be >85%). (2) Expansion revenue may be driven by price increases, not true product adoption. Price-driven NRR is less sustainable. (3) Cohort analysis might show declining retention in newer cohorts, meaning the best customers were acquired early. (4) Annual contracts can mask churn. If contracts auto-renew with 90-day notice, true at-risk revenue might be higher than it appears. (5) The 8% top customer is likely on a custom enterprise deal. Losing that one customer would hurt disproportionately. In DD, you need a full cohort retention analysis, not just the blended NRR number.",
        type: "diagnostic",
        keywords: ["gross retention", "logo churn", "cohort analysis", "expansion revenue", "price increases", "contract terms", "NRR"]
      },
      {
        q: "Would you invest in TrueNorth? What's your thesis, and what's the biggest thing that could go wrong?",
        hint: "Balance the high-quality revenue model against the capital intensity of growth and competitive dynamics in cybersecurity SaaS.",
        answer: "Yes, with conviction. Thesis: TrueNorth has a capital-efficient, high-retention business in a regulatory-driven market where compliance spend is non-discretionary. The play is: (1) invest $10-15M in growth equity to fuel sales expansion and reduce CAC payback through better go-to-market efficiency, (2) push gross margins toward 82%+ through infrastructure optimization, (3) layer in channel partnerships (MSPs, consultancies) to supplement direct sales, (4) target Rule of 40 score of 55+ within 3 years. Exit at 6-8x ARR once the company reaches $25-30M ARR. Biggest risk: a major cybersecurity platform (CrowdStrike, Palo Alto) launches a 'good enough' compliance module bundled with their core product, compressing TrueNorth's TAM and pricing power. This is a real threat in SaaS, and the moat here is product depth, not distribution. You need to believe the compliance workflow is complex enough that a bolt-on won't satisfy serious buyers.",
        type: "thesis",
        keywords: ["growth equity", "recurring revenue", "compliance", "TAM", "CAC efficiency", "channel partnerships", "competitive moat", "platform risk"]
      }
    ]
  },
  {
    id: "ironclad-construction",
    difficulty: 3,
    name: "Ironclad Builders",
    industry: "Commercial Construction / General Contracting",
    description: "Regional commercial general contractor specializing in government, healthcare, and education projects. Founded 1998 by a veteran project manager. 185 employees, bonded up to $25M per project. Operates across three Southeastern states.",
    revenue: 52.8,
    context: "Profitable GC with a strong backlog and government contract history. Owner (age 63) looking for succession and capital to pursue larger projects requiring higher bonding capacity.",
    incomeStatement: {
      years: [2024, 2025],
      revenue: [49.8, 52.8],
      cogs: [40.8, 43.3],
      grossProfit: [9.0, 9.5],
      sgaExpense: [3.8, 4.1],
      ownerComp: [0.8, 0.9],
      depreciation: [0.7, 0.8],
      amortization: [0.0, 0.0],
      interestExpense: [0.3, 0.4],
      otherIncome: [0.1, 0.1],
      netIncome: [3.5, 3.4],
      addBacks: { ownerPerks: 0.3, oneTimeExpenses: 0.2, aboveMarketRent: 0.15 }
    },
    balanceSheet: {
      cash: 3.2, ar: 8.4, inventory: 0.0, otherCurrentAssets: 1.8,
      ppe: 4.2, goodwill: 0, otherLtAssets: 0.6,
      ap: 6.5, currentDebt: 1.0, accruedExpenses: 2.8,
      ltDebt: 2.4, otherLtLiabilities: 0.9, equity: 4.6
    },
    cashFlow: {
      netIncome: 3.4, da: 0.8, changeWc: -1.4, capex: -1.1,
      debtPayments: -0.6, distributions: -1.5
    },
    keyMetrics: {
      ebitda: 4.6, adjustedEbitda: 5.25, ebitdaMargin: 8.7, adjustedEbitdaMargin: 9.9,
      grossMargin: 18.0, revenueGrowth: 6.0,
      recurringRevenuePct: 15, customerConcentration: 22,
      employeeCount: 185, avgRevenuePerEmployee: 0.285
    },
    redFlags: ["18% gross margins are thin for construction. One bad project can wipe out a quarter", "22% customer concentration. Likely one large government agency or health system", "Project-based revenue with no recurring component (only 15% is repeat/maintenance work)", "Working capital intensive. $8.4M in AR on a $52.8M business means slow collections", "Bonding capacity of $25M limits project size. Larger competitors can bid on bigger jobs", "Owner succession risk. The owner's relationships drive project wins"],
    greenFlags: ["$68M backlog provides 15+ months of revenue visibility", "40% government contract mix provides payment certainty and counter-cyclical stability", "Experienced estimating team with <2% average cost overrun rate on completed projects", "Low leverage. Only $3.4M total debt on $5.25M adjusted EBITDA = 0.6x", "185 employees with low turnover (12% annually) in a tight labor market"],
    questions: [
      {
        q: "Ironclad's gross margin is 18% and EBITDA margin is 8.7%. How do these compare to commercial GC benchmarks, and what's the risk of margin erosion?",
        hint: "GC industry margins are typically 15-22% gross and 5-10% EBITDA. Think about what can compress these already thin margins.",
        answer: "Ironclad's 18% gross margin is mid-range for commercial GCs (benchmarks: 15-22%). The 8.7% EBITDA margin is also reasonable (industry: 5-10%). The concern is how thin these margins are in absolute terms. A single project cost overrun of $1M (very possible on a $20M+ project) would wipe out 22% of annual EBITDA. Margin risks include: (1) rising materials costs (steel, concrete, lumber), (2) labor cost inflation in a tight market, (3) project delays causing overhead absorption issues, (4) competitive bidding pressure on new work. In DD, you'd want the project-level P&L for the last 3 years to see margin variability by project. The standard deviation matters more than the average.",
        type: "metric"
      },
      {
        q: "The owner takes $900K in comp plus $300K in perks. There is also $200K in one-time legal fees and $150K in above-market rent on a company-owned property. Walk through the full EBITDA bridge.",
        hint: "Start with net income, add back interest, taxes (assume pass-through), D&A, then add-backs. Be precise.",
        answer: "EBITDA bridge: Net Income $3.4M + Depreciation $0.8M + Interest $0.4M = EBITDA of $4.6M. Add-backs: $0.3M owner perks + $0.2M one-time legal + $0.15M above-market rent = $0.65M. Adjusted EBITDA = $4.6M + $0.65M = $5.25M. If you also normalize owner comp (replace $0.9M with a $250K GM), that adds another $650K, bringing normalized EBITDA to ~$5.9M or an 11.2% margin. For a GC business, that is strong.",
        type: "adjustment"
      },
      {
        q: "With a $68M backlog and $52.8M in annual revenue, what does the backlog-to-revenue ratio tell you? How would you use this in your valuation framework?",
        hint: "Backlog is the GC equivalent of a SaaS pipeline. It provides revenue visibility but isn't guaranteed. Think about burn rate and backlog quality.",
        answer: "Backlog-to-revenue ratio is 1.29x ($68M / $52.8M), meaning roughly 15 months of current revenue is in the pipeline. This is solid for a GC. 40% of backlog is government work, which is highly reliable (government projects rarely cancel). However, backlog is not revenue. Key questions: (1) What's the average margin in the backlog vs. historical? If they bid aggressively to fill backlog, margins could decline. (2) How much of the backlog is contracted vs. LOI/awarded but unsigned? (3) What's the typical conversion rate from backlog to revenue? For valuation, a strong backlog supports a higher multiple (maybe 5-6x adjusted EBITDA vs. 4-5x for a GC with weak visibility). At 5.5x adjusted EBITDA ($5.25M), EV would be ~$28.9M. The backlog provides downside protection that justifies the premium.",
        type: "valuation"
      },
      {
        q: "Construction is inherently project-based with no recurring revenue. How does this affect your risk assessment and what would you do post-acquisition to improve revenue predictability?",
        hint: "Think about how PE firms create recurring revenue in project-based businesses: service contracts, maintenance programs, preferred vendor agreements.",
        answer: "Project-based revenue is the Achilles' heel of construction investing. Every year starts at zero, and you're only as good as your next bid. Risk factors: (1) Revenue can swing 20-30% year over year based on project timing, (2) Fixed overhead doesn't flex with project volume, (3) A recession can freeze project starts overnight. Post-acquisition revenue predictability plays: (1) Build a maintenance/facilities management division offering annual contracts to past clients (target 30%+ recurring within 3 years), (2) Pursue multi-year MSAs with health systems and school districts for ongoing renovation work, (3) Develop a preferred vendor program with repeat clients that provides right of first refusal on new projects, (4) Acquire a specialty subcontractor with maintenance contracts. The goal is to shift from 15% to 40%+ recurring revenue, which also supports a higher exit multiple.",
        type: "risk",
        keywords: ["project-based revenue", "recurring revenue", "maintenance contracts", "revenue predictability", "MSA", "preferred vendor", "facilities management"]
      },
      {
        q: "The estimating team has a <2% cost overrun rate. Why is this metric so critical in construction, and how would you protect it post-acquisition?",
        hint: "In a thin-margin business, estimating accuracy is the difference between profit and loss. Think about what happens when key estimators leave.",
        answer: "In a business with 18% gross margins, a 2% cost overrun on a $20M project ($400K) represents nearly 10% of annual EBITDA. The estimating team IS the competitive advantage. Most GCs run 5-8% average overruns, so <2% is exceptional. This creates two risks and one opportunity: Risks: (1) Key-person risk on the estimating team. If the lead estimator leaves, accuracy could drop significantly. Need to understand the team depth and how knowledge is transferred. (2) The low overrun rate might be because they bid conservatively and leave money on the table. Opportunity: This accuracy supports bidding on larger, more complex projects where competitors struggle. Post-acquisition protection: (1) Retention bonuses and equity incentives for key estimators, (2) Document and systematize the estimating process (proprietary database of costs by project type), (3) Invest in estimating software to reduce dependency on individual judgment.",
        type: "diagnostic",
        keywords: ["estimating accuracy", "cost overruns", "key-person risk", "competitive advantage", "margin protection", "process documentation"]
      },
      {
        q: "Would you invest in Ironclad? What is your thesis and how do you get to a 3x MOIC in a low-growth, thin-margin business?",
        hint: "Construction is typically a 'pass' for PE. What would make this one different? Think about the value creation levers beyond organic growth.",
        answer: "Cautious yes, but only at the right price and with a clear operational playbook. Thesis: Ironclad is a well-run GC with a certification/bonding moat, excellent estimating, and government relationships that are hard to replicate. The 3x MOIC path: (1) Increase bonding capacity from $25M to $50M+ per project by adding PE-backed financial strength. This unlocks a larger addressable market immediately. (2) Build recurring revenue through a facilities management division (target $8-10M within 3 years). (3) Margin expansion by investing in project management technology and prefab capabilities (push EBITDA margin from 10% to 13%). (4) Selective bolt-on acquisitions of specialty subcontractors to vertically integrate and capture subcontractor margin. (5) Entry price matters enormously. At 4.5x adjusted EBITDA ($23.6M EV), a 3x MOIC requires growing EBITDA to ~$8M and exiting at 5.5x in 4-5 years. Achievable but requires disciplined execution. Would not pay more than 5x.",
        type: "thesis",
        keywords: ["bonding capacity", "facilities management", "recurring revenue", "margin expansion", "bolt-on acquisitions", "vertical integration", "entry price"]
      }
    ]
  },
  {
    id: "vitality-vet",
    difficulty: 2,
    name: "Vitality Pet Wellness",
    industry: "Healthcare Services / Veterinary",
    description: "Multi-location veterinary clinic group with 3 clinics across suburban Atlanta. Founded 2018 by a veterinarian-turned-operator. 52 employees, 7 veterinarians. Offers primary care, surgery, dental, and wellness plans.",
    revenue: 8.4,
    context: "Early-stage vet roll-up with strong unit economics and a wellness plan model that drives recurring revenue. Founder seeking PE capital to acquire 3-4 more clinics and build a regional platform. Revenue is slightly below the typical $10M LMM threshold.",
    incomeStatement: {
      years: [2024, 2025],
      revenue: [6.9, 8.4],
      cogs: [2.6, 3.2],
      grossProfit: [4.3, 5.2],
      sgaExpense: [2.3, 2.8],
      ownerComp: [0.5, 0.5],
      depreciation: [0.3, 0.3],
      amortization: [0.1, 0.2],
      interestExpense: [0.2, 0.2],
      otherIncome: [0.0, 0.1],
      netIncome: [0.9, 1.3],
      addBacks: { ownerPerks: 0.15, oneTimeExpenses: 0.3, aboveMarketRent: 0.0 }
    },
    balanceSheet: {
      cash: 0.5, ar: 0.4, inventory: 0.3, otherCurrentAssets: 0.1,
      ppe: 1.8, goodwill: 1.6, otherLtAssets: 0.3,
      ap: 0.4, currentDebt: 0.4, accruedExpenses: 0.5,
      ltDebt: 2.1, otherLtLiabilities: 0.2, equity: 1.4
    },
    cashFlow: {
      netIncome: 1.3, da: 0.5, changeWc: -0.1, capex: -0.4,
      debtPayments: -0.3, distributions: -0.4
    },
    keyMetrics: {
      ebitda: 1.7, adjustedEbitda: 2.15, ebitdaMargin: 20.2, adjustedEbitdaMargin: 25.6,
      grossMargin: 61.9, revenueGrowth: 21.7,
      recurringRevenuePct: 65, customerConcentration: 2,
      employeeCount: 52, avgRevenuePerEmployee: 0.162
    },
    redFlags: ["Revenue of $8.4M is below the typical $10M LMM threshold. Some PE funds won't look at this", "21.7% growth is a mix of organic + acquired. What is same-store growth?", "$1.6M in goodwill from clinic acquisitions. Were they fairly priced?", "Vet shortage is a national issue. Losing 1-2 vets could materially impact revenue", "3 locations is very early stage. Integration complexity will grow with each acquisition", "One-time expenses of $300K. Likely acquisition and integration costs that will recur"],
    greenFlags: ["65% recurring revenue from wellness plans and routine care. Very sticky", "62% gross margins are strong for veterinary and improving", "2% customer concentration. Extremely diversified patient base", "Pet healthcare spending is recession-resistant and growing with humanization trend", "Demographic tailwinds: pet ownership at all-time highs, spending per pet increasing 8-10% annually", "Founder is an operator, not just a clinician. Scalable leadership model"],
    questions: [
      {
        q: "Revenue per veterinarian is $1.2M ($8.4M / 7 vets). How does this compare to industry benchmarks and what does it tell you about productivity and growth capacity?",
        hint: "Industry average is $800K-1.2M per vet. Think about what drives revenue per vet: visit volume, average transaction value, ancillary services.",
        answer: "At $1.2M per vet, Vitality is at the top of the industry range ($800K-$1.2M). This could mean: (1) Vets are fully booked with limited appointment availability, meaning organic growth is capacity-constrained without adding vets. (2) Average transaction value is high, possibly driven by wellness plans that bundle services. (3) Good ancillary revenue (dental, surgery, diagnostics) supplementing primary care. The implication for growth: organic revenue growth requires either adding vets (hard in a shortage) or increasing revenue per visit (limited upside if already at the top). This reinforces that acquisitions are the primary growth lever. In DD, you'd want visit volume trends, average ticket size by service, and vet utilization rates by clinic.",
        type: "metric"
      },
      {
        q: "The company has $300K in one-time expenses (likely acquisition costs) and the owner takes $500K + $150K in perks. Normalize EBITDA for a PE buyer and flag what you'd challenge.",
        hint: "In a roll-up, are acquisition costs really one-time? And is $500K owner comp above or below market for a vet practice CEO?",
        answer: "Starting EBITDA: $1.7M. Add-backs: $150K owner perks + $300K one-time expenses + $0 above-market rent = $450K. Adjusted EBITDA = $2.15M. But I'd challenge two things: (1) The $300K 'one-time' acquisition costs will recur if the strategy is to acquire 3-4 more clinics. This is recurring cost of doing business, not truly one-time. Removing this add-back drops adjusted EBITDA to $1.85M. (2) Owner comp of $500K is arguably below market for a multi-location practice CEO. A PE-installed operator might cost $350-400K, so there's actually a $100-150K add-back available from normalizing the owner comp DOWN. Net adjusted EBITDA with these corrections: ~$1.95-2.0M. The difference between $2.15M and $1.95M is ~10%, which matters at 8-10x multiples.",
        type: "adjustment"
      },
      {
        q: "Vet roll-ups have traded at 10-14x EBITDA at scale. Vitality is at $8.4M revenue with 3 locations. What multiple is appropriate now, and how does the 'platform premium' work?",
        hint: "Think about the multiple arbitrage in roll-ups: buy individual practices at 4-6x, build a platform valued at 10-14x. But you need scale to get there.",
        answer: "At 3 locations and $8.4M revenue, Vitality is too small for platform multiples. Current fair value: 6-8x adjusted EBITDA ($2.15M) = $12.9-17.2M EV. The platform premium works like this: individual vet practices trade at 4-6x EBITDA. A PE-backed platform at 15+ locations and $30M+ revenue trades at 10-14x because of (1) diversification, (2) professional management, (3) growth predictability, and (4) strategic acquirer interest. The arbitrage: buy clinics at 5x, integrate them into the platform, and the whole entity re-rates to 10-12x at exit. If Vitality grows to $25M revenue and $5M EBITDA through acquisitions and organic growth, exit at 11x = $55M. That is 3-4x the entry investment. But you need $15-20M of acquisition capital to get there, and execution risk is real.",
        type: "valuation"
      },
      {
        q: "There are only ~120,000 veterinarians in the US and demand far outstrips supply. How does the vet shortage affect your risk assessment of this deal?",
        hint: "Think about both the risk (losing vets) and the opportunity (barrier to new competition). Consider retention strategies.",
        answer: "The vet shortage is both the biggest risk and the biggest opportunity: Risk: (1) Losing even 1 vet at a 3-clinic operation means ~15% revenue loss. (2) Recruiting costs are high ($30-50K per vet placement). (3) Remaining vets face burnout from overwork, creating a turnover spiral. (4) Salary inflation is 5-8% annually, compressing margins. Opportunity: (1) The shortage is a massive barrier to entry. No one can open competing clinics without vets. (2) Clinics with strong culture and modern equipment attract talent. (3) Consolidation platforms can offer vets career paths, mentorship, and better work-life balance than solo practices. Mitigation: (1) Retention bonuses and equity incentives for vets. (2) Invest in support staff (vet techs) to leverage vet time. (3) Competitive benefits including student loan repayment. (4) Maintain manageable caseloads. In DD, you need vet employment agreements, tenure data, and non-compete enforceability by state.",
        type: "risk",
        keywords: ["vet shortage", "talent retention", "burnout", "salary inflation", "barrier to entry", "recruitment", "non-compete", "equity incentives"]
      },
      {
        q: "21.7% revenue growth is a blend of organic and acquired growth. How would you decompose this and why does it matter for the investment thesis?",
        hint: "Acquired growth requires capital and carries integration risk. Organic growth is higher quality. Separating them tells you what you are really buying.",
        answer: "Decomposition approach: If Vitality acquired one clinic mid-year that generates $1.0M annually (contributing ~$0.5M in the partial year), organic growth would be: ($8.4M - $0.5M acquired - $6.9M prior year) / $6.9M = ~14.5% organic growth. This distinction is critical because: (1) 14.5% organic growth is very strong for vet clinics (industry average is 5-8%), validating the wellness plan model. (2) Acquired growth of ~7% cost money to purchase, meaning actual cash returns from acquisitions depend on the purchase multiple. (3) If organic growth is only 5-6% and the rest is acquired, the business is dependent on M&A to hit growth targets, which is riskier and more capital-intensive. For the thesis, you want to see 10%+ organic growth proving the model works, with acquisitions layered on top for acceleration. If organic growth is weak, you are just buying revenue, not a platform.",
        type: "diagnostic",
        keywords: ["organic growth", "acquired growth", "same-store growth", "wellness plans", "integration risk", "capital intensity", "revenue quality"]
      },
      {
        q: "Would you invest in Vitality despite it being below the $10M revenue threshold? What is your thesis and what must be true for it to work?",
        hint: "Below $10M is unusual for PE. What justifies the exception? Think about unit economics, growth trajectory, and the path to scale.",
        answer: "Yes, but as a growth equity bet with specific milestones. Thesis: Vitality is a sub-scale platform with proven unit economics, a differentiated wellness plan model driving 65% recurring revenue, and a founder who is an operator, not just a clinician. The play: invest $8-10M to acquire 4-5 clinics over 18 months, reaching $18-20M revenue and $4-5M EBITDA. Exit at 10-12x EBITDA ($40-60M) in 4-5 years. What must be true: (1) Same-store organic growth stays above 10%, proving the wellness model works across locations. (2) Vet retention rate stays above 85%, which means the culture and compensation model are scalable. (3) Acquired clinics can be integrated within 6 months and brought to platform-level margins. (4) The founder can manage 7-8 locations without burning out or the team can hire a COO. (5) Acquisition multiples for individual practices stay at 4-6x, preserving the arbitrage. If any of these fail, the thesis breaks. It is a higher-risk, higher-reward bet than a $20M platform, but the sub-$10M entry point means a lower purchase price and more upside.",
        type: "thesis",
        keywords: ["growth equity", "sub-scale platform", "wellness plans", "vet retention", "multiple arbitrage", "organic growth", "integration", "unit economics"]
      }
    ]
  },
  {
    id: "meridian-fulfillment",
    difficulty: 2,
    name: "Meridian Fulfillment Co.",
    industry: "E-Commerce Fulfillment / 3PL",
    description: "Third-party logistics provider specializing in order fulfillment for direct-to-consumer e-commerce brands. Founded 2015. 145 employees across 3 warehouse locations (NJ, TX, NV). Handles pick, pack, ship, and returns processing.",
    revenue: 29.5,
    context: "Growing 3PL riding the DTC e-commerce wave. Has invested heavily in warehouse automation. Seeking PE capital to open a 4th facility and fund technology upgrades. Competes with Amazon FBA, ShipBob, and regional players.",
    incomeStatement: {
      years: [2024, 2025],
      revenue: [26.3, 29.5],
      cogs: [17.9, 20.1],
      grossProfit: [8.4, 9.4],
      sgaExpense: [4.2, 4.8],
      ownerComp: [0.7, 0.8],
      depreciation: [1.0, 1.2],
      amortization: [0.1, 0.1],
      interestExpense: [0.4, 0.5],
      otherIncome: [0.1, 0.1],
      netIncome: [2.1, 2.1],
      addBacks: { ownerPerks: 0.2, oneTimeExpenses: 0.35, aboveMarketRent: 0.0 }
    },
    balanceSheet: {
      cash: 1.4, ar: 3.8, inventory: 0.0, otherCurrentAssets: 0.5,
      ppe: 6.2, goodwill: 0, otherLtAssets: 1.1,
      ap: 2.3, currentDebt: 1.5, accruedExpenses: 1.6,
      ltDebt: 3.8, otherLtLiabilities: 0.7, equity: 3.1
    },
    cashFlow: {
      netIncome: 2.1, da: 1.3, changeWc: -0.5, capex: -2.2,
      debtPayments: -0.8, distributions: -0.6
    },
    keyMetrics: {
      ebitda: 4.1, adjustedEbitda: 4.65, ebitdaMargin: 13.9, adjustedEbitdaMargin: 15.8,
      grossMargin: 31.9, revenueGrowth: 12.2,
      recurringRevenuePct: 40, customerConcentration: 18,
      employeeCount: 145, avgRevenuePerEmployee: 0.203
    },
    redFlags: ["Amazon FBA is the 800-pound gorilla. Brands can switch to FBA with minimal friction", "CapEx intensive: $2.2M (7.5% of revenue) for warehouse equipment and automation", "18% customer concentration. Likely one large DTC brand that could pull volume", "Seasonal volatility. Q4 can be 35-40% of annual revenue. Miss peak season and the year is wrecked", "Only 40% contracted revenue. 60% is transactional and can leave with 30-day notice", "Net income flat YoY ($2.1M both years) despite 12% revenue growth. Where is the margin expansion?"],
    greenFlags: ["3 warehouse locations provide geographic coverage and redundancy (NJ, TX, NV)", "Automation investments ($1.1M in other LT assets) reducing cost per order over time", "Long-term contracts (3-year avg) with growing DTC brands provide stable base", "12% revenue growth outpacing the broader 3PL industry growth of 8%", "Returns processing capability is a high-margin, differentiated service", "No inventory on balance sheet. True asset-light service model"],
    questions: [
      {
        q: "Meridian's cost per order is a critical metric. With $20.1M in COGS and an estimated 2.5M orders processed, what's the unit economics story?",
        hint: "COGS / orders = cost per order. Then think about average revenue per order and contribution margin. What drives cost per order down?",
        answer: "Cost per order = $20.1M / 2.5M orders = $8.04. If average revenue per order is $11.80 ($29.5M / 2.5M), gross profit per order is $3.76, or a 31.9% contribution margin. This is decent but not great for 3PL (leaders achieve $4-5 per order). What drives improvement: (1) Automation reduces labor per order (currently ~60% of COGS). Each $500K automation investment should drop cost per order by $0.30-0.50. (2) Order density: more orders per warehouse = lower fixed cost allocation. (3) Shipping rate negotiation with carriers improves with volume. (4) Returns processing at $3-5 per return is higher margin than outbound fulfillment. A PE buyer should model cost per order declining 5-8% annually through automation, which flows straight to EBITDA.",
        type: "metric"
      },
      {
        q: "Net income was flat at $2.1M despite 12% revenue growth. Walk through where the incremental revenue went and whether this is a problem.",
        hint: "Revenue grew $3.2M. Trace it through COGS, SGA, depreciation, and interest. Which line items absorbed the growth?",
        answer: "Revenue grew $3.2M ($26.3M to $29.5M). Where it went: COGS increased $2.2M (proportional, so gross margins held). SGA increased $0.6M (14% growth vs. 12% revenue growth, slightly outpacing). D&A increased $0.2M (higher depreciation from automation investments). Interest increased $0.1M (more debt). Owner comp increased $0.1M. Total cost increases: $3.2M, exactly matching revenue growth. This means the business is scaling but not generating operating leverage. The question is whether the automation investments (driving higher D&A) will eventually reduce labor costs enough to create margin expansion. If not, this is a scale-but-not-profit story, which is less attractive for PE. You need to see a credible path to 16-18% EBITDA margins within 2-3 years for the deal to work.",
        type: "adjustment"
      },
      {
        q: "3PL businesses typically trade at 6-8x EBITDA. What drives the multiple range, and where does Meridian fall?",
        hint: "Think about what makes a 3PL worth 8x vs. 6x: contract quality, technology, customer diversification, and growth profile.",
        answer: "Multiple drivers in 3PL: Higher end (8x+): high contracted revenue percentage, strong technology/automation, diversified customer base, double-digit growth, and returns/value-added services. Lower end (6x): transactional revenue, commodity services, customer concentration, and low barriers to entry. Meridian falls in the middle. Positives: 12% growth, 3 facilities, automation investments, returns processing capability. Negatives: only 40% contracted (below the 60%+ threshold for premium multiples), 18% concentration, flat margins. Fair range: 6.5-7.5x adjusted EBITDA ($4.65M) = $30.2-34.9M EV. Net debt = ($1.5M + $3.8M) - $1.4M = $3.9M. Equity value: $26.3-31.0M. To command 8x+, Meridian needs to get contracted revenue above 60% and demonstrate margin expansion from automation investments.",
        type: "valuation"
      },
      {
        q: "60% of Meridian's revenue is transactional (no contract, 30-day notice). How does this change your risk assessment compared to the 40% that is contracted?",
        hint: "Transactional revenue in 3PL means customers can leave for Amazon FBA, ShipBob, or any competitor with minimal switching costs. What protects Meridian?",
        answer: "The 60% transactional revenue is a significant risk. In practical terms: (1) $17.7M in revenue could theoretically walk out the door with 30 days notice. (2) Amazon FBA offers a 'good enough' alternative for many brands with no setup cost. (3) Newer competitors (ShipBob, ShipMonk) are aggressively pricing to win share. However, switching costs are higher than they appear: (1) Integration work (connecting to the brand's e-commerce platform, ERP, returns portal) creates friction. (2) Brands have to re-train their operations team on new systems. (3) Mid-peak-season switching is nearly impossible. Mitigation: (1) Convert transactional customers to 1-2 year contracts with volume commitments and pricing incentives. (2) Deepen integrations to increase switching costs. (3) Offer value-added services (kitting, subscription box assembly, returns processing) that commoditized 3PLs don't provide. Target: move from 40% to 65% contracted within 2 years post-acquisition.",
        type: "risk",
        keywords: ["transactional revenue", "switching costs", "Amazon FBA", "contract conversion", "customer retention", "integration", "value-added services"]
      },
      {
        q: "Meridian processes ~2.5M orders across 3 warehouses. What does warehouse utilization look like, and why does peak season capacity matter so much in 3PL?",
        hint: "Think about average daily throughput vs. peak throughput. A 3PL that's 85% utilized on average may be 120% at peak, meaning they have to turn away business.",
        answer: "At 2.5M orders across 3 warehouses, average throughput is ~833K orders per facility per year, or ~3,200 orders per day. But if Q4 is 35-40% of volume, peak daily throughput could hit 5,000-6,000 orders per facility. This creates several issues: (1) If warehouses are 80% utilized on average, they're 110-120% at peak, requiring expensive temp labor, overtime, and potential service level failures. (2) Brands evaluate 3PLs based on peak performance. One blown peak season and a customer is gone. (3) Building capacity for peak means excess capacity for 8 months of the year, killing utilization economics. (4) The 4th warehouse they want to build addresses peak capacity but adds fixed costs year-round. In DD, ask for monthly order volume by warehouse for the last 3 years, peak season SLA performance, and the staffing model (how many temps vs. permanent at peak). The ideal is 70% average utilization with the flexibility to surge to 100% at peak through automation and flex labor.",
        type: "diagnostic",
        keywords: ["warehouse utilization", "peak season", "throughput", "capacity planning", "temp labor", "service levels", "seasonal volatility"]
      },
      {
        q: "Would you invest in Meridian? What is your thesis and how do you win against Amazon FBA?",
        hint: "You cannot beat Amazon on scale or price. Think about where a mid-market 3PL can differentiate and build a defensible position.",
        answer: "Yes, with a focused differentiation strategy. You cannot beat Amazon on price or scale, so don't try. Thesis: Meridian targets the underserved mid-market DTC brand ($5-50M revenue) that has outgrown Amazon FBA but is too small for enterprise 3PLs (XPO, Radial). The play: (1) Invest $5-8M in the 4th warehouse and automation to reduce cost per order by 15% over 3 years. (2) Build a technology layer (real-time analytics, inventory optimization, branded tracking) that creates switching costs. (3) Expand returns processing and value-added services (kitting, subscription assembly) to drive higher margin per order. (4) Convert transactional customers to contracts through volume incentives and custom integration work. (5) Selectively acquire 1-2 smaller 3PLs for their customer books and geographic coverage. Target: grow from $29.5M to $45M revenue and improve EBITDA margin from 16% to 19% in 4 years, then exit at 7-8x EBITDA ($8.5M x 7.5 = $63.8M). The Amazon risk is real but manageable if you stay focused on the mid-market niche where FBA's limitations (no custom branding, limited returns flexibility, no kitting) matter most to customers.",
        type: "thesis",
        keywords: ["mid-market DTC", "Amazon FBA differentiation", "automation", "returns processing", "switching costs", "contract conversion", "value-added services", "niche focus"]
      }
    ]
  }
];
