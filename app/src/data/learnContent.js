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
            type: "companyData",
            companyId: "bright-dental",
            view: "metrics"
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
  },

  // ===== SECTION 4: KEY CONCEPTS =====
  {
    id: "s4",
    title: "4. Key Concepts",
    subsections: [
      {
        id: "s4a",
        title: "4A. EBITDA Add-backs",
        blocks: [
          {
            type: "text",
            content: "EBITDA add-backs are adjustments that normalize earnings to reflect true operating performance under new ownership. They directly impact enterprise value: a $500K add-back at 6x multiple creates $3M of value. Aggressive or unsupported add-backs are the #1 source of post-close disputes in LMM deals."
          },
          {
            type: "text",
            content: "Why it matters: Add-backs bridge the gap between reported EBITDA and what a PE buyer considers the true run-rate earnings of the business. Getting this number right is the foundation of every deal."
          },
          {
            type: "text",
            content: "How to spot it: Look for owner compensation above market rate (common in founder-led businesses), one-time expenses that recur suspiciously often, related-party transactions (rent, consulting fees to family members), and pro forma adjustments with no historical basis."
          },
          {
            type: "text",
            content: "Red flags: Add-backs exceed 30% of reported EBITDA. More than 3 categories of adjustments. No documentation or third-party validation. 'One-time' costs that appeared in prior years too."
          },
          {
            type: "companyData",
            companyId: "summit-hvac",
            view: "income"
          },
          {
            type: "text",
            content: "Summit's owner takes $2.0M in compensation plus $400K in perks, with $300K in one-time expenses and $200K in above-market rent. The add-backs total $900K, pushing EBITDA from $4.6M to $5.5M adjusted. If you also normalize owner comp to a $250K GM replacement, adjusted EBITDA could reach $6.35M."
          },
          {
            type: "companyData",
            companyId: "precision-manufacturing",
            view: "income"
          },
          {
            type: "text",
            content: "Precision has $300K in owner perks, $100K in one-time expenses, and $150K in above-market rent. These add-backs are modest relative to EBITDA ($3.6M to $4.15M), which is a positive signal. The owner's technical expertise is the bigger concern here, not the add-back quality."
          },
          {
            type: "exercise",
            id: "ex-4a-1",
            q: "BrightSmile Dental wants to add back $500K in 'one-time expenses,' but their entire growth strategy is acquisitions. Should you accept this add-back? Walk through your reasoning and what questions you would ask in diligence.",
            inputMode: "qualitative",
            answer: "You should NOT accept it at face value. If the $500K is deal costs, legal fees, and integration expenses related to acquisitions, and BrightSmile plans to keep acquiring, then these costs will recur every year. They are the cost of executing the growth strategy, not a one-time anomaly. Questions: (1) Break out the $500K line by line. (2) What were 'one-time' costs in the prior year? If $300-500K then too, the pattern proves recurrence. (3) How many acquisitions are planned in the next 2 years? (4) What is the expected cost per acquisition? A reasonable approach: accept maybe 50% (for truly non-recurring items like a specific legal settlement) and treat the rest as ongoing costs."
          },
          {
            type: "notes",
            id: "notes-4a"
          }
        ]
      },
      {
        id: "s4b",
        title: "4B. LBO Economics",
        blocks: [
          {
            type: "text",
            content: "A leveraged buyout uses a combination of debt and equity to acquire a business. The debt is serviced and paid down using the company's own cash flow. The key insight: because the equity investor puts in only 30-40% of the purchase price, even modest EBITDA growth produces outsized equity returns."
          },
          {
            type: "text",
            content: "Why it matters: LBO economics explain why PE exists. Leverage amplifies returns when things go right, but it also amplifies losses when they don't. The three levers of PE value creation are EBITDA growth, multiple expansion, and debt paydown."
          },
          {
            type: "text",
            content: "How to evaluate LBO viability: Strong free cash flow to service debt. Predictable, non-cyclical revenue. Low capex requirements. Defensible market position. Multiple pathways to EBITDA growth."
          },
          {
            type: "text",
            content: "Red flags for LBO: High capex relative to EBITDA (reduces cash available for debt service). Cyclical revenue (debt payments don't flex with downturns). Low margins that leave no room for interest expense. Customer concentration that could impair cash flow."
          },
          {
            type: "companyData",
            companyId: "truenorth-saas",
            view: "metrics"
          },
          {
            type: "text",
            content: "TrueNorth is an ideal LBO candidate: 78% gross margins, 92% recurring revenue, only $400K in capex. Nearly all EBITDA converts to cash. A buyer could comfortably lever this 3-4x and use the predictable cash flow to pay down debt rapidly."
          },
          {
            type: "companyData",
            companyId: "ironclad-construction",
            view: "metrics"
          },
          {
            type: "text",
            content: "Ironclad is a tougher LBO: 18% gross margins leave thin room for debt service. Revenue is project-based (15% recurring), and working capital is volatile. Leverage capacity exists (only 0.7x currently), but the risk of a bad project quarter makes high leverage dangerous."
          },
          {
            type: "exercise",
            id: "ex-4b-1",
            q: "You are acquiring TrueNorth at 6x adjusted EBITDA ($18M EV) with 60% debt ($10.8M) and 40% equity ($7.2M). If EBITDA grows 20% per year for 4 years and you exit at 8x, what is the equity value at exit and the approximate MOIC? Assume $2M of debt is paid down annually.",
            inputMode: "qualitative",
            answer: "Year 0 EBITDA: $3.0M. Year 4 EBITDA at 20% annual growth: $3.0M x 1.2^4 = $6.22M. Exit at 8x: EV = $49.8M. Remaining debt: $10.8M - ($2M x 4) = $2.8M. Exit equity value: $49.8M - $2.8M = $47.0M. MOIC: $47.0M / $7.2M = ~6.5x. This illustrates the power of LBO economics: the combination of EBITDA growth (2x), multiple expansion (6x to 8x), and debt paydown ($8M) transforms a $7.2M equity check into $47M. Even without multiple expansion (exit at 6x), equity would be $34.5M or ~4.8x MOIC."
          },
          {
            type: "notes",
            id: "notes-4b"
          }
        ]
      },
      {
        id: "s4c",
        title: "4C. Margin Drivers",
        blocks: [
          {
            type: "text",
            content: "Margins reveal the economic engine of a business. Gross margin shows pricing power and direct cost efficiency. EBITDA margin shows how well the business converts revenue into operating earnings after overhead. In PE, understanding what drives margins, and whether they can expand, is central to the value creation thesis."
          },
          {
            type: "text",
            content: "Why it matters: A 200 bps margin improvement on a $50M revenue business creates $1M of incremental EBITDA. At a 6x multiple, that is $6M of enterprise value from operational improvement alone."
          },
          {
            type: "text",
            content: "How to analyze: Compare margins year-over-year (expanding, stable, or compressing?). Benchmark against industry peers. Decompose the income statement: is COGS or SGA growing faster than revenue? Identify fixed vs. variable cost components."
          },
          {
            type: "text",
            content: "Red flags: Gross margin declining while revenue grows (cost pass-through problem). SGA growing faster than revenue (losing operating leverage). Margins that depend on one-time factors rather than structural advantage."
          },
          {
            type: "companyData",
            companyId: "coastal-foods",
            view: "income"
          },
          {
            type: "text",
            content: "Coastal's gross profit was flat at $9.2M both years despite $2.4M in revenue growth. ALL the revenue growth was eaten by COGS increases. This is margin compression from input costs (transportation, product) not being passed through to customers. Net income dropped 78%."
          },
          {
            type: "companyData",
            companyId: "bright-dental",
            view: "income"
          },
          {
            type: "text",
            content: "BrightSmile shows the opposite dynamic: 55% gross margins with labor leverage. Dentists are expensive but each one generates high revenue per hour. As the practice group scales, corporate overhead (SGA) gets spread across more revenue. The path to margin expansion is adding locations, not cutting costs."
          },
          {
            type: "exercise",
            id: "ex-4c-1",
            q: "Coastal's gross margin was flat at 19.1% despite 5.2% revenue growth. If you could improve gross margin by 200 bps through pricing and procurement, what is the EBITDA and enterprise value impact at a 5x multiple?",
            inputMode: "qualitative",
            answer: "200 bps improvement on $48.2M revenue = $48.2M x 0.02 = $964K incremental gross profit. If SGA stays flat, that flows straight to EBITDA: $3.9M + $964K = $4.86M adjusted EBITDA. At 5x multiple, EV goes from $19.5M to $24.3M, a $4.8M value creation from margin improvement alone. This is the classic PE playbook for distribution businesses: fix the pricing, optimize procurement, and let the margin improvement compound through the multiple."
          },
          {
            type: "notes",
            id: "notes-4c"
          }
        ]
      },
      {
        id: "s4d",
        title: "4D. Cash Conversion",
        blocks: [
          {
            type: "text",
            content: "Cash conversion measures how much of EBITDA actually turns into free cash flow. A business can have strong EBITDA but poor cash conversion if working capital is growing, capex is heavy, or non-cash accruals inflate earnings. In PE, cash is what pays down debt, funds acquisitions, and generates returns."
          },
          {
            type: "text",
            content: "Why it matters: A business with $5M EBITDA and 80% cash conversion generates $4M in real cash. A business with $5M EBITDA and 20% cash conversion generates only $1M. Both have the same EBITDA, but the first is worth far more to a leveraged buyer."
          },
          {
            type: "text",
            content: "How to calculate: Free Cash Flow = Net Income + D&A + Working Capital Change - CapEx. Cash conversion = FCF / EBITDA. Strong: above 70%. Acceptable: 50-70%. Weak: below 50%."
          },
          {
            type: "text",
            content: "Red flags: CapEx consistently exceeds D&A (meaning maintenance capex is understated). Working capital consuming cash every year (growing AR or inventory). EBITDA growing but FCF flat or declining."
          },
          {
            type: "companyData",
            companyId: "meridian-fulfillment",
            view: "metrics"
          },
          {
            type: "text",
            content: "Meridian: FCF = $2.1M + $1.3M + (-$0.5M) + (-$2.2M) = $0.7M. Cash conversion = $0.7M / $4.1M EBITDA = 17%. The $2.2M capex (warehouse automation) and working capital drain are consuming nearly all the operating cash. Net income was flat despite 12% revenue growth."
          },
          {
            type: "companyData",
            companyId: "truenorth-saas",
            view: "metrics"
          },
          {
            type: "text",
            content: "TrueNorth: FCF = $2.4M + $0.8M + (-$0.6M) + (-$0.4M) = $2.2M. Cash conversion = $2.2M / $2.6M EBITDA = 85%. SaaS businesses typically have excellent cash conversion because of minimal capex and prepaid annual contracts that create negative working capital. This is why SaaS commands premium multiples."
          },
          {
            type: "exercise",
            id: "ex-4d-1",
            q: "Apex Logistics has $4.55M adjusted EBITDA but only $0.9M in free cash flow (20% conversion). If you were presenting this deal to an investment committee, how would you explain the gap and what would need to change for the deal to work?",
            inputMode: "qualitative",
            answer: "The gap is driven by three factors: (1) $2.5M in capex (trucks wear out and need replacing, making this a capital-intensive business disguised as a service company). (2) $1.2M in debt service payments. (3) After $0.3M in distributions, virtually nothing is left. To make the deal work, you would need to: separate maintenance capex (~$1.5M to keep the fleet running) from growth capex (~$1.0M for new trucks/routes). True free cash flow to equity is minimal. You would either need to (a) significantly reduce capex by leasing vs. buying trucks, (b) restructure the debt at a lower rate, or (c) accept that this is a growth equity play where you reinvest all cash into fleet expansion and bet on revenue growth to eventually improve the economics."
          },
          {
            type: "notes",
            id: "notes-4d"
          }
        ]
      },
      {
        id: "s4e",
        title: "4E. Customer Concentration",
        blocks: [
          {
            type: "text",
            content: "Customer concentration measures how much revenue depends on a small number of customers. It is the #1 deal-killer in LMM PE. The rule of thumb: any single customer above 20% of revenue is a red flag. Above 35% is often a deal-breaker. But the real assessment depends on contract terms, switching costs, and replacement speed."
          },
          {
            type: "text",
            content: "Why it matters: If your largest customer leaves, can the business survive? In a leveraged deal, debt payments do not decrease when revenue does. Customer concentration risk is amplified by leverage."
          },
          {
            type: "text",
            content: "How to evaluate: Look at the top customer percentage, but also examine contract duration, historical relationship length, switching costs for the customer, and how quickly the lost revenue could be replaced."
          },
          {
            type: "text",
            content: "Red flags: Any customer above 25% with short-term contracts. Customer concentration increasing over time. The concentrated customer is also the most price-sensitive. Revenue from the top customer is growing faster than the rest (deepening dependence)."
          },
          {
            type: "companyData",
            companyId: "coastal-foods",
            view: "metrics"
          },
          {
            type: "text",
            content: "Coastal at 22% concentration: moderate risk. Food distribution contracts tend to be short-cycle, so this customer could leave relatively quickly. The thin margins (19.1% gross) mean losing 22% of revenue would likely push the business to breakeven or below."
          },
          {
            type: "companyData",
            companyId: "apex-logistics",
            view: "metrics"
          },
          {
            type: "text",
            content: "Apex at 35% concentration: high risk. One major e-commerce retailer represents over a third of revenue. Combined with declining revenue (-8.6%) and high fixed costs (fleet, facilities), losing this customer would be catastrophic. The business likely cannot cover its fixed cost base on the remaining 65%."
          },
          {
            type: "exercise",
            id: "ex-4e-1",
            q: "Compare customer concentration at Coastal (22%), Apex (35%), and TrueNorth (8%). For each, explain the severity of the risk and what deal protections you would negotiate.",
            inputMode: "qualitative",
            answer: "TrueNorth (8%): Low risk. No single customer dependency. SaaS contracts have 12-month terms and high switching costs. No special deal protections needed beyond standard customer consent provisions. Coastal (22%): Moderate risk. Food distribution contracts are short-cycle, so the customer could leave within months. Deal protections: earnout tied to top customer retention for 12-18 months, require seller to maintain the relationship during transition, verify contract terms and renewal history. Apex (35%): High risk, near deal-breaker. One customer leaving would destroy EBITDA given the fixed cost base. Deal protections: significant escrow holdback (15-20% of purchase price) that releases over 24 months tied to customer revenue maintenance, require personal introduction to customer decision-makers, obtain a letter of intent or comfort letter from the customer, and structure a heavy earnout component."
          },
          {
            type: "notes",
            id: "notes-4e"
          }
        ]
      },
      {
        id: "s4f",
        title: "4F. Key-Person Risk",
        blocks: [
          {
            type: "text",
            content: "Key-person risk exists when a business's value, customer relationships, or technical capabilities depend on one or two individuals, usually the founder. In LMM PE, almost every founder-led business has key-person risk. The question is not whether it exists, but how severe it is and how quickly it can be mitigated."
          },
          {
            type: "text",
            content: "Why it matters: PE firms buy businesses, not people. If the founder leaves and the business collapses, the investment is destroyed. Key-person risk directly affects deal structure: transition periods, earnouts, and non-competes are all designed to manage this risk."
          },
          {
            type: "text",
            content: "How to assess: Who holds the customer relationships? Who makes the technical or operational decisions that are hard to replicate? How deep is the management team below the founder? Could the business operate for 6 months if the founder disappeared?"
          },
          {
            type: "text",
            content: "Red flags: Founder is the sole relationship holder for top customers. No documented processes or systems. Second-in-command does not exist or is weak. Founder handles sales, operations, AND finance personally."
          },
          {
            type: "companyData",
            companyId: "summit-hvac",
            view: "metrics"
          },
          {
            type: "text",
            content: "Summit: The founder IS the business. Owner comp is $2.4M (salary + perks), signaling deep involvement. Customer relationships, vendor negotiations, and strategic decisions all flow through one person. The 15.7% growth may be driven by the founder's personal network. Key question: can a $250K GM replicate what this founder does?"
          },
          {
            type: "companyData",
            companyId: "precision-manufacturing",
            view: "metrics"
          },
          {
            type: "text",
            content: "Precision: The owner is the sole technical expert. CNC machining for aerospace and medical devices requires deep expertise, and the owner personally handles estimating and quality control. The ISO certifications are tied to processes the owner built. Losing the owner means losing the technical moat."
          },
          {
            type: "exercise",
            id: "ex-4f-1",
            q: "You are acquiring Summit HVAC. The founder wants to retire in 2-3 years. Design a transition plan that protects the investment. What milestones would you set, and how would you structure the deal to align incentives?",
            inputMode: "qualitative",
            answer: "Transition plan: (1) Year 1: Hire a GM ($250K) and have the founder introduce them to all key customers, vendors, and employees. Founder stays full-time. (2) Year 2: GM takes over day-to-day operations. Founder shifts to advisory role (part-time) focused on top 5 customer relationships and strategic partnerships. (3) Year 3: Founder exits fully. GM is established, relationships are transferred. Deal structure: (a) Purchase price split between closing payment and earnout. 60% at close, 40% over 3 years tied to revenue retention and GM onboarding milestones. (b) Non-compete for 5 years covering the Southeast US HVAC market. (c) Consulting agreement at $200K/year for 2 years post-close, contingent on GM remaining. (d) Quarterly customer NPS or retention check tied to earnout payments. The goal: make it financially irrational for the founder to undermine the transition."
          },
          {
            type: "notes",
            id: "notes-4f"
          }
        ]
      },
      {
        id: "s4g",
        title: "4G. Valuation Multiples",
        blocks: [
          {
            type: "text",
            content: "In LMM PE, businesses are valued as a multiple of adjusted EBITDA. The multiple reflects the market's assessment of risk and growth potential. Higher multiples go to businesses with recurring revenue, strong growth, defensible moats, and low risk. Lower multiples reflect cyclicality, customer concentration, or thin margins."
          },
          {
            type: "text",
            content: "Why it matters: The difference between a 5x and 8x multiple on $5M EBITDA is $15M in enterprise value. Understanding what drives multiples helps you know what you are paying for, and what you need to improve to achieve multiple expansion at exit."
          },
          {
            type: "text",
            content: "Typical LMM multiples by sector: SaaS/software: 8-12x. Healthcare services (dental, vet): 8-12x at platform scale. Business services (HVAC, staffing): 5-7x. Manufacturing: 4-7x. Distribution/logistics: 5-8x. Construction: 4-6x."
          },
          {
            type: "text",
            content: "Multiple expansion drivers: Growing recurring revenue percentage. Improving margins. Reducing customer concentration. Building a management team (reducing key-person risk). Scaling to platform size in roll-up sectors."
          },
          {
            type: "companyData",
            companyId: "truenorth-saas",
            view: "metrics"
          },
          {
            type: "text",
            content: "TrueNorth at 8-10x EBITDA: Premium multiple justified by 92% recurring revenue, 78% gross margins, 28% growth, 8% customer concentration, and low capex. Rule of 40 score (growth + EBITDA margin) = 46, above the 40 threshold."
          },
          {
            type: "companyData",
            companyId: "summit-hvac",
            view: "metrics"
          },
          {
            type: "text",
            content: "Summit HVAC at 5-7x EBITDA: Mid-range for services. Strengths: 16.9% adjusted margin, 15.7% growth, low concentration. Weaknesses: only 35% recurring, key-person risk. At 6x and $5.5M adjusted EBITDA, EV = $33M."
          },
          {
            type: "companyData",
            companyId: "meridian-fulfillment",
            view: "metrics"
          },
          {
            type: "text",
            content: "Meridian 3PL at 6-8x EBITDA: Middle of the 3PL range. 12% growth and automation investments support the higher end. 40% contracted revenue and 18% concentration push toward the lower end. At 7x and $4.65M, EV = $32.6M."
          },
          {
            type: "exercise",
            id: "ex-4g-1",
            q: "You are bidding on Summit HVAC. The seller's broker claims it deserves an 8x multiple because of strong growth. You think 5.5-6.5x is appropriate. Make the case for your range and identify what would need to change for 8x to be justified.",
            inputMode: "qualitative",
            answer: "Case for 5.5-6.5x: (1) Only 35% recurring revenue, well below the 60%+ threshold that commands premium HVAC multiples. (2) Significant key-person risk with the founder, which a buyer must invest time and money to mitigate. (3) HVAC services are competitive with low barriers to entry at the local level. (4) Customer relationships may not transfer cleanly. At 6x and $5.5M EBITDA, EV = $33M, which is fair for a well-run but founder-dependent HVAC business. What would justify 8x: (a) Recurring revenue above 60% through expanded service contracts. (b) A proven second-in-command who has demonstrated they can run the business independently. (c) 3+ years of consistent 15%+ organic growth. (d) Documented, replicable processes that reduce reliance on any individual. (e) Multiple location expansion showing the model scales. In other words, 8x is achievable post-acquisition as a value creation target, not what you pay at entry."
          },
          {
            type: "notes",
            id: "notes-4g"
          }
        ]
      },
      {
        id: "s4h",
        title: "4H. Investment Thesis Structure",
        blocks: [
          {
            type: "text",
            content: "An investment thesis is the argument for why a deal will generate attractive returns. It is not just 'this is a good business.' It is a specific, testable claim about what value creation levers exist, how they will be executed, and what must be true for the returns to materialize. Every thesis has a bull case, a base case, and a bear case."
          },
          {
            type: "text",
            content: "Why it matters: The thesis drives everything: valuation, deal structure, operating plan, and exit strategy. A weak thesis leads to overpaying, under-managing, or holding too long. A strong thesis provides guardrails throughout the hold period."
          },
          {
            type: "text",
            content: "Components of a strong thesis: (1) Why this business: what is the competitive moat or structural advantage? (2) Why now: what makes this the right entry point? (3) Value creation plan: 3-4 specific, measurable levers (organic growth, margin expansion, bolt-on acquisitions, working capital improvement). (4) Exit strategy: who is the likely buyer and at what multiple? (5) Key risks and mitigants: what could break the thesis and how do you protect against it?"
          },
          {
            type: "text",
            content: "Red flags in a thesis: No clear value creation plan beyond 'ride the wave.' Growth assumptions that exceed historical rates without a catalyst. Thesis depends entirely on multiple expansion with no operational improvement. Key risks are hand-waved rather than addressed with specific mitigants."
          },
          {
            type: "companyData",
            companyId: "bright-dental",
            view: "metrics"
          },
          {
            type: "text",
            content: "BrightSmile roll-up thesis: Buy at 6-8x EBITDA, acquire individual practices at 4-5x, integrate them to platform-level margins, and exit at 10-12x as a scaled dental platform. Value creation: multiple arbitrage + same-store growth + central overhead leverage. Risk: integration execution and vet/dentist retention."
          },
          {
            type: "companyData",
            companyId: "vitality-vet",
            view: "metrics"
          },
          {
            type: "text",
            content: "Vitality uses the same roll-up playbook in veterinary. At 3 locations and $8.4M revenue, it is sub-scale but has proven unit economics: 62% gross margins, 65% recurring revenue (wellness plans), 22% growth. The thesis: invest $8-10M to acquire 4-5 clinics, reaching $18-20M revenue, then exit at 10-12x EBITDA."
          },
          {
            type: "exercise",
            id: "ex-4h-1",
            q: "Write a 60-second investment thesis for BrightSmile Dental Partners. Structure it as: (1) Why this business, (2) Value creation plan with 3 specific levers, (3) Key risk and mitigant, (4) Target returns.",
            inputMode: "qualitative",
            answer: "Why this business: BrightSmile is a dental roll-up with 55% gross margins, 70% recurring patient revenue, and a non-clinical founder who is a pure operator. Dental is recession-resistant with predictable demand and fragmented ownership (ideal for consolidation). Value creation: (1) Acquire 4-6 practices at 4-5x EBITDA over 3 years, creating multiple arbitrage as the platform scales to 10-12x. (2) Drive same-store revenue growth of 8-10% through expanded service lines (orthodontics, cosmetic) and optimized scheduling. (3) Centralize back-office functions (billing, procurement, HR) to improve EBITDA margin from 25.5% to 30%+. Key risk: Dentist retention. Employed dentists may leave post-acquisition. Mitigant: equity incentives, competitive comp, and patient loyalty that follows the practice, not the dentist. Target returns: Enter at 7x adjusted EBITDA ($17.5M EV). Exit at 11x on $6M EBITDA in Year 4 ($66M EV). 3.5-4x MOIC."
          },
          {
            type: "notes",
            id: "notes-4h"
          }
        ]
      }
    ]
  }
];
