import { useMemo } from "react";
import { createStore, useStore } from "./progressStore";
import { isRecord } from "../utils/normalizeRecordMap";
import { loadJSON, saveJSON } from "../utils/storage";

const STORAGE_KEY = "forge-notes";
const DEFAULT_STATE = {};

function loadNotes() {
  return loadJSON(STORAGE_KEY, { validate: isRecord, fallback: DEFAULT_STATE });
}

function saveNotes(notes) {
  saveJSON(STORAGE_KEY, notes);
}

// Shared module-level store: every useNotes instance reads and writes the same
// state, so a stale instance can no longer clobber notes saved by another.
const store = createStore({ load: loadNotes, save: saveNotes });

const setNoteText = (noteId, text) =>
  store.setState((prev) => ({
    ...prev,
    [noteId]: { text, lastUpdated: new Date().toISOString() },
  }));

const clearNote = (noteId) =>
  store.setState((prev) => {
    const next = { ...prev };
    delete next[noteId];
    return next;
  });

export default function useNotes() {
  const notes = useStore(store);

  return useMemo(
    () => ({
      getNoteText: (noteId) => notes[noteId]?.text || "",
      setNoteText,
      clearNote,
    }),
    [notes],
  );
}
