import { useMemo } from "react";
import { createStore, useStore } from "./progressStore";
import { isRecord } from "../utils/normalizeRecordMap";

const STORAGE_KEY = "forge-notes";
const DEFAULT_STATE = {};

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (!isRecord(parsed)) {
      console.warn(`[Forge] Invalid shape in ${STORAGE_KEY}, resetting`);
      return DEFAULT_STATE;
    }
    return parsed;
  } catch (err) {
    console.warn(`[Forge] Corrupt data in ${STORAGE_KEY}, resetting:`, err.message);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) localStorage.setItem(`${STORAGE_KEY}-corrupt-backup`, raw);
    } catch {}
    return DEFAULT_STATE;
  }
}

function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.warn(`[Forge] Failed to save ${STORAGE_KEY}:`, err.message);
  }
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
