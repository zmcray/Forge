// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import QuestionCard from "./QuestionCard";

vi.mock("../utils/evaluateAnswer", () => ({
  evaluateAnswer: vi.fn(() => new Promise(() => {})), // pending forever; tests don't rely on LLM result
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
  keywords: ["customer concentration"],
};

function renderQuant(onScore = vi.fn()) {
  render(
    <QuestionCard question={quantQuestion} index={0} onScore={onScore} companyContext="" />
  );
  return onScore;
}

describe("QuestionCard keyboard shortcuts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("reveals the model answer on Enter when a valid answer is committed", () => {
    renderQuant();
    const input = screen.getByPlaceholderText("Enter your numeric answer...");
    fireEvent.change(input, { target: { value: "16.9" } });
    fireEvent.keyDown(document.body, { key: "Enter" });
    expect(screen.getByText("Model Answer")).toBeInTheDocument();
  });

  it("does not reveal on Enter without a valid answer", () => {
    renderQuant();
    fireEvent.keyDown(document.body, { key: "Enter" });
    expect(screen.queryByText("Model Answer")).not.toBeInTheDocument();
  });

  it("does not hijack Enter while typing in an input", () => {
    renderQuant();
    const input = screen.getByPlaceholderText("Enter your numeric answer...");
    fireEvent.change(input, { target: { value: "16.9" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.queryByText("Model Answer")).not.toBeInTheDocument();
  });

  it("scores the revealed answer when pressing 3", () => {
    const onScore = renderQuant();
    const input = screen.getByPlaceholderText("Enter your numeric answer...");
    fireEvent.change(input, { target: { value: "16.9" } });
    fireEvent.keyDown(document.body, { key: "Enter" });
    fireEvent.keyDown(document.body, { key: "3" });
    expect(onScore).toHaveBeenCalledTimes(1);
    expect(onScore.mock.calls[0][0]).toBe("metric");
    expect(onScore.mock.calls[0][1]).toBe(3);
  });

  it("does not score before reveal when pressing a number", () => {
    const onScore = renderQuant();
    const input = screen.getByPlaceholderText("Enter your numeric answer...");
    fireEvent.change(input, { target: { value: "16.9" } });
    fireEvent.keyDown(document.body, { key: "3" });
    expect(onScore).not.toHaveBeenCalled();
  });

  it("does not treat typing '3' inside the qualitative textarea as scoring", () => {
    const onScore = vi.fn();
    render(
      <QuestionCard question={qualQuestion} index={0} onScore={onScore} companyContext="" />
    );
    const textarea = screen.getByPlaceholderText(/Write your analysis/);
    fireEvent.change(textarea, { target: { value: "A".repeat(60) } });
    fireEvent.keyDown(textarea, { key: "3" });
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(onScore).not.toHaveBeenCalled();
    expect(screen.queryByText("Model Answer")).not.toBeInTheDocument();
  });
});
