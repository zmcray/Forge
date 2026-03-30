export const COMPARISONS = [
  {
    id: "customer-concentration",
    title: "Customer Concentration Risk",
    subtitle: "Same risk, different severity across three business models",
    description: "Customer concentration is the #1 deal-killer in LMM PE. But what counts as 'concentrated' varies by industry. A food distributor with 22% in one customer faces different risk than a SaaS company with 8% in one account. The key variables: contract duration, switching costs, and how quickly the lost revenue could be replaced.",
    companies: ["coastal-foods", "apex-logistics", "truenorth-saas"],
    dataPoints: [
      { label: "Customer Concentration", path: "keyMetrics.customerConcentration", suffix: "%" },
      { label: "Revenue", path: "revenue", prefix: "$", suffix: "M" },
      { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct", suffix: "%" },
      { label: "Adjusted EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin", suffix: "%" },
      { label: "Revenue Growth", path: "keyMetrics.revenueGrowth", suffix: "%" }
    ],
    analysisPrompts: [
      "Which company's concentration risk concerns you most, and why? Consider not just the percentage but the business model dynamics.",
      "How would you structure earn-out or holdback provisions differently for each company based on their concentration risk?",
      "If the top customer left tomorrow, which company survives and which doesn't? Walk through the math."
    ],
    keyInsight: "Concentration risk is not just about the percentage. It is about switching costs, contract duration, and how quickly the revenue can be replaced. Apex's 35% is existential because logistics contracts are easy to move. TrueNorth's 8% is low risk because SaaS contracts have 12-month terms and high switching costs. Coastal's 22% is moderate but dangerous because food distribution is a commodity market with thin margins."
  },
  {
    id: "key-person-risk",
    title: "Key-Person / Founder Risk",
    subtitle: "Three flavors of founder dependency: sales, technical, clinical",
    description: "Almost every LMM business has key-person risk. The founder built it, and to some degree, IS it. But the nature of the risk varies dramatically. A founder who holds customer relationships is a different problem than a founder who holds technical certifications or clinical expertise. Each requires a different mitigation strategy.",
    companies: ["summit-hvac", "precision-manufacturing", "bright-dental"],
    dataPoints: [
      { label: "Owner Compensation", path: "incomeStatement.ownerComp", isArray: true, arrayIndex: 1, prefix: "$", suffix: "M" },
      { label: "Revenue", path: "revenue", prefix: "$", suffix: "M" },
      { label: "Revenue Growth", path: "keyMetrics.revenueGrowth", suffix: "%" },
      { label: "Employee Count", path: "keyMetrics.employeeCount" },
      { label: "Adjusted EBITDA", path: "keyMetrics.adjustedEbitda", prefix: "$", suffix: "M" }
    ],
    analysisPrompts: [
      "Categorize the type of founder risk in each company (sales/relationship, technical/expertise, operational/strategic). How does the type change your mitigation approach?",
      "Rank these three businesses by how long they could operate effectively if the founder left tomorrow. What drives the ranking?",
      "Design a different transition plan for each founder. What is the right timeline and incentive structure?"
    ],
    keyInsight: "Summit's founder holds customer relationships (sales risk). A strong GM can eventually replace this, but it takes 12-18 months of relationship transfer. Precision's founder holds technical expertise (knowledge risk). This is the hardest to replace because certifications and estimating skill take years to develop. BrightSmile's founder is a non-clinical operator (strategic risk). This is actually the easiest to mitigate because the clinical work is done by employed dentists, and the operational model can be documented and transferred."
  },
  {
    id: "growth-vs-margin",
    title: "Growth vs. Margin Tension",
    subtitle: "Three different growth models with different margin implications",
    description: "In PE, the ideal business grows quickly while expanding margins. In reality, most businesses face a trade-off: invest in growth (which compresses margins) or optimize margins (which may slow growth). How a company manages this tension reveals its economic engine and determines the right PE strategy.",
    companies: ["truenorth-saas", "bright-dental", "ironclad-construction"],
    dataPoints: [
      { label: "Revenue Growth", path: "keyMetrics.revenueGrowth", suffix: "%" },
      { label: "Gross Margin", path: "keyMetrics.grossMargin", suffix: "%" },
      { label: "EBITDA Margin", path: "keyMetrics.ebitdaMargin", suffix: "%" },
      { label: "Adj. EBITDA Margin", path: "keyMetrics.adjustedEbitdaMargin", suffix: "%" },
      { label: "Recurring Revenue", path: "keyMetrics.recurringRevenuePct", suffix: "%" }
    ],
    analysisPrompts: [
      "Each company has a different growth model (organic SaaS, roll-up acquisition, project-based). How does the growth model affect margin trajectory?",
      "If you could only pick one of these three to invest in, which one and why? What is the margin expansion path for your pick?",
      "TrueNorth is growing 28% with an 18% EBITDA margin. Ironclad is growing 6% with an 8% EBITDA margin. Which is actually generating more incremental cash? Show your math."
    ],
    keyInsight: "TrueNorth's growth creates long-term value because SaaS has near-zero marginal cost. Each new customer flows almost entirely to gross profit. BrightSmile's growth via acquisition is riskier because each new practice comes with integration costs and new clinical staff to retain. Ironclad's growth is the least valuable because construction projects have thin margins, high working capital needs, and no compounding effect. The PE strategy should match the model: for TrueNorth, invest in sales; for BrightSmile, optimize integration; for Ironclad, focus on margin expansion rather than growth."
  },
  {
    id: "working-capital-intensity",
    title: "Working Capital Intensity",
    subtitle: "Same balance sheet line items, wildly different dynamics by business model",
    description: "Working capital, the cash tied up in receivables, inventory, and payables, behaves completely differently depending on the business model. A SaaS company that collects upfront has negative working capital (a source of cash). A food distributor carrying perishable inventory has positive working capital (a use of cash). Understanding these dynamics is essential for modeling cash flow and structuring deals.",
    companies: ["meridian-fulfillment", "coastal-foods", "truenorth-saas"],
    dataPoints: [
      { label: "Accounts Receivable", path: "balanceSheet.ar", prefix: "$", suffix: "M" },
      { label: "Inventory", path: "balanceSheet.inventory", prefix: "$", suffix: "M" },
      { label: "Accounts Payable", path: "balanceSheet.ap", prefix: "$", suffix: "M" },
      { label: "Working Capital Change", path: "cashFlow.changeWc", prefix: "$", suffix: "M" },
      { label: "Revenue", path: "revenue", prefix: "$", suffix: "M" }
    ],
    analysisPrompts: [
      "Calculate DSO (Days Sales Outstanding) for each company. What does the spread tell you about each business model?",
      "As each company grows 20% next year, estimate the additional working capital each one will need. Which business model is the most capital-efficient for growth?",
      "If you were setting a working capital peg for each company in an acquisition, what trailing average would you use and why?"
    ],
    keyInsight: "TrueNorth's SaaS model collects annual subscriptions upfront, creating negative working capital, meaning the company gets paid before it delivers the service. Growth actually generates cash. Coastal's food distribution model requires carrying perishable inventory and offering 45+ day payment terms, meaning growth consumes cash. Every $1M in revenue growth requires roughly $100K in additional working capital. Meridian's 3PL model has no inventory but carries significant AR ($3.8M on $29.5M revenue), making cash collection the key lever."
  }
];
