import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Dialog accessibility for overlay surfaces: role/aria-modal props, focus trap
 * (Tab/Shift+Tab cycle within the container), initial focus on open, focus
 * restore to the trigger element on close, and Escape-to-close.
 *
 * @param {{ open?: boolean, onClose: () => void }} options
 * @returns {{ dialogRef: React.RefObject, dialogProps: object }}
 */
export function useDialog({ open = true, onClose }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const container = dialogRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement;

    // Initial focus: first focusable element, else the container itself.
    const first = container.querySelector(FOCUSABLE);
    (first || container).focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = Array.from(container.querySelectorAll(FOCUSABLE));
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === firstEl || !container.contains(active)) {
          e.preventDefault();
          lastEl.focus();
        }
      } else if (active === lastEl || !container.contains(active)) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [open]);

  return {
    dialogRef,
    dialogProps: { role: "dialog", "aria-modal": "true", tabIndex: -1 },
  };
}
