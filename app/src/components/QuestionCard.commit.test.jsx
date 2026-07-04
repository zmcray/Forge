// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import QuestionCard from "./QuestionCard";
import { evaluateAnswer } from "../utils/evaluateAnswer";

vi.mock("../utils/evaluateAnswer", () => ({
  evaluateAnswer: vi.fn(),
}));

const quantQuestion = {
  id: "q-metric-1",
  type: "metric",
  q: "What is the adjusted EBITDA margin?",
  answer: "The adjusted EBITDA margin is 16.9%",
  hint: "Divide adjusted EBITDA by revenue.",
};

const qualQuestion = {
  id: "q-risk-1",
  type: "risk",
  q: "What are the key risks?",
  answer: "Customer concentration and owner dependence.",
  hint: "Think about revenue durability.",
  keywords: ["customer concentration", "owner dependence"],
};

function renderCard(question, onScore = vi.fn()) {
  render(<QuestionCard question={question} index={0} onScore={onScore} companyContext="" />);
  return onScore;
}

const revealButton = () => screen.getByRole("button", { name: "Reveal Answer" });

describe("QuestionCard commit-first gating (quantitative)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    evaluateAnswer.mockImplementation(() => new Promise(() => {}));
  });

  it("disables Reveal Answer until a number is committed", () => {
    renderCard(quantQuestion);
    expect(revealButton()).toBeDisabled();
    expect(screen.queryByText("Model Answer")).not.toBeInTheDocument();
  });

  it("enables Reveal Answer once a numeric answer is entered", () => {
    renderCard(quantQuestion);
    const input = screen.getByPlaceholderText("Enter your numeric answer...");
    fireEvent.change(input, { target: { value: "16.9" } });
    expect(revealButton()).toBeEnabled();
  });

  it("re-disables Reveal Answer when the number is cleared", () => {
    renderCard(quantQuestion);
    const input = screen.getByPlaceholderText("Enter your numeric answer...");
    fireEvent.change(input, { target: { value: "16.9" } });
    fireEvent.change(input, { target: { value: "" } });
    expect(revealButton()).toBeDisabled();
  });

  it("never calls the LLM for quantitative questions on reveal", () => {
    renderCard(quantQuestion);
    const input = screen.getByPlaceholderText("Enter your numeric answer...");
    fireEvent.change(input, { target: { value: "15" } });
    fireEvent.click(revealButton());
    expect(screen.getByText("Model Answer")).toBeInTheDocument();
    expect(evaluateAnswer).not.toHaveBeenCalled();
  });

  it("fires onScore with type, self-score, delta, and atom back-reference", () => {
    const onScore = renderCard(quantQuestion);
    const input = screen.getByPlaceholderText("Enter your numeric answer...");
    fireEvent.change(input, { target: { value: "15" } });
    fireEvent.click(revealButton());
    fireEvent.click(screen.getByRole("button", { name: "4" }));

    expect(onScore).toHaveBeenCalledTimes(1);
    const [type, score, meta] = onScore.mock.calls[0];
    expect(type).toBe("metric");
    expect(score).toBe(4);
    expect(meta.delta).toBeCloseTo(15 - 16.9, 10);
    expect(meta.unit).toBe("%");
    expect(meta.atomId).toBe("q-metric-1");
    expect(meta.atomType).toBe("company-question");
    expect(meta.feedback).toBeNull();
  });
});

describe("QuestionCard commit-first gating (qualitative)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    evaluateAnswer.mockImplementation(() => new Promise(() => {}));
  });

  it("keeps Reveal Answer disabled below the 50-character minimum", () => {
    renderCard(qualQuestion);
    const textarea = screen.getByPlaceholderText(/Write your analysis/);
    fireEvent.change(textarea, { target: { value: "A".repeat(49) } });
    expect(revealButton()).toBeDisabled();
  });

  it("ignores leading/trailing whitespace when checking the minimum", () => {
    renderCard(qualQuestion);
    const textarea = screen.getByPlaceholderText(/Write your analysis/);
    fireEvent.change(textarea, { target: { value: "A".repeat(40) + " ".repeat(20) } });
    expect(revealButton()).toBeDisabled();
  });

  it("enables Reveal Answer at exactly 50 characters", () => {
    renderCard(qualQuestion);
    const textarea = screen.getByPlaceholderText(/Write your analysis/);
    fireEvent.change(textarea, { target: { value: "A".repeat(50) } });
    expect(revealButton()).toBeEnabled();
  });

  it("auto-scores from a successful LLM evaluation with the full feedback payload", async () => {
    evaluateAnswer.mockResolvedValue({
      score: 4,
      strengths: ["Spotted concentration"],
      gaps: ["Missed owner dependence"],
      suggestion: "Quantify the top-customer exposure.",
    });
    const onScore = renderCard(qualQuestion);
    const textarea = screen.getByPlaceholderText(/Write your analysis/);
    fireEvent.change(textarea, { target: { value: "Customer concentration is the biggest risk in this deal by far." } });
    fireEvent.click(revealButton());

    await waitFor(() => expect(onScore).toHaveBeenCalledTimes(1));
    const [type, score, meta] = onScore.mock.calls[0];
    expect(type).toBe("risk");
    expect(score).toBe(4);
    expect(meta.aiScore).toBe(4);
    expect(meta.atomId).toBe("q-risk-1");
    expect(meta.atomType).toBe("company-question");
    expect(meta.feedback).toEqual({
      strengths: ["Spotted concentration"],
      gaps: ["Missed owner dependence"],
      suggestion: "Quantify the top-customer exposure.",
    });
  });

  it("falls back to keyword feedback and self-scoring when the LLM fails", async () => {
    evaluateAnswer.mockRejectedValue(new Error("boom"));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const onScore = renderCard(qualQuestion);
    const textarea = screen.getByPlaceholderText(/Write your analysis/);
    fireEvent.change(textarea, {
      target: { value: "Customer concentration worries me most in this deal." },
    });
    fireEvent.click(revealButton());

    await screen.findByText(/AI grading unavailable/);
    // Keyword fallback: 1 of 2 factors identified
    expect(screen.getByText(/1\/2 identified/)).toBeInTheDocument();
    // Self-score path fires onScore with null feedback
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    const [type, score, meta] = onScore.mock.calls[0];
    expect(type).toBe("risk");
    expect(score).toBe(3);
    expect(meta.feedback).toBeNull();
    expect(meta.atomId).toBe("q-risk-1");
    warn.mockRestore();
  });
});
