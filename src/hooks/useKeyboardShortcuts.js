import { useEffect } from "react";

export default function useKeyboardShortcuts(handlers) {
  // handlers: { onScore(n), onReveal(), onBack(), enabled }
  useEffect(() => {
    if (!handlers.enabled) return;

    function handleKeyDown(e) {
      // Don't capture when typing in inputs
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      // 1-5 for scoring
      const num = parseInt(e.key);
      if (num >= 1 && num <= 5 && handlers.onScore) {
        e.preventDefault();
        handlers.onScore(num);
        return;
      }

      // Enter to reveal
      if (e.key === "Enter" && handlers.onReveal) {
        e.preventDefault();
        handlers.onReveal();
        return;
      }

      // Escape to go back
      if (e.key === "Escape" && handlers.onBack) {
        e.preventDefault();
        handlers.onBack();
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}
