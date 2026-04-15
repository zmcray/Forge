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
    (scenarioId) => {
      const stored = progress.scenarios[scenarioId];
      if (stored && typeof stored === "object") return stored;
      return {
        customAssumptions: null,
        lastStudied: null,
        exerciseAttempted: false,
        exerciseScore: null,
      };
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
      const existing = (prev.scenarios[scenarioId] && typeof prev.scenarios[scenarioId] === "object")
        ? prev.scenarios[scenarioId]
        : {};
      // Once passed, stay passed. Subsequent misses don't downgrade a prior win.
      const wasPassed = existing.exerciseScore === 5;
      const next = {
        ...prev,
        scenarios: {
          ...prev.scenarios,
          [scenarioId]: {
            ...existing,
            exerciseAttempted: true,
            exerciseScore: wasPassed || passed ? 5 : 0,
          },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  // Pass `null` for assumptions to clear the stored custom state (used by Reset to plan).
  const setCustomAssumptions = useCallback((scenarioId, assumptions) => {
    setProgress((prev) => {
      const existing = (prev.scenarios[scenarioId] && typeof prev.scenarios[scenarioId] === "object")
        ? prev.scenarios[scenarioId]
        : {};
      const next = {
        ...prev,
        scenarios: {
          ...prev.scenarios,
          [scenarioId]: {
            ...existing,
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
    () => Object.values(progress.scenarios).filter((s) => s && s.lastStudied).length,
    [progress]
  );

  const getExerciseCount = useCallback(
    () => Object.values(progress.scenarios).filter((s) => s && s.exerciseAttempted).length,
    [progress]
  );

  // Counts scenarios where the user has actually solved the exercise (score === 5).
  // Distinct from getExerciseCount, which counts all attempts including misses.
  const getPassedCount = useCallback(
    () => Object.values(progress.scenarios).filter((s) => s && s.exerciseScore === 5).length,
    [progress]
  );

  return {
    getScenario,
    markStudied,
    markExerciseAttempted,
    setCustomAssumptions,
    getStudiedCount,
    getExerciseCount,
    getPassedCount,
  };
}
