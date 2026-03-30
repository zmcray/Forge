// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ChatDrawer from "../components/learn/ChatDrawer";

// Mock useChatContext to avoid importing companies data
vi.mock("../hooks/useChatContext", () => ({
  default: () => ({
    systemPrompt: "You are a tutor.",
    suggestedQuestions: ["What is EBITDA?", "Why do margins matter?"],
  }),
}));

describe("ChatDrawer", () => {
  const defaultProps = {
    subsection: { id: "test-sub", title: "Test Topic", blocks: [] },
    chatContext: null,
    messages: [],
    setMessages: vi.fn(),
    getNoteText: () => "",
    setNoteText: vi.fn(),
    completedIds: [],
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders header with subsection title", () => {
    render(<ChatDrawer {...defaultProps} />);
    expect(screen.getByText("Chat: Test Topic")).toBeInTheDocument();
  });

  it("renders suggested questions when no messages exist", () => {
    render(<ChatDrawer {...defaultProps} />);
    expect(screen.getByText("What is EBITDA?")).toBeInTheDocument();
    expect(screen.getByText("Why do margins matter?")).toBeInTheDocument();
  });

  it("hides suggested questions when messages exist", () => {
    render(
      <ChatDrawer
        {...defaultProps}
        messages={[{ role: "user", content: "Hello" }]}
      />
    );
    expect(screen.queryByText("What is EBITDA?")).not.toBeInTheDocument();
  });

  it("renders empty state placeholder when no messages", () => {
    render(<ChatDrawer {...defaultProps} />);
    expect(screen.getByText(/Ask a question about/)).toBeInTheDocument();
  });

  it("renders existing messages", () => {
    const messages = [
      { role: "user", content: "What is EBITDA?" },
      { role: "assistant", content: "EBITDA stands for..." },
    ];
    render(<ChatDrawer {...defaultProps} messages={messages} />);
    expect(screen.getByText("What is EBITDA?")).toBeInTheDocument();
    expect(screen.getByText(/EBITDA stands for/)).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<ChatDrawer {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByTitle("Close chat"));
    expect(onClose).toHaveBeenCalled();
  });

  it("disables send button when input is empty", () => {
    render(<ChatDrawer {...defaultProps} />);
    const sendButton = screen.getByTitle("Send");
    expect(sendButton).toBeDisabled();
  });

  it("enables send button when input has text", () => {
    render(<ChatDrawer {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Type a question...");
    fireEvent.change(textarea, { target: { value: "Test question" } });
    const sendButton = screen.getByTitle("Send");
    expect(sendButton).not.toBeDisabled();
  });

  it("shows character count warning near limit", () => {
    render(<ChatDrawer {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Type a question...");
    fireEvent.change(textarea, { target: { value: "x".repeat(1501) } });
    expect(screen.getByText(/1501\/2000/)).toBeInTheDocument();
  });

  it("does not show character count when under threshold", () => {
    render(<ChatDrawer {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Type a question...");
    fireEvent.change(textarea, { target: { value: "Short question" } });
    expect(screen.queryByText(/\/2000/)).not.toBeInTheDocument();
  });
});
