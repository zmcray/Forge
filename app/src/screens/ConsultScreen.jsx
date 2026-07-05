import { useNavigate } from "react-router-dom";
import { COMPANIES } from "../data/companies";
import { OPERATIONS_PROFILES } from "../data/companyOperations";
import { formatCurrency } from "../utils/format";

/**
 * Stage 2 consulting wedge entry: pick a company to run the two-stage
 * decomposition + AI opportunity ranking exercise on. Minimal cards on
 * purpose; the financial deep-dive lives in Practice.
 */
export default function ConsultScreen() {
  const navigate = useNavigate();
  const companies = COMPANIES.filter((c) => OPERATIONS_PROFILES[c.id]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-extrabold font-headline text-on-surface mb-1">
        Consulting Wedge
      </h1>
      <p className="text-sm text-on-surface-variant mb-6">
        Decompose a company's operations, then rank where AI actually moves
        EBITDA. Commit before you see the answer.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <button
            key={company.id}
            onClick={() => navigate(`/consult/${company.id}`)}
            className="text-left bg-surface-container-lowest rounded-xl ghost-border p-5 hover:shadow-md transition-all duration-200 group"
          >
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">
              {company.industry}
            </span>
            <h3 className="text-lg font-bold font-headline text-on-surface mt-1 mb-2">
              {company.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-on-surface-variant mb-4">
              <span>{formatCurrency(company.revenue)} revenue</span>
              <span>{OPERATIONS_PROFILES[company.id].operations.length} processes</span>
            </div>
            <span className="block w-full text-center py-2 rounded-lg text-[11px] uppercase tracking-widest font-semibold bg-surface-container-low text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-all duration-200">
              Start Engagement
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
