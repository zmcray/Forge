import { formatCurrency } from "../utils/format";
import { QUESTION_TYPES } from "../data/questionTypes";

export default function CompanyCard({ company, completed, onSelect }) {
  return (
    <div
      className={`bg-white border rounded-xl p-5 hover:shadow-md transition-all cursor-pointer ${completed ? "border-green-300 bg-green-50/30" : "border-gray-200"}`}
      onClick={() => onSelect(company)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-lg">{company.name}</h3>
            {completed && <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Completed</span>}
          </div>
          <p className="text-sm text-blue-600 font-medium mb-2">{company.industry}</p>
          <p className="text-sm text-gray-600 mb-3">{company.description}</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>Revenue: <span className="font-semibold text-gray-700">{formatCurrency(company.revenue)}</span></span>
            <span>EBITDA: <span className="font-semibold text-gray-700">{formatCurrency(company.keyMetrics.adjustedEbitda)}</span></span>
            <span>Margin: <span className="font-semibold text-gray-700">{company.keyMetrics.adjustedEbitdaMargin.toFixed(1)}%</span></span>
            <span>Growth: <span className={`font-semibold ${company.keyMetrics.revenueGrowth >= 0 ? "text-green-700" : "text-red-700"}`}>{company.keyMetrics.revenueGrowth > 0 ? "+" : ""}{company.keyMetrics.revenueGrowth.toFixed(1)}%</span></span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 ml-4">
          <span className="text-2xl">{company.questions.length}</span>
          <span className="text-xs text-gray-500">Questions</span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {company.questions.map((q, i) => {
          const t = QUESTION_TYPES[q.type];
          return <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${t.color}`}>{t.icon} {t.label}</span>;
        })}
      </div>
    </div>
  );
}
