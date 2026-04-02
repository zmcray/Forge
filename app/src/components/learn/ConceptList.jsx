import { useNavigate } from "react-router-dom";
import { CONCEPT_CARDS } from "../../data/conceptCards";
import useConceptProgress from "../../hooks/useConceptProgress";

export default function ConceptList() {
  const navigate = useNavigate();
  const { getCard, getStudiedCount, getPracticeCount } = useConceptProgress();
  const studied = getStudiedCount();
  const practiced = getPracticeCount();

  return (
    <div>
      <h2 className="text-xl font-bold text-on-surface mb-1">Key Concepts</h2>
      <p className="text-sm text-on-surface-variant mb-2">
        Master the core building blocks of PE deal analysis, one concept at a time.
      </p>
      {(studied > 0 || practiced > 0) && (
        <p className="text-xs text-on-surface-variant mb-4">
          {studied}/{CONCEPT_CARDS.length} studied · {practiced}/{CONCEPT_CARDS.length} practiced
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {CONCEPT_CARDS.map((card) => {
          const cardProgress = getCard(card.id);
          const hasStudied = !!cardProgress.lastStudied;
          const hasPracticed = cardProgress.practiceAttempted;

          return (
            <button
              key={card.id}
              onClick={() => navigate(`/learn/concepts/${card.id}`)}
              className="text-left bg-surface-container-lowest ghost-border rounded-xl p-5 hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-base font-bold text-on-surface">{card.title}</h3>
                <div className="flex gap-1 shrink-0">
                  {hasStudied && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container">
                      Studied
                    </span>
                  )}
                  {hasPracticed && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                      Practiced
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-on-surface-variant mb-3">{card.oneLiner}</p>
              <div className="flex flex-wrap gap-1.5">
                {card.companyExamples.slice(0, 3).map((ex) => (
                  <span
                    key={ex.companyId}
                    className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container"
                  >
                    {ex.companyId.replace(/-/g, " ")}
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
