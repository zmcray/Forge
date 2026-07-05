import { useNavigate } from "react-router-dom";
import { COMPANIES } from "../../data/companies";

/**
 * Stage-1 linkage: renders "Practice this" links from learn-module content
 * (levers, bridge scenarios) back to real company questions in companies.js.
 * Links navigate to the company's practice session; ids are validated by
 * live-resolution data integrity tests.
 */
export default function PracticeLinks({ links }) {
  const navigate = useNavigate();
  if (!links || links.length === 0) return null;

  return (
    <div className="flex flex-col items-start gap-1">
      {links.map(({ companyId, questionId }) => {
        const company = COMPANIES.find((c) => c.id === companyId);
        const question = company?.questions.find((q) => q.id === questionId);
        if (!company || !question) return null;
        return (
          <button
            key={questionId}
            onClick={() => navigate(`/practice/${companyId}`)}
            className="text-[11px] text-primary hover:opacity-80 inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">exercise</span>
            <span>
              Practice this: {company.name}
              <span className="text-on-surface-variant"> &middot; {question.type} question</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
