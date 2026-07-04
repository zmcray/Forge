import { useMemo } from "react";
import { createProgressStore, useStore } from "./progressStore";

const DEFAULT_LEVER = {
  notes: "",
  lastStudied: null,
  exerciseAttempted: false,
  exerciseScore: null,
};

const store = createProgressStore({ storageKey: "forge-levers", containerKey: "levers" });

// Module-stable mutators: safe in effect deps, shared across all instances.
const markStudied = (leverId) => store.patchRecord(leverId, { lastStudied: new Date().toISOString() });
const markExerciseAttempted = (leverId, score = null) =>
  store.patchRecord(leverId, { exerciseAttempted: true, exerciseScore: score });
const setLeverNotes = (leverId, text) =>
  store.patchRecord(leverId, { notes: text, lastUpdated: new Date().toISOString() });

export default function useLeverProgress() {
  const progress = useStore(store);

  return useMemo(() => {
    const levers = store.getRecords(progress);
    return {
      getLever: (leverId) => levers[leverId] || DEFAULT_LEVER,
      markStudied,
      markExerciseAttempted,
      setLeverNotes,
      getStudiedCount: () => Object.values(levers).filter((l) => l.lastStudied).length,
      getExerciseCount: () => Object.values(levers).filter((l) => l.exerciseAttempted).length,
    };
  }, [progress]);
}
