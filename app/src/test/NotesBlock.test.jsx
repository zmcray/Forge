// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NotesBlock from "../components/learn/NotesBlock";

describe("NotesBlock", () => {
  it("renders with placeholder text", () => {
    render(<NotesBlock noteId="test-note" getNoteText={() => ""} setNoteText={() => {}} />);
    expect(screen.getByPlaceholderText(/Write your own summary/)).toBeInTheDocument();
  });

  it("renders 'My Notes' header", () => {
    render(<NotesBlock noteId="test-note" getNoteText={() => ""} setNoteText={() => {}} />);
    expect(screen.getByText("My Notes")).toBeInTheDocument();
  });

  it("calls setNoteText on change", () => {
    const setNoteText = vi.fn();
    render(<NotesBlock noteId="test-note-save" getNoteText={() => ""} setNoteText={setNoteText} />);
    const textarea = screen.getByPlaceholderText(/Write your own summary/);
    fireEvent.change(textarea, { target: { value: "Key takeaway: add-backs matter" } });
    expect(setNoteText).toHaveBeenCalledWith("test-note-save", "Key takeaway: add-backs matter");
  });

  it("displays existing note text from getNoteText", () => {
    render(
      <NotesBlock
        noteId="preloaded-note"
        getNoteText={(id) => id === "preloaded-note" ? "Previously saved note" : ""}
        setNoteText={() => {}}
      />
    );
    expect(screen.getByDisplayValue("Previously saved note")).toBeInTheDocument();
  });
});
