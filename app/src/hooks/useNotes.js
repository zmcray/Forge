import { useState, useCallback } from "react";

const STORAGE_KEY = "forge-notes";

function loadNotes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // corrupt JSON or storage unavailable
  }
  return {};
}

function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {}
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
