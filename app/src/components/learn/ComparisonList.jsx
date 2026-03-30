import { useNavigate } from "react-router-dom";
import { COMPARISONS } from "../../data/comparisons";
import { COMPANIES } from "../../data/companies";

export default function ComparisonList() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-xl font-bold text-on-surface mb-1">Cross-Industry Comparisons</h2>
      <p className="text-sm text-on-surface-variant mb-6">
        See how the same risk or dynamic plays out differently across industries using real Forge company data.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COMPARISONS.map((comp) => {
          const companyNames = comp.companies.map((id) => {
            const c = COMPANIES.find((co) => co.id === id);
            return c ? c.name : id;
          });

          return (
            <button
              key={comp.id}
              onClick={() => navigate(`/learn/compare/${comp.id}`)}
              className="text-left bg-surface-container-lowest ghost-border rounded-xl p-5 hover:bg-surface-container-low transition-colors"
            >
              <h3 className="text-base font-bold text-on-surface mb-1">{comp.title}</h3>
              <p className="text-xs text-on-surface-variant mb-3">{comp.subtitle}</p>
              <div className="flex flex-wrap gap-1.5">
                {companyNames.map((name) => (
                  <span
                    key={name}
                    className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
