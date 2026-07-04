import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SCENARIOS } from "../data/scenarios";
import { shuffleArray } from "../utils/format";
import { mergeScenario } from "../utils/scenarios";
import { useScoringDispatch } from "../contexts/ScoringContext";
import useTimer from "./useTimer";
import useKeyboardShortcuts from "./useKeyboardShortcuts";

// Owns the full lifecycle of a practice session: company selection (with
// scenario overlay), shuffled questions, timer wiring, per-question scoring,
// and the finish/summary flow. Returned as one cohesive object so screens
// take a single `session` prop instead of a dozen drilled values.
export default function usePracticeSession() {
  const navigate = useNavigate();
  const { addScore, updateSessionDuration } = useScoringDispatch();
  const timer = useTimer(15);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [statementView, setStatementView] = useState("income");
  const [showSummary, setShowSummary] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  const handleScore = useCallback((type, score, meta) => {
    if (!selectedCompany) return;
    addScore({
      companyId: selectedCompany._scenarioId || selectedCompany.id,
      questionType: type,
      score,
      delta: meta?.delta ?? null,
      unit: meta?.unit ?? null,
      atomId: meta?.atomId ?? null,
      atomType: meta?.atomType ?? null,
      feedback: meta?.feedback ?? null,
      // timestamp defaults to now() inside addScore (ISO8601)
    });
    setSessionQuestions(prev => [...prev, { type, score, delta: meta?.delta ?? null, unit: meta?.unit ?? null, selfScore: meta?.selfScore ?? null, aiScore: meta?.aiScore ?? null }]);
  }, [selectedCompany, addScore]);

  const startPractice = useCallback((company, scenarioId) => {
    let practiceCompany = company;
    if (scenarioId) {
      const scenario = SCENARIOS.find(s => s.id === scenarioId);
      if (scenario) {
        practiceCompany = mergeScenario(company, scenario);
      }
    }
    setSelectedCompany(practiceCompany);
    setShuffledQuestions(shuffleArray([...practiceCompany.questions]));
    setSessionQuestions([]);
    timer.start();
    // Warmup ping to reduce cold-start latency on first evaluation
    fetch("/api/evaluate", { method: "OPTIONS" }).catch(() => {});
    setStatementView("income");
    // URL is owned by the caller (PracticeRoute syncs it), not the session.
  }, [timer]);

  // Depends on live state directly, so no ref-mirror workaround is needed;
  // every consumer re-subscribes per render anyway.
  const finishCompany = useCallback(() => {
    timer.stop();
    if (selectedCompany) {
      updateSessionDuration(
        selectedCompany._scenarioId || selectedCompany.id,
        timer.elapsedMinutes
      );
      if (sessionQuestions.length > 0) {
        setShowSummary(true);
        return;
      }
    }
    navigate("/");
    setSelectedCompany(null);
  }, [timer, selectedCompany, sessionQuestions, updateSessionDuration, navigate]);

  const closeSummary = useCallback(() => {
    setShowSummary(false);
    navigate("/");
    setSelectedCompany(null);
  }, [navigate]);

  useKeyboardShortcuts({
    enabled: !!selectedCompany,
    onBack: finishCompany,
  });

  return {
    selectedCompany,
    statementView,
    setStatementView,
    showSummary,
    sessionQuestions,
    shuffledQuestions,
    timer,
    handleScore,
    startPractice,
    finishCompany,
    closeSummary,
  };
}
