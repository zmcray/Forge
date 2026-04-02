import { useNavigate } from "react-router-dom";

const STEPS = [
  {
    title: "Welcome to Forge",
    body: "You'll practice PE deal analysis with realistic lower-middle-market company data. Review financials, commit your answers, and build pattern recognition.",
    cta: "Let's Go",
    ctaAction: "advance",
    alt: null,
  },
  {
    title: "Learn the Fundamentals",
    body: "Start with the Learn module. Each section covers financial statements, screening metrics, and due diligence frameworks with interactive exercises.",
    cta: "Open Learn Module",
    ctaAction: "navigate:/learn",
    alt: "Next",
  },
  {
    title: "Try a Practice Question",
    body: "You'll commit your answer before seeing the model answer. No peeking. After reveal, you'll see how your analysis compares.",
    cta: "Try Summit HVAC",
    ctaAction: "navigate:/practice/summit-hvac",
    alt: "Next",
  },
  {
    title: "Track Your Progress",
    body: "Your scores, streaks, and weak spots are tracked automatically. The dashboard surfaces where to focus next.",
    cta: "See Dashboard",
    ctaAction: "navigate:/progress",
    alt: "Next",
  },
  {
    title: "You're Ready",
    body: "Start with beginner companies and work your way up. Each company has unique financials, red flags, and analysis questions.",
    cta: "Start with Summit HVAC",
    ctaAction: "navigate:/practice/summit-hvac",
    alt: "Explore on my own",
  },
];

export default function IntroSequence({
  currentStep,
  onAdvance,
  onSkip,
  onComplete,
  startPractice,
}) {
  const navigate = useNavigate();
  const step = STEPS[currentStep] || STEPS[0];

  function handleCta() {
    if (step.ctaAction === "advance") {
      onAdvance();
      return;
    }
    if (step.ctaAction.startsWith("navigate:")) {
      const path = step.ctaAction.replace("navigate:", "");
      onComplete();
      if (path === "/practice/summit-hvac" && startPractice) {
        startPractice();
      } else {
        navigate(path);
      }
    }
  }

  function handleAlt() {
    if (currentStep === STEPS.length - 1) {
      onComplete();
    } else {
      onAdvance();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-scrim/60 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-xl max-w-md w-full mx-4 p-8 ghost-border">
        {/* Skip button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-xs text-on-surface-variant hover:text-on-surface transition-colors uppercase tracking-widest font-medium"
        >
          Skip
        </button>

        {/* Step indicator dots */}
        <div className="flex gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? "w-6 bg-primary"
                  : i < currentStep
                    ? "w-1.5 bg-primary/40"
                    : "w-1.5 bg-outline-variant/30"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold font-headline text-on-surface mb-3">
          {step.title}
        </h3>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
          {step.body}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCta}
            className="flex-1 py-3 rounded-lg text-sm font-semibold text-on-primary bg-gradient-to-r from-primary to-primary-container hover:opacity-90 transition-opacity"
          >
            {step.cta}
          </button>
          {step.alt && (
            <button
              onClick={handleAlt}
              className="px-4 py-3 rounded-lg text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {step.alt}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
