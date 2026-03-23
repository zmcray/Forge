// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DeltaDisplay from "./DeltaDisplay";

describe("DeltaDisplay", () => {
  it("renders your answer and model answer", () => {
    render(
      <DeltaDisplay
        committedNumeric={16.5}
        modelExtracted={{ value: 16.9, unit: "%" }}
      />
    );
    expect(screen.getByText(/Your answer:/)).toBeInTheDocument();
    expect(screen.getByText(/Model:/)).toBeInTheDocument();
  });

  it("returns null when committedNumeric is null", () => {
    const { container } = render(
      <DeltaDisplay committedNumeric={null} modelExtracted={{ value: 16.9, unit: "%" }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null when modelExtracted is null", () => {
    const { container } = render(
      <DeltaDisplay committedNumeric={16.5} modelExtracted={null} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("displays formatted values with units", () => {
    render(
      <DeltaDisplay
        committedNumeric={5.5}
        modelExtracted={{ value: 5.5, unit: "$M" }}
      />
    );
    const matches = screen.getAllByText(/5.5/);
    expect(matches.length).toBeGreaterThanOrEqual(2); // your answer + model
  });

  it("shows delta value", () => {
    render(
      <DeltaDisplay
        committedNumeric={20}
        modelExtracted={{ value: 16.9, unit: "%" }}
      />
    );
    expect(screen.getByText(/Delta:/)).toBeInTheDocument();
  });
});
