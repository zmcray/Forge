// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TimerBar from "./TimerBar";

describe("TimerBar", () => {
  it("renders formatted time", () => {
    render(
      <TimerBar formattedTime="3:45" progress={0.25} isExpired={false} currentMilestone={null} />
    );
    expect(screen.getByText("3:45")).toBeInTheDocument();
  });

  it("shows progress bar with correct width", () => {
    const { container } = render(
      <TimerBar formattedTime="5:00" progress={0.5} isExpired={false} currentMilestone={null} />
    );
    const bar = container.querySelector("[style]");
    expect(bar.style.width).toBe("50%");
  });

  it("shows expired state", () => {
    render(
      <TimerBar formattedTime="15:00" progress={1} isExpired={true} currentMilestone={null} />
    );
    expect(screen.getByText("Time's up")).toBeInTheDocument();
  });

  it("does not show expired badge when not expired", () => {
    render(
      <TimerBar formattedTime="5:00" progress={0.33} isExpired={false} currentMilestone={null} />
    );
    expect(screen.queryByText("Time's up")).not.toBeInTheDocument();
  });

  it("shows milestone message when present", () => {
    const milestone = { minutes: 5, message: "5 min in. Have you checked margins and growth?" };
    render(
      <TimerBar formattedTime="5:30" progress={0.37} isExpired={false} currentMilestone={milestone} />
    );
    expect(screen.getByText(milestone.message)).toBeInTheDocument();
  });

  it("hides milestone when expired", () => {
    const milestone = { minutes: 15, message: "15 min. A real screening call would be wrapping up." };
    render(
      <TimerBar formattedTime="15:00" progress={1} isExpired={true} currentMilestone={milestone} />
    );
    expect(screen.queryByText(milestone.message)).not.toBeInTheDocument();
  });

  it("caps progress bar at 100%", () => {
    const { container } = render(
      <TimerBar formattedTime="20:00" progress={1.5} isExpired={true} currentMilestone={null} />
    );
    const bar = container.querySelector("[style]");
    expect(bar.style.width).toBe("100%");
  });
});
