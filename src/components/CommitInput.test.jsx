// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CommitInput from "./CommitInput";

describe("CommitInput - quantitative mode", () => {
  it("renders number input in quantitative mode", () => {
    render(
      <CommitInput
        mode="quantitative"
        disabled={false}
        value=""
        onChange={() => {}}
        numericValue={null}
        onNumericChange={() => {}}
      />
    );
    expect(screen.getByPlaceholderText("Enter your numeric answer...")).toBeInTheDocument();
  });

  it("calls onNumericChange when typing a number", () => {
    const onNumericChange = vi.fn();
    render(
      <CommitInput
        mode="quantitative"
        disabled={false}
        value=""
        onChange={() => {}}
        numericValue={null}
        onNumericChange={onNumericChange}
      />
    );
    const input = screen.getByPlaceholderText("Enter your numeric answer...");
    fireEvent.change(input, { target: { value: "16.9" } });
    expect(onNumericChange).toHaveBeenCalledWith(16.9);
  });

  it("passes null when input is cleared", () => {
    const onNumericChange = vi.fn();
    render(
      <CommitInput
        mode="quantitative"
        disabled={false}
        value=""
        onChange={() => {}}
        numericValue={16.9}
        onNumericChange={onNumericChange}
      />
    );
    const input = screen.getByPlaceholderText("Enter your numeric answer...");
    fireEvent.change(input, { target: { value: "" } });
    expect(onNumericChange).toHaveBeenCalledWith(null);
  });

  it("disables inputs when disabled prop is true", () => {
    render(
      <CommitInput
        mode="quantitative"
        disabled={true}
        value=""
        onChange={() => {}}
        numericValue={null}
        onNumericChange={() => {}}
      />
    );
    expect(screen.getByPlaceholderText("Enter your numeric answer...")).toBeDisabled();
  });
});

describe("CommitInput - qualitative mode", () => {
  it("renders textarea in qualitative mode", () => {
    render(
      <CommitInput
        mode="qualitative"
        disabled={false}
        value=""
        onChange={() => {}}
        numericValue={null}
        onNumericChange={() => {}}
      />
    );
    expect(screen.getByPlaceholderText(/Write your analysis/)).toBeInTheDocument();
  });

  it("shows character count", () => {
    render(
      <CommitInput
        mode="qualitative"
        disabled={false}
        value="Hello"
        onChange={() => {}}
        numericValue={null}
        onNumericChange={() => {}}
      />
    );
    expect(screen.getByText("5/50 characters minimum")).toBeInTheDocument();
  });

  it("shows ready state when minimum chars reached", () => {
    const longText = "A".repeat(50);
    render(
      <CommitInput
        mode="qualitative"
        disabled={false}
        value={longText}
        onChange={() => {}}
        numericValue={null}
        onNumericChange={() => {}}
      />
    );
    expect(screen.getByText(/ready to reveal/)).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const onChange = vi.fn();
    render(
      <CommitInput
        mode="qualitative"
        disabled={false}
        value=""
        onChange={onChange}
        numericValue={null}
        onNumericChange={() => {}}
      />
    );
    const textarea = screen.getByPlaceholderText(/Write your analysis/);
    fireEvent.change(textarea, { target: { value: "Test input" } });
    expect(onChange).toHaveBeenCalledWith("Test input");
  });
});
