import { useState, useCallback } from "react";

const STORAGE_KEY = "forge-notes";
const DEFAULT_STATE = {};

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
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

export default function useNotes() {
  const [notes, setNotes] = useState(loadNotes);

  const getNoteText = useCallback((noteId) => {
    return notes[noteId]?.text || "";
  }, [notes]);

  const setNoteText = useCallback((noteId, text) => {
    setNotes(prev => {
      const next = {
        ...prev,
        [noteId]: { text, lastUpdated: new Date().toISOString() },
      };
      saveNotes(next);
      return next;
    });
  }, []);

  const clearNote = useCallback((noteId) => {
    setNotes(prev => {
      const next = { ...prev };
      delete next[noteId];
      saveNotes(next);
      return next;
    });
  }, []);

  return { getNoteText, setNoteText, clearNote };
}
