/**
 * Concept Cards -- 8 core PE deal analysis concepts.
 * Each card references real company data from companies.js via companyId.
 * The practicePrompt feeds into LearnExercise with LLM grading.
 */
export const CONCEPT_CARDS = [
  {
    id: "ebitda-add-backs",
    title: "EBITDA Add-backs",
    oneLiner: "The adjustments that bridge reported EBITDA to 'true' owner earnings.",
    whyItMatters:
      "Add-backs are the single biggest source of valuation disagreement in LMM deals. Sellers want to maximize adjusted EBITDA (higher price); buyers want to minimize it (lower risk). Understanding which add-backs are legitimate vs. aggressive is the core skill of PE due diligence.",
    howToSpot: [
      "Owner compensation above market rate (compare to what a hired GM would cost)",
      "One-time expenses that truly will not recur (litigation settlement, flood damage)",
      "Above-market rent paid to a related entity (owner's LLC owns the building)",
      "Personal expenses run through the business (vehicles, travel, family payroll)",
    ],
    redFlags: [
      "Add-backs exceed 30% of reported EBITDA -- the 'real' business may be much smaller",
      "'One-time' expenses that appear every year -- they are recurring costs in disguise",
      "No documentation supporting the add-back amounts",
      "Seller resists quality-of-earnings (QoE) analysis",
    ],
    companyExamples: [
      {
        companyId: "summit-hvac",
        dataPoints: [
          { label: "Reported EBITDA", path: "keyMetrics.ebitda" },
          { label: "Adjusted EBITDA", path: "keyMetrics.adjustedEbitda" },
          { label: "Owner Perks", path: "incomeStatement.addBacks.ownerPerks" },
          { label: "One-Time Expenses", path: "incomeStatement.addBacks.oneTimeExpenses" },
          { label: "Above-Market Rent", path: "incomeStatement.addBacks.aboveMarketRent" },
        ],
        insight:
          "Summit's clean add-backs total $0.9M on $4.6M reported EBITDA (20%). The above-market rent of $0.2M is the most defensible (the lease can be renegotiated at close). The $0.4M in owner perks needs line-item scrutiny, and the $2.0M owner salary is negotiated separately against a market-rate GM.",
      },
      {
        companyId: "precision-manufacturing",
        dataPoints: [
          { label: "Reported EBITDA", path: "keyMetrics.ebitda" },
          { label: "Adjusted EBITDA", path: "keyMetrics.adjustedEbitda" },
          { label: "Owner Perks", path: "incomeStatement.addBacks.ownerPerks" },
          { label: "One-Time Expenses", path: "incomeStatement.addBacks.oneTimeExpenses" },
          { label: "Above-Market Rent", path: "incomeStatement.addBacks.aboveMarketRent" },
        ],
        insight:
          "Precision's add-backs of $0.55M on $3.6M EBITDA (15%) are modest, which is a good sign. The bigger question sits outside the add-back schedule: the owner takes $0.7M and is the technical heart of the shop, so what would a replacement GM plus technical director actually cost?",
      },
    ],
    practicePrompt: {
      question:
        "Summit HVAC reports $4.6M EBITDA and claims $5.5M adjusted after $0.9M of add-backs, and the broker hints at $7.25M if you fully normalize the owner's $2.4M of comp and perks against a $250K GM. Walk through how you would evaluate each add-back category and decide which are defensible.",
      type: "adjustment",
      modelAnswer:
        "Take the categories one at a time: (1) Owner perks ($0.4M) -- ask for the detail (vehicles, travel, family payroll) and W-2s; defensible where genuinely personal. (2) One-time expenses ($0.3M) -- get the list and check prior years; if similar costs recur annually, they are operating costs, not add-backs. (3) Above-market rent ($0.2M) -- most defensible, compare to market lease comps and reset the lease at close. Those support the $5.5M. (4) The normalization to $7.25M is a negotiation, not a fact: the owner takes $2.4M all-in, a replacement GM costs ~$250K, but whether a buyer credits the full $2.15M delta depends on how much of what the owner does (sales, vendor relationships) a GM can actually replicate. Most buyers underwrite between $5.5M and $7.25M and bridge the gap with structure (earnout or consulting agreement).",
    },
  },
  {
    id: "lbo-economics",
    title: "LBO Economics",
    oneLiner: "How debt amplifies equity returns in leveraged buyouts.",
    whyItMatters:
      "The LBO is the foundational PE transaction model. Using debt to fund a portion of the purchase price means the equity investor puts up less cash, and if the business grows and pays down debt, the equity return is magnified. Understanding this math is essential for evaluating whether a deal 'works' at a given price.",
    howToSpot: [
      "Stable, predictable cash flows that can reliably service debt payments",
      "Low existing leverage (room to add debt at acquisition)",
      "Asset-heavy balance sheets that provide collateral for lenders",
      "Businesses with contracted or recurring revenue streams",
    ],
    redFlags: [
      "Debt service coverage ratio (DSCR) below 1.5x -- thin margin for error",
      "Cyclical revenue that could drop 20-30% in a downturn",
      "High existing capex requirements competing with debt service for cash",
      "Aggressive leverage (>4x EBITDA) on a business with <$5M EBITDA",
    ],
    companyExamples: [
      {
        companyId: "truenorth-saas",
        dataPoints: [
          { label: "EBITDA", path: "keyMetrics.adjustedEbitda" },
          { label: "Recurring Revenue %", path: "keyMetrics.recurringRevenuePct" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Existing Debt", path: "balanceSheet.ltDebt" },
        ],
        insight:
          "TrueNorth's 92% recurring revenue and 27.9% growth make it attractive for leverage. But SaaS companies often trade at high multiples (8-12x or priced off ARR), which requires more equity and limits leveraged returns.",
      },
      {
        companyId: "ironclad-construction",
        dataPoints: [
          { label: "EBITDA", path: "keyMetrics.adjustedEbitda" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Long-Term Debt", path: "balanceSheet.ltDebt" },
          { label: "Cash", path: "balanceSheet.cash" },
        ],
        insight:
          "Ironclad's $5.25M adjusted EBITDA and construction assets provide collateral, and leverage is only 0.6x today. But project-based revenue is lumpy, so lenders may require a lower leverage multiple (2-3x vs. 4x for recurring revenue), and bonding capacity punishes leveraged balance sheets.",
      },
    ],
    practicePrompt: {
      question:
        "You are acquiring TrueNorth Analytics for 8x adjusted EBITDA. Walk through the LBO math: how much equity do you need, what leverage is appropriate, and what equity return could you expect if EBITDA grows 15% annually for 5 years?",
      type: "valuation",
      modelAnswer:
        "TrueNorth adjusted EBITDA is $3.0M. At 8x, enterprise value = $24M. SaaS businesses with 92% recurring revenue can support 3-4x leverage. At 3.5x = $10.5M debt, equity check = $13.5M. If EBITDA grows 15%/year for 5 years: Year 5 EBITDA = $6.0M. Exit at 8x (same multiple) = $48.3M EV. Subtract remaining debt (~$5M after paydown) = $43.3M equity. Return = $43.3M / $13.5M = 3.2x MOIC, or ~26% IRR. The deal 'works' because recurring revenue de-risks the leverage and organic growth does the heavy lifting. Key sensitivities: exit multiple and growth rate. (Note: a competitive process would likely price TrueNorth off ARR at a higher headline value; an 8x EBITDA entry assumes a negotiated, non-auction deal.)",
    },
  },
  {
    id: "margin-drivers",
    title: "Margin Drivers",
    oneLiner: "What makes margins expand or contract, and why it matters for value creation.",
    whyItMatters:
      "Margin improvement is one of the three core PE value creation levers (alongside revenue growth and multiple expansion). A business growing revenue 10% with expanding margins is worth far more than one growing 15% with compressing margins. Identifying what drives margins tells you where the value creation opportunity lives.",
    howToSpot: [
      "Compare gross margin to industry benchmarks -- is the company above or below peers?",
      "Track EBITDA margin trend over 2-3 years -- expanding, stable, or compressing?",
      "Break SGA into components -- which line items are growing faster than revenue?",
      "Look for operating leverage -- businesses with high fixed costs see margin expand as revenue grows",
    ],
    redFlags: [
      "Gross margin declining while revenue grows -- pricing pressure or input cost inflation",
      "SGA growing faster than revenue -- overhead is outpacing the business",
      "EBITDA margin below 15% in a service business -- limited room for error",
      "Margin improvement plan relies entirely on revenue growth with no cost actions",
    ],
    companyExamples: [
      {
        companyId: "coastal-foods",
        dataPoints: [
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "EBITDA Margin", path: "keyMetrics.ebitdaMargin" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Revenue", path: "revenue" },
        ],
        insight:
          "Coastal's 19.1% gross margin (down from 20.1% a year ago) is typical for food distribution but leaves thin EBITDA margins (8.1% adjusted). Margin improvement means recovering pass-through pricing, negotiating supplier terms, and shifting mix toward higher-margin specialty items.",
      },
      {
        companyId: "bright-dental",
        dataPoints: [
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
          { label: "EBITDA Margin", path: "keyMetrics.ebitdaMargin" },
          { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
        ],
        insight:
          "BrightSmile's 55% gross margin is strong for healthcare services. But SGA grew 36% vs. 32% revenue growth, so margin expansion requires either slowing overhead growth or accelerating revenue through same-store growth (not just acquisitions).",
      },
    ],
    practicePrompt: {
      question:
        "Coastal Fresh Foods runs a 19.1% gross margin and an 8.1% adjusted EBITDA margin. A PE buyer believes they can reach a 10-11% EBITDA margin within 3 years. What specific operational changes would drive this, and how realistic is it?",
      type: "thesis",
      modelAnswer:
        "A 200-300 bps EBITDA margin improvement in food distribution is ambitious but achievable; anything much beyond that is fantasy in a pass-through industry. The path: (1) Gross margin recovery (19.1% toward 21%): reprice contracts with input-cost escalators, renegotiate supplier terms on volume, shift mix toward higher-margin specialty lines. Note the first ~100 bps just restores the 2024 baseline of 20.1%. Worth 150-200 bps. (2) SGA discipline (hold SGA growth below revenue growth): route optimization, warehouse labor scheduling, admin automation. Worth 50-100 bps. (3) Scale leverage as fixed costs spread over mid-single-digit revenue growth. The risk: distribution is competitive, aggressive repricing loses volume, and the 22% concentrated customer has real negotiating power. A conservative underwrite is 10%; 11% is the stretch case.",
    },
  },
  {
    id: "cash-conversion",
    title: "Cash Conversion",
    oneLiner: "How efficiently a business turns EBITDA into actual cash you can take home.",
    whyItMatters:
      "EBITDA is not cash. A business can have strong EBITDA but terrible cash flow if it's stuck in working capital (AR, inventory) or consumed by maintenance capex. PE buyers care about free cash flow (FCF) because that's what services debt, funds distributions, and finances growth. Cash conversion = FCF / EBITDA.",
    howToSpot: [
      "Compare EBITDA to operating cash flow -- a big gap signals working capital or capex issues",
      "Check days sales outstanding (DSO) -- slow-paying customers lock up cash",
      "Look at capex as % of revenue -- above 5% in services is a yellow flag",
      "Working capital changes: negative means the business is consuming cash to grow",
    ],
    redFlags: [
      "Cash conversion below 50% -- half of EBITDA never becomes real cash",
      "AR growing faster than revenue -- collection is deteriorating",
      "Large capex combined with low margins -- cash flow may not cover reinvestment needs",
      "Negative working capital change despite flat or declining revenue",
    ],
    companyExamples: [
      {
        companyId: "meridian-fulfillment",
        dataPoints: [
          { label: "Adjusted EBITDA", path: "keyMetrics.adjustedEbitda" },
          { label: "CapEx", path: "cashFlow.capex" },
          { label: "Working Capital Change", path: "cashFlow.changeWc" },
          { label: "Net Income", path: "cashFlow.netIncome" },
        ],
        insight:
          "Meridian's $2.2M of capex on $4.65M adjusted EBITDA consumes nearly half of earnings, and working capital absorbs another $0.5M as receivables grow. Actual distributable cash is thin despite healthy EBITDA.",
      },
      {
        companyId: "truenorth-saas",
        dataPoints: [
          { label: "Adjusted EBITDA", path: "keyMetrics.adjustedEbitda" },
          { label: "CapEx", path: "cashFlow.capex" },
          { label: "Working Capital Change", path: "cashFlow.changeWc" },
          { label: "Recurring Revenue %", path: "keyMetrics.recurringRevenuePct" },
        ],
        insight:
          "TrueNorth's SaaS model has minimal capex (-$0.4M) and positive working capital dynamics from annual prepaid contracts. Cash conversion is excellent, with most EBITDA flowing through to distributable cash.",
      },
    ],
    practicePrompt: {
      question:
        "Meridian Fulfillment has $4.65M adjusted EBITDA but $2.2M in capex and a $0.5M working capital build. Calculate the approximate free cash flow and explain what this means for a potential buyer's return expectations.",
      type: "diagnostic",
      modelAnswer:
        "From the cash flow statement: $2.1M net income + $1.3M D&A - $0.5M working capital - $2.2M capex = ~$0.7M FCF. Cash conversion = $0.7M / $4.65M = ~15%. This is poor. For a buyer, it means: (1) debt service capacity is much lower than EBITDA suggests -- lenders will underwrite to FCF, not EBITDA, (2) distributions to equity holders will be minimal during the hold period, (3) returns depend almost entirely on EBITDA growth and exit multiple, not on interim cash flow. The key question: is the $2.2M capex maintenance or growth? The automation spend should be building future margin; if it is really maintenance (forklifts, racking, systems refresh), this is the true earning power of the business.",
    },
  },
  {
    id: "customer-concentration",
    title: "Customer Concentration",
    oneLiner: "The risk that one customer leaving can torpedo the business.",
    whyItMatters:
      "Customer concentration is one of the fastest ways to kill a deal in LMM PE. If one customer represents 20%+ of revenue, losing them can wipe out all EBITDA. Lenders hate it (reduces borrowing capacity), buyers discount for it (lower multiple), and sellers often do not realize how much it hurts their valuation.",
    howToSpot: [
      "Top customer as % of revenue -- above 15% is a concern, above 25% is a deal issue",
      "Top 5 customers as % of revenue -- above 50% means a handful of relationships drive the business",
      "Contract terms -- are there long-term contracts, or can customers leave anytime?",
      "Trend -- is concentration improving (diversifying) or worsening?",
    ],
    redFlags: [
      "Single customer above 30% of revenue with no long-term contract",
      "Top customer's contract renews within 12 months of the deal closing",
      "Customer concentration is increasing year-over-year",
      "The largest customer has superior bargaining power (e.g., major retailer)",
    ],
    companyExamples: [
      {
        companyId: "coastal-foods",
        dataPoints: [
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
          { label: "Revenue", path: "incomeStatement.revenue" },
          { label: "Gross Margin", path: "keyMetrics.grossMargin" },
        ],
        insight:
          "Coastal's 22% concentration in a single grocery chain means ~$10.6M in revenue depends on one relationship. In food distribution at a 19.1% gross margin, losing that customer would eliminate ~$2.0M of gross profit, more than half of adjusted EBITDA.",
      },
      {
        companyId: "apex-logistics",
        dataPoints: [
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
          { label: "Revenue", path: "incomeStatement.revenue" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
        ],
        insight:
          "Apex's 35% concentration is severe. Combined with declining revenue (-8.6%), it raises the question: is the top customer pulling back? If so, the business is shrinking and concentrated, a double red flag.",
      },
    ],
    practicePrompt: {
      question:
        "Apex Logistics has 35% customer concentration and revenue just declined 8.6%. How would you structure due diligence around this risk, and what would need to be true for you to still do the deal?",
      type: "risk",
      modelAnswer:
        "DD structure: (1) Get a customer-by-customer revenue breakout for 3 years. Is the decline coming from the top customer or broad-based? (2) Interview the top customer directly -- what's their satisfaction level, planned volume, competitive alternatives? (3) Review the contract terms -- length, termination provisions, volume commitments, pricing mechanism. (4) Analyze the pipeline -- are new customers being added? At what rate? To still do the deal: the top customer needs a multi-year contract with volume commitments, the decline needs to be COVID normalization (not customer loss), and there needs to be a credible diversification plan. Structurally, you might negotiate a purchase price adjustment if the top customer leaves within 18 months (earnout or escrow). Lenders will likely cap leverage at 2-2.5x given the concentration, reducing the equity return potential.",
    },
  },
  {
    id: "key-person-risk",
    title: "Key-Person Risk",
    oneLiner: "What happens to the business when the founder walks out the door.",
    whyItMatters:
      "In LMM businesses, the founder often IS the business: they hold customer relationships, technical knowledge, supplier pricing, and team loyalty. If they leave post-acquisition and the business deteriorates, the buyer overpaid. Managing the founder transition is one of the highest-leverage activities in a deal.",
    howToSpot: [
      "Founder handles sales directly -- do customers buy the company or the person?",
      "No second-in-command or management layer below the founder",
      "Technical expertise concentrated in one person (recipes, processes, client relationships)",
      "Founder name is the brand or is prominently featured in marketing",
    ],
    redFlags: [
      "Founder wants a clean exit at closing (no transition period)",
      "No employment agreements with key employees below the founder",
      "Revenue is tied to founder's personal relationships with no CRM or documentation",
      "Founder's children or family hold key roles with no succession plan",
    ],
    companyExamples: [
      {
        companyId: "summit-hvac",
        dataPoints: [
          { label: "Revenue", path: "incomeStatement.revenue" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
          { label: "Recurring Revenue %", path: "keyMetrics.recurringRevenuePct" },
        ],
        insight:
          "Summit's 35% recurring revenue (maintenance contracts) provides some insulation from key-person risk, since contracts survive a founder transition. But with 127 employees and a founder-led sales culture, the question is: who manages the commercial relationships?",
      },
      {
        companyId: "precision-manufacturing",
        dataPoints: [
          { label: "Revenue", path: "incomeStatement.revenue" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
        ],
        insight:
          "Precision's 45-person shop with 28% customer concentration and a technical founder is a classic key-person risk profile. The founder likely manages the top customer relationship personally and holds the institutional knowledge behind the CNC processes and certifications.",
      },
    ],
    practicePrompt: {
      question:
        "You are acquiring Precision CNC Solutions. The founder/owner runs all major customer relationships and oversees production quality. How would you structure the deal to mitigate key-person risk?",
      type: "risk",
      modelAnswer:
        "Multi-layered mitigation: (1) Transition period: require 18-24 month employment agreement with the founder post-close, with meaningful incentive (equity rollover or earnout) tied to revenue retention. (2) Relationship transfer plan: founder introduces a new VP of Sales to each top customer during months 1-6, joint visits, then solo visits by month 12. (3) Knowledge capture: document all processes, customer preferences, pricing agreements, and supplier relationships in the first 90 days. (4) Management build: hire a production manager and sales lead within 6 months, so the founder becomes a consultant, not a cog. (5) Deal structure: 20-30% of purchase price as an earnout tied to 12-month trailing revenue, creating financial incentive for the founder to ensure a smooth transition. (6) Customer contracts: formalize any verbal agreements into written contracts with the company (not the founder) before closing.",
    },
  },
  {
    id: "valuation-multiples",
    title: "Valuation Multiples",
    oneLiner: "What you pay relative to earnings, and why the same EBITDA can be worth 4x or 12x.",
    whyItMatters:
      "EV/EBITDA multiples are the common language of PE valuation. But the 'right' multiple varies enormously based on growth rate, recurring revenue, margin quality, size, and industry. A company that looks cheap at 5x might be expensive if it's declining; one that looks expensive at 10x might be a bargain if it's growing 25% with 90% recurring revenue.",
    howToSpot: [
      "Compare to recent transactions in the same industry and size range",
      "Higher multiples for: recurring revenue, high growth, high margins, large scale",
      "Lower multiples for: customer concentration, key-person risk, declining revenue, cyclicality",
      "Check if the multiple is on reported or adjusted EBITDA -- this changes the real price",
    ],
    redFlags: [
      "Seller anchored to public company multiples (irrelevant for LMM private companies)",
      "Multiple applied to 'projected' EBITDA rather than trailing actual EBITDA",
      "No comparable transactions to validate the multiple",
      "Broker's CIM uses aggressive add-backs to inflate EBITDA before applying the multiple",
    ],
    companyExamples: [
      {
        companyId: "truenorth-saas",
        dataPoints: [
          { label: "Adjusted EBITDA", path: "keyMetrics.adjustedEbitda" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Recurring Revenue %", path: "keyMetrics.recurringRevenuePct" },
          { label: "EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
        ],
        insight:
          "TrueNorth's 92% recurring revenue and 27.9% growth justify a premium multiple (8-12x EBITDA, or priced off ARR in a competitive process). SaaS businesses with these metrics trade at the top of the LMM range because the revenue is predictable and the growth is real.",
      },
      {
        companyId: "summit-hvac",
        dataPoints: [
          { label: "Adjusted EBITDA", path: "keyMetrics.adjustedEbitda" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Recurring Revenue %", path: "keyMetrics.recurringRevenuePct" },
          { label: "EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
        ],
        insight:
          "Summit's 15.7% growth is strong, but only 35% recurring revenue and real key-person risk keep it in the 5-7x services range. HVAC is well-understood by PE buyers, which supports liquidity and a fair process.",
      },
      {
        companyId: "meridian-fulfillment",
        dataPoints: [
          { label: "Adjusted EBITDA", path: "keyMetrics.adjustedEbitda" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Recurring Revenue %", path: "keyMetrics.recurringRevenuePct" },
          { label: "EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin" },
        ],
        insight:
          "Meridian's 12.2% growth is solid, but only 40% contracted revenue and real capital intensity (capex near half of EBITDA) hold it in the middle of the 6-8x 3PL range.",
      },
    ],
    practicePrompt: {
      question:
        "You are evaluating three companies: TrueNorth Analytics ($3.0M adjusted EBITDA, 92% recurring, 27.9% growth), Summit HVAC ($5.5M adjusted EBITDA, 35% recurring, 15.7% growth), and Meridian Fulfillment ($4.65M adjusted EBITDA, 40% contracted, 12.2% growth). Rank them by appropriate valuation multiple and explain your reasoning.",
      type: "valuation",
      modelAnswer:
        "Ranking highest to lowest multiple: (1) TrueNorth Analytics: 8-12x EBITDA, and a competitive process would price it off ARR (4-6x). 92% recurring SaaS revenue is the gold standard for predictability and 27.9% growth means it is scaling fast. (2) Meridian Fulfillment: 6-8x. Long-term contracts on 40% of revenue and 12% growth are solid, but capital intensity (warehouse capex near half of EBITDA) caps the multiple; cash conversion matters here. (3) Summit HVAC: 5-7x. Faster-growing than Meridian, but only 35% recurring, founder-dependent, and in a competitive local services market with low barriers to entry. The key takeaway: recurring revenue quality, capital intensity, and transferability drive multiples at least as much as growth. A dollar of SaaS EBITDA is worth roughly twice a dollar of HVAC EBITDA because it is more predictable, more scalable, and cheaper to convert into cash.",
    },
  },
  {
    id: "investment-thesis",
    title: "Investment Thesis Structure",
    oneLiner: "The 60-second argument for why this deal will make money.",
    whyItMatters:
      "Every PE deal needs a clear thesis: why buy this company, what will you do with it, and how will you exit at a higher value. A weak thesis means you are buying and hoping. A strong thesis identifies specific, actionable value creation levers. The thesis drives every decision: price, structure, management plan, and exit strategy.",
    howToSpot: [
      "Can you articulate the value creation plan in 3 bullet points?",
      "Is each lever specific and measurable (not 'improve operations')?",
      "Does the thesis have a clear exit path -- who buys this company and why?",
      "Are the assumptions testable in due diligence before committing capital?",
    ],
    redFlags: [
      "Thesis relies on a single lever ('just grow revenue')",
      "Value creation plan requires capabilities the buyer does not have",
      "Exit assumption requires a strategic buyer that may not exist",
      "Thesis depends on macroeconomic tailwinds (not company-specific actions)",
    ],
    companyExamples: [
      {
        companyId: "bright-dental",
        dataPoints: [
          { label: "Revenue", path: "incomeStatement.revenue" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "Adjusted EBITDA", path: "keyMetrics.adjustedEbitda" },
          { label: "Recurring Revenue %", path: "keyMetrics.recurringRevenuePct" },
        ],
        insight:
          "BrightSmile has a classic roll-up thesis: acquire individual dental practices at 4-5x EBITDA, integrate them onto a shared platform, and exit the combined entity at 10-12x as a scaled dental platform. The arbitrage between single-practice and platform multiples IS the thesis.",
      },
      {
        companyId: "vitality-vet",
        dataPoints: [
          { label: "Revenue", path: "incomeStatement.revenue" },
          { label: "Revenue Growth", path: "keyMetrics.revenueGrowth" },
          { label: "EBITDA Margin", path: "keyMetrics.ebitdaMargin" },
          { label: "Recurring Revenue %", path: "keyMetrics.recurringRevenuePct" },
        ],
        insight:
          "Vitality Pet follows the same roll-up playbook as dental but in veterinary. The thesis: pet healthcare is recession-resistant, growing (pet ownership + spending per pet), and fragmented. Build scale, then sell to a national consolidator.",
      },
    ],
    practicePrompt: {
      question:
        "Write a 3-point investment thesis for acquiring BrightSmile Dental Partners. Include the value creation plan, target hold period, and exit strategy.",
      type: "thesis",
      modelAnswer:
        "Investment Thesis -- BrightSmile Dental Partners: (1) Multiple arbitrage through continued roll-up: Acquire individual practices at 4-5x EBITDA, integrate onto shared back-office platform (billing, scheduling, procurement). Current adjusted EBITDA of $2.5M can grow to $6-8M in 3-4 years through same-store growth (5-7%) plus tuck-in acquisitions ($10M invested). (2) Margin expansion through operational consolidation: Centralize procurement (dental supplies = 15-20% of COGS), implement shared scheduling and billing systems, and rationalize administrative staff across locations. Target: improve EBITDA margin from 25.5% to 30%+ by year 3. (3) Exit to a national dental platform at premium valuation: DSOs (dental service organizations) like Aspen, Heartland, and Pacific Dental pay 10-12x EBITDA for established multi-location platforms with $5M+ EBITDA and proven integration playbooks. Hold period: 4-5 years. Target return: 3-4x MOIC / 25-30% IRR. Key risks: integration execution, dentist retention post-acquisition, and organic growth in a competitive market.",
    },
  },
];
