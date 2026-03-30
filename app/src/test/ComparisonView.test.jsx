// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ComparisonView from "../components/learn/ComparisonView";

function renderAtRoute(comparisonId) {
  return render(
    <MemoryRouter initialEntries={[`/learn/compare/${comparisonId}`]}>
      <Routes>
        <Route path="/learn/compare/:comparisonId" element={<ComparisonView />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ComparisonView", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders comparison title and description", () => {
    renderAtRoute("customer-concentration");
    expect(screen.getByText("Customer Concentration Risk")).toBeInTheDocument();
    expect(screen.getByText(/Same risk, different severity/)).toBeInTheDocument();
  });

  it("renders company data cards with real numbers", () => {
    renderAtRoute("customer-concentration");
    // Coastal Fresh Foods should appear
    expect(screen.getByText("Coastal Fresh Foods")).toBeInTheDocument();
    // Apex Last-Mile Logistics
    expect(screen.getByText("Apex Last-Mile Logistics")).toBeInTheDocument();
    // TrueNorth Analytics
    expect(screen.getByText("TrueNorth Analytics")).toBeInTheDocument();
  });

  it("renders analysis prompts", () => {
    renderAtRoute("customer-concentration");
    expect(screen.getByText(/Which company's concentration risk concerns you most/)).toBeInTheDocument();
  });

  it("renders 'Reveal Key Insight' button initially", () => {
    renderAtRoute("customer-concentration");
    expect(screen.getByText("Reveal Key Insight")).toBeInTheDocument();
  });

  it("reveals key insight on button click", () => {
    renderAtRoute("customer-concentration");
    fireEvent.click(screen.getByText("Reveal Key Insight"));
    expect(screen.getByText("Key Insight")).toBeInTheDocument();
    expect(screen.getByText(/Concentration risk is not just about the percentage/)).toBeInTheDocument();
  });

  it("shows 'not found' for invalid comparison id", () => {
    renderAtRoute("nonexistent-id");
    expect(screen.getByText("Comparison not found.")).toBeInTheDocument();
  });

  it("saves prompt responses to localStorage", () => {
    renderAtRoute("customer-concentration");
    const textareas = screen.getAllByPlaceholderText("Type your analysis here...");
    fireEvent.change(textareas[0], { target: { value: "Coastal concerns me most" } });
    const stored = JSON.parse(localStorage.getItem("forge-notes"));
    expect(stored["compare-customer-concentration-0"].text).toBe("Coastal concerns me most");
  });

  it("renders resolved data values", () => {
    renderAtRoute("customer-concentration");
    // Coastal's customer concentration is 22%
    expect(screen.getByText("22%")).toBeInTheDocument();
    // Apex's customer concentration is 35%
    expect(screen.getByText("35%")).toBeInTheDocument();
    // TrueNorth's customer concentration is 8%
    expect(screen.getByText("8%")).toBeInTheDocument();
  });
});
