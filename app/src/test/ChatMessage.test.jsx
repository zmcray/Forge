// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatMessage from "../components/learn/ChatMessage";

describe("ChatMessage", () => {
  const defaultProps = {
    isStreaming: false,
    noteId: null,
    getNoteText: () => "",
    setNoteText: vi.fn(),
  };

  it("renders user message as plain text", () => {
    render(
      <ChatMessage
        {...defaultProps}
        message={{ role: "user", content: "What is EBITDA?" }}
      />
    );
    expect(screen.getByText("What is EBITDA?")).toBeInTheDocument();
  });

  it("renders assistant message with markdown", () => {
    render(
      <ChatMessage
        {...defaultProps}
        message={{ role: "assistant", content: "**EBITDA** stands for Earnings Before Interest, Taxes, Depreciation, and Amortization." }}
      />
    );
    // react-markdown renders bold text in <strong>
    expect(screen.getByText("EBITDA")).toBeInTheDocument();
  });

  it("renders streaming message as plain text with cursor", () => {
    const { container } = render(
      <ChatMessage
        {...defaultProps}
        isStreaming={true}
        message={{ role: "assistant", content: "Thinking about" }}
      />
    );
    expect(screen.getByText(/Thinking about/)).toBeInTheDocument();
    // Should have the blinking cursor element
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("shows Save to Notes button for assistant messages when noteId is provided", () => {
    render(
      <ChatMessage
        {...defaultProps}
        noteId="note-1"
        message={{ role: "assistant", content: "Here is the explanation." }}
      />
    );
    expect(screen.getByText("Save to Notes")).toBeInTheDocument();
  });

  it("does not show Save to Notes for user messages", () => {
    render(
      <ChatMessage
        {...defaultProps}
        noteId="note-1"
        message={{ role: "user", content: "Explain this." }}
      />
    );
    expect(screen.queryByText("Save to Notes")).not.toBeInTheDocument();
  });

  it("does not show Save to Notes when noteId is null", () => {
    render(
      <ChatMessage
        {...defaultProps}
        noteId={null}
        message={{ role: "assistant", content: "Here is the explanation." }}
      />
    );
    expect(screen.queryByText("Save to Notes")).not.toBeInTheDocument();
  });

  it("does not show Save to Notes while streaming", () => {
    render(
      <ChatMessage
        {...defaultProps}
        isStreaming={true}
        noteId="note-1"
        message={{ role: "assistant", content: "Still typing..." }}
      />
    );
    expect(screen.queryByText("Save to Notes")).not.toBeInTheDocument();
  });

  it("calls setNoteText with appended content on save", () => {
    const setNoteText = vi.fn();
    render(
      <ChatMessage
        {...defaultProps}
        noteId="note-1"
        getNoteText={() => "Existing notes"}
        setNoteText={setNoteText}
        message={{ role: "assistant", content: "New insight from chat." }}
      />
    );
    fireEvent.click(screen.getByText("Save to Notes"));
    expect(setNoteText).toHaveBeenCalledWith(
      "note-1",
      expect.stringContaining("Existing notes")
    );
    expect(setNoteText).toHaveBeenCalledWith(
      "note-1",
      expect.stringContaining("New insight from chat.")
    );
  });

  it("shows Saved! confirmation after save", async () => {
    render(
      <ChatMessage
        {...defaultProps}
        noteId="note-1"
        setNoteText={vi.fn()}
        message={{ role: "assistant", content: "Saved content." }}
      />
    );
    fireEvent.click(screen.getByText("Save to Notes"));
    expect(screen.getByText("Saved!")).toBeInTheDocument();
  });
});
