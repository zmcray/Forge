import { useNavigate } from "react-router-dom";
import { PLAYBOOKS } from "../../data/playbooks";
import { COMPANIES } from "../../data/companies";
import usePlaybookProgress from "../../hooks/usePlaybookProgress";

export default function PlaybookList() {
  const navigate = useNavigate();
  const { getPlaybook, getVisitedCount, getExerciseCount } = usePlaybookProgress();
  const visited = getVisitedCount();
  const practiced = getExerciseCount();

  return (
    <div>
      <h2 className="text-xl font-bold text-on-surface mb-1">Operating Playbooks</h2>
      <p className="text-sm text-on-surface-variant mb-2">
        36-month value creation playbooks for 9 companies. Learn how to sequence
        initiatives, front-load quick wins, and build toward exit.
      </p>
      {(visited > 0 || practiced > 0) && (
        <p className="text-xs text-on-surface-variant mb-6">
          {visited}/{PLAYBOOKS.length} studied · {practiced}/{PLAYBOOKS.length} practiced
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
        {PLAYBOOKS.map((playbook) => {
          const company = COMPANIES.find((c) => c.id === playbook.companyId);
          const progress = getPlaybook(playbook.id);
          const hasVisited = !!progress.lastVisited;
          const hasPracticed = progress.exerciseAttempted;

          const initiativeCount = Object.values(playbook.timeline).reduce(
            (sum, phase) => sum + phase.initiatives.length,
            0
          );

          return (
            <button
              key={playbook.id}
              onClick={() => navigate(`/learn/playbooks/${playbook.id}`)}
              className="text-left bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-surface-container-high transition-all duration-150"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-bold text-on-surface leading-tight">
                  {company?.name || playbook.companyId}
                </h4>
                <div className="flex gap-1 shrink-0">
                  {hasVisited && (
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

              <p className="text-[10px] uppercase tracking-widest text-outline-variant mb-2">
                {company?.industry}
              </p>

              <p className="text-xs text-on-surface-variant mb-3 leading-snug line-clamp-2">
                {playbook.description}
              </p>

              <div className="flex flex-wrap gap-2 items-center text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container">
                  ${playbook.entryMetrics.revenue}M revenue
                </span>
                <span className="px-1.5 py-0.5 rounded bg-tertiary-container text-on-tertiary-container">
                  {playbook.entryMetrics.adjustedEbitdaMargin}% margin
                </span>
                <span className="text-outline-variant">
                  · {initiativeCount} initiatives · Target {playbook.exitTargets.moicTarget} MOIC
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
