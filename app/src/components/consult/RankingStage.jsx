import { useState } from "react";
import OpportunityMatrix from "./OpportunityMatrix";
import { gradeRanking } from "../../utils/rankingScore";
import { getScoreChipClass } from "../../utils/format";
import { useScoringDispatch } from "../../contexts/ScoringContext";

/**
 * Stage 2B (MCR-97): rank the top 3 processes by EBITDA automation impact.
 * Numbered selection (click to add, up/down/remove to reorder); commit reveals
 * the impact/feasibility matrix and grades deterministically via rankingScore.
 */
export default function RankingStage({ company, operations, aiOpportunities, implementationContext }) {
  const [ranked, setRanked] = useState([]);
  const [grade, setGrade] = useState(null);
  const { addScore } = useScoringDispatch();

  const opName = (id) => operations.find((op) => op.id === id)?.name || id;
  const toggle = (id) =>
    setRanked((r) =>
      r.includes(id) ? r.filter((x) => x !== id) : r.length < 3 ? [...r, id] : r,
    );
  const move = (index, dir) =>
    setRanked((r) => {
      const next = [...r];
      const j = index + dir;
      if (j < 0 || j >= next.length) return r;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });

  const handleCommit = () => {
    const result = gradeRanking(ranked, aiOpportunities);
    setGrade(result);
    addScore({
      companyId: company.id,
      questionType: "opportunity-ranking",
      score: result.score,
      delta: null,
      unit: null,
      atomId: `stage2-rank-${company.id}`,
      atomType: "opportunity-ranking",
      feedback: null,
    });
  };

  if (grade) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold px-2 py-0.5 rounded ${getScoreChipClass(grade.score)}`}>
            {grade.score}/5
          </span>
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
            {grade.firstPickCorrect ? "Your #1 pick matched the model's" : "Your #1 pick differed from the model's"}
          </span>
        </div>

        <OpportunityMatrix
          operations={operations}
          aiOpportunities={aiOpportunities}
          highlightedIds={grade.ideal}
        />

        <div className="grid gap-3 md:grid-cols-2">
          <div className="bg-surface-container ghost-border rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Matched picks</p>
            {grade.matched.length === 0 && (
              <p className="text-sm text-on-surface-variant">None of your picks were in the model's top 3.</p>
            )}
            <ul className="text-sm text-on-surface space-y-1">
              {grade.matched.map((id) => (
                <li key={id}>&#10003; {opName(id)}</li>
              ))}
            </ul>
          </div>
          <div className="bg-surface-container ghost-border rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">What you missed, and why it ranks</p>
            {grade.missed.length === 0 && (
              <p className="text-sm text-on-surface-variant">Nothing. You found all three.</p>
            )}
            <ul className="text-sm space-y-3">
              {grade.missed.map((id) => (
                <li key={id}>
                  <span className="font-medium text-on-surface">{opName(id)}</span>
                  <p className="text-xs text-on-surface-variant mt-0.5">{aiOpportunities[id].complexityNotes}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Risks: {aiOpportunities[id].risks.join("; ")}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-surface-container-low ghost-border rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Technical readiness</p>
          <p className="text-sm text-on-surface-variant mb-1">
            <span className="font-medium text-on-surface">Stack:</span> {implementationContext.techStack.join(", ")} (IT capability: {implementationContext.itCapability})
          </p>
          <p className="text-sm text-on-surface-variant mb-1">
            <span className="font-medium text-on-surface">Management:</span> {implementationContext.managementOpenness}
          </p>
          <p className="text-sm text-on-surface-variant">
            <span className="font-medium text-on-surface">Data:</span> {implementationContext.dataInfrastructure}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container ghost-border rounded-xl p-4">
      <p className="text-on-surface font-medium mb-1">
        Rank your top 3 processes by EBITDA automation impact.
      </p>
      <p className="text-sm text-on-surface-variant mb-3">
        Click a process to add it to your ranked list. Weigh impact against how
        feasible automation actually is here.
      </p>

      <div className="grid gap-2 md:grid-cols-2 mb-4">
        {operations.map((op) => {
          const position = ranked.indexOf(op.id);
          const selected = position >= 0;
          return (
            <button
              key={op.id}
              onClick={() => toggle(op.id)}
              disabled={!selected && ranked.length >= 3}
              className={`text-left rounded-lg px-3 py-2 text-sm ghost-border transition-colors ${selected ? "bg-primary/10 ring-2 ring-primary" : "bg-surface-container-lowest hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed"}`}
            >
              <span className="font-medium text-on-surface">
                {selected && <span className="text-primary font-bold mr-1.5">#{position + 1}</span>}
                {op.name}
              </span>
              <span className="block text-xs text-on-surface-variant">
                {op.headcount} FTEs, ~${op.costAllocation.amount}M cost base
              </span>
            </button>
          );
        })}
      </div>

      {ranked.length > 0 && (
        <ol className="space-y-1.5 mb-4">
          {ranked.map((id, i) => (
            <li key={id} className="flex items-center gap-2 text-sm bg-surface-container-low rounded-lg px-3 py-1.5">
              <span className="font-bold text-primary w-6">#{i + 1}</span>
              <span className="flex-1 text-on-surface">{opName(id)}</span>
              <button onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${opName(id)} up`} className="p-1 text-on-surface-variant hover:text-on-surface disabled:opacity-30">
                <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
              </button>
              <button onClick={() => move(i, 1)} disabled={i === ranked.length - 1} aria-label={`Move ${opName(id)} down`} className="p-1 text-on-surface-variant hover:text-on-surface disabled:opacity-30">
                <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
              </button>
              <button onClick={() => toggle(id)} aria-label={`Remove ${opName(id)}`} className="p-1 text-on-surface-variant hover:text-error">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </li>
          ))}
        </ol>
      )}

      <button
        onClick={handleCommit}
        disabled={ranked.length !== 3}
        className={`px-4 py-2 text-sm rounded-lg transition-colors ${ranked.length === 3 ? "bg-primary text-on-primary hover:opacity-90" : "bg-surface-container-low text-on-surface-variant/40 cursor-not-allowed"}`}
      >
        Commit Ranking ({ranked.length}/3)
      </button>
    </div>
  );
}
