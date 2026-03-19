export const LEARN_CONTENT = [
  // ===== SECTION 1: THE THREE FINANCIAL STATEMENTS =====
  {
    id: "s1",
    title: "1. The Three Financial Statements",
    subsections: [
      {
        id: "s1a",
        title: "1A. Income Statement",
        blocks: [
          {
            type: "text",
            content: "The income statement shows how much a company earned and spent over a period (usually a year). In PE, you read it top to bottom: Revenue minus costs equals profit. The key question is always: how much of each dollar of revenue actually becomes profit the owner can keep?"
          },
          {
            type: "text",
            content: "Here are the major line items you will see on every LMM income statement, and what each one tells you."
          },
          {
            type: "lineItemTable",
            headers: ["Line Item", "What It Is", "What to Watch For"],
            rows: [
              ["Revenue", "Total sales for the period", "Growth rate, concentration in a few customers, recurring vs. one-time"],
              ["COGS", "Direct costs to deliver the product or service", "Trend vs. revenue. If COGS grows faster than revenue, margins are compressing"],
              ["Gross Profit", "Revenue minus COGS. The money left after direct costs", "Gross margin % (Gross Profit / Revenue). Indicates pricing power and cost control"],
              ["SG&A", "Sales, general, and administrative expenses. Overhead.", "Should grow slower than revenue as the business scales (operating leverage)"],
              ["Owner Compensation", "Salary, benefits, perks paid to the owner", "In LMM deals, owners often overpay themselves. This is the biggest add-back area"],
              ["Depreciation & Amortization", "Non-cash charge for asset wear and IP/goodwill writedown", "Compare to CapEx. If D&A is much less than CapEx, the business is capital-hungry"],
              ["Interest Expense", "Cost of debt", "Signals current leverage. Will change under new capital structure"],
              ["Net Income", "Bottom line after all expenses", "Often misleading in LMM. Add-backs can double or triple this number"]
            ]
          },
          {
            type: "text",
            content: "Let's look at a real income statement. Below is Summit Mechanical Services, an HVAC company doing $32.5M in revenue. As you review it, pay attention to the gross margin and how owner compensation affects the bottom line."
          },
          {
            type: "companyData",
            companyId: "summit-hvac",
            view: "income"
          },
          {
            type: "exercise",
            id: "ex-1a-1",
            q: "Looking at Summit's income statement, what is the gross margin for each year? Did it improve or decline?",
            inputMode: "quantitative",
            answer: "2024 gross margin: $9.8M / $28.1M = 34.9%. 2025 gross margin: $11.7M / $32.5M = 36.0%. Gross margin improved by ~1.1pp, which is a positive sign. It means Summit is either getting better pricing or managing direct costs more effectively as it grows."
          },
          {
            type: "exercise",
            id: "ex-1a-2",
            q: "Summit's owner takes $2.0M in compensation plus $400K in perks ($2.4M total). If you hired a general manager at $250K to replace them, how much would that add back to EBITDA?",
            inputMode: "quantitative",
            answer: "Owner total cost: $2.4M ($2.0M comp + $0.4M perks). Replacement cost: $250K. The add-back is $2.15M. This is the single largest adjustment in the deal. It takes adjusted EBITDA from $5.5M to potentially $6.35M when combined with other add-backs, changing the valuation significantly."
          }
        ]
      },
      {
        id: "s1b",
        title: "1B. Balance Sheet",
        blocks: [
          {
            type: "text",
            content: "The balance sheet is a snapshot of what the company owns (assets), what it owes (liabilities), and the residual value (equity) at a single point in time. In PE, the balance sheet tells you two critical things: how much working capital the business needs to operate, and how much debt it carries."
          },
          {
            type: "lineItemTable",
            headers: ["Category", "Key Items", "PE Relevance"],
            rows: [
              ["Current Assets", "Cash, Accounts Receivable (AR), Inventory", "AR and Inventory are the working capital drivers. High AR means slow-paying customers. High inventory means tied-up cash."],
              ["Long-Term Assets", "PP&E, Goodwill, Intangibles", "PP&E signals capital intensity. Goodwill from prior acquisitions may signal overpayment."],
              ["Current Liabilities", "Accounts Payable (AP), Accrued Expenses, Current Debt", "AP is free financing from suppliers. Current debt matures within a year."],
              ["Long-Term Liabilities", "Long-Term Debt, Other Obligations", "Total debt relative to EBITDA determines leverage and risk."],
              ["Equity", "Retained earnings, owner capital", "Small equity base with high debt = leveraged. Net equity = what the owner actually 'owns.'"]
            ]
          },
          {
            type: "text",
            content: "Here is Coastal Fresh Foods' balance sheet. Coastal is a food distributor with $48.2M in revenue. Notice the AR balance relative to revenue, and the debt levels relative to EBITDA ($3.9M adjusted)."
          },
          {
            type: "companyData",
            companyId: "coastal-foods",
            view: "balance"
          },
          {
            type: "exercise",
            id: "ex-1b-1",
            q: "What is Coastal's net working capital (Current Assets minus Current Liabilities)? Is this a capital-light or capital-intensive business?",
            inputMode: "quantitative",
            answer: "Current Assets: $0.4M + $6.8M + $3.2M + $0.2M = $10.6M. Current Liabilities: $5.1M + $1.2M + $0.8M = $7.1M. Net Working Capital: $3.5M. For a $48.2M revenue business, NWC of $3.5M (7.3% of revenue) is moderate. Distribution businesses typically need meaningful working capital because they carry inventory and extend credit to customers. This is capital that a buyer needs to fund at close."
          },
          {
            type: "exercise",
            id: "ex-1b-2",
            q: "What is Coastal's leverage ratio (Total Debt / Adjusted EBITDA)? Would a bank be comfortable lending more to this business?",
            inputMode: "quantitative",
            answer: "Total Debt: $1.2M (current) + $4.8M (LT) = $6.0M. Adjusted EBITDA: $3.9M. Leverage: $6.0M / $3.9M = 1.5x. This is moderate leverage. Banks typically lend up to 3-4x for stable businesses. So there is room for additional debt capacity of ~$9-12M more. However, the declining net income ($0.9M to $0.2M) and flat gross margins would make lenders cautious about the trajectory."
          }
        ]
      },
      {
        id: "s1c",
        title: "1C. Cash Flow Statement",
        blocks: [
          {
            type: "text",
            content: "The cash flow statement answers the most important question in PE: how much actual cash does this business generate? EBITDA is an approximation, but cash flow is reality. Profitable companies can still run out of cash if working capital is eating it, CapEx is heavy, or debt service is high."
          },
          {
            type: "text",
            content: "The cash flow statement has three sections, but in LMM PE, the first two matter most."
          },
          {
            type: "lineItemTable",
            headers: ["Section", "Key Components", "What It Tells You"],
            rows: [
              ["Operating Cash Flow", "Net Income + D&A +/- Working Capital Changes", "Cash generated from running the business. Working capital changes can be a massive swing."],
              ["Investing Cash Flow", "Capital Expenditures (CapEx), Acquisitions", "Maintenance CapEx is the cost of keeping the business running. Growth CapEx expands capacity."],
              ["Free Cash Flow", "Operating Cash Flow minus CapEx", "The real money available to service debt, pay distributions, or reinvest. This is what PE cares about."],
              ["Financing Cash Flow", "Debt Payments, Distributions/Dividends", "Shows how cash is being used after operations and investment."]
            ]
          },
          {
            type: "text",
            content: "Let's examine Apex Last-Mile Logistics. Apex has $4.55M adjusted EBITDA, but does that translate into cash? Look at the cash flow statement below and pay special attention to CapEx and working capital."
          },
          {
            type: "companyData",
            companyId: "apex-logistics",
            view: "cashflow"
          },
          {
            type: "exercise",
            id: "ex-1c-1",
            q: "Apex has $4.55M adjusted EBITDA but only $0.9M in free cash flow. What is the EBITDA-to-FCF conversion rate, and what is eating the cash?",
            inputMode: "quantitative",
            answer: "FCF = $0.6M (NI) + $2.0M (D&A) + $0.8M (WC improvement) - $2.5M (CapEx) = $0.9M. Conversion rate: $0.9M / $4.55M = 19.8%. That is terrible. The biggest cash drain is CapEx at $2.5M (trucks wear out). D&A of $2.0M is less than CapEx, meaning the fleet requires more investment than the accounting charge suggests. This is a capital-intensive business disguised by its EBITDA. Buyers who pay a multiple of EBITDA need to understand that most of it gets reinvested just to maintain the fleet."
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
