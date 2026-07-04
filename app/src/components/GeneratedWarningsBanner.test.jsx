// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GeneratedWarningsBanner from "./GeneratedWarningsBanner";

describe("GeneratedWarningsBanner", () => {
  it("renders nothing when there are no warnings", () => {
    const { container } = render(<GeneratedWarningsBanner warnings={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when warnings is undefined", () => {
    const { container } = render(<GeneratedWarningsBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it("lists each warning with an unverified-financials headline", () => {
    render(
      <GeneratedWarningsBanner
        warnings={["Gross profit mismatch in year 2", "EBITDA does not reconcile to net income plus I/D/A"]}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("AI-generated, unverified financials (2 inconsistencies)");
    expect(screen.getByText("Gross profit mismatch in year 2")).toBeInTheDocument();
    expect(screen.getByText("EBITDA does not reconcile to net income plus I/D/A")).toBeInTheDocument();
  });

  it("dismisses when the dismiss button is clicked", () => {
    render(<GeneratedWarningsBanner warnings={["Gross profit mismatch in year 2"]} />);

    fireEvent.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
