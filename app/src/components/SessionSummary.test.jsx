// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SessionSummary from "./SessionSummary";

const company = { name: "Summit Mechanical Services", industry: "HVAC" };
const questions = [
  { type: "metric", score: 4, delta: 1.2 },
  { type: "risk", score: 3, delta: null },
];

describe("SessionSummary", () => {
  it("renders as a modal dialog", () => {
    render(
      <SessionSummary company={company} questions={questions} elapsedMinutes={12} onClose={vi.fn()} />
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(screen.getByText("Session Summary")).toBeInTheDocument();
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    render(
      <SessionSummary company={company} questions={questions} elapsedMinutes={12} onClose={onClose} />
    );
    fireEvent.keyDown(document.activeElement, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("moves focus into the dialog on open", () => {
    render(
      <SessionSummary company={company} questions={questions} elapsedMinutes={12} onClose={vi.fn()} />
    );
    expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);
  });
});
