import { useState, useCallback } from "react";
import { isRecord, stripNonRecords } from "../utils/normalizeRecordMap";

const STORAGE_KEY = "forge-levers";
const DEFAULT_STATE = { levers: {} };
const DEFAULT_LEVER = {
  notes: "",
  lastStudied: null,
  exerciseAttempted: false,
  exerciseScore: null,
};

function getLevers(progress) {
  return isRecord(progress?.levers) ? progress.levers : {};
}

function loadProgress() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!isRecord(parsed) || !isRecord(parsed.levers)) return DEFAULT_STATE;
    // Null/garbage inner values crash count consumers; strip once at load.
    return { ...parsed, levers: stripNonRecords(parsed.levers) };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded)
  }
}

export default function useLeverProgress() {
  const [progress, setProgress] = useState(loadProgress);

  const getLever = useCallback(
    (leverId) => getLevers(progress)[leverId] || DEFAULT_LEVER,
    [progress],
  );

  const markStudied = useCallback((leverId) => {
    setProgress((prev) => {
      const levers = getLevers(prev);
      const next = {
        ...prev,
        levers: {
          ...levers,
          [leverId]: {
            ...levers[leverId],
            lastStudied: new Date().toISOString(),
          },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const markExerciseAttempted = useCallback((leverId, score = null) => {
    setProgress((prev) => {
      const levers = getLevers(prev);
      const next = {
        ...prev,
        levers: {
          ...levers,
          [leverId]: {
            ...levers[leverId],
            exerciseAttempted: true,
            exerciseScore: score,
          },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const setLeverNotes = useCallback((leverId, text) => {
    setProgress((prev) => {
      const levers = getLevers(prev);
      const next = {
        ...prev,
        levers: {
          ...levers,
          [leverId]: {
            ...levers[leverId],
            notes: text,
            lastUpdated: new Date().toISOString(),
          },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const getStudiedCount = useCallback(
    () => Object.values(getLevers(progress)).filter((l) => l.lastStudied).length,
    [progress],
  );

  const getExerciseCount = useCallback(
    () => Object.values(getLevers(progress)).filter((l) => l.exerciseAttempted).length,
    [progress],
  );

  return {
    getLever,
    markStudied,
    markExerciseAttempted,
    setLeverNotes,
    getStudiedCount,
    getExerciseCount,
  };
}
