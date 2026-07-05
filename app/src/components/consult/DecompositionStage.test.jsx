// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test/renderWithProviders";
import DecompositionStage from "./DecompositionStage";
import { COMPANIES } from "../../data/companies";
import { OPERATIONS_PROFILES } from "../../data/companyOperations";

vi.mock("../../utils/evaluateAnswer", () => ({
  evaluateAnswer: vi.fn(),
}));
import { evaluateAnswer } from "../../utils/evaluateAnswer";

const company = COMPANIES.find((c) => c.id === "summit-hvac");
const operations = OPERATIONS_PROFILES["summit-hvac"].operations;

const LONG_ANSWER =
  "Dispatch, field service, estimating, procurement, and back office AR/AP with heavy Excel usage.";

function renderStage(onComplete = vi.fn()) {
  renderWithProviders(
    <DecompositionStage company={company} operations={operations} onComplete={onComplete} />,
  );
  return onComplete;
}

describe("DecompositionStage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    evaluateAnswer.mockResolvedValue({
      score: 4,
      strengths: ["Mapped cost lines"],
      gaps: ["Missed procurement"],
      suggestion: "Trace COGS next time.",
    });
  });

  it("gates the commit button until 50 characters are entered", () => {
    renderStage();
    const button = screen.getByRole("button", { name: /commit decomposition/i });
    expect(button).toBeDisabled();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "too short" } });
    expect(button).toBeDisabled();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: LONG_ANSWER } });
    expect(button).not.toBeDisabled();
  });

  it("offers starter prompts that seed the textarea", () => {
    renderStage();
    fireEvent.click(screen.getByRole("button", { name: /follow the money/i }));
    expect(screen.getByRole("textbox").value).toMatch(/Follow the money/);
  });

  it("reveals the process map after commit", async () => {
    renderStage();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: LONG_ANSWER } });
    fireEvent.click(screen.getByRole("button", { name: /commit decomposition/i }));
    expect(await screen.findByText("Dispatch & Scheduling")).toBeInTheDocument();
    expect(screen.getByText("The actual process map")).toBeInTheDocument();
    // Commit-first: the map is not visible before commit (fresh render check above).
  });

  it("evaluates via the diagnostic API type with the process map as model answer", async () => {
    renderStage();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: LONG_ANSWER } });
    fireEvent.click(screen.getByRole("button", { name: /commit decomposition/i }));
    await waitFor(() => expect(evaluateAnswer).toHaveBeenCalledTimes(1));
    const payload = evaluateAnswer.mock.calls[0][0];
    expect(payload.questionType).toBe("diagnostic");
    expect(payload.userAnswer).toBe(LONG_ANSWER);
    expect(payload.modelAnswer).toContain("Dispatch & Scheduling");
    expect(payload.modelAnswer.length).toBeLessThanOrEqual(5000);
  });

  it("persists the LLM score with the stage2-decompose atom", async () => {
    renderStage();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: LONG_ANSWER } });
    fireEvent.click(screen.getByRole("button", { name: /commit decomposition/i }));
    await waitFor(() => {
      const data = JSON.parse(localStorage.getItem("forge-data"));
      expect(data?.sessions?.length).toBe(1);
    });
    const data = JSON.parse(localStorage.getItem("forge-data"));
    const question = data.sessions[0].questions[0];
    expect(data.sessions[0].companyId).toBe("summit-hvac");
    expect(question.type).toBe("process-decomposition");
    expect(question.score).toBe(4);
    expect(question.atomId).toBe("stage2-decompose-summit-hvac");
    expect(question.atomType).toBe("process-decomposition");
    expect(question.feedback.gaps).toEqual(["Missed procurement"]);
  });

  it("degrades gracefully and still allows continuing when the LLM fails", async () => {
    evaluateAnswer.mockRejectedValue(new Error("down"));
    const onComplete = renderStage();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: LONG_ANSWER } });
    fireEvent.click(screen.getByRole("button", { name: /commit decomposition/i }));
    expect(await screen.findByText(/AI grading unavailable/)).toBeInTheDocument();
    expect(localStorage.getItem("forge-data")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /continue to opportunity ranking/i }));
    expect(onComplete).toHaveBeenCalled();
  });
});
