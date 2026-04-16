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

/** Enter a lesson from the hub by clicking the Start/Continue button. */
function enterLesson() {
  // The hub shows a Start or Continue button
  const cta = screen.getByRole("button", { name: /start|continue/i });
  fireEvent.click(cta);
}

describe("LearnModule Chat Integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows Chat button in subsection header after entering a lesson", () => {
    renderLearnModule();
    enterLesson();
    expect(screen.getByText("Chat")).toBeInTheDocument();
  });

  it("opens ChatDrawer when Chat button is clicked", () => {
    renderLearnModule();
    enterLesson();
    expect(screen.queryByTestId("chat-drawer")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Chat"));
    expect(screen.getByTestId("chat-drawer")).toBeInTheDocument();
  });

  it("closes ChatDrawer when close button is clicked", () => {
    renderLearnModule();
    enterLesson();
    fireEvent.click(screen.getByText("Chat"));
    expect(screen.getByTestId("chat-drawer")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("chat-close"));
    expect(screen.queryByTestId("chat-drawer")).not.toBeInTheDocument();
  });

  it("chat drawer shows correct subsection title", () => {
    renderLearnModule();
    enterLesson();
    fireEvent.click(screen.getByText("Chat"));
    const drawer = screen.getByTestId("chat-drawer");
    const subsectionTitle = within(drawer).getByTestId("chat-subsection");
    expect(subsectionTitle.textContent).toBeTruthy();
  });

  it("chat messages start empty", () => {
    renderLearnModule();
    enterLesson();
    fireEvent.click(screen.getByText("Chat"));
    expect(screen.getByTestId("chat-message-count").textContent).toBe("0");
  });

  it("clears chat when navigating to next subsection", () => {
    renderLearnModule();
    enterLesson();
    // Open chat
    fireEvent.click(screen.getByText("Chat"));
    expect(screen.getByTestId("chat-drawer")).toBeInTheDocument();

    // Navigate to next subsection via the bottom Next button
    fireEvent.click(screen.getByText("Next"));

    // Chat should be closed (cleared on navigation)
    expect(screen.queryByTestId("chat-drawer")).not.toBeInTheDocument();
  });
});
