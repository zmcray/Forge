import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VALUE_LEVERS, LEVER_CATEGORIES } from "../../data/valueLevers";
import { getScoreChipClass } from "../../utils/format";
import LeverExamples from "./LeverExamples";
import LeverQuantExercise from "./LeverQuantExercise";
import useLeverProgress from "../../hooks/useLeverProgress";
import useNotes from "../../hooks/useNotes";
import CommitInput from "../CommitInput";
import { LLMGrading, LLMFeedbackSkeleton } from "../LLMFeedback";
import useLLMEvaluation from "../../hooks/useLLMEvaluation";

const CATEGORY_STYLES = {
  revenue: { chip: "bg-primary-container text-on-primary-container", dot: "bg-primary" },
  margin: { chip: "bg-tertiary-container text-on-tertiary-container", dot: "bg-tertiary" },
  organizational: { chip: "bg-secondary-container text-on-secondary-container", dot: "bg-secondary" },
  technology: { chip: "bg-surface-container-high text-on-surface", dot: "bg-on-surface-variant" },
  strategic: { chip: "bg-error-container text-on-error-container", dot: "bg-error" },
};

function buildModelAnswer(acceptanceCriteria) {
  const numbered = acceptanceCriteria.map((c, i) => `${i + 1}) ${c}`).join(". ");
  return `A strong answer addresses: ${numbered}.`;
}

