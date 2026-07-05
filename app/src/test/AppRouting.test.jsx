// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import App from "../App";

// jsdom has no matchMedia; useTheme falls back to it for system preference.
function stubMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Route table smoke tests: every top-level surface mounts without crashing.
describe("App routing", () => {
  beforeEach(() => {
    localStorage.clear();
    stubMatchMedia();
  });

  it("renders the home screen at /", async () => {
    renderWithProviders(<App />, { route: "/" });
    expect(await screen.findByText("PE Financial Analyst")).toBeInTheDocument();
  });

  it("renders the practice screen for a real company at /practice/:companyId", async () => {
    renderWithProviders(<App />, { route: "/practice/summit-hvac" });
    expect(
      await screen.findByRole("heading", { name: "Summit Mechanical Services" })
    ).toBeInTheDocument();
  });

  it("bounces an unknown company id back to home", async () => {
    renderWithProviders(<App />, { route: "/practice/not-a-company" });
    expect(await screen.findByText("PE Financial Analyst")).toBeInTheDocument();
  });

  it("renders the progress dashboard at /progress", async () => {
    renderWithProviders(<App />, { route: "/progress" });
    expect(await screen.findByText("Questions Completed")).toBeInTheDocument();
    expect(screen.getByText("Performance by Category")).toBeInTheDocument();
  });

  it("renders the learn hub at /learn", async () => {
    renderWithProviders(<App />, { route: "/learn" });
    expect(await screen.findByText("Learn the Fundamentals")).toBeInTheDocument();
  });

  it("renders the consult company list lazily at /consult", async () => {
    renderWithProviders(<App />, { route: "/consult" });
    expect(await screen.findByText("Consulting Wedge")).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "Summit Mechanical Services" })
    ).toBeInTheDocument();
  });

  it("renders the consult session at /consult/:companyId", async () => {
    renderWithProviders(<App />, { route: "/consult/summit-hvac" });
    expect(
      await screen.findByRole("heading", { name: "Summit Mechanical Services" })
    ).toBeInTheDocument();
    expect(await screen.findByText("Stage 2A: Decompose")).toBeInTheDocument();
  });

  it("bounces an unknown consult company id back to the consult list", async () => {
    renderWithProviders(<App />, { route: "/consult/not-a-company" });
    expect(await screen.findByText("Consulting Wedge")).toBeInTheDocument();
  });

  it("renders quick screen mode at /quickfire", async () => {
    renderWithProviders(<App />, { route: "/quickfire" });
    // "Quick Screen" also appears as a sidebar nav label; target the heading.
    expect(await screen.findByRole("heading", { name: "Quick Screen" })).toBeInTheDocument();
    expect(screen.getByText(/Company 1 of/)).toBeInTheDocument();
  });
});
