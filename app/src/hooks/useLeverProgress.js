import { useState, useCallback } from "react";

const STORAGE_KEY = "forge-levers";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { levers: {} };
  } catch {
    return { levers: {} };
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
    (leverId) =>
      progress.levers[leverId] || {
        notes: "",
        lastStudied: null,
        exerciseAttempted: false,
        exerciseScore: null,
      },
    [progress]
  );

  const markStudied = useCallback((leverId) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        levers: {
          ...prev.levers,
          [leverId]: {
            ...prev.levers[leverId],
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
      const next = {
        ...prev,
        levers: {
          ...prev.levers,
          [leverId]: {
            ...prev.levers[leverId],
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
      const next = {
        ...prev,
        levers: {
          ...prev.levers,
          [leverId]: {
            ...prev.levers[leverId],
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
    () => Object.values(progress.levers).filter((l) => l.lastStudied).length,
    [progress]
  );

  const getExerciseCount = useCallback(
    () => Object.values(progress.levers).filter((l) => l.exerciseAttempted).length,
    [progress]
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
