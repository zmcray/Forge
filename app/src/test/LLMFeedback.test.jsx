// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LLMGrading, LLMFeedbackSkeleton } from "../components/LLMFeedback";

describe("LLMFeedbackSkeleton", () => {
  it("renders loading skeleton", () => {
    render(<LLMFeedbackSkeleton />);
    expect(screen.getByText("Analyzing your response...")).toBeInTheDocument();
  });
});

describe("LLMGrading", () => {
  it("renders score badge", () => {
    render(
      <LLMGrading
        result={{ score: 4, strengths: ["Good point"], gaps: [], suggestion: null }}
      />
    );
    expect(screen.getByText("4/5")).toBeInTheDocument();
    expect(screen.getByText("AI Assessment")).toBeInTheDocument();
  });

  it("renders strengths", () => {
    render(
      <LLMGrading
        result={{ score: 3, strengths: ["Identified the risk"], gaps: [], suggestion: null }}
      />
    );
    expect(screen.getByText("What You Got Right")).toBeInTheDocument();
    expect(screen.getByText("Identified the risk")).toBeInTheDocument();
  });

  it("renders gaps", () => {
    render(
      <LLMGrading
        result={{ score: 2, strengths: [], gaps: ["Missed the key metric"], suggestion: null }}
      />
    );
    expect(screen.getByText("What You Missed")).toBeInTheDocument();
    expect(screen.getByText("Missed the key metric")).toBeInTheDocument();
  });

  it("renders suggestion", () => {
    render(
      <LLMGrading
        result={{ score: 3, strengths: [], gaps: [], suggestion: "Focus on margin analysis" }}
      />
    );
    expect(screen.getByText("Focus on margin analysis")).toBeInTheDocument();
  });

  it("applies green styling for high scores", () => {
    render(
      <LLMGrading
        result={{ score: 5, strengths: [], gaps: [], suggestion: null }}
      />
    );
    const badge = screen.getByText("5/5");
    expect(badge.className).toContain("bg-green-100");
  });

  it("applies red styling for low scores", () => {
    render(
      <LLMGrading
        result={{ score: 1, strengths: [], gaps: [], suggestion: null }}
      />
    );
    const badge = screen.getByText("1/5");
    expect(badge.className).toContain("bg-red-100");
  });

  it("renders without crashing when strengths is missing", () => {
    const { container } = render(
      <LLMGrading result={{ score: 3, gaps: ["Missed something"], suggestion: null }} />
    );
    expect(screen.getByText("3/5")).toBeInTheDocument();
    expect(screen.queryByText("What You Got Right")).not.toBeInTheDocument();
    expect(screen.getByText("Missed something")).toBeInTheDocument();
  });

  it("renders without crashing when gaps is null", () => {
    const { container } = render(
      <LLMGrading result={{ score: 4, strengths: ["Good"], gaps: null, suggestion: null }} />
    );
    expect(screen.getByText("4/5")).toBeInTheDocument();
    expect(screen.getByText("Good")).toBeInTheDocument();
    expect(screen.queryByText("What You Missed")).not.toBeInTheDocument();
  });

  it("renders with only score field", () => {
    const { container } = render(
      <LLMGrading result={{ score: 2 }} />
    );
    expect(screen.getByText("2/5")).toBeInTheDocument();
    expect(screen.queryByText("What You Got Right")).not.toBeInTheDocument();
    expect(screen.queryByText("What You Missed")).not.toBeInTheDocument();
  });

  it("returns null for null result", () => {
    const { container } = render(<LLMGrading result={null} />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null for non-object result", () => {
    const { container } = render(<LLMGrading result="bad" />);
    expect(container.innerHTML).toBe("");
  });
});
