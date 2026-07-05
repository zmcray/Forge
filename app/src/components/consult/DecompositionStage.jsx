import { useState } from "react";
import CommitInput from "../CommitInput";
import ProcessMapReveal from "./ProcessMapReveal";
import { LLMGrading, LLMFeedbackSkeleton } from "../LLMFeedback";
import useLLMEvaluation from "../../hooks/useLLMEvaluation";
import { useScoringDispatch } from "../../contexts/ScoringContext";
import { buildProcessMapSummary } from "../../utils/processMapSummary";
import { buildCompanyContext } from "../../utils/buildCompanyContext";

// Static nudges against blank-page freeze (MCR-96 usability note): each
// inserts a scaffold sentence into the textarea rather than answering for you.
const STARTER_PROMPTS = [
  "Follow the money: the biggest cost lines usually map to the biggest process areas. ",
  "Walk order-to-cash: how does a job get sold, delivered, invoiced, and collected? ",
  "Where do people re-key data between systems, spreadsheets, or paper? ",
];

/**
 * Stage 2A (MCR-96): commit-first free-text decomposition of the company's
 * operations. On commit: reveal the realistic process map, then LLM-grade the
 * decomposition against it via the existing evaluate pipeline.
 */
export default function DecompositionStage({ company, operations, onComplete }) {
  const [phase, setPhase] = useState("commit"); // commit | revealed
  const [answer, setAnswer] = useState("");
  const { addScore } = useScoringDispatch();
  const { llmResult, llmLoading, llmError, evaluate } = useLLMEvaluation({
    resetKey: company.id,
  });

  const canCommit = answer.trim().length >= CommitInput.MIN_QUALITATIVE_CHARS;

  const handleCommit = () => {
    setPhase("revealed");
    evaluate({
      userAnswer: answer,
      // /api/evaluate allowlists risk|diagnostic|thesis; the decomposition
      // task is diagnostic in nature. Persisted questionType differs (below).
      questionType: "diagnostic",
      questionText: `Decompose ${company.name}'s operations into its major functions. For each: estimated headcount, share of cost structure (COGS vs SG&A), the manual sub-processes involved, and the tools in use.`,
      modelAnswer: buildProcessMapSummary(operations),
      companyContext: buildCompanyContext(company),
    }).then((outcome) => {
      if (outcome.status !== "success") return;
      addScore({
        companyId: company.id,
        questionType: "process-decomposition",
        score: outcome.data.score,
        delta: null,
        unit: null,
        atomId: `stage2-decompose-${company.id}`,
        atomType: "process-decomposition",
        feedback: {
          strengths: outcome.data.strengths ?? [],
          gaps: outcome.data.gaps ?? [],
          suggestion: outcome.data.suggestion ?? "",
        },
      });
    });
  };

  return (
    <div>
      {phase === "commit" && (
        <div className="bg-surface-container ghost-border rounded-xl p-4">
          <p className="text-on-surface font-medium mb-1">
            Decompose {company.name}'s operations.
          </p>
          <p className="text-sm text-on-surface-variant mb-3">
            List the major functions you would expect inside this business. For
            each: rough headcount, where its cost sits (COGS vs SG&A), the
            manual sub-processes you suspect, and the tools likely in use.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setAnswer((a) => (a ? `${a}\n${prompt}` : prompt))}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container hover:opacity-80 transition-opacity text-left"
              >
                {prompt.trim()}
              </button>
            ))}
          </div>
          <CommitInput mode="qualitative" disabled={false} value={answer} onChange={setAnswer} />
          <button
            onClick={handleCommit}
            disabled={!canCommit}
            className={`mt-3 px-4 py-2 text-sm rounded-lg transition-colors ${canCommit ? "bg-primary text-on-primary hover:opacity-90" : "bg-surface-container-low text-on-surface-variant/40 cursor-not-allowed"}`}
          >
            Commit Decomposition
          </button>
        </div>
      )}

      {phase === "revealed" && (
        <div className="space-y-4">
          <div className="bg-surface-container-low ghost-border rounded-xl p-4 text-sm">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
              Your decomposition
            </p>
            <p className="text-on-surface-variant whitespace-pre-wrap">{answer}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold font-headline text-on-surface mb-2">
              The actual process map
            </h3>
            <ProcessMapReveal operations={operations} />
          </div>

          <div className="bg-surface-container ghost-border rounded-xl p-4">
            {llmLoading && <LLMFeedbackSkeleton />}
            {llmResult && <LLMGrading result={llmResult} />}
            {llmError && !llmLoading && (
              <p className="text-xs text-warning mb-2">
                AI grading unavailable. Compare your decomposition against the
                map above, then continue.
              </p>
            )}
            <button
              onClick={onComplete}
              className="px-4 py-2 text-sm rounded-lg bg-primary text-on-primary hover:opacity-90 transition-colors"
            >
              Continue to Opportunity Ranking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
