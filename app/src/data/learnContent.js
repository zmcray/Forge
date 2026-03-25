export const LEARN_CONTENT = [
  // ===== SECTION 1: ANALYZING FINANCIAL STATEMENTS =====
  {
    id: "s1",
    title: "1. Analyzing Financial Statements",
    subsections: [
      {
        id: "s1a",
        title: "1A. Gross Margin",
        blocks: [
          {
            type: "text",
            content: "Gross margin is the first number PE analysts check on any income statement. It tells you how much money the business keeps after paying direct costs (COGS) to deliver its product or service. A high gross margin means pricing power and room for overhead; a low or declining one signals a commodity business or cost pressure."
          },
          {
            type: "text",
            content: "The formula is simple: Gross Profit divided by Revenue. Drag the correct items from Summit's P&L below to build the equation."
          },
          {
            type: "calculationExercise",
            id: "ex-1a-calc",
            layout: "division",
            instruction: "Build the gross margin formula by dragging the correct items from the P&L into the equation.",
            resultLabel: "Gross Margin",
            resultValue: "36.0%",
            explanation: "Summit's 36% gross margin is solid for HVAC services. It means for every dollar of revenue, $0.36 remains after paying technicians, parts, and direct job costs. In LMM screening, you compare gross margin within the industry. HVAC services typically run 30-40%, so Summit is at the higher end, suggesting good pricing discipline or an efficient service model.",
            zones: [
              { id: "numerator", correctIds: ["gross-profit"], hint: "What profit goes on top?" },
              { id: "denominator", correctIds: ["revenue"], hint: "Divide by what?" }
            ],
            draggables: [
              { id: "revenue", label: "Revenue", value: "$32.5M" },
              { id: "cogs", label: "COGS", value: "$20.8M" },
              { id: "gross-profit", label: "Gross Profit", value: "$11.7M" },
              { id: "net-income", label: "Net Income", value: "$2.3M" },
              { id: "sga", label: "SG&A", value: "$6.1M" }
            ],
            supplementalItems: []
          }
        ]
      },
      {
        id: "s1b",
        title: "1B. Net Margin",
        blocks: [
          {
            type: "text",
            content: "Net margin shows how much of each revenue dollar survives all the way to the bottom line after every expense: COGS, overhead, owner compensation, depreciation, interest, and taxes. In public company analysis, net margin is a core metric. In LMM PE, it is often misleading because owner compensation, one-time costs, and tax structures distort it."
          },
          {
            type: "text",
            content: "That said, building the formula is essential. It sets up the next step: understanding why PE uses EBITDA instead."
          },
          {
            type: "calculationExercise",
            id: "ex-1b-calc",
            layout: "division",
            instruction: "Build the net margin formula. What goes in the numerator and denominator?",
            resultLabel: "Net Margin",
            resultValue: "7.1%",
            explanation: "Summit's 7.1% net margin looks thin, but in LMM this number is almost always misleading. The owner takes $2.0M in compensation plus $400K in perks. Interest expense reflects the current owner's debt choices, not what a buyer would structure. Depreciation is a non-cash charge. That is why PE strips all of this out and works with EBITDA and Adjusted EBITDA instead. The next two exercises show exactly how.",
            zones: [
              { id: "numerator", correctIds: ["net-income"], hint: "What is the bottom line?" },
              { id: "denominator", correctIds: ["revenue"], hint: "Divide by what?" }
            ],
            draggables: [
              { id: "revenue", label: "Revenue", value: "$32.5M" },
              { id: "gross-profit", label: "Gross Profit", value: "$11.7M" },
              { id: "net-income", label: "Net Income", value: "$2.3M" },
              { id: "cogs", label: "COGS", value: "$20.8M" },
              { id: "owner-comp", label: "Owner Comp", value: "$2.0M" }
            ],
            supplementalItems: []
          }
        ]
      },
      {
        id: "s1c",
        title: "1C. EBITDA",
        blocks: [
          {
            type: "text",
            content: "EBITDA strips out capital structure (Interest), tax strategy (Taxes), and non-cash accounting charges (Depreciation, Amortization) to reveal the operating earnings of the business. It is the starting point for valuation in virtually every PE deal."
          },
          {
            type: "text",
            content: "The formula starts with Net Income and adds back four items. Note: Taxes are not shown as a separate line on Summit's P&L, but they are implied by the gap between pre-tax income and net income. Check the 'Additional Items' section below the P&L."
          },
          {
            type: "calculationExercise",
            id: "ex-1c-calc",
            layout: "addition",
            instruction: "Build the EBITDA formula. Start with Net Income, then add back the four items that EBITDA removes.",
            resultLabel: "EBITDA",
            resultValue: "$4.6M",
            explanation: "EBITDA of $4.6M on $32.5M revenue gives a 14.2% EBITDA margin. This is the operating earnings before any adjustments. But this is not the number PE uses to value the business. The owner's excess compensation, perks, and one-time costs still need to be added back. That is the next step: Adjusted EBITDA.",
            zones: [
              { id: "base", correctIds: ["net-income"], hint: "Start with the bottom line" },
              { id: "add1", correctIds: ["interest", "taxes", "depreciation", "amortization"], hint: "Add back..." },
              { id: "add2", correctIds: ["interest", "taxes", "depreciation", "amortization"], hint: "Add back..." },
              { id: "add3", correctIds: ["interest", "taxes", "depreciation", "amortization"], hint: "Add back..." },
              { id: "add4", correctIds: ["interest", "taxes", "depreciation", "amortization"], hint: "Add back..." }
            ],
            draggables: [
              { id: "net-income", label: "Net Income", value: "$2.3M" },
              { id: "interest", label: "Interest", value: "$0.3M" },
              { id: "taxes", label: "Taxes", value: "$0.8M" },
              { id: "depreciation", label: "Depreciation", value: "$1.1M" },
              { id: "amortization", label: "Amortization", value: "$0.1M" },
              { id: "revenue", label: "Revenue", value: "$32.5M" },
              { id: "gross-profit", label: "Gross Profit", value: "$11.7M" }
            ],
            supplementalItems: [
              { id: "taxes", label: "Taxes (derived)", value: "$0.8M", note: "Taxes are not a separate line on this P&L. Pre-tax income is $3.1M and Net Income is $2.3M, so taxes = $0.8M." }
            ]
          }
        ]
      },
      {
        id: "s1d",
        title: "1D. Adjusted EBITDA",
        blocks: [
          {
            type: "text",
            content: "Adjusted EBITDA is the number PE uses to value a business. It takes EBITDA and adds back costs that will not continue under new ownership: owner perks, one-time expenses, and above-market rent the owner charges. These add-backs are where the art of LMM analysis lives. Legitimate add-backs can double the effective profitability; aggressive ones are a red flag."
          },
          {
            type: "text",
            content: "Summit has three add-backs. Drag them from the 'Additional Items' section into the equation to see how they transform the valuation basis."
          },
          {
            type: "calculationExercise",
            id: "ex-1d-calc",
            layout: "addition",
            instruction: "Build the Adjusted EBITDA formula. Start with EBITDA, then add the three legitimate add-backs.",
            resultLabel: "Adjusted EBITDA",
            resultValue: "$5.5M",
            explanation: "The $0.9M in add-backs takes EBITDA from $4.6M to $5.5M, a 20% increase. At a typical 5-6x multiple, that $0.9M in add-backs is worth $4.5-5.4M in enterprise value. This is why add-back analysis is so critical in PE. Note: this does not yet include the biggest potential add-back, owner excess compensation ($2.0M salary vs. a $250K replacement GM), which would push Adjusted EBITDA even higher. That larger adjustment is typically negotiated separately.",
            zones: [
              { id: "base", correctIds: ["ebitda"], hint: "Start with EBITDA" },
              { id: "add1", correctIds: ["owner-perks", "one-time", "above-market-rent"], hint: "Add-back" },
              { id: "add2", correctIds: ["owner-perks", "one-time", "above-market-rent"], hint: "Add-back" },
              { id: "add3", correctIds: ["owner-perks", "one-time", "above-market-rent"], hint: "Add-back" }
            ],
            draggables: [
              { id: "ebitda", label: "EBITDA", value: "$4.6M" },
              { id: "owner-perks", label: "Owner Perks", value: "$0.4M" },
              { id: "one-time", label: "One-Time Expenses", value: "$0.3M" },
              { id: "above-market-rent", label: "Above-Market Rent", value: "$0.2M" },
              { id: "owner-comp", label: "Owner Comp", value: "$2.0M" },
              { id: "sga", label: "SG&A", value: "$6.1M" }
            ],
            supplementalItems: [
              { id: "ebitda", label: "EBITDA", value: "$4.6M" },
              { id: "owner-perks", label: "Owner Perks", value: "$0.4M" },
              { id: "one-time", label: "One-Time Expenses", value: "$0.3M" },
              { id: "above-market-rent", label: "Above-Market Rent", value: "$0.2M" }
            ]
          }
        ]
      }
    ]
  },

  // ===== SECTION 2: FIRST-PASS SCREENING METRICS =====
  {
    id: "s2",
    title: "2. First-Pass Screening Metrics",
    subsections: [
      {
        id: "s2a",
        title: "2A. The Seven Key Metrics",
        blocks: [
          {
            type: "text",
            content: "When a deal hits your desk, you need to quickly assess whether it is worth a deeper look. These seven metrics let you screen a business in under 10 minutes. Each one tests a different dimension of business quality. No single metric is a deal-breaker on its own, but together they paint a clear picture."
          },
          {
            type: "metricTable",
            headers: ["Metric", "Formula", "LMM Benchmark", "Why It Matters"],
            rows: [
              ["Revenue", "Total sales", "$10-75M", "Below $10M is usually too small for institutional PE. Above $75M attracts larger, more competitive funds."],
              ["Revenue Growth", "(Current - Prior) / Prior", "5-15% organic", "Shows demand trajectory. Declining revenue is a yellow flag. Hyper-growth may not be sustainable."],
              ["Gross Margin", "Gross Profit / Revenue", "Varies by industry", "Indicates pricing power and direct cost control. Compare within industry, not across."],
              ["Adjusted EBITDA Margin", "Adj. EBITDA / Revenue", "15-25% (services), 10-20% (distribution)", "The core profitability metric in PE. Higher margins mean more room for debt service and value creation."],
              ["Customer Concentration", "Top customer % of revenue", "Under 20%", "Above 20% is risky. Above 35% is often a deal-breaker. One customer leaving could destroy the business."],
              ["Recurring Revenue %", "Contracted/repeat revenue / Total", "Above 50% preferred", "Recurring revenue is more predictable and commands higher multiples."],
              ["Leverage (Debt/EBITDA)", "Total Debt / Adj. EBITDA", "Under 3x comfortable", "Above 4x is highly leveraged. Indicates risk and limits future borrowing capacity."]
            ]
          },
          {
            type: "text",
            content: "Let's practice screening. Below are the key metrics for Precision CNC Solutions. Review them and then answer the screening question."
          },
          {
            type: "companyData",
            companyId: "precision-manufacturing",
            view: "metrics"
          },
          {
            type: "exercise",
            id: "ex-2a-1",
            q: "Based on the seven screening metrics, would Precision CNC pass your first-pass screen? Which metrics are strong and which raise concerns?",
            inputMode: "qualitative",
            answer: "Precision mostly passes with flying colors. Strong: Revenue of $12.8M is in range. Revenue growth of 14.3% is excellent. Gross margin of 43% is exceptional for manufacturing. Adjusted EBITDA margin of 32.4% is elite. Recurring revenue at 45% is decent. Leverage at ~0.5x is very conservative. Concerns: Customer concentration at 28% is above the 20% threshold. Revenue at $12.8M is on the smaller end. The customer concentration is the one red flag that warrants investigation, but everything else is strong enough to move to a deeper look."
          },
          {
            type: "exercise",
            id: "ex-2a-2",
            q: "Now screen BrightSmile Dental Partners using the same seven metrics. Look at its key metrics below and decide: pass or investigate further?",
            inputMode: "qualitative",
            answer: "BrightSmile screens well for a roll-up: Revenue $9.8M (slightly below LMM threshold but growing fast at 32.4%). Gross margin 55.1% is excellent for dental. Adjusted EBITDA margin 25.5% is strong. Customer concentration 3% is ideal (diversified patient base). Recurring revenue 70% (patients return every 6 months). Leverage 2.0x is comfortable. The concern: $9.8M revenue is technically below the $10M floor, but the 32% growth rate means it will cross that threshold within a quarter. Also, how much of that growth is organic vs. acquired? Worth a deeper look, but it screens in."
          }
        ]
      },
      {
        id: "s2b",
        title: "2B. Working Capital Metrics",
        blocks: [
          {
            type: "text",
            content: "Working capital is cash tied up in day-to-day operations. It is the money locked in inventory and owed by customers (AR), offset by money owed to suppliers (AP). In PE deals, working capital determines how much cash a buyer needs at close beyond the purchase price, and whether the business generates or consumes cash as it grows."
          },
          {
            type: "metricTable",
            headers: ["Metric", "Formula", "Healthy Range", "Watch For"],
            rows: [
              ["DSO (Days Sales Outstanding)", "(AR / Revenue) x 365", "30-45 days", "Above 50 means slow-paying customers or loose collection practices"],
              ["DIO (Days Inventory Outstanding)", "(Inventory / COGS) x 365", "Industry-specific", "Rising DIO means inventory is building up. Could signal slowing demand."],
              ["DPO (Days Payable Outstanding)", "(AP / COGS) x 365", "30-45 days", "Higher is better (you are using supplier money). But very high DPO may strain relationships."],
              ["Cash Conversion Cycle", "DSO + DIO - DPO", "Lower is better", "Negative CCC means the business gets paid before it pays suppliers. Rare but excellent."],
              ["NWC % of Revenue", "NWC / Revenue", "5-15%", "Higher means the business needs more cash as it grows. Important for modeling growth capital needs."]
            ]
          },
          {
            type: "text",
            content: "Let's calculate DSO for Coastal Fresh Foods, which has $6.8M in AR on $48.2M in revenue."
          },
          {
            type: "companyData",
            companyId: "coastal-foods",
            view: "balance"
          },
          {
            type: "exercise",
            id: "ex-2b-1",
            q: "Calculate Coastal's DSO, DIO, DPO, and cash conversion cycle. Is working capital helping or hurting this business?",
            inputMode: "quantitative",
            answer: "DSO = ($6.8M / $48.2M) x 365 = 51.5 days (above 45-day benchmark). DIO = ($3.2M / $39.0M) x 365 = 30.0 days (reasonable for food distribution). DPO = ($5.1M / $39.0M) x 365 = 47.7 days (they are stretching supplier payments). Cash Conversion Cycle = 51.5 + 30.0 - 47.7 = 33.8 days. Working capital is hurting the business. The main problem is DSO at 51.5 days. They are collecting slowly from customers while carrying 30 days of perishable inventory. Every day of DSO improvement on $48.2M revenue frees up ~$132K in cash."
          }
        ]
      }
    ]
  },

  // ===== SECTION 3: DD DEEP-DIVE =====
  {
    id: "s3",
    title: "3. Due Diligence Deep-Dive",
    subsections: [
      {
        id: "s3a",
        title: "3A. Revenue Quality",
        blocks: [
          {
            type: "text",
            content: "Not all revenue is created equal. A dollar of recurring, contracted revenue from a diversified customer base is worth far more than a dollar of one-time, project-based revenue from a single customer. Revenue quality determines the multiple a buyer will pay."
          },
          {
            type: "text",
            content: "Key dimensions of revenue quality:"
          },
          {
            type: "lineItemTable",
            headers: ["Dimension", "Higher Quality", "Lower Quality"],
            rows: [
              ["Recurring vs. One-Time", "Contracted, subscription, maintenance agreements", "Project-based, one-off sales, seasonal spikes"],
              ["Customer Concentration", "No customer above 10% of revenue", "Top customer is 25%+ of revenue"],
              ["Organic vs. Acquired", "Same-store growth from existing operations", "Growth entirely from acquisitions (purchased revenue)"],
              ["Pricing Power", "Regular price increases accepted by customers", "Race-to-the-bottom pricing, low switching costs"],
              ["Contract Length", "Multi-year agreements with auto-renewal", "Month-to-month or purchase-order-based"]
            ]
          },
          {
            type: "text",
            content: "Let's analyze revenue quality for two very different businesses. First, look at Summit's metrics (35% recurring, 12% customer concentration) versus Apex's (55% recurring, 35% customer concentration)."
          },
          {
            type: "companyData",
            companyId: "summit-hvac",
            view: "metrics"
          },
          {
            type: "companyData",
            companyId: "apex-logistics",
            view: "metrics"
          },
          {
            type: "exercise",
            id: "ex-3a-1",
            q: "Compare the revenue quality of Summit HVAC vs. Apex Logistics. Which has higher-quality revenue and why? Consider recurring %, customer concentration, and growth trajectory.",
            inputMode: "qualitative",
            answer: "Summit has higher-quality revenue despite lower recurring %. Summit: 35% recurring (service contracts), 12% customer concentration (highly diversified), 15.7% organic growth. Apex: 55% recurring, but 35% concentration with a single e-commerce customer and revenue is declining at -8.6%. Apex's higher recurring % is misleading because it is concentrated in one relationship. If that customer leaves, 35% of revenue vanishes and the fixed cost base means EBITDA would go to zero or negative. Summit's diversified, growing revenue base is fundamentally more durable even though less of it is technically 'recurring.' Revenue quality is about durability, not just contractual structure."
          }
        ]
      },
      {
        id: "s3b",
        title: "3B. EBITDA Quality",
        blocks: [
          {
            type: "text",
            content: "EBITDA quality analysis asks: are the add-backs legitimate, and does EBITDA translate into real cash? In LMM deals, sellers and brokers often inflate adjusted EBITDA through aggressive add-backs. Your job is to distinguish between genuine one-time costs and recurring expenses being disguised as adjustable."
          },
          {
            type: "text",
            content: "The add-back spectrum, from most to least defensible:"
          },
          {
            type: "lineItemTable",
            headers: ["Add-Back Type", "Defensibility", "Common Example"],
            rows: [
              ["Owner excess compensation", "High", "Owner takes $2M but a GM costs $250K. The $1.75M difference is a clear add-back."],
              ["Truly one-time legal/settlement", "High", "A one-time lawsuit settlement that is resolved and non-recurring."],
              ["Owner perks", "Medium-High", "Personal car, club memberships, family members on payroll who do not work."],
              ["Above-market rent", "Medium", "Owner owns the building and charges the company above-market rent."],
              ["'One-time' integration costs", "Low (in roll-ups)", "If the strategy is to keep acquiring, integration costs are the cost of doing business."],
              ["Non-recurring revenue adjustments", "Low", "Removing a 'bad' year or adding back 'lost' customers. These are red flags."]
            ]
          },
          {
            type: "text",
            content: "BrightSmile Dental wants to add back $500K in 'one-time expenses.' Let's examine their income statement and decide if this is legitimate."
          },
          {
            type: "companyData",
            companyId: "bright-dental",
            view: "income"
          },
          {
            type: "exercise",
            id: "ex-3b-1",
            q: "BrightSmile is a dental roll-up that grew 32% last year, partly through acquisition. They want to add back $500K as 'one-time expenses.' Should you accept this add-back at face value? What questions would you ask?",
            inputMode: "qualitative",
            answer: "You should NOT accept it at face value. BrightSmile's entire growth strategy is acquisitions. If the $500K is deal costs, legal fees, and integration expenses related to acquisitions, and they plan to keep acquiring, then these costs will recur every year. They are the cost of executing the strategy, not a one-time anomaly. Questions to ask: (1) What exactly is in the $500K? Break it out line by line. (2) What were 'one-time' costs in 2024? If they were $300-500K then, the pattern proves they are recurring. (3) How many acquisitions are planned in the next 2 years? (4) What is the expected cost per acquisition? A reasonable approach: accept maybe 50% of the add-back (for truly non-recurring items like a specific legal matter) and treat the rest as ongoing costs."
          }
        ]
      },
      {
        id: "s3c",
        title: "3C. Working Capital in DD",
        blocks: [
          {
            type: "text",
            content: "In due diligence, working capital analysis goes beyond calculating ratios. The key question becomes: what is the 'normal' level of working capital this business needs, and who pays for any excess or deficit at close? Most PE deals include a working capital peg, a target amount of net working capital that the seller must deliver at closing."
          },
          {
            type: "text",
            content: "Working capital peg mechanics:"
          },
          {
            type: "lineItemTable",
            headers: ["Concept", "What It Means", "Impact"],
            rows: [
              ["NWC Peg", "Agreed-upon 'normal' NWC level, usually a trailing 12-month average", "Sets the baseline for the close adjustment"],
              ["NWC at Close > Peg", "Business has more working capital than agreed", "Seller gets the excess added to purchase price"],
              ["NWC at Close < Peg", "Business has less working capital than agreed", "Purchase price is reduced by the shortfall"],
              ["NWC Collar", "A range around the peg (e.g. +/- $100K) where no adjustment is made", "Prevents trivial adjustments from creating disputes"]
            ]
          },
          {
            type: "text",
            content: "Let's look at Coastal's working capital situation more carefully. They have significant AR and inventory relative to their revenue."
          },
          {
            type: "companyData",
            companyId: "coastal-foods",
            view: "balance"
          },
          {
            type: "exercise",
            id: "ex-3c-1",
            q: "If you were acquiring Coastal Fresh Foods and set the NWC peg at $3.5M (based on trailing average), but at close NWC came in at $4.2M because AR spiked to $7.5M, what happens to the purchase price? And what would concern you about that AR spike?",
            inputMode: "quantitative",
            answer: "NWC at close ($4.2M) minus peg ($3.5M) = $700K excess. The buyer pays $700K more than the base purchase price. But you should be very concerned about why AR spiked. Possible explanations: (1) The seller stuffed the channel, shipping orders early to inflate revenue before close. (2) A major customer is not paying, so AR is growing but may not be collectible. (3) Seasonal timing (legitimate). In DD, you would demand an AR aging schedule to see if the spike is in current receivables (fine) or aging receivables (bad). You might also negotiate a holdback or escrow tied to collection of the excess AR within 90 days post-close."
          }
        ]
      },
      {
        id: "s3d",
        title: "3D. Leverage & Capital Structure",
        blocks: [
          {
            type: "text",
            content: "Leverage is the amount of debt relative to earnings. In PE, leverage is the tool that amplifies returns. Buy a business with 60% debt, grow EBITDA, pay down the debt, and sell. The equity holders capture a disproportionate share of the value creation. But leverage also amplifies risk. If EBITDA declines, debt payments stay the same and the equity gets wiped out."
          },
          {
            type: "metricTable",
            headers: ["Leverage Level", "Debt/EBITDA", "Risk Profile", "Typical Situation"],
            rows: [
              ["Conservative", "Under 2.0x", "Low risk, lower returns", "Family businesses, owner-funded growth"],
              ["Moderate", "2.0-3.5x", "Balanced risk/return", "Typical PE acquisition leverage"],
              ["Aggressive", "3.5-5.0x", "Higher risk, higher potential return", "Competitive auctions, strong cash flow businesses"],
              ["Highly Leveraged", "Above 5.0x", "High risk of distress", "Sponsor-to-sponsor deals, special situations"]
            ]
          },
          {
            type: "text",
            content: "Let's compare the capital structures of Precision CNC (low leverage) and Apex Logistics (moderate-to-high leverage) and understand what that means for each deal."
          },
          {
            type: "companyData",
            companyId: "precision-manufacturing",
            view: "metrics"
          },
          {
            type: "companyData",
            companyId: "apex-logistics",
            view: "metrics"
          },
          {
            type: "exercise",
            id: "ex-3d-1",
            q: "Calculate the leverage ratio for both Precision CNC and Apex Logistics. If you were acquiring each business, how much additional debt could you put on, and what would concern you about leveraging each one?",
            inputMode: "qualitative",
            answer: "Precision CNC: Total debt $2.1M ($0.3M current + $1.8M LT) / $4.15M Adj. EBITDA = 0.5x leverage. Extremely conservative. You could add $10-12M of additional debt to reach 3.0x, giving significant acquisition firepower. Precision's 32.4% EBITDA margins and 43% gross margins mean strong debt service coverage. Risk: customer concentration at 28% means a customer loss could impair the ability to service debt. Apex: Total debt $8.6M ($2.1M + $6.5M) / $4.55M Adj. EBITDA = 1.9x leverage. Already moderate. Theoretical capacity to 3.5x = $15.9M total, so ~$7.3M more. But you should NOT lever up Apex further. Revenue is declining 8.6%, FCF conversion is only 20%, and 35% customer concentration means EBITDA could collapse. Adding more debt to a declining-revenue, capital-intensive business with a concentrated customer base is a recipe for distress."
          }
        ]
      }
    ]
  }
];
