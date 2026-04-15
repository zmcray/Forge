import { useState, useCallback } from "react";

const STORAGE_KEY = "forge-bridge";

function loadProgress() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (
      parsed &&
      typeof parsed === "object" &&
      parsed.scenarios &&
      typeof parsed.scenarios === "object" &&
      !Array.isArray(parsed.scenarios)
    ) {
      return parsed;
    }
  } catch {
    // corrupt JSON or storage unavailable
  }
  return { scenarios: {} };
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded)
  }
}

export default function useBridgeProgress() {
  const [progress, setProgress] = useState(loadProgress);

  const getScenario = useCallback(
    (scenarioId) =>
      progress.scenarios[scenarioId] || {
        customAssumptions: null,
        lastStudied: null,
        exerciseAttempted: false,
        exerciseScore: null,
      },
    [progress]
  );

  const markStudied = useCallback((scenarioId) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        scenarios: {
          ...prev.scenarios,
          [scenarioId]: {
            ...prev.scenarios[scenarioId],
            lastStudied: new Date().toISOString(),
          },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const markExerciseAttempted = useCallback((scenarioId, passed) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        scenarios: {
          ...prev.scenarios,
          [scenarioId]: {
            ...prev.scenarios[scenarioId],
            exerciseAttempted: true,
            exerciseScore: passed ? 5 : 0,
          },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const setCustomAssumptions = useCallback((scenarioId, assumptions) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        scenarios: {
          ...prev.scenarios,
          [scenarioId]: {
            ...prev.scenarios[scenarioId],
            customAssumptions: assumptions,
            lastUpdated: new Date().toISOString(),
          },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const getStudiedCount = useCallback(
    () => Object.values(progress.scenarios).filter((s) => s.lastStudied).length,
    [progress]
  );

  const getExerciseCount = useCallback(
    () => Object.values(progress.scenarios).filter((s) => s.exerciseAttempted).length,
    [progress]
  );

  return {
    getScenario,
    markStudied,
    markExerciseAttempted,
    setCustomAssumptions,
    getStudiedCount,
    getExerciseCount,
  };
}
