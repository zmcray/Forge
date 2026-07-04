import { useState, useCallback, useEffect } from "react";
import { loadString, saveString } from "../utils/storage";

const STORAGE_KEY = "forge-chat-mode";

export const CHAT_MODES = Object.freeze({
  DIRECT: "direct",
  SOCRATIC: "socratic",
});

const VALID_MODES = [CHAT_MODES.DIRECT, CHAT_MODES.SOCRATIC];
const DEFAULT_MODE = CHAT_MODES.DIRECT;

export default function useChatMode() {
  const [mode, setModeState] = useState(() =>
    loadString(STORAGE_KEY, {
      validate: (v) => VALID_MODES.includes(v),
      fallback: DEFAULT_MODE,
    }),
  );

  const setMode = useCallback((next) => {
    if (!VALID_MODES.includes(next)) return;
    setModeState(next);
    // saveString warns on failure; mode still persists in memory.
    saveString(STORAGE_KEY, next);
  }, []);

  // Cross-tab sync: storage events only fire on tabs OTHER than the writer.
  // Without this, a user toggling Socratic in one tab keeps seeing Direct in
  // every other open tab until reload.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      if (e.newValue === null) {
        setModeState(DEFAULT_MODE);
      } else if (VALID_MODES.includes(e.newValue)) {
        setModeState(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return { mode, setMode };
}
