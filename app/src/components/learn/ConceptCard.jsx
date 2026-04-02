import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CONCEPT_CARDS } from "../../data/conceptCards";
import { COMPANIES } from "../../data/companies";
import { resolveDataPath } from "../../utils/resolveDataPath";
import useConceptProgress from "../../hooks/useConceptProgress";
import useNotes from "../../hooks/useNotes";
import CommitInput from "../CommitInput";
import { LLMGrading, LLMFeedbackSkeleton } from "../LLMFeedback";
import { evaluateAnswer } from "../../utils/evaluateAnswer";

function formatValue(value) {
  if (value == null) return "N/A";
  if (Array.isArray(value)) return value[value.length - 1];
  return value;
}

export default function ConceptCard() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const { getCard, markStudied, markPracticeAttempted, setCardNotes } = useConceptProgress();
  const { getNoteText, setNoteText } = useNotes();

  const card = CONCEPT_CARDS.find((c) => c.id === cardId);
  const cardProgress = getCard(cardId);

  // Practice prompt state
  const [textAnswer, setTextAnswer] = useState("");
  const [phase, setPhase] = useState("commit"); // commit, done
  const [committedText, setCommittedText] = useState("");
  const [llmResult, setLlmResult] = useState(null);
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmError, setLlmError] = useState(null);

  // Mark studied on view
  useEffect(() => {
    if (card) markStudied(cardId);
  }, [cardId, card, markStudied]);

  if (!card) {
    return (
      <div className="text-center py-12">
        <p className="text-on-surface-variant">Concept not found.</p>
        <button
          onClick={() => navigate("/learn/concepts")}
          className="mt-4 text-sm text-primary hover:opacity-80"
        >
          Back to concepts
        </button>
      </div>
    );
  }

  const currentIndex = CONCEPT_CARDS.findIndex((c) => c.id === cardId);
  const prevCard = currentIndex > 0 ? CONCEPT_CARDS[currentIndex - 1] : null;
  const nextCard = currentIndex < CONCEPT_CARDS.length - 1 ? CONCEPT_CARDS[currentIndex + 1] : null;

  const hasValidInput = textAnswer.trim().length >= CommitInput.MIN_QUALITATIVE_CHARS;

  const handleReveal = () => {
    setCommittedText(textAnswer);
    setPhase("done");
    markPracticeAttempted(cardId);

    setLlmLoading(true);
    setLlmError(null);
    evaluateAnswer({
      userAnswer: textAnswer,
      modelAnswer: card.practicePrompt.modelAnswer,
      questionText: card.practicePrompt.question,
      questionType: card.practicePrompt.type,
      companyContext: "",
    })
      .then(setLlmResult)
      .catch((err) => {
        console.warn("[Forge] LLM evaluation failed:", err);
        setLlmError(true);
      })
      .finally(() => setLlmLoading(false));
  };

  const handleRedo = () => {
    setTextAnswer("");
    setCommittedText("");
    setLlmResult(null);
    setLlmLoading(false);
    setLlmError(null);
    setPhase("commit");
  };

  const noteId = `concept-${cardId}`;
  const noteText = getNoteText(noteId);

  return (
    <div>
      {/* Back link */}
      <button
        onClick={() => navigate("/learn/concepts")}
        className="text-sm text-on-surface-variant hover:text-on-surface mb-4 inline-flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        All Concepts
      </button>

      {/* Header */}
      <h2 className="text-xl font-bold text-on-surface mb-1">{card.title}</h2>
      <p className="text-sm text-on-surface-variant mb-6">{card.oneLiner}</p>

      {/* Why It Matters */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">
          Why It Matters
        </h3>
        <p className="text-sm text-on-surface leading-relaxed">{card.whyItMatters}</p>
      </section>

      {/* How to Spot It */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">
          How to Spot It
        </h3>
        <ul className="space-y-1.5">
          {card.howToSpot.map((item, i) => (
            <li key={i} className="text-sm text-on-surface flex gap-2">
              <span className="text-primary shrink-0">&#8226;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Red Flags */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">
          Red Flags
        </h3>
        <div className="bg-error-container/30 border border-on-error-container/20 rounded-lg p-4">
          <ul className="space-y-1.5">
            {card.redFlags.map((flag, i) => (
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
          Real Company Examples
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {card.companyExamples.map((ex) => {
            const company = COMPANIES.find((c) => c.id === ex.companyId);
            if (!company) return null;

            return (
              <div
                key={ex.companyId}
                className="bg-surface-container-lowest ghost-border rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-on-surface">{company.name}</span>
                  <span className="text-xs text-primary bg-secondary-container px-2 py-0.5 rounded">
                    {company.industry}
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  {ex.dataPoints.map((dp) => {
                    const value = resolveDataPath(company, dp.path);
                    return (
                      <div key={dp.label} className="flex justify-between items-center">
                        <span className="text-xs text-on-surface-variant">{dp.label}</span>
                        <span className="text-sm font-semibold text-on-surface font-mono">
                          {formatValue(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/20 pt-2">
                  {ex.insight}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Practice Prompt */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-3">
          Practice
        </h3>
        <div className="border border-outline-variant/30 rounded-lg overflow-hidden">
          <div className="bg-secondary-container px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-on-surface">Exercise</span>
              {phase === "done" && <span className="text-on-tertiary-container">&#10003;</span>}
              {llmResult && (
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded ${llmResult.score >= 4 ? "bg-green-100 text-green-800" : llmResult.score >= 3 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}
                >
                  {llmResult.score}/5 AI
                </span>
              )}
            </div>
            {phase === "done" && (
              <button onClick={handleRedo} className="text-xs text-primary hover:opacity-80">
                Try Again
              </button>
            )}
          </div>
          <div className="p-4">
            <p className="text-on-surface font-medium mb-3">{card.practicePrompt.question}</p>

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
                    Reveal Answer
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
                  <p className="text-xs text-amber-600 mb-2">AI grading unavailable.</p>
                )}

                <div className="bg-tertiary-container border border-on-tertiary-container/30 rounded-lg p-3 text-sm text-on-tertiary-container">
                  <span className="font-semibold text-on-tertiary-container text-xs uppercase">
                    Model Answer
                  </span>
                  <p className="mt-1">{card.practicePrompt.modelAnswer}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="mb-8">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">
          My Notes
        </h3>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(noteId, e.target.value)}
          placeholder="Capture your key takeaways..."
          className="w-full min-h-[80px] text-sm text-on-surface bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-3 resize-y focus:outline-none focus:border-primary/50 placeholder:text-outline-variant"
        />
      </section>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-outline-variant/30">
        <button
          onClick={() => prevCard && navigate(`/learn/concepts/${prevCard.id}`)}
          disabled={!prevCard}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${!prevCard ? "text-outline-variant cursor-not-allowed" : "text-on-surface-variant hover:bg-surface-container-low"}`}
        >
          Previous
        </button>
        <button
          onClick={() => nextCard && navigate(`/learn/concepts/${nextCard.id}`)}
          disabled={!nextCard}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${!nextCard ? "text-outline-variant cursor-not-allowed" : "bg-primary text-on-primary hover:opacity-90"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
