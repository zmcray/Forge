// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchModal from "./SearchModal";

const noop = () => {};

function renderModal(props = {}) {
  return render(
    <SearchModal
      open={true}
      onClose={vi.fn()}
      onNavigateCompany={noop}
      onNavigateLearn={noop}
      onNavigateView={noop}
      {...props}
    />
  );
}

describe("SearchModal dialog semantics", () => {
  it("renders as a modal dialog with focus on the input", () => {
    renderModal();
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(document.activeElement).toBe(screen.getByPlaceholderText("Search companies, metrics, topics..."));
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    renderModal({ onClose });
    fireEvent.keyDown(document.activeElement, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("traps focus: Shift+Tab from the input wraps to the last focusable element", () => {
    renderModal();
    const input = screen.getByPlaceholderText("Search companies, metrics, topics...");
    fireEvent.keyDown(input, { key: "Tab", shiftKey: true });
    const dialog = screen.getByRole("dialog");
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(document.activeElement).not.toBe(input);
  });

  it("restores focus to the trigger element on close", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    const props = {
      onClose: vi.fn(),
      onNavigateCompany: noop,
      onNavigateLearn: noop,
      onNavigateView: noop,
    };
    const { rerender } = render(<SearchModal open={true} {...props} />);
    expect(document.activeElement).not.toBe(trigger);

    rerender(<SearchModal open={false} {...props} />);
    expect(document.activeElement).toBe(trigger);
    document.body.removeChild(trigger);
  });
});
