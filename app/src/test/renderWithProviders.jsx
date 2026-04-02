import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ScoringProvider } from "../contexts/ScoringContext";
import { OnboardingProvider } from "../contexts/OnboardingContext";

export function renderWithProviders(ui, options = {}) {
  const { route = "/", ...renderOptions } = options;

  function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <ScoringProvider>
          <OnboardingProvider>
            {children}
          </OnboardingProvider>
        </ScoringProvider>
      </MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
