// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { screen, fireEvent, act } from "@testing-library/react";
import { renderWithProviders } from "../test/renderWithProviders";
import { COMPANIES } from "../data/companies";
import QuickFireScreen from "./QuickFireScreen";

describe("QuickFireScreen", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const submitButton = () => screen.getByRole("button", { name: "Submit Decision" });

  function commitDecision(decision = "GO - Worth a deeper look", reasoning = "Strong margins and recurring revenue.") {
    fireEvent.click(screen.getByRole("button", { name: decision }));
    fireEvent.change(screen.getByPlaceholderText("Why? One sentence..."), {
      target: { value: reasoning },
    });
  }

  it("counts down from 60 seconds and flags expiry", () => {
    renderWithProviders(<QuickFireScreen />);
    expect(screen.getByText("0:60")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText("0:59")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(60000));
    expect(screen.getByText("0:00")).toBeInTheDocument();
    expect(screen.getByText(/Time's up!/)).toBeInTheDocument();
  });

  it("requires both a decision and >=10 chars of reasoning to submit", () => {
    renderWithProviders(<QuickFireScreen />);
    expect(submitButton()).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "GO - Worth a deeper look" }));
    expect(submitButton()).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("Why? One sentence..."), {
      target: { value: "too short" }, // 9 chars
    });
    expect(submitButton()).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("Why? One sentence..."), {
      target: { value: "long enough reasoning" },
    });
    expect(submitButton()).toBeEnabled();
  });

  it("reveals red/green flags and echoes the recorded decision", () => {
    renderWithProviders(<QuickFireScreen />);
    commitDecision("NO-GO - Pass", "Customer concentration is too high for me.");
    fireEvent.click(submitButton());

    expect(screen.getByText("Red Flags")).toBeInTheDocument();
    expect(screen.getByText("Green Flags")).toBeInTheDocument();
    expect(screen.getByText("Your Call")).toBeInTheDocument();
    expect(screen.getByText("NO-GO")).toBeInTheDocument();
    expect(screen.getByText(/Customer concentration is too high/)).toBeInTheDocument();
  });

  it("resets the timer for the next company and reaches the results summary", () => {
    renderWithProviders(<QuickFireScreen />);
    const total = COMPANIES.length;

    for (let i = 0; i < total; i++) {
      expect(screen.getByText(`Company ${i + 1} of ${total}`)).toBeInTheDocument();
      act(() => vi.advanceTimersByTime(5000)); // burn some clock
      commitDecision(undefined, `Reasoning for company number ${i + 1}.`);
      fireEvent.click(submitButton());
      const isLast = i === total - 1;
      fireEvent.click(
        screen.getByRole("button", { name: isLast ? "See Results" : "Next Company" })
      );
      if (!isLast) {
        // Timer restarted at 60 for the new company
        expect(screen.getByText("0:60")).toBeInTheDocument();
      }
    }

    expect(screen.getByText("Quick Screen Complete")).toBeInTheDocument();
    expect(screen.getByText(`You screened ${total} companies. Here's how you did:`)).toBeInTheDocument();
    expect(screen.getAllByText("GO")).toHaveLength(total);
    expect(screen.getByText(`Reasoning for company number ${total}.`)).toBeInTheDocument();
  });
});
