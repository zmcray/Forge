// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { useDialog } from "./useDialog";

function TestDialog({ open = true, onClose }) {
  const { dialogRef, dialogProps } = useDialog({ open, onClose });
  if (!open) return null;
  return (
    <div ref={dialogRef} {...dialogProps} aria-label="Test dialog">
      <button>first</button>
      <button>middle</button>
      <button>last</button>
    </div>
  );
}

describe("useDialog", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("applies dialog semantics via dialogProps", () => {
    const { getByRole } = render(<TestDialog onClose={vi.fn()} />);
    const dialog = getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
  });

  it("moves initial focus into the dialog on open", () => {
    const { getByText } = render(<TestDialog onClose={vi.fn()} />);
    expect(document.activeElement).toBe(getByText("first"));
  });

  it("calls onClose on Escape", () => {
    const onClose = vi.fn();
    render(<TestDialog onClose={onClose} />);
    fireEvent.keyDown(document.activeElement, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("traps Tab: cycles from last to first", () => {
    const onClose = vi.fn();
    const { getByText } = render(<TestDialog onClose={onClose} />);
    getByText("last").focus();
    fireEvent.keyDown(getByText("last"), { key: "Tab" });
    expect(document.activeElement).toBe(getByText("first"));
  });

  it("traps Shift+Tab: cycles from first to last", () => {
    const onClose = vi.fn();
    const { getByText } = render(<TestDialog onClose={onClose} />);
    getByText("first").focus();
    fireEvent.keyDown(getByText("first"), { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(getByText("last"));
  });

  it("restores focus to the trigger element on close", () => {
    const trigger = document.createElement("button");
    trigger.textContent = "open";
    document.body.appendChild(trigger);
    trigger.focus();

    const { rerender, getByText } = render(<TestDialog open={true} onClose={vi.fn()} />);
    expect(document.activeElement).toBe(getByText("first"));

    rerender(<TestDialog open={false} onClose={vi.fn()} />);
    expect(document.activeElement).toBe(trigger);
  });

  it("does nothing while closed", () => {
    const onClose = vi.fn();
    render(<TestDialog open={false} onClose={onClose} />);
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });
});
