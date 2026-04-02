// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import IntroSequence from "../components/onboarding/IntroSequence";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderIntro(props = {}) {
  const defaults = {
    currentStep: 0,
    onAdvance: vi.fn(),
    onSkip: vi.fn(),
    onComplete: vi.fn(),
    startPractice: vi.fn(),
  };
  const merged = { ...defaults, ...props };
  return { ...render(
    <MemoryRouter>
      <IntroSequence {...merged} />
    </MemoryRouter>
  ), ...merged };
}

describe("IntroSequence", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders step 0 on first load", () => {
    renderIntro({ currentStep: 0 });
    expect(screen.getByText("Welcome to Forge")).toBeTruthy();
    expect(screen.getByText("Let's Go")).toBeTruthy();
  });

  it("Let's Go advances to next step", () => {
    const { onAdvance } = renderIntro({ currentStep: 0 });
    fireEvent.click(screen.getByText("Let's Go"));
    expect(onAdvance).toHaveBeenCalledOnce();
  });

  it("Skip button marks intro complete", () => {
    const { onSkip } = renderIntro({ currentStep: 0 });
    fireEvent.click(screen.getByText("Skip"));
    expect(onSkip).toHaveBeenCalledOnce();
  });

  it("renders step 1 with Learn content", () => {
    renderIntro({ currentStep: 1 });
    expect(screen.getByText("Learn the Fundamentals")).toBeTruthy();
    expect(screen.getByText("Open Learn Module")).toBeTruthy();
  });

  it("step 1 CTA navigates to /learn", () => {
    const { onComplete } = renderIntro({ currentStep: 1 });
    fireEvent.click(screen.getByText("Open Learn Module"));
    expect(onComplete).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledWith("/learn");
  });

  it("renders step 2 with practice content", () => {
    renderIntro({ currentStep: 2 });
    expect(screen.getByText("Try a Practice Question")).toBeTruthy();
  });

  it("step 2 CTA calls startPractice", () => {
    const { onComplete, startPractice } = renderIntro({ currentStep: 2 });
    fireEvent.click(screen.getByText("Try Summit HVAC"));
    expect(onComplete).toHaveBeenCalledOnce();
    expect(startPractice).toHaveBeenCalledOnce();
  });

  it("renders step 3 with progress content", () => {
    renderIntro({ currentStep: 3 });
    expect(screen.getByText("Track Your Progress")).toBeTruthy();
  });

  it("step 3 CTA navigates to /progress", () => {
    const { onComplete } = renderIntro({ currentStep: 3 });
    fireEvent.click(screen.getByText("See Dashboard"));
    expect(onComplete).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledWith("/progress");
  });

  it("renders step 4 final step", () => {
    renderIntro({ currentStep: 4 });
    expect(screen.getByText("You're Ready")).toBeTruthy();
    expect(screen.getByText("Explore on my own")).toBeTruthy();
  });

  it("step 4 alt completes intro without navigation", () => {
    const { onComplete } = renderIntro({ currentStep: 4 });
    fireEvent.click(screen.getByText("Explore on my own"));
    expect(onComplete).toHaveBeenCalledOnce();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("shows 5 step indicator dots", () => {
    const { container } = renderIntro({ currentStep: 0 }).container
      ? { container: renderIntro({ currentStep: 0 }).container }
      : renderIntro({ currentStep: 0 });
    // 5 dots rendered
    const dots = container.querySelectorAll(".rounded-full.h-1\\.5");
    expect(dots.length).toBe(5);
  });
});