export default function LeverCard() {
  const { leverId } = useParams();
  const navigate = useNavigate();
  const { markStudied, markExerciseAttempted, setLeverNotes } = useLeverProgress();
  const { getNoteText, setNoteText } = useNotes();

  const [textAnswer, setTextAnswer] = useState("");
  const [phase, setPhase] = useState("commit");
  const [committedText, setCommittedText] = useState("");
  // LLM state resets and inflight requests abort when leverId changes
  const { llmResult, llmLoading, llmError, evaluate, reset: resetLLM } =
    useLLMEvaluation({ resetKey: leverId });

  const lever = VALUE_LEVERS.find((l) => l.id === leverId);

  // Reset practice state when navigating between levers
  useEffect(() => {
    setTextAnswer("");
    setCommittedText("");
    setPhase("commit");
  }, [leverId]);

  useEffect(() => {
    if (lever) markStudied(leverId);
  }, [leverId, lever, markStudied]);

  if (!lever) {
    return (
      <div className="text-center py-12">
        <p className="text-on-surface-variant">Lever not found.</p>
        <button
          onClick={() => navigate("/learn/levers")}
          className="mt-4 text-sm text-primary hover:opacity-80"
        >
          Back to levers
        </button>
      </div>
    );
  }

  const currentIndex = VALUE_LEVERS.findIndex((l) => l.id === leverId);
  const prevLever = currentIndex > 0 ? VALUE_LEVERS[currentIndex - 1] : null;
  const nextLever = currentIndex < VALUE_LEVERS.length - 1 ? VALUE_LEVERS[currentIndex + 1] : null;
  const category = LEVER_CATEGORIES[lever.category];
  const styles = CATEGORY_STYLES[lever.category];

  const hasValidInput = textAnswer.trim().length >= CommitInput.MIN_QUALITATIVE_CHARS;

  const handleReveal = () => {
    setCommittedText(textAnswer);
    setPhase("done");
    const modelAnswer = buildModelAnswer(lever.exercise.acceptanceCriteria);

    evaluate({
      userAnswer: textAnswer,
      modelAnswer,
      questionText: lever.exercise.prompt,
      questionType: lever.exercise.type,
      companyContext: "",
    }).then((outcome) => {
      if (outcome.status === "success") {
        markExerciseAttempted(leverId, outcome.data?.score ?? null);
      } else if (outcome.status === "error") {
        markExerciseAttempted(leverId, null);
      }
    });
  };

  const handleRedo = () => {
    setTextAnswer("");
    setCommittedText("");
    resetLLM();
    setPhase("commit");
  };

  const noteId = `lever-${leverId}`;
  const noteText = getNoteText(noteId);

  return (
    <div>
      {/* Back link */}
      <button
        onClick={() => navigate("/learn/levers")}
        className="text-sm text-on-surface-variant hover:text-on-surface mb-4 inline-flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        All Levers
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
        <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">
          {category.label}
        </span>
        <span className="text-xs text-outline-variant">
          {currentIndex + 1} / {VALUE_LEVERS.length}
        </span>
      </div>
      <h2 className="text-xl font-bold text-on-surface mb-1">{lever.title}</h2>
      <p className="text-sm text-on-surface-variant mb-6">{lever.oneLiner}</p>

      {/* When to Deploy */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">
          When to Deploy
        </h3>
        <ul className="space-y-1.5">
          {lever.whenToDeploy.map((item, i) => (
            <li key={i} className="text-sm text-on-surface flex gap-2">
              <span className="text-primary shrink-0">&#8226;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Typical Impact */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">
          Typical Impact
        </h3>
        <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start gap-3">
              <span className="text-xs text-on-surface-variant uppercase tracking-wide shrink-0">Revenue</span>
              <span className="text-sm text-on-surface text-right">{lever.typicalImpact.revenue}</span>
            </div>
            <div className="flex justify-between items-start gap-3">
              <span className="text-xs text-on-surface-variant uppercase tracking-wide shrink-0">EBITDA Margin</span>
              <span className="text-sm text-on-surface text-right font-mono">{lever.typicalImpact.ebitdaMargin}</span>
            </div>
            <div className="flex justify-between items-start gap-3">
              <span className="text-xs text-on-surface-variant uppercase tracking-wide shrink-0">Timeline</span>
              <span className="text-sm text-on-surface text-right">{lever.typicalImpact.timeline}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Business Type Fit */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">
          Business Type Fit
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(lever.businessTypeFit).map(([type, fit]) => (
            <div
              key={type}
              className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-3"
            >
              <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">
                {type}
              </div>
              <div className="text-xs text-on-surface leading-relaxed">{fit}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Red Flags */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">
          Red Flags
        </h3>
        <div className="bg-error-container/30 border border-on-error-container/20 rounded-lg p-4">
          <ul className="space-y-1.5">
            {lever.redFlags.map((flag, i) => (
              <li key={i} className="text-sm text-on-surface flex gap-2">
                <span className="text-error shrink-0">&#9888;</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Company Examples */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-3">
          Applied Examples
        </h3>
        <LeverExamples examples={lever.companyExamples} />
      </section>

      {/* Exercise */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-3">
          Practice
        </h3>
        <div className="border border-outline-variant/40 rounded-lg overflow-hidden">
          <div className={`px-4 py-2 flex items-center justify-between ${styles.chip}`}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Exercise</span>
              {phase === "done" && <span>&#10003;</span>}
              {llmResult && (
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded ${getScoreChipClass(llmResult.score)}`}
                >
                  {llmResult.score}/5 AI
                </span>
              )}
            </div>
            {phase === "done" && (
              <button onClick={handleRedo} className="text-xs hover:opacity-80">
                Try Again
              </button>
            )}
          </div>
          <div className="p-4 bg-surface-container-lowest">
            <p className="text-on-surface font-medium mb-3">{lever.exercise.prompt}</p>

            {phase === "commit" && (
              <div>
                <CommitInput
                  mode="qualitative"
                  disabled={false}
                  value={textAnswer}
                  onChange={setTextAnswer}
                />
                <div className="mt-3">
                  <button
                    onClick={handleReveal}
                    disabled={!hasValidInput}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${hasValidInput ? "bg-primary text-on-primary hover:opacity-90" : "bg-surface-container-high text-outline-variant cursor-not-allowed"}`}
                  >
                    Reveal Rubric
                  </button>
                </div>
              </div>
            )}

            {phase === "done" && (
              <div>
                {committedText && (
                  <div className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 mb-3 text-sm">
                    <span className="font-semibold text-outline-variant text-xs uppercase">
                      Your Answer
                    </span>
                    <p className="mt-1 text-on-surface-variant">{committedText}</p>
                  </div>
                )}

                {llmLoading && <LLMFeedbackSkeleton />}
                {llmResult && <LLMGrading result={llmResult} />}
                {llmError && (
                  <p className="text-xs text-warning mb-2">AI grading unavailable.</p>
                )}

                <div className="bg-tertiary-container border border-on-tertiary-container/30 rounded-lg p-3 text-sm text-on-tertiary-container">
                  <div className="font-semibold text-xs uppercase mb-2">A Strong Answer Covers</div>
                  <ul className="space-y-1">
                    {lever.exercise.acceptanceCriteria.map((c, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="shrink-0">{i + 1}.</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {lever.quantExercise && (
          <LeverQuantExercise exercise={lever.quantExercise} resetKey={leverId} />
        )}
      </section>

      {/* Notes */}
      <section className="mb-8">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">
          My Notes
        </h3>
        <textarea
          value={noteText}
          onChange={(e) => {
            setNoteText(noteId, e.target.value);
            setLeverNotes(leverId, e.target.value);
          }}
          placeholder="Capture your key takeaways..."
          className="w-full min-h-[80px] text-sm text-on-surface bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-3 resize-y focus:outline-none focus:border-primary/50 placeholder:text-outline-variant"
        />
      </section>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-outline-variant/30">
        <button
          onClick={() => prevLever && navigate(`/learn/levers/${prevLever.id}`)}
          disabled={!prevLever}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${!prevLever ? "text-outline-variant cursor-not-allowed" : "text-on-surface-variant hover:bg-surface-container-low"}`}
        >
          Previous
        </button>
        <button
          onClick={() => nextLever && navigate(`/learn/levers/${nextLever.id}`)}
          disabled={!nextLever}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${!nextLever ? "text-outline-variant cursor-not-allowed" : "bg-primary text-on-primary hover:opacity-90"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
