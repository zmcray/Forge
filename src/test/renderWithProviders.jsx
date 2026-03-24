import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ScoringProvider } from "../contexts/ScoringContext";

export function renderWithProviders(ui, options = {}) {
  const { route = "/", ...renderOptions } = options;

  function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <ScoringProvider>
          {children}
        </ScoringProvider>
      </MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
