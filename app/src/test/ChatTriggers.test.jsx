// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LearnExercise from "../components/learn/LearnExercise";
import LearnSection from "../components/learn/LearnSection";

// Mock evaluateAnswer to avoid API calls
vi.mock("../utils/evaluateAnswer", () => ({
  evaluateAnswer: vi.fn().mockResolvedValue({
    score: 3,
    strengths: ["Good start"],
    gaps: ["customer concentration"],
    suggestion: "Focus more on risk factors.",
  }),
}));

describe("Chat Triggers", () => {
  describe("LearnSection chat button", () => {
    it("renders chat button when onOpenChat is provided", () => {
      const subsection = {
        id: "test",
        title: "Test Section",
        blocks: [{ type: "text", content: "Some content" }],
      };
      render(
        <LearnSection
          subsection={subsection}
          isComplete={() => false}
          onExerciseComplete={vi.fn()}
          onOpenChat={vi.fn()}
          getNoteText={() => ""}
          setNoteText={vi.fn()}
        />
      );
      expect(screen.getByText("Chat")).toBeInTheDocument();
    });

    it("does not render chat button when onOpenChat is not provided", () => {
      const subsection = {
        id: "test",
        title: "Test Section",
        blocks: [{ type: "text", content: "Some content" }],
      };
      render(
        <LearnSection
          subsection={subsection}
          isComplete={() => false}
          onExerciseComplete={vi.fn()}
          getNoteText={() => ""}
          setNoteText={vi.fn()}
        />
      );
      expect(screen.queryByText("Chat")).not.toBeInTheDocument();
    });

    it("calls onOpenChat when chat button is clicked", () => {
      const onOpenChat = vi.fn();
      const subsection = {
        id: "test",
        title: "Test Section",
        blocks: [{ type: "text", content: "Some content" }],
      };
      render(
        <LearnSection
          subsection={subsection}
          isComplete={() => false}
          onExerciseComplete={vi.fn()}
          onOpenChat={onOpenChat}
          getNoteText={() => ""}
          setNoteText={vi.fn()}
        />
      );
      fireEvent.click(screen.getByText("Chat"));
      expect(onOpenChat).toHaveBeenCalled();
    });
  });

  describe("LearnExercise dig deeper", () => {
    const exercise = {
      id: "ex-1",
      q: "What are the key risks?",
      answer: "Customer concentration, margin pressure, key person dependency.",
      inputMode: "qualitative",
    };

    it("does not show dig deeper button before grading", () => {
      render(
        <LearnExercise
          exercise={exercise}
          isComplete={false}
          onComplete={vi.fn()}
          onOpenChat={vi.fn()}
        />
      );
      expect(screen.queryByText(/dig deeper/i)).not.toBeInTheDocument();
    });

    it("shows dig deeper button after LLM grading completes", async () => {
      render(
        <LearnExercise
          exercise={exercise}
          isComplete={false}
          onComplete={vi.fn()}
          onOpenChat={vi.fn()}
        />
      );

      // Type a qualitative answer
      const textarea = screen.getByPlaceholderText(/your analysis/i);
      fireEvent.change(textarea, { target: { value: "Customer concentration is the main risk because one client represents a large portion of revenue. This creates dependency." } });

      // Click reveal
      fireEvent.click(screen.getByText("Reveal Answer"));

      // Wait for LLM grading to complete
      const digDeeper = await screen.findByText(/dig deeper/i);
      expect(digDeeper).toBeInTheDocument();
    });

    it("calls onOpenChat with llmResult when dig deeper is clicked", async () => {
      const onOpenChat = vi.fn();
      render(
        <LearnExercise
          exercise={exercise}
          isComplete={false}
          onComplete={vi.fn()}
          onOpenChat={onOpenChat}
        />
      );

      const textarea = screen.getByPlaceholderText(/your analysis/i);
      fireEvent.change(textarea, { target: { value: "Customer concentration is the main risk because one client represents a large portion of revenue. This creates dependency." } });

      fireEvent.click(screen.getByText("Reveal Answer"));

      const digDeeper = await screen.findByText(/dig deeper/i);
      fireEvent.click(digDeeper);

      expect(onOpenChat).toHaveBeenCalledWith(
        expect.objectContaining({
          llmResult: expect.objectContaining({ score: 3, gaps: ["customer concentration"] }),
        })
      );
    });
  });
});
