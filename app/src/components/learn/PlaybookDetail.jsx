import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { PLAYBOOKS } from "../../data/playbooks";
import { COMPANIES } from "../../data/companies";
import usePlaybookProgress from "../../hooks/usePlaybookProgress";
import PhaseBlock from "./PhaseBlock";
import { LLMGrading } from "../LLMFeedback";
import { evaluateAnswer } from "../../utils/evaluateAnswer";

const PHASE_KEYS = ["months-1-6", "months-7-18", "months-19-36"];

export default function PlaybookDetail() {
  const { playbookId } = useParams();
  const navigate = useNavigate();
  const {
    getPlaybook,
    markVisited,
    markExerciseAttempted,
    setPlaybookNotes,
  } = usePlaybookProgress();

  const idx = PLAYBOOKS.findIndex((p) => p.id === playbookId);
  const playbook = PLAYBOOKS[idx];
  const company = playbook
    ? COMPANIES.find((c) => c.id === playbook.companyId)
    : null;

  const progress = playbook ? getPlaybook(playbook.id) : null;

  // Exercise state
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [llmResult, setLlmResult] = useState(null);
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmError, setLlmError] = useState(null);

  // Notes state
  const [notes, setNotes] = useState(progress?.notes || "");

  useEffect(() => {
    if (playbook) markVisited(playbook.id);
  }, [playbook, markVisited]);

  // Restore exercise state from progress
  useEffect(() => {
    if (progress?.exerciseAttempted) {
      setRevealed(true);
    }
  }, [progress]);

  const handleReveal = useCallback(async () => {
    setRevealed(true);
    setLlmLoading(true);
    setLlmError(null);

    const modelAnswer = playbook.exercise.acceptanceCriteria
      .map((c, i) => `${i + 1}) ${c}`)
      .join("\n");

    try {
      const result = await evaluateAnswer({
        userAnswer: answer,
        modelAnswer,
        questionText: playbook.exercise.prompt,
        questionType: "thesis",
        companyContext: `${company?.name} (${company?.industry}). ${playbook.description}`,
      });
      setLlmResult(result);
      markExerciseAttempted(playbook.id, result.score);
    } catch (err) {
      setLlmError(err.message || "Evaluation failed");
      // Still mark attempted even if LLM fails
      markExerciseAttempted(playbook.id, null);
    } finally {
      setLlmLoading(false);
    }
  }, [answer, playbook, company, markExerciseAttempted]);

  const handleNotesChange = useCallback(
    (e) => {
      const text = e.target.value;
      setNotes(text);
      setPlaybookNotes(playbook.id, text);
    },
    [playbook, setPlaybookNotes]
  );

  // Not found state
  if (!playbook) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-semibold text-on-surface">
          Playbook not found
        </p>
        <p className="text-sm text-on-surface-variant mt-2">
          The playbook &ldquo;{playbookId}&rdquo; does not exist.
        </p>
        <button
          onClick={() => navigate("/learn/playbooks")}
          className="mt-4 px-4 py-2 text-sm bg-primary text-on-primary rounded-lg hover:opacity-90"
        >
          Back to Playbooks
        </button>
      </div>
    );
  }

  const prevPlaybook = idx > 0 ? PLAYBOOKS[idx - 1] : null;
  const nextPlaybook = idx < PLAYBOOKS.length - 1 ? PLAYBOOKS[idx + 1] : null;

  return (
    <div>
      {/* Back link */}
      <button
        onClick={() => navigate("/learn/playbooks")}
        className="text-xs text-primary hover:underline mb-4 flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-[14px]">arrow_back</span>
        All Playbooks
      </button>

      {/* Header */}
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-widest text-outline-variant mb-1">
          {company?.industry}
        </p>
        <h2 className="text-xl font-bold text-on-surface mb-2">
          {company?.name}
        </h2>
        <p className="text-sm text-on-surface-variant leading-snug mb-4">
          {playbook.description}
        </p>

        {/* Entry/Exit metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-surface-container-low rounded-lg p-3 text-center">
            <p className="text-[10px] uppercase tracking-widest text-outline-variant">
              Entry Revenue
            </p>
            <p className="text-lg font-bold text-on-surface">
              ${playbook.entryMetrics.revenue}M
            </p>
          </div>
          <div className="bg-surface-container-low rounded-lg p-3 text-center">
            <p className="text-[10px] uppercase tracking-widest text-outline-variant">
              Entry Margin
            </p>
            <p className="text-lg font-bold text-on-surface">
              {playbook.entryMetrics.adjustedEbitdaMargin}%
            </p>
          </div>
          <div className="bg-surface-container-low rounded-lg p-3 text-center">
            <p className="text-[10px] uppercase tracking-widest text-outline-variant">
              Exit Revenue Target
            </p>
            <p className="text-lg font-bold text-primary">
              ${playbook.exitTargets.revenue}M
            </p>
          </div>
          <div className="bg-surface-container-low rounded-lg p-3 text-center">
            <p className="text-[10px] uppercase tracking-widest text-outline-variant">
              MOIC Target
            </p>
            <p className="text-lg font-bold text-primary">
              {playbook.exitTargets.moicTarget}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Levers */}
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-widest text-outline-variant mb-2">
          Primary Levers
        </p>
        <div className="flex flex-wrap gap-1.5">
          {playbook.primaryLevers.map((leverId) => (
            <button
              key={leverId}
              onClick={() => navigate(`/learn/levers/${leverId}`)}
              className="text-[10px] uppercase tracking-widest px-2 py-1 rounded bg-primary-container text-on-primary-container hover:opacity-80 transition-opacity"
            >
              {leverId.replace(/-/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Phase blocks */}
      {PHASE_KEYS.map((key) => (
        <PhaseBlock key={key} phaseKey={key} phase={playbook.timeline[key]} />
      ))}

      {/* Golden Year Analysis */}
      <div className="bg-surface-container-lowest ghost-border rounded-xl p-5 mb-6">
        <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary">
            star
          </span>
          Golden Year Analysis
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-outline-variant">
              Year 1 EBITDA
            </p>
            <p className="text-lg font-bold text-on-surface">
              {playbook.goldenYearAnalysis.year1Ebitda}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-outline-variant">
              % of 3-Year Plan in Year 1
            </p>
            <p className="text-lg font-bold text-primary">
              {playbook.goldenYearAnalysis.year1VsPlan}
            </p>
          </div>
        </div>
        <p className="text-sm text-on-surface-variant leading-snug">
          {playbook.goldenYearAnalysis.assessment}
        </p>
      </div>

      {/* Exercise */}
      <div className="bg-surface-container-lowest ghost-border rounded-xl p-5 mb-6">
        <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-tertiary">
            edit_note
          </span>
          Exercise
        </h3>
        <p className="text-sm text-on-surface leading-snug mb-4">
          {playbook.exercise.prompt}
        </p>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={revealed}
          placeholder="Type your analysis here (minimum 50 characters)..."
          className="w-full h-32 p-3 text-sm bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface placeholder:text-outline-variant resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
        />
        <div className="flex items-center justify-between mt-2">
          <span
            className={`text-xs ${
              answer.length >= 50
                ? "text-on-surface-variant"
                : "text-outline-variant"
            }`}
          >
            {answer.length}/50 characters
          </span>
          {!revealed && (
            <button
              onClick={handleReveal}
              disabled={answer.length < 50}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                answer.length >= 50
                  ? "bg-primary text-on-primary hover:opacity-90"
                  : "bg-outline-variant/30 text-outline-variant cursor-not-allowed"
              }`}
            >
              Submit & Evaluate
            </button>
          )}
        </div>

        {/* LLM Feedback */}
        {revealed && (
          <div className="mt-4">
            {llmLoading && (
              <p className="text-sm text-on-surface-variant animate-pulse">
                Evaluating your answer...
              </p>
            )}
            {llmError && (
              <div className="bg-error-container/30 border border-error/30 rounded-lg p-3">
                <p className="text-sm text-error">{llmError}</p>
              </div>
            )}
            {llmResult && <LLMGrading result={llmResult} />}

            {/* Model answer (acceptance criteria) */}
            <div className="mt-4 bg-surface-container-low rounded-lg p-4">
              <p className="text-[10px] uppercase tracking-widest text-outline-variant mb-2">
                Key Criteria
              </p>
              <ul className="space-y-1">
                {playbook.exercise.acceptanceCriteria.map((criterion, i) => (
                  <li
                    key={i}
                    className="text-xs text-on-surface-variant flex items-start gap-1.5"
                  >
                    <span className="text-primary mt-0.5 font-bold">
                      {i + 1}.
                    </span>
                    {criterion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="bg-surface-container-lowest ghost-border rounded-xl p-5 mb-6">
        <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
            sticky_note_2
          </span>
          Your Notes
        </h3>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Capture your thoughts on this playbook..."
          className="w-full h-24 p-3 text-sm bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface placeholder:text-outline-variant resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Prev/Next navigation */}
      <div className="flex justify-between pt-4 border-t border-outline-variant/30">
        {prevPlaybook ? (
          <button
            onClick={() => navigate(`/learn/playbooks/${prevPlaybook.id}`)}
            className="text-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">
              chevron_left
            </span>
            {COMPANIES.find((c) => c.id === prevPlaybook.companyId)?.name ||
              "Previous"}
          </button>
        ) : (
          <div />
        )}
        {nextPlaybook ? (
          <button
            onClick={() => navigate(`/learn/playbooks/${nextPlaybook.id}`)}
            className="text-sm text-primary hover:opacity-80 transition-opacity flex items-center gap-1"
          >
            {COMPANIES.find((c) => c.id === nextPlaybook.companyId)?.name ||
              "Next"}
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
