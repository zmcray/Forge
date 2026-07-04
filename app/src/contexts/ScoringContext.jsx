import { createContext, useContext, useMemo } from "react";
import useScoring from "../hooks/useScoring";

const ScoringStateContext = createContext(null);
const ScoringDispatchContext = createContext(null);

export function ScoringProvider({ children }) {
  const scoring = useScoring();

  // Session-derived reads live in the state value (they change exactly when
  // sessions change), so the dispatch value stays identity-stable forever.
  const state = useMemo(() => ({
    sessions: scoring.sessions,
    streak: scoring.streak,
    data: scoring.data,
    allScores: scoring.allScores,
    scoresByType: scoring.scoresByType,
    weakSpots: scoring.weakSpots,
    quantitativeAccuracy: scoring.quantitativeAccuracy,
    attemptedCompanyIds: scoring.attemptedCompanyIds,
  }), [scoring.data, scoring.sessions, scoring.streak, scoring.allScores,
       scoring.scoresByType, scoring.weakSpots, scoring.quantitativeAccuracy,
       scoring.attemptedCompanyIds]);

  // Mutators only. Both are useCallback([]) in useScoring, so this value is
  // created once and never re-renders dispatch-only consumers on writes.
  const dispatch = useMemo(() => ({
    addScore: scoring.addScore,
    updateSessionDuration: scoring.updateSessionDuration,
  }), [scoring.addScore, scoring.updateSessionDuration]);

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
