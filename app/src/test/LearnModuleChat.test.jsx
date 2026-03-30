// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LearnModule from "../components/learn/LearnModule";

// Mock ChatDrawer to avoid needing full streaming infrastructure
vi.mock("../components/learn/ChatDrawer", () => ({
  default: ({ onClose, messages, subsection }) => (
    <div data-testid="chat-drawer">
      <span data-testid="chat-subsection">{subsection?.title}</span>
      <span data-testid="chat-message-count">{messages.length}</span>
      <button onClick={onClose} data-testid="chat-close">Close</button>
    </div>
  ),
}));

// Mock ComparisonList and ComparisonView since we don't need them
vi.mock("../components/learn/ComparisonList", () => ({
  default: () => <div>ComparisonList</div>,
}));
vi.mock("../components/learn/ComparisonView", () => ({
  default: () => <div>ComparisonView</div>,
}));

function renderLearnModule(initialRoute = "/learn") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <LearnModule />
    </MemoryRouter>
  );
}

describe("LearnModule Chat Integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows Chat button in subsection header", () => {
    renderLearnModule();
    expect(screen.getByText("Chat")).toBeInTheDocument();
  });

  it("opens ChatDrawer when Chat button is clicked", () => {
    renderLearnModule();
    expect(screen.queryByTestId("chat-drawer")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Chat"));
    expect(screen.getByTestId("chat-drawer")).toBeInTheDocument();
  });

  it("closes ChatDrawer when close button is clicked", () => {
    renderLearnModule();
    fireEvent.click(screen.getByText("Chat"));
    expect(screen.getByTestId("chat-drawer")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("chat-close"));
    expect(screen.queryByTestId("chat-drawer")).not.toBeInTheDocument();
  });

  it("chat drawer shows correct subsection title", () => {
    renderLearnModule();
    fireEvent.click(screen.getByText("Chat"));
    const drawer = screen.getByTestId("chat-drawer");
    // Should show the first subsection's title
    const subsectionTitle = within(drawer).getByTestId("chat-subsection");
    expect(subsectionTitle.textContent).toBeTruthy();
  });

  it("chat messages start empty", () => {
    renderLearnModule();
    fireEvent.click(screen.getByText("Chat"));
    expect(screen.getByTestId("chat-message-count").textContent).toBe("0");
  });

  it("clears chat when navigating to next subsection", () => {
    renderLearnModule();
    // Open chat
    fireEvent.click(screen.getByText("Chat"));
    expect(screen.getByTestId("chat-drawer")).toBeInTheDocument();

    // Navigate to next subsection
    fireEvent.click(screen.getByText("Next"));

    // Chat should be closed (cleared on navigation)
    expect(screen.queryByTestId("chat-drawer")).not.toBeInTheDocument();
  });
});
