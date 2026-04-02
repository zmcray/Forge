import { createContext, useContext } from "react";
import useOnboardingHook from "../hooks/useOnboarding";

const OnboardingContext = createContext(null);

export function OnboardingProvider({ children }) {
  const onboarding = useOnboardingHook();

  return (
    <OnboardingContext value={onboarding}>
      {children}
    </OnboardingContext>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
