export const QUESTION_TYPES = {
  metric: { label: "Metric Analysis", color: "bg-blue-100 text-blue-800", icon: "\u{1F4CA}", inputMode: "quantitative" },
  adjustment: { label: "EBITDA Adjustments", color: "bg-purple-100 text-purple-800", icon: "\u{1F527}", inputMode: "quantitative" },
  valuation: { label: "Valuation", color: "bg-success-container text-on-success-container", icon: "\u{1F4B0}", inputMode: "quantitative" },
  risk: { label: "Risk Assessment", color: "bg-error-container text-on-error-container", icon: "\u26A0\uFE0F", inputMode: "qualitative" },
  diagnostic: { label: "Diagnostic", color: "bg-warning-container text-on-warning-container", icon: "\u{1F50D}", inputMode: "qualitative" },
  thesis: { label: "Investment Thesis", color: "bg-indigo-100 text-indigo-800", icon: "\u{1F4DD}", inputMode: "qualitative" },
  // Stage 2 consulting wedge atoms (MCR-96/MCR-97). Registered deliberately so
  // dashboards (WeakSpotCard, SessionSummary, ProgressDashboard) render them
  // first-class instead of leaning on info?. null-tolerance.
  "process-decomposition": { label: "Process Decomposition", color: "bg-secondary-container text-on-secondary-container", icon: "\u{1F9E9}", inputMode: "qualitative" },
  "opportunity-ranking": { label: "AI Opportunity Ranking", color: "bg-tertiary-container text-on-tertiary-container", icon: "\u{1F3AF}", inputMode: "qualitative" },
};
