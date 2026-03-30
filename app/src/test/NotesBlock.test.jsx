// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NotesBlock from "../components/learn/NotesBlock";

describe("NotesBlock", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders with placeholder text", () => {
    render(<NotesBlock noteId="test-note" />);
    expect(screen.getByPlaceholderText(/Write your own summary/)).toBeInTheDocument();
  });

  it("renders 'My Notes' header", () => {
    render(<NotesBlock noteId="test-note" />);
    expect(screen.getByText("My Notes")).toBeInTheDocument();
  });

  it("saves text to localStorage on change", () => {
    render(<NotesBlock noteId="test-note-save" />);
    const textarea = screen.getByPlaceholderText(/Write your own summary/);
    fireEvent.change(textarea, { target: { value: "Key takeaway: add-backs matter" } });
    expect(textarea.value).toBe("Key takeaway: add-backs matter");

    const stored = JSON.parse(localStorage.getItem("forge-notes"));
    expect(stored["test-note-save"].text).toBe("Key takeaway: add-backs matter");
  });

  it("loads existing note from localStorage", () => {
    localStorage.setItem("forge-notes", JSON.stringify({
      "preloaded-note": { text: "Previously saved note", lastUpdated: "2026-03-29T00:00:00Z" }
    }));
    render(<NotesBlock noteId="preloaded-note" />);
    expect(screen.getByDisplayValue("Previously saved note")).toBeInTheDocument();
  });
});
