import { useState, useCallback, useEffect } from "react";
import { loadString, saveString } from "../utils/storage";

export const CHAT_MODES = Object.freeze({
  DIRECT: "direct",
  SOCRATIC: "socratic",
});

export const MODE_LABEL = Object.freeze({
  [CHAT_MODES.DIRECT]: "Direct",
  [CHAT_MODES.SOCRATIC]: "Socratic",
});

const VALID_MODES = [CHAT_MODES.DIRECT, CHAT_MODES.SOCRATIC];

// One persisted value per surface. Learn defaults Socratic (guided discovery
// fits lessons); Practice defaults Direct (users want answers under a timer).
// An explicit user choice on a surface always wins over the default.
const STORAGE_KEYS = Object.freeze({
  learn: "forge-chat-mode-learn",
  practice: "forge-chat-mode-practice",
});
const LEGACY_KEY = "forge-chat-mode";
const DEFAULT_MODES = Object.freeze({
  learn: CHAT_MODES.SOCRATIC,
  practice: CHAT_MODES.DIRECT,
});

const resolveContext = (context) =>
  context === "practice" ? "practice" : "learn";

// One-time migration from the pre-MCR-101 single global mode. The old value
// was the user's explicit choice everywhere, so it seeds BOTH surfaces (only
// where no per-surface value exists yet), then the legacy key is removed so
// this never re-runs. Idempotent and safe to call on every mount.
function migrateLegacyMode() {
  const legacy = loadString(LEGACY_KEY, {
    validate: (v) => VALID_MODES.includes(v),
    fallback: null,
  });
  if (legacy != null) {
    for (const key of Object.values(STORAGE_KEYS)) {
      const existing = loadString(key, {
        validate: (v) => VALID_MODES.includes(v),
        fallback: null,
      });
      if (existing == null) saveString(key, legacy);
    }
  }
  try {
    localStorage.removeItem(LEGACY_KEY);
  } catch (err) {
    console.warn(`[Forge] Could not remove ${LEGACY_KEY}:`, err.message);
  }
}

export default function useChatMode(context = "learn") {
  const surface = resolveContext(context);
  const storageKey = STORAGE_KEYS[surface];
  const defaultMode = DEFAULT_MODES[surface];

  const [mode, setModeState] = useState(() => {
    migrateLegacyMode();
    return loadString(storageKey, {
      validate: (v) => VALID_MODES.includes(v),
      fallback: defaultMode,
    });
  });

  const setMode = useCallback(
    (next) => {
      if (!VALID_MODES.includes(next)) return;
      setModeState(next);
      // saveString warns on failure; mode still persists in memory.
      saveString(storageKey, next);
    },
    [storageKey],
  );

  // Cross-tab sync: storage events only fire on tabs OTHER than the writer.
  // Without this, a user toggling Socratic in one tab keeps seeing Direct in
  // every other open tab until reload.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorage = (e) => {
      if (e.key !== storageKey) return;
      if (e.newValue === null) {
        setModeState(defaultMode);
      } else if (VALID_MODES.includes(e.newValue)) {
        setModeState(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey, defaultMode]);

  return { mode, setMode };
}
