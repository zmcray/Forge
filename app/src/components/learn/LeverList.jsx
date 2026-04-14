import { useNavigate } from "react-router-dom";
import { VALUE_LEVERS, LEVER_CATEGORIES } from "../../data/valueLevers";
import useLeverProgress from "../../hooks/useLeverProgress";

const CATEGORY_STYLES = {
  revenue: {
    chip: "bg-primary-container text-on-primary-container",
    dot: "bg-primary",
  },
  margin: {
    chip: "bg-tertiary-container text-on-tertiary-container",
    dot: "bg-tertiary",
  },
  organizational: {
    chip: "bg-secondary-container text-on-secondary-container",
    dot: "bg-secondary",
  },
  technology: {
    chip: "bg-surface-container-high text-on-surface",
    dot: "bg-on-surface-variant",
  },
  strategic: {
    chip: "bg-error-container text-on-error-container",
    dot: "bg-error",
  },
};

export default function LeverList() {
  const navigate = useNavigate();
  const { getLever, getStudiedCount, getExerciseCount } = useLeverProgress();
  const studied = getStudiedCount();
  const practiced = getExerciseCount();

  const categoryOrder = ["revenue", "margin", "organizational", "technology", "strategic"];

  return (
    <div>
      <h2 className="text-xl font-bold text-on-surface mb-1">Value Creation Levers</h2>
      <p className="text-sm text-on-surface-variant mb-2">
        15 operational levers for PE value creation. Calibrated against 2026 institutional research.
      </p>
      {(studied > 0 || practiced > 0) && (
        <p className="text-xs text-on-surface-variant mb-6">
          {studied}/{VALUE_LEVERS.length} studied · {practiced}/{VALUE_LEVERS.length} practiced
        </p>
      )}

      <div className="space-y-8 mt-6">
        {categoryOrder.map((categoryId) => {
          const category = LEVER_CATEGORIES[categoryId];
          const levers = VALUE_LEVERS.filter((l) => l.category === categoryId);
          if (levers.length === 0) return null;

          const styles = CATEGORY_STYLES[categoryId];

          return (
            <section key={categoryId}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
                <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">
                  {category.label}
                </h3>
                <span className="text-xs text-outline-variant">
                  {levers.length} {levers.length === 1 ? "lever" : "levers"}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mb-3 ml-4">{category.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {levers.map((lever) => {
                  const progress = getLever(lever.id);
                  const hasStudied = !!progress.lastStudied;
                  const hasPracticed = progress.exerciseAttempted;

                  return (
                    <button
                      key={lever.id}
                      onClick={() => navigate(`/learn/levers/${lever.id}`)}
                      className="text-left bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-surface-container-high transition-all duration-150"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-bold text-on-surface leading-tight">
                          {lever.title}
                        </h4>
                        <div className="flex gap-1 shrink-0">
                          {hasStudied && (
                            <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container">
                              Studied
                            </span>
                          )}
                          {hasPracticed && (
                            <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                              Practiced
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-on-surface-variant mb-3 leading-snug line-clamp-2">
                        {lever.oneLiner}
                      </p>
                      <div className="flex flex-wrap gap-1 items-center">
                        <span
                          className={`text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded ${styles.chip}`}
                        >
                          {lever.typicalImpact.ebitdaMargin.split("(")[0].trim()}
                        </span>
                        <span className="text-[10px] text-outline-variant">
                          · {lever.typicalImpact.timeline.split(";")[0]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
