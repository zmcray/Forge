import { useState, useCallback } from "react";

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
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE, firstVisit: new Date().toISOString(), lastVisit: new Date().toISOString() };
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || !Array.isArray(parsed.softGateBypasses)) {
      console.warn(`[Forge] Invalid shape in ${STORAGE_KEY}, resetting`);
      return { ...DEFAULT_STATE, firstVisit: new Date().toISOString(), lastVisit: new Date().toISOString() };
    }
    return parsed;
  } catch (err) {
    console.warn(`[Forge] Corrupt data in ${STORAGE_KEY}, resetting:`, err.message);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) localStorage.setItem(`${STORAGE_KEY}-corrupt-backup`, raw);
    } catch {}
    return { ...DEFAULT_STATE, firstVisit: new Date().toISOString(), lastVisit: new Date().toISOString() };
  }
}

function saveOnboarding(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn(`[Forge] Failed to save ${STORAGE_KEY}:`, err.message);
  }
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

  return {
    isIntroComplete: state.introCompleted,
    currentIntroStep: state.introStep,
    advanceIntro,
    skipIntro,
    completeIntro,
    hasBypassedGate,
    bypassGate,
    resetOnboarding,
  };
}

export { loadOnboarding, saveOnboarding };
