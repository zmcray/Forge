// Per-company operational data layers for Stage 2 consulting-wedge exercises (F13/F14).
// Three layers per company: operations (process maps), aiOpportunities (scored assessments
// keyed by process id), implementationContext (tech readiness). Grounded in each company's
// financials in companies.js: costAllocation.mapsTo references real income-statement lines,
// headcount reconciles to keyMetrics.employeeCount, and the sum of aiOpportunity impact
// highs stays well under 40% of reported EBITDA. Nothing outside tests imports this file
// yet; Stage 2 screens will lazy-import it to keep the eager bundle lean.

export const OPERATIONS_PROFILES = {
  "summit-hvac": {
    operations: [
      {
        id: "dispatch-scheduling",
        name: "Dispatch & Scheduling",
        description:
          "Central dispatch desk routing 60+ field technicians across 3 branches; balances emergency service calls against scheduled maintenance contract visits.",
        headcount: 6,
        costAllocation: {
          amount: 0.7,
          mapsTo: "sgaExpense",
          note: "Dispatcher salaries and dispatch software licenses, ~13% of SGA",
        },
        manualSubProcesses: [
          "Phone-based intake of emergency service calls",
          "Manual technician-to-job matching by dispatcher memory of skills and territory",
          "End-of-day paper timesheet reconciliation against job tickets",
          "Callback scheduling for follow-up visits tracked in a spreadsheet",
        ],
        currentTools: ["ServiceTitan (partially adopted)", "Excel", "Phone/text"],
        dataQuality:
          "Job and timesheet data lives in ServiceTitan but adoption is inconsistent across branches; roughly a third of jobs still close out on paper.",
      },
      {
        id: "field-service-ops",
        name: "Field Service Operations",
        description:
          "Installation and service delivery: technicians performing commercial HVAC installs, repairs, and preventive maintenance under service contracts.",
        headcount: 78,
        costAllocation: {
          amount: 12.5,
          mapsTo: "cogs",
          note: "Direct labor and truck costs, ~60% of COGS (remainder is equipment and materials)",
        },
        manualSubProcesses: [
          "Handwritten job notes transcribed into the system after the visit",
          "Photo documentation stored on technician phones, not centrally",
          "Warranty claim assembly from paper records",
          "Parts usage logged at day end from memory",
        ],
        currentTools: ["ServiceTitan mobile app", "Phone cameras", "Paper job packets"],
        dataQuality:
          "Job completion data is reliable; parts usage and time-on-task data are noisy because they are back-filled at day end.",
      },
      {
        id: "estimating-quoting",
        name: "Estimating & Quoting",
        description:
          "Commercial install bids and service quote generation; the owner personally reviews every bid over $50K, creating a bottleneck.",
        headcount: 5,
        costAllocation: {
          amount: 0.8,
          mapsTo: "sgaExpense",
          note: "Estimator salaries, ~15% of SGA",
        },
        manualSubProcesses: [
          "Manual takeoffs from blueprints",
          "Pricing built in per-estimator Excel templates that have drifted apart",
          "Owner review queue for large bids managed over email",
          "Win/loss tracking in a shared spreadsheet, rarely updated",
        ],
        currentTools: ["Excel", "Bluebeam (one seat)", "Email"],
        dataQuality:
          "Historical bid data exists but is scattered across estimator spreadsheets; no unified win-rate or margin-by-bid dataset.",
      },
      {
        id: "procurement",
        name: "Procurement & Inventory",
        description:
          "Equipment and parts purchasing from HVAC distributors (Carrier, Trane, Ferguson); truck stock management across 3 branches.",
        headcount: 4,
        costAllocation: {
          amount: 6.8,
          mapsTo: "cogs",
          note: "Equipment and materials spend, ~33% of COGS, managed by the purchasing team",
        },
        manualSubProcesses: [
          "PO creation by phone and email with distributor reps",
          "Price comparison across distributors done ad hoc",
          "Truck stock counts done quarterly on paper",
          "Invoice-to-PO matching done by hand in AP",
        ],
        currentTools: ["Distributor web portals", "Excel", "QuickBooks"],
        dataQuality:
          "Purchase history is complete in QuickBooks but not structured by part or job; no visibility into price variance across distributors.",
      },
      {
        id: "backoffice-ar-ap",
        name: "Back-Office AR/AP",
        description:
          "Invoicing, collections, payables, and service contract billing; DSO runs high because contract invoices go out in a monthly batch.",
        headcount: 7,
        costAllocation: {
          amount: 0.9,
          mapsTo: "sgaExpense",
          note: "Accounting and admin staff, ~17% of SGA",
        },
        manualSubProcesses: [
          "Manual invoice assembly from completed job tickets",
          "Collections calls worked from an aging report printout",
          "Three-way match of invoice, PO, and receiving doc by hand",
          "Service contract renewals tracked in a calendar spreadsheet",
        ],
        currentTools: ["QuickBooks", "Excel", "Email"],
        dataQuality:
          "Financial records are clean (QuickBooks is well maintained) but operational-to-financial linkage (job to invoice) requires manual lookup.",
      },
    ],
    aiOpportunities: {
      "dispatch-scheduling": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.15, high: 0.4 },
        recommendedTier: 1,
        complexityNotes:
          "ServiceTitan's own optimization features plus an off-the-shelf routing layer get most of the win; the hard part is branch-level adoption, not technology.",
        dependencies: ["Full ServiceTitan adoption across all 3 branches", "Clean technician skill/territory data"],
        risks: ["Dispatcher resistance to algorithmic assignment", "Emergency-call variability limits optimization headroom"],
      },
      "field-service-ops": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.1, high: 0.35 },
        recommendedTier: 2,
        complexityNotes:
          "AI-assisted job documentation (voice-to-notes, photo capture with auto-tagging) and guided diagnostics; needs light customization around Summit's job types and warranty workflows.",
        dependencies: ["Mobile app adoption by field techs", "Standardized job closeout process"],
        risks: ["Older technician workforce may resist new mobile workflows", "Garbage-in data if closeout discipline does not improve first"],
      },
      "estimating-quoting": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.1, high: 0.3 },
        recommendedTier: 2,
        complexityNotes:
          "Draft-quote generation from historical bids and takeoff assistance; requires consolidating estimator spreadsheets into a structured bid library first.",
        dependencies: ["Unified historical bid database", "Owner willingness to delegate sub-$50K bid review"],
        risks: ["Mispriced bids in a thin-margin trade are expensive", "Owner is the de facto pricing model; knowledge extraction takes time"],
      },
      procurement: {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.12, high: 0.3 },
        recommendedTier: 1,
        complexityNotes:
          "Off-the-shelf spend analytics plus automated price comparison across distributor portals; 1-2% savings on $6.8M of managed spend is the realistic band.",
        dependencies: ["Structured purchase history export from QuickBooks", "Distributor portal API or EDI access"],
        risks: ["Distributor relationship dynamics may limit aggressive price shopping", "Rebate structures complicate true price comparison"],
      },
      "backoffice-ar-ap": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.08, high: 0.2 },
        recommendedTier: 1,
        complexityNotes:
          "Invoice automation and AI-drafted collections outreach are mature off-the-shelf capabilities; direct labor savings plus working capital benefit from faster billing.",
        dependencies: ["QuickBooks integration", "Job-to-invoice data linkage from ServiceTitan"],
        risks: ["Automated collections tone must not damage commercial relationships"],
      },
    },
    implementationContext: {
      techStack: ["ServiceTitan (partial)", "QuickBooks", "Excel", "Microsoft 365"],
      itCapability: "basic",
      managementOpenness:
        "Owner is retirement-focused and skeptical of big software projects but receptive to anything that reduces his personal bid-review bottleneck; branch managers vary widely.",
      dataInfrastructure:
        "Two systems of record (ServiceTitan, QuickBooks) with no integration between them; meaningful history exists but needs consolidation before any model-driven work.",
      regulatoryConstraints: ["EPA 608 refrigerant handling documentation", "State contractor licensing records", "OSHA safety compliance"],
    },
  },

  "coastal-foods": {
    operations: [
      {
        id: "procurement-buying",
        name: "Procurement & Buying",
        description:
          "Specialty food purchasing from 200+ suppliers; buyers manage perishable inventory risk and negotiate price in a rising-cost environment where pass-through has failed.",
        headcount: 5,
        costAllocation: {
          amount: 32.0,
          mapsTo: "cogs",
          note: "Product purchase spend, ~82% of COGS, managed by the buying team",
        },
        manualSubProcesses: [
          "Buyer-by-buyer supplier negotiation with no shared price benchmark",
          "Demand forecasting by gut feel and last year's order sheet",
          "Manual substitution decisions when items short",
          "Spot-buy approvals over phone calls",
        ],
        currentTools: ["Legacy ERP (Produce Pro)", "Excel", "Phone/email"],
        dataQuality:
          "Purchase and cost history is complete in the ERP but pricing data is item-level only; no landed-cost or margin-by-item analysis exists.",
      },
      {
        id: "warehouse-ops",
        name: "Warehouse Operations",
        description:
          "Receiving, cold storage, and order picking across 2 warehouses; perishables demand tight rotation discipline and shrink is tracked loosely.",
        headcount: 38,
        costAllocation: {
          amount: 4.2,
          mapsTo: "cogs",
          note: "Warehouse labor and cold-chain facility costs, ~11% of COGS",
        },
        manualSubProcesses: [
          "Paper pick tickets for roughly half of orders",
          "Manual lot rotation checks (FEFO) on the floor",
          "Shrink counted monthly by clipboard walk-through",
          "Receiving quality inspection with handwritten reject logs",
        ],
        currentTools: ["Produce Pro WMS module (dated)", "Paper pick tickets", "Handheld scanners (one warehouse only)"],
        dataQuality:
          "Inventory accuracy is fair in the scanned warehouse, poor in the paper one; shrink and spoilage data is directional at best.",
      },
      {
        id: "routing-delivery",
        name: "Routing & Delivery",
        description:
          "Daily multi-stop delivery routes to restaurants, hotels, and grocers; transportation cost is the single biggest driver of the margin compression.",
        headcount: 22,
        costAllocation: {
          amount: 2.8,
          mapsTo: "cogs",
          note: "Driver labor, fuel, and fleet costs, ~7% of COGS; the line that has inflated fastest",
        },
        manualSubProcesses: [
          "Routes built each evening by two senior dispatchers from experience",
          "Manual re-sequencing when late orders land",
          "Paper proof-of-delivery with driver signatures",
          "Fuel and mileage logs keyed in weekly",
        ],
        currentTools: ["Static route sheets", "Paper POD", "Fuel cards"],
        dataQuality:
          "Stop-level delivery data is on paper; no telematics; cost-per-stop and route efficiency are unknowable today without a data build.",
      },
      {
        id: "order-entry-cs",
        name: "Order Entry & Customer Service",
        description:
          "Inbound order desk taking phone, fax, and email orders from restaurant and hotel customers, mostly before 6am cutoffs.",
        headcount: 8,
        costAllocation: {
          amount: 0.9,
          mapsTo: "sgaExpense",
          note: "Order desk and CS salaries, ~14% of SGA",
        },
        manualSubProcesses: [
          "Manual keying of phone and voicemail orders into the ERP",
          "Fax and email order transcription",
          "Order error resolution by callback",
          "Standing-order maintenance by hand",
        ],
        currentTools: ["Produce Pro order entry", "Phone/fax/email", "Excel"],
        dataQuality:
          "Order history is clean and complete in the ERP; the input channel is the problem, not the record-keeping.",
      },
      {
        id: "pricing-margin-mgmt",
        name: "Pricing & Margin Management",
        description:
          "Weekly price-sheet updates across 3,000+ SKUs; the failure to pass through input-cost inflation here is the root cause of the 100bps gross margin compression.",
        headcount: 3,
        costAllocation: {
          amount: 0.5,
          mapsTo: "sgaExpense",
          note: "Pricing analyst and sales-margin oversight, ~8% of SGA",
        },
        manualSubProcesses: [
          "Weekly price sheet built in Excel from cost reports",
          "Customer-specific pricing exceptions tracked in the ERP with no review cadence",
          "Margin leakage investigated only when a month closes badly",
          "Contract reprice negotiations prepared by hand",
        ],
        currentTools: ["Excel", "Produce Pro cost reports"],
        dataQuality:
          "Cost and price data both exist but are joined manually in Excel weekly; item-customer margin visibility lags reality by 2-4 weeks.",
      },
      {
        id: "ar-collections",
        name: "AR & Collections",
        description:
          "Receivables management on 51.5-day DSO against a 30-45 day industry norm; the top customer (22% concentration) is also a slow payer.",
        headcount: 4,
        costAllocation: {
          amount: 0.5,
          mapsTo: "sgaExpense",
          note: "AR clerk salaries and collections effort, ~8% of SGA",
        },
        manualSubProcesses: [
          "Collections worked from a weekly aging printout",
          "Manual cash application against remittances",
          "Credit-hold decisions escalated to the owner",
          "Dispute resolution over email threads",
        ],
        currentTools: ["Produce Pro AR module", "Excel", "Email"],
        dataQuality:
          "AR aging data is accurate; payment-behavior history by customer exists but has never been analyzed systematically.",
      },
    ],
    aiOpportunities: {
      "procurement-buying": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.1, high: 0.25 },
        recommendedTier: 2,
        complexityNotes:
          "Demand forecasting and buy-price benchmarking on $32M of spend; even 0.5% is meaningful, but perishable volatility and the legacy ERP make this a data project first.",
        dependencies: ["ERP data extraction pipeline", "Item master cleanup", "Buyer adoption"],
        risks: ["Perishable demand is genuinely volatile; overtrust in forecasts creates spoilage", "Buyers see negotiation as their craft"],
      },
      "warehouse-ops": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.05, high: 0.15 },
        recommendedTier: 2,
        complexityNotes:
          "Scanner rollout to the second warehouse plus AI-assisted rotation and shrink alerting; hardware and process change dominate the cost, not the model.",
        dependencies: ["Handheld scanner deployment in warehouse 2", "Lot-level receiving discipline"],
        risks: ["Labor pushback on scan compliance", "Cold-chain environment is hard on devices"],
      },
      "routing-delivery": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.08, high: 0.15 },
        recommendedTier: 1,
        complexityNotes:
          "Off-the-shelf route optimization with telematics directly attacks the transportation-cost inflation; 3-5% route-cost savings is a well-established benchmark.",
        dependencies: ["Telematics installation across the fleet", "Digital proof-of-delivery rollout"],
        risks: ["Senior dispatcher knowledge (dock constraints, delivery windows) must be encoded or retained", "Driver acceptance of tracked routes"],
      },
      "order-entry-cs": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.05, high: 0.12 },
        recommendedTier: 1,
        complexityNotes:
          "AI transcription of voicemail/email/fax orders into ERP-ready drafts is mature off-the-shelf tech; frees the order desk for exception handling and upsell.",
        dependencies: ["ERP order-entry API or import path", "Customer tolerance for confirmation texts"],
        risks: ["Order errors on perishables are costly and erode trust; needs human review in the loop initially"],
      },
      "pricing-margin-mgmt": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.08, high: 0.18 },
        recommendedTier: 2,
        complexityNotes:
          "Automated cost-to-price pass-through alerts and margin-leakage detection at item-customer level; the highest-leverage fix for the diagnosed margin compression, but requires joining cost and price data cleanly.",
        dependencies: ["Weekly cost/price data pipeline out of the ERP", "Sales team buy-in on repricing conversations"],
        risks: ["Aggressive repricing tests the 22% top-customer relationship", "Exception sprawl can silently defeat the system"],
      },
      "ar-collections": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.04, high: 0.1 },
        recommendedTier: 1,
        complexityNotes:
          "Automated dunning sequences and AI cash application; the bigger prize is working capital (cutting DSO toward 40 days frees ~$1.5M of cash) with a modest interest/labor EBITDA effect.",
        dependencies: ["AR module integration", "Owner willingness to enforce credit holds on the top customer"],
        risks: ["Collections pressure on the 22% concentration customer is commercially delicate"],
      },
    },
    implementationContext: {
      techStack: ["Produce Pro ERP (legacy)", "Excel", "Handheld scanners (1 of 2 warehouses)", "Fuel cards"],
      itCapability: "basic",
      managementOpenness:
        "Second-generation owner knows the margin problem is existential and is openly seeking outside help; middle management is stretched thin and change-fatigued.",
      dataInfrastructure:
        "One legacy ERP holds most records but extraction is painful; routing and delivery are effectively undigitized; a lightweight data warehouse is a prerequisite for the pricing and procurement plays.",
      regulatoryConstraints: ["FDA FSMA food safety and traceability rules", "HACCP cold-chain documentation", "DOT hours-of-service for drivers"],
    },
  },

  "precision-manufacturing": {
    operations: [
      {
        id: "quoting-estimating",
        name: "Quoting & Estimating",
        description:
          "RFQ response for aerospace and medical device parts; quotes require process planning knowledge that lives almost entirely in the owner's head.",
        headcount: 3,
        costAllocation: {
          amount: 0.35,
          mapsTo: "sgaExpense",
          note: "Estimating and inside sales salaries, ~27% of the lean $1.3M SGA line",
        },
        manualSubProcesses: [
          "Manual review of customer drawings and specs",
          "Cycle-time estimation from the owner's experience",
          "Material and tooling cost lookup across supplier sites",
          "Quote assembly in Word/Excel templates",
        ],
        currentTools: ["Excel", "Word", "Email", "JobBOSS (quoting module unused)"],
        dataQuality:
          "Actual job cost vs. quote data exists in JobBOSS but has never been fed back into quoting; the estimate-to-actual loop is open.",
      },
      {
        id: "cnc-programming-setup",
        name: "CNC Programming & Setup",
        description:
          "CAM programming, fixture design, and machine setup for new and repeat parts; setup time is the biggest capacity lever on a facility running near its ceiling.",
        headcount: 6,
        costAllocation: {
          amount: 1.1,
          mapsTo: "cogs",
          note: "Programmer and setup technician labor, ~15% of COGS",
        },
        manualSubProcesses: [
          "Program creation from scratch for parts similar to past jobs",
          "Paper setup sheets walked to the machine",
          "Tool library maintained in a spreadsheet",
          "First-article setup verification logged by hand",
        ],
        currentTools: ["Mastercam", "Excel tool library", "Paper setup sheets"],
        dataQuality:
          "Programs and setup sheets are archived but not searchable by part feature; finding the nearest prior job relies on veteran memory.",
      },
      {
        id: "machining-production",
        name: "Machining Production",
        description:
          "Lights-dim CNC production across ~20 machines running aerospace and medical parts to tight tolerances; utilization is capacity-constrained.",
        headcount: 24,
        costAllocation: {
          amount: 4.6,
          mapsTo: "cogs",
          note: "Machinist labor, materials, and machine overhead, ~63% of COGS",
        },
        manualSubProcesses: [
          "Machine status checked by walking the floor",
          "Job travelers updated by hand at each operation",
          "Downtime causes noted informally, rarely coded",
          "Material lot tracking on paper travelers",
        ],
        currentTools: ["JobBOSS travelers", "Machine HMIs (not networked)", "Whiteboards"],
        dataQuality:
          "No machine monitoring; utilization, OEE, and downtime data do not exist in structured form despite being the binding constraint on growth.",
      },
      {
        id: "quality-inspection-docs",
        name: "Quality & Inspection Documentation",
        description:
          "First-article inspection, in-process checks, and the AS9100/ISO 13485 documentation burden; certification paperwork consumes skilled hours.",
        headcount: 5,
        costAllocation: {
          amount: 0.9,
          mapsTo: "cogs",
          note: "Quality team labor and inspection equipment, ~12% of COGS",
        },
        manualSubProcesses: [
          "Manual transcription of CMM results into FAI reports (AS9102 forms)",
          "Certificate-of-conformance assembly per shipment",
          "Nonconformance reports written and routed on paper",
          "Audit-prep document gathering done manually for weeks",
        ],
        currentTools: ["CMM with PC-DMIS", "Excel FAI templates", "Paper NCR forms"],
        dataQuality:
          "Measurement data is precise and digital at the CMM but gets re-keyed into documents; quality records are complete because auditors require it, just trapped in PDFs.",
      },
      {
        id: "scheduling-procurement",
        name: "Production Scheduling & Procurement",
        description:
          "Job sequencing across machines and raw material purchasing (aerospace alloys, medical-grade stock) with long and volatile lead times.",
        headcount: 3,
        costAllocation: {
          amount: 0.4,
          mapsTo: "sgaExpense",
          note: "Scheduler and buyer salaries, ~31% of SGA",
        },
        manualSubProcesses: [
          "Weekly schedule built on a whiteboard and adjusted daily",
          "Material orders placed reactively when jobs release",
          "Expedite decisions made by phone with the owner",
          "Supplier lead-time tracking in a notebook",
        ],
        currentTools: ["Whiteboard", "JobBOSS (scheduling module unused)", "Excel"],
        dataQuality:
          "Order and due-date data is in JobBOSS; actual routing times are not, so any scheduling optimization needs shop-floor data capture first.",
      },
    ],
    aiOpportunities: {
      "quoting-estimating": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.08, high: 0.2 },
        recommendedTier: 2,
        complexityNotes:
          "Similar-part retrieval plus quote drafting from historical actuals closes the estimate-to-actual loop and de-risks the owner dependency; needs the JobBOSS history structured first.",
        dependencies: ["Historical job-cost data extraction", "Owner knowledge capture sessions"],
        risks: ["A bad quote on an aerospace part is a multi-quarter margin hit", "Owner is the validation authority and a bottleneck"],
      },
      "cnc-programming-setup": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.1, high: 0.25 },
        recommendedTier: 2,
        complexityNotes:
          "AI-assisted program reuse (feature-based search of the program archive) and digital setup sheets cut setup hours, which converts directly to capacity in a sold-out shop.",
        dependencies: ["Program archive indexing", "Networking the machine tools"],
        risks: ["Wrong program reuse is a scrap and certification event; human verification stays mandatory"],
      },
      "machining-production": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.12, high: 0.3 },
        recommendedTier: 2,
        complexityNotes:
          "Machine monitoring (MTConnect-style retrofit) with AI downtime classification; recovering 5-8% utilization on a capacity-constrained shop is revenue at 43% gross margin.",
        dependencies: ["Machine connectivity retrofit", "Downtime-coding discipline on the floor"],
        risks: ["Older machines need hardware adapters", "Monitoring can read as surveillance to machinists"],
      },
      "quality-inspection-docs": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.1, high: 0.25 },
        recommendedTier: 2,
        complexityNotes:
          "Automated FAI report generation from CMM output and AI-drafted certs/NCRs; document automation in a regulated shop is high-value and the data is already digital at the source.",
        dependencies: ["PC-DMIS output integration", "Quality manager sign-off workflow"],
        risks: ["AS9100/ISO 13485 auditors must accept the generated documentation; validation burden is real"],
      },
      "scheduling-procurement": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.06, high: 0.15 },
        recommendedTier: 2,
        complexityNotes:
          "Finite-capacity scheduling and material lead-time prediction; only worth building after shop-floor data capture exists, so sequence this behind machine monitoring.",
        dependencies: ["Machine monitoring data (see machining-production)", "JobBOSS scheduling module activation"],
        risks: ["Whiteboard scheduling embeds tribal constraints that must be captured, not overwritten"],
      },
    },
    implementationContext: {
      techStack: ["JobBOSS ERP (partially used)", "Mastercam", "PC-DMIS (CMM)", "Excel"],
      itCapability: "basic",
      managementOpenness:
        "Owner is technically brilliant and open to tooling that multiplies his expertise, but has zero patience for consultant-speak; wins must show up on the floor within a quarter.",
      dataInfrastructure:
        "Islands of high-quality digital data (CAM programs, CMM measurements, JobBOSS orders) with no connective tissue; machines are not networked, which is the first infrastructure spend.",
      regulatoryConstraints: ["AS9100 aerospace quality system", "ISO 13485 medical device quality system", "ITAR for certain defense-adjacent parts", "Material traceability requirements"],
    },
  },

  "bright-dental": {
    operations: [
      {
        id: "scheduling-recall",
        name: "Scheduling & Patient Recall",
        description:
          "Front-desk scheduling across 5 offices plus hygiene recall outreach; open chair time and recall lapses are the biggest silent revenue leaks in a dental group.",
        headcount: 8,
        costAllocation: {
          amount: 0.5,
          mapsTo: "sgaExpense",
          note: "Front-desk salaries across 5 offices, ~15% of SGA",
        },
        manualSubProcesses: [
          "Phone-based recall outreach worked from printed lists",
          "Manual fill of same-day cancellations by calling down a waitlist",
          "Insurance eligibility spot-checks before visits",
          "Confirmation calls the day before appointments",
        ],
        currentTools: ["Dentrix (per-office instances)", "Phone", "Printed recall lists"],
        dataQuality:
          "Each office runs its own Dentrix instance; recall and utilization data exists per office but nobody sees a consolidated view.",
      },
      {
        id: "billing-insurance-rcm",
        name: "Billing & Insurance RCM",
        description:
          "Claims submission, denial rework, and patient billing across multiple payers; revenue cycle is the classic margin lever in dental roll-ups.",
        headcount: 6,
        costAllocation: {
          amount: 0.5,
          mapsTo: "sgaExpense",
          note: "Central billing team salaries, ~15% of SGA",
        },
        manualSubProcesses: [
          "Manual claim scrubbing before submission",
          "Denial rework from payer portals one claim at a time",
          "Patient statement runs and follow-up calls",
          "Payment posting from EOBs by hand",
        ],
        currentTools: ["Dentrix billing module", "Payer web portals", "Excel"],
        dataQuality:
          "Claims data is complete but fragmented across 5 Dentrix instances; denial-reason coding is inconsistent between billers.",
      },
      {
        id: "clinical-ops",
        name: "Clinical Operations",
        description:
          "Dentist and hygienist care delivery across 5 offices: exams, hygiene, restorative, and specialty referrals; clinical labor is the dominant cost line.",
        headcount: 34,
        costAllocation: {
          amount: 3.6,
          mapsTo: "cogs",
          note: "Clinical labor (8 dentists, hygienists, assistants) and supplies, ~82% of COGS",
        },
        manualSubProcesses: [
          "Chart notes typed or dictated after each patient",
          "Treatment plan presentation built chairside",
          "Lab case tracking on a whiteboard",
          "Referral letters drafted individually",
        ],
        currentTools: ["Dentrix clinical charting", "Digital X-ray sensors", "Whiteboards"],
        dataQuality:
          "Clinical records are digital and complete per office; imaging is digital; treatment-plan acceptance rates are computable but never computed.",
      },
      {
        id: "intake-marketing",
        name: "New Patient Intake & Marketing",
        description:
          "New-patient acquisition (local search, referrals) and intake paperwork; new-patient flow feeds the de novo growth math the roll-up thesis depends on.",
        headcount: 3,
        costAllocation: {
          amount: 0.4,
          mapsTo: "sgaExpense",
          note: "Marketing spend and intake coordinator, ~12% of SGA",
        },
        manualSubProcesses: [
          "Paper intake forms scanned and re-keyed",
          "Phone inquiries answered live or lost to voicemail",
          "Review responses written ad hoc",
          "Referral source tracking in a spreadsheet",
        ],
        currentTools: ["Google Business profiles", "Paper forms", "Excel"],
        dataQuality:
          "Marketing attribution is essentially guesswork; call answer rates and conversion from inquiry to booked appointment are unmeasured.",
      },
      {
        id: "procurement-supplies",
        name: "Procurement & Supplies",
        description:
          "Dental supply and lab purchasing across 5 offices; each office manager orders independently, so the group forfeits its consolidated buying power.",
        headcount: 2,
        costAllocation: {
          amount: 0.6,
          mapsTo: "cogs",
          note: "Supplies and outside lab fees, ~14% of COGS, ordered office-by-office",
        },
        manualSubProcesses: [
          "Per-office ordering from supplier catalogs",
          "No formulary; product choice varies by office",
          "Invoice approval by office managers",
          "Lab fee reconciliation by hand",
        ],
        currentTools: ["Supplier web portals (Henry Schein, Patterson)", "Email", "QuickBooks"],
        dataQuality:
          "Spend data is in QuickBooks by vendor, not by item or office; a spend cube must be built before savings can be quantified.",
      },
    ],
    aiOpportunities: {
      "scheduling-recall": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.08, high: 0.15 },
        recommendedTier: 1,
        complexityNotes:
          "Off-the-shelf dental engagement platforms (automated recall, text confirmations, waitlist auto-fill) are proven and integrate with Dentrix; filling open chair time is nearly pure margin.",
        dependencies: ["Dentrix integration per office", "Patient contact data hygiene"],
        risks: ["Over-messaging annoys patients", "Front-desk staff may see automation as replacement"],
      },
      "billing-insurance-rcm": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.1, high: 0.18 },
        recommendedTier: 1,
        complexityNotes:
          "AI claim scrubbing and denial-management tools are mature in dental; cutting denial write-offs and days-in-AR on ~$9.8M of billings is the single best ROI in the group.",
        dependencies: ["Consolidation or bridging of the 5 Dentrix instances", "Consistent denial-reason coding"],
        risks: ["Payer behavior changes can erode gains", "HIPAA compliance for any vendor touching PHI"],
      },
      "clinical-ops": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.03, high: 0.08 },
        recommendedTier: 1,
        complexityNotes:
          "AI voice charting and radiograph-assist tools reduce per-visit admin minutes and support treatment-plan consistency; adoption by 8 dentists is the constraint, not the tech.",
        dependencies: ["Dentist champions in at least 2 offices", "Dentrix charting integration"],
        risks: ["Clinical pushback on AI-assisted diagnostics", "Malpractice and consent considerations for AI-read radiographs"],
      },
      "intake-marketing": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.05, high: 0.1 },
        recommendedTier: 1,
        complexityNotes:
          "AI phone answering for missed calls, digital intake forms, and automated review responses; recovering missed new-patient calls is measurable within weeks.",
        dependencies: ["Phone system with call routing/recording", "Online intake form rollout"],
        risks: ["A clumsy AI receptionist damages the local-practice feel the brand depends on"],
      },
      "procurement-supplies": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.03, high: 0.06 },
        recommendedTier: 1,
        complexityNotes:
          "Group purchasing consolidation with spend analytics; the AI component is light (spend classification), the savings come from formulary discipline across 5 offices.",
        dependencies: ["Item-level spend data build", "Office manager compliance with a formulary"],
        risks: ["Office autonomy culture resists central mandates"],
      },
    },
    implementationContext: {
      techStack: ["Dentrix (5 separate office instances)", "QuickBooks", "Digital radiography", "Google Workspace"],
      itCapability: "basic",
      managementOpenness:
        "Non-clinical founder is an operator by background and actively wants a technology-led playbook; office managers vary, and the 8 dentists must be won over individually on anything clinical.",
      dataInfrastructure:
        "Five siloed practice-management instances with no consolidated reporting; a group-level data layer (or migration to a cloud PMS) is the enabling investment for almost every play.",
      regulatoryConstraints: ["HIPAA privacy and security", "State dental board rules on delegable tasks", "Payer credentialing requirements", "OSHA infection control"],
    },
  },

  "apex-logistics": {
    operations: [
      {
        id: "routing-dispatch",
        name: "Routing & Dispatch",
        description:
          "Daily route construction and live dispatch for 65 box trucks across 4 metros; two-person white-glove crews make routing denser and costlier than parcel work.",
        headcount: 12,
        costAllocation: {
          amount: 1.6,
          mapsTo: "cogs",
          note: "Dispatch team and routing software, ~6% of COGS",
        },
        manualSubProcesses: [
          "Manual route adjustment after the optimizer's first pass",
          "Live exception handling (no-shows, refusals) by phone",
          "Crew-to-route assignment balancing skills and hours by hand",
          "Next-day capacity planning in a spreadsheet",
        ],
        currentTools: ["Basic routing software (DispatchTrack-class)", "Excel", "Phone/radio"],
        dataQuality:
          "Stop-level and GPS data is captured and reasonably clean; the fleet is instrumented, making this the best data asset in the company.",
      },
      {
        id: "delivery-ops",
        name: "Delivery Operations",
        description:
          "Two-person white-glove delivery, assembly, and haul-away of heavy/bulky items; labor is the dominant cost and quality drives the retailer scorecards that keep contracts.",
        headcount: 150,
        costAllocation: {
          amount: 18.5,
          mapsTo: "cogs",
          note: "Driver/helper labor (W2) and IC settlements, ~66% of COGS",
        },
        manualSubProcesses: [
          "Pre-delivery item inspection logged inconsistently",
          "In-home damage documentation via ad hoc photos",
          "Assembly instructions looked up per item on the fly",
          "IC settlement calculation reconciled manually each week",
        ],
        currentTools: ["Driver mobile app (POD photos, signatures)", "Excel settlement sheets"],
        dataQuality:
          "POD and photo data is captured but unstructured; damage-claim evidence is scattered; IC settlement data is spreadsheet-fragile.",
      },
      {
        id: "customer-scheduling",
        name: "Customer Scheduling & Notifications",
        description:
          "Delivery-window scheduling with end customers on behalf of retailers, plus day-of notifications; failed first-attempt deliveries are the most expensive event in the network.",
        headcount: 14,
        costAllocation: {
          amount: 1.3,
          mapsTo: "sgaExpense",
          note: "Call center and scheduling staff, ~20% of SGA",
        },
        manualSubProcesses: [
          "Outbound scheduling calls to end customers",
          "Rescheduling and window-change requests handled by phone",
          "Manual escalation when customers are unreachable",
          "Day-of ETA updates given only when customers call in",
        ],
        currentTools: ["Phone system", "Scheduling module of routing software", "SMS (one-way)"],
        dataQuality:
          "Contact attempts and outcomes are logged in the scheduling module; reachability patterns by customer segment have never been analyzed.",
      },
      {
        id: "fleet-maintenance",
        name: "Fleet & Maintenance",
        description:
          "Maintenance and lifecycle management of 65 box trucks; unplanned downtime cascades into missed delivery windows and retailer scorecard penalties.",
        headcount: 10,
        costAllocation: {
          amount: 2.2,
          mapsTo: "cogs",
          note: "Maintenance labor, parts, and outside repair, ~8% of COGS",
        },
        manualSubProcesses: [
          "PM scheduling on a wall calendar by mileage guesses",
          "Driver vehicle inspection reports on paper",
          "Repair-vs-replace decisions made informally",
          "Parts ordering reactive to breakdowns",
        ],
        currentTools: ["Telematics (GPS + basic diagnostics)", "Paper DVIRs", "Excel"],
        dataQuality:
          "Telematics provides mileage and fault codes but maintenance history is in paper folders; predictive anything requires digitizing work orders first.",
      },
      {
        id: "claims-exceptions",
        name: "Claims & Exception Management",
        description:
          "Damage claims, missing-item disputes, and delivery exceptions with retailers and end customers; claims leakage directly erodes thin margins and retailer trust.",
        headcount: 6,
        costAllocation: {
          amount: 0.7,
          mapsTo: "sgaExpense",
          note: "Claims team salaries and claim payouts absorbed in overhead, ~11% of SGA",
        },
        manualSubProcesses: [
          "Claim intake by email from retailer portals",
          "Photo evidence gathering from driver phones after the fact",
          "Liability determination by case-by-case judgment",
          "Claim status updates typed into each retailer's portal",
        ],
        currentTools: ["Email", "Retailer portals", "Excel claim log"],
        dataQuality:
          "Claim outcomes are logged in a spreadsheet; linking claims back to specific crews, items, and handling steps is manual and rarely done.",
      },
      {
        id: "billing-settlement",
        name: "Billing & IC Settlement",
        description:
          "Retailer invoicing against rate cards with accessorial charges, plus weekly independent-contractor settlement; both are error-prone and disputes consume back-office time.",
        headcount: 6,
        costAllocation: {
          amount: 0.7,
          mapsTo: "sgaExpense",
          note: "Billing and settlement staff, ~11% of SGA",
        },
        manualSubProcesses: [
          "Manual rating of accessorials (stairs, assembly, haul-away) per delivery",
          "Invoice dispute research across systems",
          "IC settlement calculation and adjustment processing",
          "Rate card version management in Excel",
        ],
        currentTools: ["QuickBooks", "Excel rate cards", "Retailer EDI (partial)"],
        dataQuality:
          "Delivery event data needed for accurate rating exists in the routing system; the rating logic itself lives in spreadsheets with version drift.",
      },
    ],
    aiOpportunities: {
      "routing-dispatch": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.15, high: 0.35 },
        recommendedTier: 2,
        complexityNotes:
          "Upgraded AI route optimization tuned for two-person crews and dwell-time prediction; the GPS data foundation is already strong, so this is configuration plus tuning, not a data build.",
        dependencies: ["Historical stop-level dwell data", "Dispatcher trust in the optimizer's second pass"],
        risks: ["Union-free labor model relies on predictable shifts; volatile routes hurt retention"],
      },
      "delivery-ops": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.1, high: 0.3 },
        recommendedTier: 2,
        complexityNotes:
          "Structured photo capture with AI damage detection at pickup and delivery, plus guided assembly content; cuts claims and re-delivery costs but requires driver workflow change across 230 people.",
        dependencies: ["Driver app upgrade", "Crew training rollout", "Claims data linkage"],
        risks: ["IC classification sensitivity: prescriptive app workflows for ICs can strengthen reclassification arguments"],
      },
      "customer-scheduling": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.1, high: 0.2 },
        recommendedTier: 1,
        complexityNotes:
          "Self-serve scheduling links, two-way SMS, and AI voice outreach for unreachable customers; cutting failed first attempts by 20-30% is a proven off-the-shelf outcome.",
        dependencies: ["Two-way SMS enablement", "Routing system API for live windows"],
        risks: ["Older end-customer demographic for some product lines still needs the phone channel"],
      },
      "fleet-maintenance": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.05, high: 0.15 },
        recommendedTier: 1,
        complexityNotes:
          "Fleet maintenance software with telematics-driven PM scheduling and fault-code triage; off the shelf, but the paper work-order history must be digitized to get predictive value.",
        dependencies: ["Work-order digitization", "Telematics data feed integration"],
        risks: ["Savings depend on mechanic capacity to act on earlier warnings"],
      },
      "claims-exceptions": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.08, high: 0.2 },
        recommendedTier: 2,
        complexityNotes:
          "AI claim triage that assembles photo evidence, drafts liability determinations, and files retailer portal updates; pairs with the delivery-ops photo capture play and shrinks both payouts and handling labor.",
        dependencies: ["Structured photo capture upstream", "Claims history data cleanup"],
        risks: ["Aggressive claim denial damages the 35%-concentration retailer relationship"],
      },
      "billing-settlement": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.08, high: 0.15 },
        recommendedTier: 2,
        complexityNotes:
          "Automated accessorial rating from delivery event data plus IC settlement automation; recovers leaked accessorial revenue and cuts dispute labor. Light custom work to encode rate cards.",
        dependencies: ["Rate card normalization", "Routing-to-billing data pipe"],
        risks: ["Retailer audits of newly captured accessorials may trigger rate renegotiation"],
      },
    },
    implementationContext: {
      techStack: ["DispatchTrack-class routing platform", "Telematics/GPS fleet-wide", "Driver mobile app", "QuickBooks", "Partial retailer EDI"],
      itCapability: "moderate",
      managementOpenness:
        "Management is under margin pressure and actively shopping for efficiency levers; appetite is high but cash for upfront investment is thin given leverage, so phased plays with fast payback win.",
      dataInfrastructure:
        "Strong operational data core (GPS, stop events, POD) with weak back-office linkage; maintenance and claims are the paper islands. A mid-tier data stack is feasible within existing IT.",
      regulatoryConstraints: ["Independent contractor classification (state ABC tests)", "DOT/FMCSA vehicle and hours rules", "Cargo liability and claims regulations"],
    },
  },

  "truenorth-saas": {
    operations: [
      {
        id: "onboarding-implementation",
        name: "Customer Onboarding & Implementation",
        description:
          "60-90 day implementations connecting customer cloud environments, importing policies, and configuring compliance frameworks; time-to-value drives early churn risk.",
        headcount: 8,
        costAllocation: {
          amount: 0.9,
          mapsTo: "cogs",
          note: "Implementation team salaries, ~29% of COGS",
        },
        manualSubProcesses: [
          "Manual mapping of customer policies to framework controls",
          "Evidence-source configuration done screen-by-screen with customers",
          "Kickoff and status decks assembled by hand",
          "Implementation runbooks copied and edited per customer",
        ],
        currentTools: ["Own platform admin console", "Notion runbooks", "Slack Connect", "Zoom"],
        dataQuality:
          "Implementation milestone data is tracked in the platform; time-per-step telemetry exists and is genuinely analyzable, a luxury the portfolio's other companies lack.",
      },
      {
        id: "customer-support",
        name: "Customer Support",
        description:
          "Tiered support for compliance questions and product issues; a high share of tickets are how-to and auditor-question lookups rather than defects.",
        headcount: 7,
        costAllocation: {
          amount: 0.8,
          mapsTo: "cogs",
          note: "Support team salaries and tooling, ~26% of COGS",
        },
        manualSubProcesses: [
          "Manual triage and routing of inbound tickets",
          "Answers researched across docs, Slack history, and past tickets",
          "Escalation summaries written for engineering",
          "Macro/canned-response library maintained by hand",
        ],
        currentTools: ["Zendesk", "Slack", "Notion knowledge base"],
        dataQuality:
          "Full ticket history with tags in Zendesk; knowledge base is decent but drifts from product reality; ideal substrate for retrieval-based AI.",
      },
      {
        id: "sales-pipeline-ops",
        name: "Sales & Pipeline Operations",
        description:
          "Outbound and inbound motion for mid-market compliance buyers; S&M runs 38% of revenue with a 20-month CAC payback, making sales efficiency the company's defining problem.",
        headcount: 18,
        costAllocation: {
          amount: 4.2,
          mapsTo: "sgaExpense",
          note: "Sales salaries, commissions, and tooling, ~53% of SGA (the S&M line)",
        },
        manualSubProcesses: [
          "Manual prospect research and list building",
          "Personalized outbound sequences written per account",
          "Security-questionnaire responses for prospects assembled by hand",
          "Pipeline hygiene and forecast roll-ups in spreadsheets",
        ],
        currentTools: ["Salesforce", "Outreach", "LinkedIn Sales Navigator", "Excel"],
        dataQuality:
          "CRM discipline is average: stages are current, but activity logging and loss reasons are patchy, which muddies any conversion analysis.",
      },
      {
        id: "marketing-demand-gen",
        name: "Marketing & Demand Generation",
        description:
          "Content-led demand gen (SOC 2 guides, compliance checklists) plus paid channels; content production velocity constrains the inbound engine.",
        headcount: 6,
        costAllocation: {
          amount: 1.2,
          mapsTo: "sgaExpense",
          note: "Marketing salaries and program spend, ~15% of SGA",
        },
        manualSubProcesses: [
          "Long-form content drafted from scratch by two writers",
          "Webinar and event logistics managed manually",
          "Lead scoring rules maintained by hand in HubSpot",
          "Campaign performance reporting stitched across platforms",
        ],
        currentTools: ["HubSpot", "Google Ads", "Webflow", "Google Analytics"],
        dataQuality:
          "Funnel data is well instrumented from visit to MQL; attribution past the MQL handoff into Salesforce is the usual mess.",
      },
      {
        id: "compliance-content-ops",
        name: "Compliance Content Operations",
        description:
          "Maintaining the control mappings, framework updates (SOC 2, ISO 27001, HIPAA), and audit-evidence templates that ARE the product's substance; slow updates create competitive exposure.",
        headcount: 5,
        costAllocation: {
          amount: 0.7,
          mapsTo: "sgaExpense",
          note: "Compliance research analysts, ~9% of SGA",
        },
        manualSubProcesses: [
          "Manual monitoring of framework and regulation changes",
          "Control-mapping updates written and peer-reviewed by analysts",
          "Cross-framework mapping maintenance (one control, many frameworks)",
          "Auditor feedback incorporated by hand each cycle",
        ],
        currentTools: ["Internal mapping database", "Notion", "Regulatory subscription feeds"],
        dataQuality:
          "The mapping database is the crown-jewel structured dataset; versioned, reviewed, and clean. Best-in-portfolio foundation for LLM-assisted work.",
      },
    ],
    aiOpportunities: {
      "onboarding-implementation": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.1, high: 0.2 },
        recommendedTier: 3,
        complexityNotes:
          "LLM-assisted policy-to-control mapping during implementation, built on the internal mapping database; deep custom because it touches the product itself, and it doubles as a sellable feature.",
        dependencies: ["Mapping database API", "Engineering capacity allocation", "Customer consent for document processing"],
        risks: ["Wrong control mappings surface in customer audits; expert review must stay in the loop"],
      },
      "customer-support": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.08, high: 0.18 },
        recommendedTier: 2,
        complexityNotes:
          "RAG-based support copilot over docs, tickets, and the mapping database; 30-40% ticket deflection is realistic given the how-to-heavy ticket mix, and the team can self-host the build.",
        dependencies: ["Knowledge base freshness process", "Zendesk integration"],
        risks: ["Confidently wrong compliance answers are worse than slow ones; guardrails and citation required"],
      },
      "sales-pipeline-ops": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.1, high: 0.22 },
        recommendedTier: 2,
        complexityNotes:
          "AI prospect research, personalized outbound drafting, and automated security-questionnaire responses; attacks the 20-month CAC payback directly, but rep adoption and CRM hygiene gate the value.",
        dependencies: ["Salesforce data cleanup", "Sales leadership enforcement of new workflow"],
        risks: ["Generic AI outbound can damage sender reputation and brand in a sophisticated buyer market"],
      },
      "marketing-demand-gen": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.05, high: 0.12 },
        recommendedTier: 1,
        complexityNotes:
          "Off-the-shelf AI content drafting with expert review doubles content velocity at flat headcount; compliance subject matter means review discipline is non-negotiable.",
        dependencies: ["Editorial review workflow", "Brand voice guidelines"],
        risks: ["Compliance content errors carry outsized reputational cost for a trust-based brand"],
      },
      "compliance-content-ops": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.06, high: 0.15 },
        recommendedTier: 3,
        complexityNotes:
          "LLM-assisted regulatory-change monitoring and draft mapping updates over the crown-jewel database; deep custom, high leverage, and compounding with the onboarding play. Analyst review remains the product guarantee.",
        dependencies: ["Mapping database versioning workflow", "Regulatory feed ingestion pipeline"],
        risks: ["Automation drift in the core dataset would be an existential product-quality failure; change control must be rigorous"],
      },
    },
    implementationContext: {
      techStack: ["AWS (own platform)", "Salesforce", "HubSpot", "Zendesk", "Notion", "Internal mapping database"],
      itCapability: "moderate",
      managementOpenness:
        "Engineer-founders are enthusiastic and can build in-house; the risk is the opposite of the rest of the portfolio: shiny-object sprawl and engineering time diverted from the product roadmap.",
      dataInfrastructure:
        "Modern cloud stack with genuine telemetry, a clean structured mapping database, and full ticket/CRM history; the only company in the portfolio where tier-3 custom builds are immediately feasible.",
      regulatoryConstraints: ["SOC 2 obligations on its own operations", "Customer data processing agreements", "GDPR/CCPA for customer environment data"],
    },
  },

  "ironclad-construction": {
    operations: [
      {
        id: "estimating-bidding",
        name: "Estimating & Bidding",
        description:
          "Takeoffs, subcontractor quote leveling, and bid assembly for government, healthcare, and education projects; the <2% cost-overrun record makes this team the company's moat.",
        headcount: 7,
        costAllocation: {
          amount: 0.9,
          mapsTo: "sgaExpense",
          note: "Estimating team salaries, ~22% of SGA",
        },
        manualSubProcesses: [
          "Manual quantity takeoffs from drawings",
          "Sub quote solicitation and leveling in spreadsheets",
          "Historical cost lookups from the lead estimator's personal database",
          "Bid form assembly to each agency's format",
        ],
        currentTools: ["On-Screen Takeoff", "Excel", "Access database of historical costs", "Agency bid portals"],
        dataQuality:
          "Two decades of project cost history exists in an Access database maintained by one senior estimator; complete but institutionally fragile.",
      },
      {
        id: "project-management-field",
        name: "Project Management & Field Operations",
        description:
          "Superintendents and PMs running concurrent commercial projects: schedule management, RFIs, submittals, change orders, and daily field coordination.",
        headcount: 130,
        costAllocation: {
          amount: 34.0,
          mapsTo: "cogs",
          note: "Field labor, subcontractor payments, and materials, ~79% of COGS",
        },
        manualSubProcesses: [
          "Daily reports typed or handwritten by superintendents",
          "RFI and submittal logs updated manually",
          "Change-order pricing assembled from sub quotes by hand",
          "Schedule updates entered weekly from field calls",
        ],
        currentTools: ["Procore (rolled out last year, adoption uneven)", "MS Project", "Excel"],
        dataQuality:
          "Procore is capturing more each quarter but historic projects live in files and email; daily-report completeness varies by superintendent.",
      },
      {
        id: "procurement-subcontractor",
        name: "Procurement & Subcontractor Management",
        description:
          "Buyout of materials and subcontractor packages after award, sub prequalification, and compliance tracking (insurance, bonding, certified payroll).",
        headcount: 8,
        costAllocation: {
          amount: 6.0,
          mapsTo: "cogs",
          note: "Direct materials purchasing and procurement team overhead, ~14% of COGS",
        },
        manualSubProcesses: [
          "Sub prequalification packets reviewed by hand",
          "Insurance certificate expiration tracking in a spreadsheet",
          "Buyout comparison sheets built per package",
          "Certified payroll collection and checking for government jobs",
        ],
        currentTools: ["Excel", "Procore (partially)", "Email"],
        dataQuality:
          "Sub performance history (quality, schedule reliability) exists only anecdotally; compliance document tracking is complete but manual.",
      },
      {
        id: "compliance-safety-docs",
        name: "Compliance & Safety Documentation",
        description:
          "Government contract compliance (prevailing wage, DBE participation, closeout documentation) and OSHA safety programs; documentation burden scales with the government mix.",
        headcount: 6,
        costAllocation: {
          amount: 0.8,
          mapsTo: "sgaExpense",
          note: "Compliance and safety staff, ~20% of SGA",
        },
        manualSubProcesses: [
          "Certified payroll report assembly weekly per project",
          "DBE participation tracking and reporting",
          "Safety audit forms completed on paper on site",
          "Project closeout binder assembly over weeks",
        ],
        currentTools: ["Excel", "Agency portals", "Paper forms", "Procore (safety module unused)"],
        dataQuality:
          "Compliance records are complete because agencies demand them, but they are document-shaped, not data-shaped; heavy re-keying between systems.",
      },
      {
        id: "billing-pay-apps",
        name: "Billing, Pay Applications & AR",
        description:
          "Monthly AIA-style pay applications with schedules of values, lien waiver management, and receivables follow-up; slow pay apps directly drive the $8.4M AR balance.",
        headcount: 6,
        costAllocation: {
          amount: 0.7,
          mapsTo: "sgaExpense",
          note: "Project accounting staff, ~17% of SGA",
        },
        manualSubProcesses: [
          "Pay application assembly from PM percent-complete calls",
          "Lien waiver collection from every sub each cycle",
          "Retention tracking in spreadsheets",
          "Owner/agency billing follow-up by phone and email",
        ],
        currentTools: ["Sage 300 CRE", "Excel", "Email"],
        dataQuality:
          "Job-cost accounting in Sage is disciplined and accurate; the friction is assembly and chasing documents, not record quality.",
      },
    ],
    aiOpportunities: {
      "estimating-bidding": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.15, high: 0.35 },
        recommendedTier: 2,
        complexityNotes:
          "AI takeoff assistance and historical cost retrieval built on the 20-year cost database; protects the estimating moat from key-person loss and lifts bid throughput without lowering the hit rate.",
        dependencies: ["Access database migration to a structured store", "Lead estimator knowledge-capture buy-in"],
        risks: ["One mispriced bid can erase a quarter of EBITDA in an 18%-gross-margin business; AI is decision support, never auto-bid"],
      },
      "project-management-field": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.15, high: 0.4 },
        recommendedTier: 2,
        complexityNotes:
          "AI daily-report capture (voice-to-structured-report), RFI drafting, and schedule-risk flagging on top of Procore; a 0.5% reduction in project cost slippage is worth ~$0.2M annually by itself.",
        dependencies: ["Procore adoption completion across all supers", "Superintendent training and champions"],
        risks: ["Field culture adoption is the graveyard of construction tech; must feel like less typing, not more oversight"],
      },
      "procurement-subcontractor": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.1, high: 0.3 },
        recommendedTier: 2,
        complexityNotes:
          "Structured sub performance scoring, automated compliance-document tracking, and AI buyout comparison; better buyout on ~$25M of annual sub packages is where the range's top end lives.",
        dependencies: ["Sub performance data capture going forward", "Procore compliance module activation"],
        risks: ["Squeezing subs too hard in a tight labor market costs schedule reliability, the thing clients pay Ironclad for"],
      },
      "compliance-safety-docs": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.08, high: 0.2 },
        recommendedTier: 1,
        complexityNotes:
          "Off-the-shelf certified-payroll automation, digital safety forms, and AI-assembled closeout documentation; pure documentation-burden relief with low change-management risk.",
        dependencies: ["Payroll system data feed", "Mobile forms rollout to field"],
        risks: ["Errors in government compliance filings carry debarment risk; validation checks required"],
      },
      "billing-pay-apps": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.08, high: 0.18 },
        recommendedTier: 1,
        complexityNotes:
          "Automated pay-app assembly from Sage job-cost data plus lien-waiver chasing workflows; accelerating billing by even a week shrinks the $8.4M AR balance and its financing cost.",
        dependencies: ["Sage 300 integration", "PM percent-complete data discipline"],
        risks: ["Government payment timing is externally constrained; gains cap out at Ironclad's side of the delay"],
      },
    },
    implementationContext: {
      techStack: ["Procore (year one of rollout)", "Sage 300 CRE", "On-Screen Takeoff", "MS Project", "Access database (estimating history)", "Excel"],
      itCapability: "basic",
      managementOpenness:
        "Owner (63) is succession-minded and supportive of anything that institutionalizes knowledge before he exits; superintendents are the adoption battleground and need field-credible champions.",
      dataInfrastructure:
        "A disciplined accounting core (Sage) and a rich but fragile estimating database, with field data mid-migration into Procore; consolidation into Procore plus a reporting layer is the enabling move.",
      regulatoryConstraints: ["Davis-Bacon prevailing wage and certified payroll", "DBE/MBE participation requirements", "OSHA construction standards", "Public bid and procurement rules", "Bonding covenants"],
    },
  },

  "vitality-vet": {
    operations: [
      {
        id: "scheduling-reminders",
        name: "Scheduling & Client Reminders",
        description:
          "Appointment booking across 3 clinics plus wellness-visit reminders; with vets at $1.2M revenue each and fully booked, every unfilled slot is unrecoverable capacity.",
        headcount: 6,
        costAllocation: {
          amount: 0.4,
          mapsTo: "sgaExpense",
          note: "Front-desk staff across 3 clinics, ~13% of SGA",
        },
        manualSubProcesses: [
          "Phone-based booking with long hold times at peak",
          "Manual reminder calls for wellness visits",
          "Waitlist management on sticky notes when slots free up",
          "No-show follow-up handled inconsistently by clinic",
        ],
        currentTools: ["Cornerstone practice management", "Phone", "Basic text reminders (one clinic)"],
        dataQuality:
          "Appointment and no-show data is complete per clinic in Cornerstone; utilization-by-vet reporting exists but is only pulled ad hoc.",
      },
      {
        id: "clinical-care",
        name: "Clinical Care Delivery",
        description:
          "Veterinary care across primary, surgery, and dental service lines by 7 vets and support staff; vet time is the scarcest resource in the whole business model.",
        headcount: 30,
        costAllocation: {
          amount: 2.6,
          mapsTo: "cogs",
          note: "Clinical labor (vets, techs, assistants) and medical supplies, ~81% of COGS",
        },
        manualSubProcesses: [
          "SOAP notes typed by vets between or after appointments",
          "Treatment estimates built line-by-line during the visit",
          "Lab result review and client callbacks by vets personally",
          "Surgical and dental charge capture reconciled at day end",
        ],
        currentTools: ["Cornerstone medical records", "IDEXX in-house lab equipment", "Digital radiography"],
        dataQuality:
          "Medical records are digital and complete; charge-capture leakage (unbilled services) is suspected but unmeasured, a classic vet-group finding.",
      },
      {
        id: "wellness-plan-admin",
        name: "Wellness Plan Administration",
        description:
          "Enrollment, billing, and utilization tracking for the wellness plans that drive the 65% recurring revenue figure; the strategic asset of the whole platform.",
        headcount: 3,
        costAllocation: {
          amount: 0.3,
          mapsTo: "sgaExpense",
          note: "Plan administration staff, ~10% of SGA",
        },
        manualSubProcesses: [
          "Enrollment paperwork processed by hand",
          "Failed-payment follow-up by phone",
          "Plan utilization tracked in spreadsheets per clinic",
          "Renewal outreach worked from a monthly list",
        ],
        currentTools: ["Cornerstone billing", "Excel", "Payment processor portal"],
        dataQuality:
          "Enrollment and payment data is reliable; utilization-vs-entitlement analysis (are plans priced right?) has never been run across clinics.",
      },
      {
        id: "inventory-pharmacy",
        name: "Inventory & Pharmacy",
        description:
          "Drug, vaccine, and supply inventory across 3 clinics including controlled substances; carrying cost and expiry waste scale badly with clinic count.",
        headcount: 2,
        costAllocation: {
          amount: 0.5,
          mapsTo: "cogs",
          note: "Pharmacy and medical supply spend, ~16% of COGS",
        },
        manualSubProcesses: [
          "Reorder decisions by shelf eyeballing per clinic",
          "Controlled-substance logs on paper",
          "Expiry checks done monthly by hand",
          "Inter-clinic stock transfers arranged by text message",
        ],
        currentTools: ["Cornerstone inventory module (partially used)", "Paper logs", "Supplier portals"],
        dataQuality:
          "On-hand counts in Cornerstone drift from reality; controlled-substance records are compliant but paper; no cross-clinic inventory view.",
      },
      {
        id: "billing-client-comms",
        name: "Billing & Client Communications",
        description:
          "Point-of-service payment, estimate follow-up, and post-visit client communication; declined estimates that never get followed up are lost high-margin revenue.",
        headcount: 5,
        costAllocation: {
          amount: 0.4,
          mapsTo: "sgaExpense",
          note: "Billing and client-service staff, ~13% of SGA",
        },
        manualSubProcesses: [
          "Declined-treatment follow-up left to individual discretion",
          "Post-op check-in calls made when time allows",
          "Payment plan tracking in a spreadsheet",
          "Client questions answered by staff pulling vets from appointments",
        ],
        currentTools: ["Cornerstone billing", "Phone", "Email"],
        dataQuality:
          "Transaction data is complete; declined-estimate and follow-up outcome data is not captured at all, hiding the conversion opportunity.",
      },
    ],
    aiOpportunities: {
      "scheduling-reminders": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.06, high: 0.12 },
        recommendedTier: 1,
        complexityNotes:
          "Off-the-shelf vet engagement platforms (online booking, automated reminders, waitlist auto-fill) integrate with Cornerstone; filling no-show slots for capacity-constrained vets is direct high-margin revenue.",
        dependencies: ["Cornerstone integration", "Text-consent capture from clients"],
        risks: ["Small front-desk teams can be overwhelmed by a new channel if phones don't actually quiet down"],
      },
      "clinical-care": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.03, high: 0.08 },
        recommendedTier: 1,
        complexityNotes:
          "AI scribe tools for SOAP notes give each vet back 30-45 minutes daily, effectively adding appointment capacity without hiring in a vet shortage; adoption by 7 vets is very tractable.",
        dependencies: ["Vet willingness to dictate", "Cornerstone note integration"],
        risks: ["Medical-record accuracy is a board-compliance matter; vets must review every note"],
      },
      "wellness-plan-admin": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.04, high: 0.1 },
        recommendedTier: 1,
        complexityNotes:
          "Automated enrollment, dunning for failed payments, and renewal outreach; protecting and growing the 65% recurring revenue base is the highest-strategic-value play even if the dollar range is modest.",
        dependencies: ["Payment processor API access", "Plan terms standardization across clinics"],
        risks: ["Clumsy dunning messaging churns exactly the members the platform thesis depends on"],
      },
      "inventory-pharmacy": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.02, high: 0.07 },
        recommendedTier: 1,
        complexityNotes:
          "Perpetual inventory with reorder-point automation and cross-clinic visibility; mostly process discipline plus off-the-shelf tooling, with expiry waste and emergency-order premiums as the savings.",
        dependencies: ["Full Cornerstone inventory module adoption", "Barcode scanning at receipt and dispense"],
        risks: ["Controlled-substance workflows must remain DEA-compliant through any change"],
      },
      "billing-client-comms": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.05, high: 0.12 },
        recommendedTier: 1,
        complexityNotes:
          "Automated declined-estimate follow-up sequences and AI-drafted client answers for routine questions; converting even 10% of declined dental/surgical estimates is high-margin revenue.",
        dependencies: ["Declined-estimate capture in the PMS", "Message templates approved by the medical director"],
        risks: ["Medical advice boundaries: client-facing AI must route clinical questions to staff"],
      },
    },
    implementationContext: {
      techStack: ["Cornerstone practice management (3 instances)", "IDEXX lab systems", "Digital radiography", "Payment processor", "Excel"],
      itCapability: "basic",
      managementOpenness:
        "Founder is a vet-turned-operator who explicitly wants a tech-enabled platform story for the PE raise; clinic managers are stretched, so anything requiring sustained project management needs outside help.",
      dataInfrastructure:
        "Three siloed Cornerstone instances with good per-clinic records and no consolidated layer; a group dashboard is the first build, and vendor integrations (IDEXX, payments) are standard.",
      regulatoryConstraints: ["State veterinary practice acts", "DEA controlled-substance recordkeeping", "State telehealth (VCPR) rules for client communications"],
    },
  },

  "meridian-fulfillment": {
    operations: [
      {
        id: "receiving-inventory",
        name: "Receiving & Inventory Control",
        description:
          "Inbound container and parcel receiving, putaway, and inventory accuracy across 3 warehouses; client trust rides on inventory counts matching their storefronts.",
        headcount: 18,
        costAllocation: {
          amount: 2.4,
          mapsTo: "cogs",
          note: "Receiving labor and inventory-control staff, ~12% of COGS",
        },
        manualSubProcesses: [
          "ASN discrepancies reconciled by email with clients",
          "Manual putaway location decisions by floor leads",
          "Cycle counts scheduled on spreadsheets",
          "Client inventory disputes researched by hand",
        ],
        currentTools: ["WMS (mid-tier, e.g. Logiwa-class)", "RF scanners", "Excel"],
        dataQuality:
          "Scan-level inventory data is solid; discrepancy root-cause data (mis-ship vs. mis-receive vs. shrink) is not categorized, so recurring problems hide.",
      },
      {
        id: "pick-pack-ship",
        name: "Pick, Pack & Ship",
        description:
          "Core fulfillment: wave picking, packing with client-specific branding requirements, and carrier handoff for ~2.5M orders annually; labor here is ~60% of COGS.",
        headcount: 85,
        costAllocation: {
          amount: 11.5,
          mapsTo: "cogs",
          note: "Direct fulfillment labor and packaging materials, ~57% of COGS",
        },
        manualSubProcesses: [
          "Manual carton selection and dunnage decisions per order",
          "Client-specific pack instructions checked from printed binders",
          "Wave planning tuned by shift supervisors from experience",
          "Pack-station error investigation after client complaints",
        ],
        currentTools: ["WMS pick/pack modules", "RF scanners", "Print-and-apply label stations", "Some conveyor automation"],
        dataQuality:
          "Order, scan, and station-level productivity data is rich; the automation investments mean this is a genuinely instrumented operation by LMM standards.",
      },
      {
        id: "returns-processing",
        name: "Returns Processing",
        description:
          "Returns receipt, inspection, grading, and disposition (restock, refurb, liquidate) for DTC clients; a differentiated, higher-margin service line worth protecting.",
        headcount: 15,
        costAllocation: {
          amount: 2.0,
          mapsTo: "cogs",
          note: "Returns labor and processing costs, ~10% of COGS",
        },
        manualSubProcesses: [
          "Item condition grading by individual judgment",
          "Disposition decisions from per-client rule sheets in binders",
          "Client notification of non-standard returns by email",
          "Fraud-pattern spotting left to experienced processors",
        ],
        currentTools: ["WMS returns module", "Client rule binders", "Email"],
        dataQuality:
          "Return reason and disposition data is captured but grading consistency varies by processor; photo documentation is sporadic.",
      },
      {
        id: "client-onboarding-integrations",
        name: "Client Onboarding & Integrations",
        description:
          "New-client setup: e-commerce platform integration (Shopify, Amazon), SKU setup, pack-spec documentation, and go-live; onboarding speed is a sales differentiator.",
        headcount: 6,
        costAllocation: {
          amount: 0.8,
          mapsTo: "sgaExpense",
          note: "Solutions and integration engineers, ~17% of SGA",
        },
        manualSubProcesses: [
          "Integration field mapping configured per client",
          "SKU dimension and weight capture done manually at intake",
          "Pack-spec documents written from client interviews",
          "Test-order validation run by hand before go-live",
        ],
        currentTools: ["WMS API tooling", "Shopify/Amazon connectors", "Jira", "Confluence"],
        dataQuality:
          "Integration configs are documented; onboarding cycle-time data is tracked loosely in Jira and understates where projects actually stall.",
      },
      {
        id: "support-billing",
        name: "Client Support & Billing",
        description:
          "Client success (WISMO queries, SLA reporting) and the monthly invoice build across storage, pick fees, packaging, and shipping cost pass-through; billing disputes are chronic.",
        headcount: 10,
        costAllocation: {
          amount: 1.1,
          mapsTo: "sgaExpense",
          note: "Client success and billing staff, ~23% of SGA",
        },
        manualSubProcesses: [
          "Where-is-my-order lookups done manually across systems",
          "Monthly invoice assembly from WMS activity exports",
          "Shipping cost reconciliation against carrier invoices",
          "SLA report decks assembled per client monthly",
        ],
        currentTools: ["Zendesk", "WMS reporting", "Excel billing models", "Carrier portals"],
        dataQuality:
          "Activity data for billing exists in the WMS; the Excel translation layer between activity and invoice is where errors and disputes originate.",
      },
      {
        id: "labor-planning-peak",
        name: "Labor Planning & Peak Management",
        description:
          "Shift scheduling, temp labor orchestration, and Q4 peak planning where 35-40% of annual volume lands; blowing peak SLAs is how 3PLs lose clients.",
        headcount: 3,
        costAllocation: {
          amount: 0.4,
          mapsTo: "sgaExpense",
          note: "Workforce planning staff and scheduling tools, ~8% of SGA",
        },
        manualSubProcesses: [
          "Volume forecasting from client estimates and last year's spreadsheet",
          "Temp agency orders placed by phone weekly",
          "Daily shift rebalancing across buildings by group text",
          "Peak post-mortems assembled anecdotally",
        ],
        currentTools: ["Excel forecasting models", "Temp agency portals", "When I Work-class scheduling"],
        dataQuality:
          "Historical volume by client by day is available from the WMS; forecast accuracy has never been formally measured against it.",
      },
    ],
    aiOpportunities: {
      "receiving-inventory": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.08, high: 0.18 },
        recommendedTier: 2,
        complexityNotes:
          "AI-assisted putaway slotting and automated discrepancy triage on top of good scan data; cuts receiving labor and the client-credit leakage from inventory disputes.",
        dependencies: ["Discrepancy categorization discipline", "WMS API access"],
        risks: ["Slotting changes disrupt picker muscle memory during transition"],
      },
      "pick-pack-ship": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.2, high: 0.45 },
        recommendedTier: 2,
        complexityNotes:
          "AI wave optimization, cartonization (right-size box selection), and pack-instruction delivery at station screens; on $11.5M of direct labor and packaging, 2-4% is the credible band and it compounds the existing automation.",
        dependencies: ["WMS configurability or middleware", "Station hardware for digital instructions"],
        risks: ["Client-specific pack requirements constrain optimization freedom", "Throughput experiments during peak are off-limits"],
      },
      "returns-processing": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.08, high: 0.2 },
        recommendedTier: 2,
        complexityNotes:
          "Photo-based AI condition grading and automated disposition against digitized client rules; standardizes the service that differentiates Meridian and supports premium pricing of returns.",
        dependencies: ["Client rule digitization", "Photo station hardware", "Grading standard definition"],
        risks: ["Mis-graded restocks reach end customers and burn the client relationship"],
      },
      "client-onboarding-integrations": {
        feasibility: "medium",
        ebitdaImpactRange: { low: 0.05, high: 0.12 },
        recommendedTier: 2,
        complexityNotes:
          "AI-assisted integration mapping and auto-generated pack-spec docs from client interviews; halving onboarding time turns sales wins into revenue faster and frees scarce integration engineers.",
        dependencies: ["Template library buildout", "Connector API standardization"],
        risks: ["A botched go-live during a client's launch window is a reputation event"],
      },
      "support-billing": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.1, high: 0.2 },
        recommendedTier: 2,
        complexityNotes:
          "Automated WISMO resolution from live WMS/carrier data plus invoice generation straight from activity data, replacing the error-prone Excel layer; attacks both support labor and billing-dispute revenue leakage.",
        dependencies: ["WMS-to-billing data pipeline", "Rate card normalization per client"],
        risks: ["Newly accurate billing may surface historical undercharges, forcing awkward client conversations"],
      },
      "labor-planning-peak": {
        feasibility: "high",
        ebitdaImpactRange: { low: 0.1, high: 0.25 },
        recommendedTier: 2,
        complexityNotes:
          "ML volume forecasting by client by day plus optimized shift and temp planning; peak labor is the most expensive labor of the year, and the WMS history to train on already exists.",
        dependencies: ["Client forecast data-sharing agreements", "Forecast accuracy baseline measurement"],
        risks: ["Under-forecasting peak breaks SLAs, which costs clients; the model must be biased conservative"],
      },
    },
    implementationContext: {
      techStack: ["Mid-tier WMS (Logiwa-class)", "RF scanning fleet-wide", "Shopify/Amazon connectors", "Zendesk", "Conveyor and print-apply automation", "Excel billing layer"],
      itCapability: "moderate",
      managementOpenness:
        "Leadership already invested in automation and views AI as the continuation of that thesis; the 4th-facility capital raise makes demonstrable efficiency gains commercially urgent.",
      dataInfrastructure:
        "The most instrumented operation in the portfolio after TrueNorth: scan-level WMS data, station productivity, and carrier data all exist; the Excel billing layer is the notable weak seam.",
      regulatoryConstraints: ["OSHA warehouse safety", "Seasonal/temp labor law compliance", "Client data protection agreements", "Carrier contract terms"],
    },
  },
};

export function getOperationsProfile(companyId) {
  return OPERATIONS_PROFILES[companyId] ?? null;
}
