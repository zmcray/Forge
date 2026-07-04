import { useMemo, useCallback } from "react";
import { COMPANIES, DIFFICULTY_LABELS } from "../data/companies";
import { SCENARIOS } from "../data/scenarios";
import CompanyCard from "../components/CompanyCard";
import WeakSpotCard from "../components/WeakSpotCard";
import StatCard from "../components/StatCard";
import MasteryCard from "../components/MasteryCard";
import ModuleCard from "../components/ModuleCard";
import IntroSequence from "../components/onboarding/IntroSequence";
import SmartHomeRecommendations from "../components/onboarding/SmartHomeRecommendations";
import { useScoringState } from "../contexts/ScoringContext";
import { useOnboarding } from "../contexts/OnboardingContext";
import useLearnProgress from "../hooks/useLearnProgress";
import useCompanyGeneration from "../hooks/useCompanyGeneration";

function getOverallLearnProgress(learnProgress) {
  return {
    completed: learnProgress.overallStats.completedExercises,
    total: learnProgress.overallStats.totalExercises,
    currentStepName: learnProgress.getCurrentStep()?.title || "Learn",
    hasStarted: learnProgress.overallStats.completedExercises > 0 ||
      learnProgress.progress.visitedSubsections.length > 0,
  };
}

export default function HomeScreen({ startPractice, setView, generatedCompanies, onGeneratedCompany }) {
  const { sessions, streak, weakSpots, quantitativeAccuracy, attemptedCompanyIds } = useScoringState();
  const { isIntroComplete, currentIntroStep, advanceIntro, skipIntro, completeIntro } = useOnboarding();
  const learnProgress = useLearnProgress();
  const generation = useCompanyGeneration({ onGeneratedCompany });

  const scenariosByCompany = useMemo(() => {
    const map = {};
    for (const s of SCENARIOS) {
      if (!map[s.companyId]) map[s.companyId] = [];
      map[s.companyId].push(s);
    }
    return map;
  }, []);

  const totalQuestions = useMemo(() => {
    return sessions.reduce((sum, s) => sum + s.questions.length, 0);
  }, [sessions]);

  const masteryLevel = useMemo(() => {
    if (totalQuestions >= 200) return "Senior Analyst";
    if (totalQuestions >= 100) return "Analyst";
    if (totalQuestions >= 50) return "Associate";
    if (totalQuestions >= 20) return "Junior";
    return "Beginner";
  }, [totalQuestions]);

  const learnStats = getOverallLearnProgress(learnProgress);

  const companiesByDifficulty = useMemo(() => {
    const groups = { 1: [], 2: [], 3: [] };
    for (const company of COMPANIES) {
      const d = company.difficulty ?? 2;
      groups[d].push(company);
    }
    return groups;
  }, []);

  const startPracticeById = useCallback((companyId) => {
    const company = COMPANIES.find((c) => c.id === companyId);
    if (company) startPractice(company);
  }, [startPractice]);

  const handleIntroStartPractice = useCallback(() => {
    const summit = COMPANIES.find((c) => c.id === "summit-hvac");
    if (summit) startPractice(summit);
  }, [startPractice]);

  return (
    <>
      {/* Intro overlay for first-time users */}
      {!isIntroComplete && (
        <IntroSequence
          currentStep={currentIntroStep}
          onAdvance={advanceIntro}
          onSkip={skipIntro}
          onComplete={completeIntro}
          startPractice={handleIntroStartPractice}
        />
      )}

      {/* Page header */}
      <section className="mb-8">
        <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">PE Financial Analyst</h2>
        <p className="text-sm text-on-surface-variant mt-2 max-w-xl">
          Practice analyzing lower-middle-market companies through a PE lens. Review financials, commit your analysis, and track progress.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => setView("progress")}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-on-primary bg-gradient-to-r from-primary to-primary-container hover:opacity-90 transition-opacity"
          >
            Check Progress
          </button>
          <button
            onClick={generation.generate}
            disabled={generation.status === "loading"}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              {generation.status === "loading" ? "Generating..." : "Generate Random Company"}
            </span>
          </button>
        </div>
        {generation.error && (
          <p className="mt-2 text-xs text-error">{generation.error}</p>
        )}
      </section>

      {/* Stats bento grid or welcome card */}
      {totalQuestions === 0 && streak.current === 0 ? (
        <section className="mb-8">
          <div className="bg-surface-container-lowest ghost-border rounded-xl p-8">
            <h3 className="text-2xl font-bold font-headline text-on-surface mb-2">Welcome to Forge</h3>
            <p className="text-sm text-on-surface-variant max-w-lg mb-6">
              Build your PE deal analysis skills through realistic LMM company scenarios. Start with the fundamentals or jump straight into a quick screen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setView("learn")}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-on-primary bg-gradient-to-r from-primary to-primary-container hover:opacity-90 transition-opacity"
              >
                Start Learning
              </button>
              <button
                onClick={() => setView("quickfire")}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high transition-colors"
              >
                Try Quick Screen
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Active Streak"
            value={streak.current}
            icon="local_fire_department"
          />
          <StatCard
            label="Questions Answered"
            value={totalQuestions}
            suffix="/ 500"
            icon="quiz"
            progress={(totalQuestions / 500) * 100}
          />
          <MasteryCard
            level={masteryLevel}
            description="Complete more practice sessions to advance your analyst ranking."
            onViewRanking={() => setView("progress")}
          />
        </section>
      )}

      {/* Smart recommendations */}
      <SmartHomeRecommendations startPracticeById={startPracticeById} />

      {/* Learning modules */}
      <section className="grid grid-cols-2 gap-4 mb-8">
        <ModuleCard
          icon="menu_book"
          title="Learn the Fundamentals"
          description="Financial statements, screening metrics, and due diligence frameworks for PE analysis."
          badges={[`${learnStats.completed}/${learnStats.total} Exercises`, "Interactive"]}
          ctaLabel={learnStats.hasStarted ? `Continue: ${learnStats.currentStepName}` : "Start Learning"}
          onClick={() => setView("learn")}
          progress={learnStats.total > 0 ? (learnStats.completed / learnStats.total) * 100 : 0}
        />
        <ModuleCard
          icon="bolt"
          title="Quick Screen"
          description="60-second go/no-go decisions on shuffled companies. Build pattern recognition fast."
          badges={["Timed", "5 Companies"]}
          ctaLabel="Start Screening"
          onClick={() => setView("quickfire")}
        />
      </section>

      {/* Weak spots (if any) */}
      {(weakSpots || quantitativeAccuracy) && (
        <section className="mb-8">
          <WeakSpotCard weakSpots={weakSpots} quantitativeAccuracy={quantitativeAccuracy} />
        </section>
      )}

      {/* Deep dive case studies, sorted by difficulty */}
      <section>
        {generatedCompanies.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm uppercase tracking-widest text-on-surface-variant font-semibold">
                Generated Cases
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {generatedCompanies.map(company => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  completed={attemptedCompanyIds.has(company.id)}
                  onSelect={() => startPractice(company)}
                />
              ))}
            </div>
          </div>
        )}

        {[1, 2, 3].map((difficulty) => {
          const companies = companiesByDifficulty[difficulty];
          if (!companies || companies.length === 0) return null;
          return (
            <div key={difficulty} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm uppercase tracking-widest text-on-surface-variant font-semibold">
                  {DIFFICULTY_LABELS[difficulty]}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {companies.map(company => (
                  <div key={company.id}>
                    <CompanyCard
                      company={company}
                      completed={attemptedCompanyIds.has(company.id)}
                      onSelect={() => startPractice(company)}
                    />
                    {scenariosByCompany[company.id] && (
                      <div className="mt-2 flex gap-2 flex-wrap px-2">
                        {scenariosByCompany[company.id].map(scenario => (
                          <button
                            key={scenario.id}
                            onClick={() => startPractice(company, scenario.id)}
                            className="text-[10px] uppercase tracking-widest px-3 py-2 bg-secondary-container/50 text-on-secondary-container rounded-full hover:bg-secondary-container transition-colors"
                          >
                            Scenario: {scenario.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
