import { formatCurrency } from "../utils/format";

export default function CompanyCard({ company, completed, onSelect }) {
  const metrics = [
    { label: "Revenue", value: formatCurrency(company.revenue), positive: true },
    { label: "EBITDA", value: formatCurrency(company.keyMetrics.adjustedEbitda), positive: true },
    { label: "Margin", value: `${company.keyMetrics.adjustedEbitdaMargin.toFixed(1)}%`, positive: company.keyMetrics.adjustedEbitdaMargin > 0 },
    { label: "Growth", value: `${company.keyMetrics.revenueGrowth > 0 ? "+" : ""}${company.keyMetrics.revenueGrowth.toFixed(1)}%`, positive: company.keyMetrics.revenueGrowth >= 0 },
  ];

  const traits = [company.industry];
  if (company.keyMetrics.recurringRevenuePct) {
    traits.push(`${company.keyMetrics.recurringRevenuePct}% recurring`);
  }
  if (company.keyMetrics.customerConcentration) {
    traits.push(`Top customer ${company.keyMetrics.customerConcentration}%`);
  }

  return (
    <div
      className="bg-surface-container-lowest rounded-xl ghost-border overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => onSelect(company)}
    >
      {/* Header area */}
      <div className="bg-surface-container-low px-5 py-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium">{company.industry}</span>
        <div className="flex items-center gap-1.5">
          {completed && (
            <span className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-tertiary-fixed-dim/20 text-on-tertiary-container font-medium">
              Completed
            </span>
          )}
          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">
            {company.questions.length} questions
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-xl font-bold font-headline text-on-surface mb-0.5">{company.name}</h3>
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">{company.description.split('.')[0]}</p>

        {/* 2x2 metrics grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
          {metrics.map(m => (
            <div key={m.label}>
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">{m.label}</span>
              <p className={`text-lg font-bold font-headline ${m.label === "Growth" ? (m.positive ? "text-on-tertiary-container" : "text-error") : "text-on-surface"}`}>
                {m.value}
              </p>
            </div>
          ))}
        </div>

        {/* Trait chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {traits.map((trait, i) => (
            <span key={i} className="text-[10px] px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-medium">
              {trait}
            </span>
          ))}
        </div>

        {/* CTA button */}
        <button className="w-full py-3 rounded-lg text-[11px] uppercase tracking-widest font-semibold bg-surface-container-low text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-all duration-200">
          Open Case Study
        </button>
      </div>
    </div>
  );
}
