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
          "Summit's add-backs total $1.65M on $4.85M reported EBITDA (34%). The above-market rent of $0.45M is the most defensible (lease can be renegotiated). The $0.7M in owner perks needs line-item scrutiny.",
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
          "Precision's add-backs of $0.5M on $1.6M EBITDA (31%) are dominated by owner compensation. With one owner running the entire operation, the key question is: what would a replacement GM cost?",
      },
    ],
    practicePrompt: {
      question:
        "Summit HVAC has $4.85M reported EBITDA and claims $6.5M adjusted EBITDA after add-backs. Walk through how you would evaluate each add-back category and determine which are defensible.",
      type: "adjustment",
      modelAnswer:
        "Start with the three categories: (1) Owner perks ($0.7M) -- compare owner comp to market rate for an HVAC GM ($150-200K). The delta is the defensible add-back. Ask for W-2s and personal expense documentation. (2) One-time expenses ($0.5M) -- get a detailed list. Were similar costs incurred in prior years? If yes, they are recurring. (3) Above-market rent ($0.45M) -- compare to market lease rates for comparable industrial space. This is usually the most defensible add-back because the lease can literally be renegotiated at closing. Total defensible add-backs might be $1.0-1.3M vs. the claimed $1.65M, putting true adjusted EBITDA closer to $5.85-6.15M.",
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
          "TrueNorth's 92% recurring revenue and 24% growth make it attractive for leverage. But SaaS companies often trade at high multiples (8-12x), which requires more equity and limits leveraged returns.",
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
          "Ironclad's $8.7M adjusted EBITDA and construction assets provide strong collateral. But project-based revenue is lumpy, so lenders may require a lower leverage multiple (2-3x vs. 4x for recurring revenue).",
      },
    ],
    practicePrompt: {
      question:
        "You are acquiring TrueNorth Analytics for 8x adjusted EBITDA. Walk through the LBO math: how much equity do you need, what leverage is appropriate, and what equity return could you expect if EBITDA grows 15% annually for 5 years?",
      type: "valuation",
      modelAnswer:
        "TrueNorth adjusted EBITDA is ~$4.1M. At 8x, enterprise value = $32.8M. SaaS businesses with 92% recurring revenue can support 3-4x leverage. At 3.5x = $14.35M debt, equity check = $18.45M. If EBITDA grows 15%/year for 5 years: Year 5 EBITDA = $8.25M. Exit at 8x (same multiple) = $66M EV. Subtract remaining debt (~$8M after paydown) = $58M equity. Return = $58M / $18.45M = 3.1x MOIC, or ~26% IRR. The deal 'works' because recurring revenue de-risks the leverage, and organic growth drives multiple expansion potential. Key sensitivities: exit multiple and growth rate.",
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
          { label: "Revenue", path: "keyMetrics.ebitda" },
        ],
        insight:
          "Coastal's 22% gross margin is typical for food distribution but leaves thin EBITDA margins (~9%). Margin improvement here means either negotiating better supplier pricing or shifting product mix toward higher-margin specialty items.",
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
        "Coastal Fresh Foods has 22% gross margin and ~9% EBITDA margin. A PE buyer believes they can improve EBITDA margin to 14% within 3 years. What specific operational changes would drive this, and how realistic is it?",
      type: "thesis",
      modelAnswer:
        "A 5-point EBITDA margin improvement in food distribution is ambitious but achievable. The path: (1) Gross margin improvement (22% to 25-26%): renegotiate supplier contracts with larger volume commitments, shift mix toward higher-margin specialty/organic items, implement dynamic pricing on perishables nearing expiry. Worth 2-3 points. (2) SGA efficiency (reduce from ~13% to 11% of revenue): consolidate warehouse operations, implement route optimization software for delivery, reduce administrative headcount through automation. Worth 1-2 points. (3) Revenue scale leverage: fixed costs (facility, management) spread over more revenue as the business grows. This is realistic if the company can grow 8-10% annually. The risk: food distribution is competitive, and aggressive pricing moves lose customers. A conservative target would be 12% EBITDA margin.",
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
          "Meridian's $-3.2M capex on $5.95M adjusted EBITDA consumes 54% of earnings just to maintain operations. Combined with negative working capital change, actual distributable cash is thin despite healthy EBITDA.",
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
        "Meridian Fulfillment has $5.95M adjusted EBITDA but $3.2M in capex and negative working capital changes. Calculate the approximate free cash flow and explain what this means for a potential buyer's return expectations.",
      type: "diagnostic",
      modelAnswer:
        "Approximate FCF: $5.95M EBITDA minus $3.2M capex minus ~$1.0M working capital absorption = ~$1.75M FCF. Cash conversion = $1.75M / $5.95M = 29%. This is poor. For a buyer, it means: (1) debt service capacity is much lower than EBITDA suggests -- lenders will underwrite to FCF, not EBITDA, (2) distributions to equity holders will be minimal during the hold period, (3) returns depend almost entirely on EBITDA growth and exit multiple, not on interim cash flow. A buyer should ask: is the $3.2M capex maintenance or growth? If growth capex drives future EBITDA, the picture improves. If it's maintenance (replacing forklifts, racking, systems), this is the real earning power of the business.",
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
          "Coastal's 22% concentration in a single grocery chain means ~$10.6M in revenue depends on one relationship. In food distribution with 22% gross margins, losing that customer would eliminate ~$2.3M gross profit, potentially wiping out most EBITDA.",
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
          "Summit's 45% recurring revenue (maintenance contracts) provides some insulation from key-person risk, as contracts survive a founder transition. But with 85 employees and a founder-led sales culture, the question is: who manages the commercial relationships?",
      },
      {
        companyId: "precision-manufacturing",
        dataPoints: [
          { label: "Revenue", path: "incomeStatement.revenue" },
          { label: "Employee Count", path: "keyMetrics.employeeCount" },
          { label: "Customer Concentration", path: "keyMetrics.customerConcentration" },
        ],
        insight:
          "Precision's 28-person shop with 18% customer concentration and a technical founder is a classic key-person risk profile. The founder likely manages the top customer relationship personally and holds institutional knowledge about the CNC processes.",
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
          "TrueNorth's 92% recurring revenue and 24% growth justify a premium multiple (8-12x). SaaS businesses with these metrics trade at the top of the LMM range because the revenue is predictable and the growth is real.",
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
          "Summit's 7.6% growth and 45% recurring revenue suggest a 5-7x multiple. HVAC services are well-understood by PE buyers, which supports liquidity and a fair valuation.",
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
          "Meridian's 18.7% growth and 60% recurring revenue (long-term contracts) put it in the 6-8x range. The fulfillment/3PL space is hot, but capital intensity (high capex) puts a ceiling on multiples.",
      },
    ],
    practicePrompt: {
      question:
        "You are evaluating three companies: TrueNorth Analytics ($4.1M EBITDA, 92% recurring, 24% growth), Summit HVAC ($6.5M EBITDA, 45% recurring, 7.6% growth), and Meridian Fulfillment ($5.95M EBITDA, 60% recurring, 18.7% growth). Rank them by appropriate valuation multiple and explain your reasoning.",
      type: "valuation",
      modelAnswer:
        "Ranking highest to lowest multiple: (1) TrueNorth Analytics: 8-12x. 92% recurring SaaS revenue is the gold standard for predictability. 24% growth means the business is scaling rapidly. SaaS multiples in LMM typically range 8-12x for these metrics. (2) Meridian Fulfillment: 6-8x. 60% recurring revenue from long-term contracts, strong 18.7% growth, but capital intensity (3PL requires warehouse capex, equipment) limits the multiple. Cash conversion matters here. (3) Summit HVAC: 5-7x. Solid, stable business with 45% recurring revenue and moderate growth. HVAC is a proven PE sector with many comparable transactions. The lower multiple reflects lower growth and lower recurring revenue percentage. The key takeaway: recurring revenue quality and growth rate are the biggest multiple drivers. A dollar of SaaS EBITDA is worth 2x a dollar of HVAC EBITDA because it's more predictable and scalable.",
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
          "BrightSmile has a classic roll-up thesis: acquire individual dental practices at 3-4x EBITDA, integrate them onto a shared platform, and sell the combined entity at 8-10x as a scaled dental platform. The arbitrage between single-practice and platform multiples IS the thesis.",
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
        "Investment Thesis -- BrightSmile Dental Partners: (1) Multiple arbitrage through continued roll-up: Acquire individual practices at 3-4x EBITDA, integrate onto shared back-office platform (billing, scheduling, procurement). Current adjusted EBITDA of $2.5M can grow to $6-8M in 3-4 years through same-store growth (5-7%) plus tuck-in acquisitions ($10M invested). (2) Margin expansion through operational consolidation: Centralize procurement (dental supplies = 15-20% of COGS), implement shared scheduling and billing systems, and rationalize administrative staff across locations. Target: improve EBITDA margin from 25.5% to 30%+ by year 3. (3) Exit to a national dental platform at premium valuation: DSOs (dental service organizations) like Aspen, Heartland, and Pacific Dental pay 10-12x EBITDA for established multi-location platforms with $5M+ EBITDA and proven integration playbooks. Hold period: 4-5 years. Target return: 3-4x MOIC / 25-30% IRR. Key risks: integration execution, dentist retention post-acquisition, and organic growth in a competitive market.",
    },
  },
];
