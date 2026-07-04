import { useState, useCallback, useMemo } from "react";
import { loadJSON, saveJSON } from "../utils/storage";

const STORAGE_KEY = "forge-onboarding";
const MAX_INTRO_STEP = 4;
const DEFAULT_STATE = {
  introCompleted: false,
  introStep: 0,
  introSkippedAt: null,
  softGateBypasses: [],
  firstVisit: new Date().toISOString(),
  lastVisit: new Date().toISOString(),
};

function loadOnboarding() {
  return loadJSON(STORAGE_KEY, {
    validate: (parsed) =>
      typeof parsed === "object" && parsed !== null && Array.isArray(parsed.softGateBypasses),
    // Lazy factory: visit timestamps must be minted at load time, not module init.
    fallback: () => ({
      ...DEFAULT_STATE,
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
    }),
  });
}

function saveOnboarding(state) {
  saveJSON(STORAGE_KEY, state);
}

export default function useOnboarding() {
  const [state, setState] = useState(loadOnboarding);

  const advanceIntro = useCallback(() => {
    setState((prev) => {
      if (prev.introStep >= MAX_INTRO_STEP) return prev;
      const next = { ...prev, introStep: prev.introStep + 1 };
      saveOnboarding(next);
      return next;
    });
  }, []);

  const skipIntro = useCallback(() => {
    setState((prev) => {
      const next = {
        ...prev,
        introCompleted: true,
        introSkippedAt: prev.introStep,
      };
      saveOnboarding(next);
      return next;
    });
  }, []);

  const completeIntro = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, introCompleted: true };
      saveOnboarding(next);
      return next;
    });
  }, []);

  const hasBypassedGate = useCallback(
    (gateId) => {
      return state.softGateBypasses.includes(gateId);
    },
    [state.softGateBypasses],
  );

  const bypassGate = useCallback((gateId) => {
    setState((prev) => {
      if (prev.softGateBypasses.includes(gateId)) return prev;
      const next = {
        ...prev,
        softGateBypasses: [...prev.softGateBypasses, gateId],
      };
      saveOnboarding(next);
      return next;
    });
  }, []);

  const resetOnboarding = useCallback(() => {
    const fresh = {
      introCompleted: false,
      introStep: 0,
      introSkippedAt: null,
      softGateBypasses: [],
      firstVisit: state.firstVisit,
      lastVisit: new Date().toISOString(),
    };
    saveOnboarding(fresh);
    setState(fresh);
  }, [state.firstVisit]);

  // Stable return identity: this object is the OnboardingContext value, so a
  // fresh object every render would re-render every consumer.
  return useMemo(() => ({
    isIntroComplete: state.introCompleted,
    currentIntroStep: state.introStep,
    advanceIntro,
    skipIntro,
    completeIntro,
    hasBypassedGate,
    bypassGate,
    resetOnboarding,
  }), [
    state.introCompleted, state.introStep,
    advanceIntro, skipIntro, completeIntro,
    hasBypassedGate, bypassGate, resetOnboarding,
  ]);
}

export { loadOnboarding, saveOnboarding };
