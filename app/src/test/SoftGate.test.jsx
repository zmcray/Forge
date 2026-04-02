// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SoftGate from "../components/onboarding/SoftGate";

// Mock the OnboardingContext
const mockBypassGate = vi.fn();
let mockBypassed = {};

vi.mock("../contexts/OnboardingContext", () => ({
  useOnboarding: () => ({
    hasBypassedGate: (id) => !!mockBypassed[id],
    bypassGate: mockBypassGate,
  }),
}));

describe("SoftGate", () => {
  beforeEach(() => {
    mockBypassGate.mockClear();
    mockBypassed = {};
  });

  it("renders banner with correct message", () => {
    render(
      <SoftGate
        gateId="test-gate"
        message="Try learning first."
        recommendedAction={vi.fn()}
        recommendedLabel="Go to Learn"
      />,
    );
    expect(screen.getByText("Try learning first.")).toBeTruthy();
    expect(screen.getByText("Go to Learn")).toBeTruthy();
  });

  it("Dismiss calls bypassGate", () => {
    render(
      <SoftGate
        gateId="test-gate"
        message="Try learning first."
        recommendedAction={vi.fn()}
        recommendedLabel="Go to Learn"
      />,
    );
    fireEvent.click(screen.getByText("Dismiss"));
    expect(mockBypassGate).toHaveBeenCalledWith("test-gate");
  });

  it("does not render when gate already bypassed", () => {
    mockBypassed = { "test-gate": true };
    const { container } = render(
      <SoftGate
        gateId="test-gate"
        message="Try learning first."
        recommendedAction={vi.fn()}
        recommendedLabel="Go to Learn"
      />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("recommended action button works", () => {
    const action = vi.fn();
    render(
      <SoftGate
        gateId="test-gate"
        message="Try learning first."
        recommendedAction={action}
        recommendedLabel="Go to Learn"
      />,
    );
    fireEvent.click(screen.getByText("Go to Learn"));
    expect(action).toHaveBeenCalledOnce();
  });
});
