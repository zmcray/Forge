import { useMemo } from "react";
import { createProgressStore, useStore } from "./progressStore";

const DEFAULT_PLAYBOOK = {
  notes: "",
  lastVisited: null,
  exerciseAttempted: false,
  exerciseScore: null,
  goldenYearGuess: null,
};

const store = createProgressStore({ storageKey: "forge-playbooks", containerKey: "playbooks" });

// Module-stable mutators: safe in effect deps, shared across all instances.
const markVisited = (playbookId) =>
  store.patchRecord(playbookId, { lastVisited: new Date().toISOString() });
const markExerciseAttempted = (playbookId, score = null) =>
  store.patchRecord(playbookId, { exerciseAttempted: true, exerciseScore: score });
const setPlaybookNotes = (playbookId, text) =>
  store.patchRecord(playbookId, { notes: text, lastUpdated: new Date().toISOString() });
const setGoldenYearGuess = (playbookId, guess) =>
  store.patchRecord(playbookId, { goldenYearGuess: guess });

export default function usePlaybookProgress() {
  const progress = useStore(store);

  return useMemo(() => {
    const playbooks = store.getRecords(progress);
    return {
      getPlaybook: (playbookId) => playbooks[playbookId] || DEFAULT_PLAYBOOK,
      markVisited,
      markExerciseAttempted,
      setPlaybookNotes,
      setGoldenYearGuess,
      getVisitedCount: () => Object.values(playbooks).filter((p) => p.lastVisited).length,
      getExerciseCount: () => Object.values(playbooks).filter((p) => p.exerciseAttempted).length,
    };
  }, [progress]);
}
