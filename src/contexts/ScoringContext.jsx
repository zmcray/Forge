import { createContext, useContext, useMemo } from "react";
import useScoring from "../hooks/useScoring";

const ScoringStateContext = createContext(null);
const ScoringDispatchContext = createContext(null);

export function ScoringProvider({ children }) {
  const scoring = useScoring();

  const state = useMemo(() => ({
    sessions: scoring.sessions,
    streak: scoring.streak,
    data: scoring.data,
  }), [scoring.data]);

  const dispatch = useMemo(() => ({
    addScore: scoring.addScore,
    updateSessionDuration: scoring.updateSessionDuration,
    getAllScores: scoring.getAllScores,
    getScoresByType: scoring.getScoresByType,
    getWeakSpots: scoring.getWeakSpots,
    getQuantitativeAccuracy: scoring.getQuantitativeAccuracy,
  }), [scoring.addScore, scoring.updateSessionDuration,
       scoring.getAllScores, scoring.getScoresByType,
       scoring.getWeakSpots, scoring.getQuantitativeAccuracy]);

  return (
    <ScoringStateContext value={state}>
      <ScoringDispatchContext value={dispatch}>
        {children}
      </ScoringDispatchContext>
    </ScoringStateContext>
  );
}

export function useScoringState() {
  const ctx = useContext(ScoringStateContext);
  if (!ctx) throw new Error("useScoringState must be used within ScoringProvider");
  return ctx;
}

export function useScoringDispatch() {
  const ctx = useContext(ScoringDispatchContext);
  if (!ctx) throw new Error("useScoringDispatch must be used within ScoringProvider");
  return ctx;
}
