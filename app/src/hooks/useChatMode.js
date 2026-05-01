import { useState, useCallback } from "react";

const STORAGE_KEY = "forge-chat-mode";

export const CHAT_MODES = Object.freeze({
  DIRECT: "direct",
  SOCRATIC: "socratic",
});

const VALID_MODES = [CHAT_MODES.DIRECT, CHAT_MODES.SOCRATIC];
const DEFAULT_MODE = CHAT_MODES.DIRECT;

export default function useChatMode() {
  const [mode, setModeState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return VALID_MODES.includes(stored) ? stored : DEFAULT_MODE;
    } catch {
      return DEFAULT_MODE;
    }
  });

  const setMode = useCallback((next) => {
    if (!VALID_MODES.includes(next)) return;
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage quota or denied; mode persists in memory only
    }
  }, []);

  return { mode, setMode };
}
