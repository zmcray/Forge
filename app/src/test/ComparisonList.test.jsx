// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ComparisonList from "../components/learn/ComparisonList";

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("ComparisonList", () => {
  it("renders all 4 comparison tiles", () => {
    renderWithRouter(<ComparisonList />);
    expect(screen.getByText("Customer Concentration Risk")).toBeInTheDocument();
    expect(screen.getByText("Key-Person / Founder Risk")).toBeInTheDocument();
    expect(screen.getByText("Growth vs. Margin Tension")).toBeInTheDocument();
    expect(screen.getByText("Working Capital Intensity")).toBeInTheDocument();
  });

  it("renders the page heading", () => {
    renderWithRouter(<ComparisonList />);
    expect(screen.getByText("Cross-Industry Comparisons")).toBeInTheDocument();
  });

  it("shows company names on tiles", () => {
    renderWithRouter(<ComparisonList />);
    // Coastal Fresh Foods appears in multiple comparisons
    const coastalElements = screen.getAllByText("Coastal Fresh Foods");
    expect(coastalElements.length).toBeGreaterThan(0);
  });
});
