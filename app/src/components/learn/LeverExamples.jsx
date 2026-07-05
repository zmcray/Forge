import { useNavigate } from "react-router-dom";
import { COMPANIES } from "../../data/companies";
import { resolveDataPath } from "../../utils/resolveDataPath";
import { formatDataPoint } from "../../utils/format";
import PracticeLinks from "./PracticeLinks";

/** Applied Examples grid for a value lever, extracted from LeverCard. */
export default function LeverExamples({ examples }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {examples.map((ex) => {
        const company = COMPANIES.find((c) => c.id === ex.companyId);
        if (!company) return null;

        return (
          <div
            key={ex.companyId}
            className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold text-on-surface">{company.name}</span>
            </div>
            <div className="text-[10px] text-primary bg-secondary-container px-2 py-0.5 rounded inline-block mb-3">
              {company.industry}
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{ex.narrative}</p>
            <div className="space-y-1 mb-3 pt-2 border-t border-outline-variant/30">
              {ex.dataPoints.map((dp) => {
                const value = resolveDataPath(company, dp.path);
                return (
                  <div key={dp.label} className="flex justify-between items-center">
                    <span className="text-[11px] text-on-surface-variant">{dp.label}</span>
                    <span className="text-xs font-semibold text-on-surface font-mono">
                      {formatDataPoint(value, dp.path)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded p-2 mb-3">
              <div className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1">
                Opportunity
              </div>
              <p className="text-[11px] text-on-surface leading-relaxed">{ex.opportunity}</p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <button
                onClick={() => navigate(`/practice/${ex.companyId}`)}
                className="text-[11px] text-primary hover:opacity-80 inline-flex items-center gap-1"
              >
                See Company
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
              <PracticeLinks links={ex.relatedQuestions} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
