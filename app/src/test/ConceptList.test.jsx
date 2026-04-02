// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ConceptList from "../components/learn/ConceptList";

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("ConceptList", () => {
  it("renders all 8 concept card tiles", () => {
    renderWithRouter(<ConceptList />);
    expect(screen.getByText("EBITDA Add-backs")).toBeInTheDocument();
    expect(screen.getByText("LBO Economics")).toBeInTheDocument();
    expect(screen.getByText("Margin Drivers")).toBeInTheDocument();
    expect(screen.getByText("Cash Conversion")).toBeInTheDocument();
    expect(screen.getByText("Customer Concentration")).toBeInTheDocument();
    expect(screen.getByText("Key-Person Risk")).toBeInTheDocument();
    expect(screen.getByText("Valuation Multiples")).toBeInTheDocument();
    expect(screen.getByText("Investment Thesis Structure")).toBeInTheDocument();
  });

  it("renders the page heading", () => {
    renderWithRouter(<ConceptList />);
    expect(screen.getByText("Key Concepts")).toBeInTheDocument();
  });

  it("shows one-liner descriptions", () => {
    renderWithRouter(<ConceptList />);
    expect(
      screen.getByText(/The adjustments that bridge reported EBITDA/)
    ).toBeInTheDocument();
  });

  it("shows company name badges", () => {
    renderWithRouter(<ConceptList />);
    // summit-hvac appears in EBITDA Add-backs card
    expect(screen.getAllByText("summit hvac").length).toBeGreaterThan(0);
  });
});
