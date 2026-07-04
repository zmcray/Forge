import { useMemo } from "react";
import { createProgressStore, useStore } from "./progressStore";

const DEFAULT_SCENARIO = {
  customAssumptions: null,
  lastStudied: null,
  exerciseAttempted: false,
  exerciseScore: null,
};

const store = createProgressStore({ storageKey: "forge-bridge", containerKey: "scenarios" });

// Module-stable mutators: safe in effect deps, shared across all instances.
const markStudied = (scenarioId) =>
  store.patchRecord(scenarioId, { lastStudied: new Date().toISOString() });
const markExerciseAttempted = (scenarioId, passed) =>
  store.patchRecord(scenarioId, (existing) => {
    // Once passed, stay passed. Subsequent misses don't downgrade a prior win.
    const wasPassed = existing.exerciseScore === 5;
    return { exerciseAttempted: true, exerciseScore: wasPassed || passed ? 5 : 0 };
  });
// Pass `null` for assumptions to clear the stored custom state (used by Reset to plan).
const setCustomAssumptions = (scenarioId, assumptions) =>
  store.patchRecord(scenarioId, {
    customAssumptions: assumptions,
    lastUpdated: new Date().toISOString(),
  });

export default function useBridgeProgress() {
  const progress = useStore(store);

  return useMemo(() => {
    const scenarios = store.getRecords(progress);
    return {
      getScenario: (scenarioId) => scenarios[scenarioId] || DEFAULT_SCENARIO,
      markStudied,
      markExerciseAttempted,
      setCustomAssumptions,
      getStudiedCount: () => Object.values(scenarios).filter((s) => s.lastStudied).length,
      getExerciseCount: () => Object.values(scenarios).filter((s) => s.exerciseAttempted).length,
      // Counts scenarios where the user has actually solved the exercise (score === 5).
      // Distinct from getExerciseCount, which counts all attempts including misses.
      getPassedCount: () => Object.values(scenarios).filter((s) => s.exerciseScore === 5).length,
    };
  }, [progress]);
}
