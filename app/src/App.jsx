import { useState, useCallback, useMemo, useEffect, useReducer, useRef } from "react";
import { Routes, Route, useLocation, useNavigate, useParams } from "react-router-dom";
import { COMPANIES, DIFFICULTY_LABELS } from "./data/companies";
import { SCENARIOS } from "./data/scenarios";
import { shuffleArray } from "./utils/format";
import { mergeScenario } from "./utils/scenarios";
import { buildCompanyContext } from "./utils/buildCompanyContext";
import FinancialTable from "./components/FinancialTable";
import QuestionCard from "./components/QuestionCard";
import ProgressDashboard from "./components/ProgressDashboard";
import CompanyCard from "./components/CompanyCard";
import LearnModule from "./components/learn/LearnModule";
import TimerBar from "./components/TimerBar";
import WeakSpotCard from "./components/WeakSpotCard";
import SessionSummary from "./components/SessionSummary";
import QuickFireScreen from "./components/QuickFireScreen";
import AppShell from "./components/AppShell";
import StatCard from "./components/StatCard";
import MasteryCard from "./components/MasteryCard";
import ModuleCard from "./components/ModuleCard";
import SearchModal from "./components/SearchModal";
import IntroSequence from "./components/onboarding/IntroSequence";
import SmartHomeRecommendations from "./components/onboarding/SmartHomeRecommendations";
import SoftGate from "./components/onboarding/SoftGate";
import ChatDrawer from "./components/learn/ChatDrawer";
import { useScoringState, useScoringDispatch } from "./contexts/ScoringContext";
import useTimer from "./hooks/useTimer";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";
import useLearnProgress from "./hooks/useLearnProgress";
import { useOnboarding } from "./contexts/OnboardingContext";
import useTheme from "./hooks/useTheme";

function viewFromPath(pathname) {
  if (pathname.startsWith("/practice")) return "practice";
  if (pathname.startsWith("/progress")) return "progress";
  if (pathname.startsWith("/learn")) return "learn";
  if (pathname.startsWith("/quickfire")) return "quickfire";
  return "home";
}

function generationReducer(state, action) {
  switch (action.type) {
    case "GENERATE_START":
      return { status: "loading", error: null };
    case "GENERATE_SUCCESS":
      return { status: "idle", error: null };
    case "GENERATE_ERROR":
      return { status: "error", error: action.payload };
    default:
      return state;
  }
}

export default function App() {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [statementView, setStatementView] = useState("income");
  const [showSummary, setShowSummary] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [generatedCompanies, setGeneratedCompanies] = useState([]);

  // Ref-mirror state for use in finishCompany to prevent stale closures
  const selectedCompanyRef = useRef(null);
  const sessionQuestionsRef = useRef([]);
  useEffect(() => { selectedCompanyRef.current = selectedCompany; }, [selectedCompany]);
  useEffect(() => { sessionQuestionsRef.current = sessionQuestions; }, [sessionQuestions]);

  const { addScore, updateSessionDuration } = useScoringDispatch();
  const timer = useTimer(15);
  const learnProgress = useLearnProgress();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  // Cmd+K global shortcut
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(o => !o);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const setView = useCallback((v) => {
    const routes = { home: "/", practice: "/practice", progress: "/progress", learn: "/learn", quickfire: "/quickfire" };
    navigate(routes[v] || "/");
  }, [navigate]);

  useKeyboardShortcuts({
    enabled: !!selectedCompany,
    onBack: () => finishCompany(),
  });

  const scenariosByCompany = useMemo(() => {
    const map = {};
    for (const s of SCENARIOS) {
      if (!map[s.companyId]) map[s.companyId] = [];
      map[s.companyId].push(s);
    }
    return map;
  }, []);

  const handleScore = useCallback((type, score, meta) => {
    if (!selectedCompany) return;
    addScore({
      companyId: selectedCompany._scenarioId || selectedCompany.id,
      questionType: type,
      score,
      delta: meta?.delta ?? null,
      unit: meta?.unit ?? null,
      atomId: meta?.atomId ?? null,
      atomType: meta?.atomType ?? null,
      feedback: meta?.feedback ?? null,
      // timestamp defaults to now() inside addScore (ISO8601)
    });
    setSessionQuestions(prev => [...prev, { type, score, delta: meta?.delta ?? null, unit: meta?.unit ?? null, selfScore: meta?.selfScore ?? null, aiScore: meta?.aiScore ?? null }]);
  }, [selectedCompany, addScore]);

  const startPractice = useCallback((company, scenarioId) => {
    let practiceCompany = company;
    if (scenarioId) {
      const scenario = SCENARIOS.find(s => s.id === scenarioId);
      if (scenario) {
        practiceCompany = mergeScenario(company, scenario);
      }
    }
    setSelectedCompany(practiceCompany);
    setShuffledQuestions(shuffleArray([...practiceCompany.questions]));
    setSessionQuestions([]);
    timer.start();
    // Warmup ping to reduce cold-start latency on first evaluation
    fetch("/api/evaluate", { method: "OPTIONS" }).catch(() => {});
    setStatementView("income");
    const url = scenarioId ? `/practice/${company.id}?scenario=${scenarioId}` : `/practice/${company.id}`;
    navigate(url);
  }, [timer, navigate]);

  const finishCompany = useCallback(() => {
    const company = selectedCompanyRef.current;
    const questions = sessionQuestionsRef.current;
    timer.stop();
    if (company) {
      updateSessionDuration(
        company._scenarioId || company.id,
        timer.elapsedMinutes
      );
      if (questions.length > 0) {
        setShowSummary(true);
        return;
      }
    }
    navigate("/");
    setSelectedCompany(null);
  }, [timer, updateSessionDuration, navigate]);

  const closeSummary = useCallback(() => {
    setShowSummary(false);
    navigate("/");
    setSelectedCompany(null);
  }, [navigate]);

  const handleSearchCompany = useCallback((companyId) => {
    const company = COMPANIES.find(c => c.id === companyId);
    if (company) startPractice(company);
  }, [startPractice]);

  const handleSearchLearn = useCallback(() => {
    navigate("/learn");
  }, [navigate]);

  const handleGeneratedCompany = useCallback((company) => {
    setGeneratedCompanies(prev => [
      company,
      ...prev.filter(c => c.id !== company.id),
    ]);
  }, []);

  return (
    <>
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigateCompany={handleSearchCompany}
        onNavigateLearn={handleSearchLearn}
        onNavigateView={setView}
      />
      <Routes>
        <Route path="/*" element={
          <AppShellWrapper
            setView={setView}
            scenariosByCompany={scenariosByCompany}
            startPractice={startPractice}
            learnProgress={learnProgress}
            selectedCompany={selectedCompany}
            generatedCompanies={generatedCompanies}
            onGeneratedCompany={handleGeneratedCompany}
            statementView={statementView}
            setStatementView={setStatementView}
            shuffledQuestions={shuffledQuestions}
            handleScore={handleScore}
            finishCompany={finishCompany}
            timer={timer}
            showSummary={showSummary}
            sessionQuestions={sessionQuestions}
            closeSummary={closeSummary}
            theme={theme}
            toggleTheme={toggleTheme}
            onSearchOpen={() => setSearchOpen(true)}
          />
        } />
      </Routes>
    </>
  );
}

function AppShellWrapper(props) {
  const setView = props.setView;

  // Determine active view from current URL
  const activeView = viewFromPath(window.location.pathname);

  const handleNavigate = useCallback((v) => {
    setView(v);
  }, [setView]);

  return (
    <AppShell activeView={activeView} onNavigate={handleNavigate} theme={props.theme} onToggleTheme={props.toggleTheme} onSearchOpen={props.onSearchOpen}>
      <Routes>
        <Route index element={
          <HomeScreen
            scenariosByCompany={props.scenariosByCompany}
            startPractice={props.startPractice}
            setView={setView}
            learnProgress={props.learnProgress}
            generatedCompanies={props.generatedCompanies}
            onGeneratedCompany={props.onGeneratedCompany}
          />
        } />
        <Route path="progress" element={
          <ProgressDashboard />
        } />
        <Route path="practice/:companyId" element={
          <PracticeRoute
            selectedCompany={props.selectedCompany}
            startPractice={props.startPractice}
            statementView={props.statementView}
            setStatementView={props.setStatementView}
            shuffledQuestions={props.shuffledQuestions}
            handleScore={props.handleScore}
            finishCompany={props.finishCompany}
            timer={props.timer}
            showSummary={props.showSummary}
            sessionQuestions={props.sessionQuestions}
            closeSummary={props.closeSummary}
          />
        } />
        <Route path="learn" element={<LearnModule />} />
        <Route path="learn/compare" element={<LearnModule />} />
        <Route path="learn/compare/:comparisonId" element={<LearnModule />} />
        <Route path="learn/concepts" element={<LearnModule />} />
        <Route path="learn/concepts/:cardId" element={<LearnModule />} />
        <Route path="learn/levers" element={<LearnModule />} />
        <Route path="learn/levers/:leverId" element={<LearnModule />} />
        <Route path="learn/bridge" element={<LearnModule />} />
        <Route path="learn/bridge/:scenarioId" element={<LearnModule />} />
        <Route path="learn/playbooks" element={<LearnModule />} />
        <Route path="learn/playbooks/:playbookId" element={<LearnModule />} />
        <Route path="quickfire" element={<QuickFireScreen />} />
      </Routes>
    </AppShell>
  );
}

function PracticeRoute({ selectedCompany, startPractice, ...practiceProps }) {
  const { companyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const scenarioId = searchParams.get("scenario");
  const activePracticeId = selectedCompany?._scenarioId || selectedCompany?.id;
  const targetPracticeId = scenarioId || companyId;

  useEffect(() => {
    if (!companyId || activePracticeId === targetPracticeId) return;

    const company = COMPANIES.find(c => c.id === companyId);
    if (!company) {
      navigate("/", { replace: true });
      return;
    }

    if (scenarioId && !SCENARIOS.some(s => s.id === scenarioId && s.companyId === company.id)) {
      navigate(`/practice/${company.id}`, { replace: true });
      return;
    }

    startPractice(company, scenarioId || undefined);
  }, [activePracticeId, companyId, navigate, scenarioId, startPractice, targetPracticeId]);

  if (!selectedCompany || activePracticeId !== targetPracticeId) return null;

  return (
    <PracticeScreen
      company={selectedCompany}
      {...practiceProps}
    />
  );
}

function getOverallLearnProgress(learnProgress) {
  return {
    completed: learnProgress.overallStats.completedExercises,
    total: learnProgress.overallStats.totalExercises,
    currentStepName: learnProgress.getCurrentStep()?.title || "Learn",
    hasStarted: learnProgress.overallStats.completedExercises > 0 ||
      learnProgress.progress.visitedSubsections.length > 0,
  };
}

function HomeScreen({ scenariosByCompany, startPractice, setView, learnProgress, generatedCompanies, onGeneratedCompany }) {
  const { sessions, streak } = useScoringState();
  const { getWeakSpots, getQuantitativeAccuracy } = useScoringDispatch();
  const { isIntroComplete, currentIntroStep, advanceIntro, skipIntro, completeIntro } = useOnboarding();
  const [generationState, dispatchGeneration] = useReducer(generationReducer, {
    status: "idle",
    error: null,
  });
  const generationAbortRef = useRef(null);

  useEffect(() => {
    return () => {
      generationAbortRef.current?.abort();
    };
  }, []);

  const completedCompanies = useMemo(() => {
    const ids = new Set();
    for (const session of sessions) {
      if (session.questions.length > 0) ids.add(session.companyId);
    }
    return ids;
  }, [sessions]);

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

  const weakSpots = getWeakSpots();
  const quantitativeAccuracy = getQuantitativeAccuracy();
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

  const handleGenerateCompany = useCallback(async () => {
    if (generationState.status === "loading") return;

    generationAbortRef.current?.abort();
    const controller = new AbortController();
    generationAbortRef.current = controller;

    dispatchGeneration({ type: "GENERATE_START" });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forge-token": import.meta.env.VITE_FORGE_AUTH_TOKEN || "",
        },
        body: JSON.stringify({}),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Generation failed, try again.");
      }

      const company = await response.json();
      if (controller.signal.aborted) return;

      onGeneratedCompany(company);
      dispatchGeneration({ type: "GENERATE_SUCCESS" });
    } catch (err) {
      if (err.name === "AbortError") return;
      console.warn("[Forge] Company generation failed:", err);
      dispatchGeneration({
        type: "GENERATE_ERROR",
        payload: err.message || "Generation failed, try again.",
      });
    } finally {
      if (generationAbortRef.current === controller) {
        generationAbortRef.current = null;
      }
    }
  }, [generationState.status, onGeneratedCompany]);

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
            onClick={handleGenerateCompany}
            disabled={generationState.status === "loading"}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              {generationState.status === "loading" ? "Generating..." : "Generate Random Company"}
            </span>
          </button>
        </div>
        {generationState.error && (
          <p className="mt-2 text-xs text-error">{generationState.error}</p>
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
                  completed={completedCompanies.has(company.id)}
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
                      completed={completedCompanies.has(company.id)}
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

function buildPracticeChatContext(co) {
  return {
    companyName: co.name,
    industry: co.industry,
    revenue: co.revenue,
    context: co.context,
    description: co.description,
    scenarioName: co._scenarioName || null,
    scenarioDescription: co._scenarioDescription || null,
    keyMetrics: co.keyMetrics,
    incomeStatement: co.incomeStatement,
    balanceSheet: co.balanceSheet,
    cashFlow: co.cashFlow,
    redFlags: co.redFlags,
    greenFlags: co.greenFlags,
    questions: co.questions.map(q => ({
      id: q.id,
      type: q.type,
      question: q.q,
      modelAnswer: q.answer,
    })),
    suggestedQuestions: [
      `What are the top diligence priorities for ${co.name}?`,
      `How would you frame the investment thesis for ${co.name}?`,
      `Which metric should I pressure-test first?`,
    ],
  };
}

function PracticeScreen({ company: co, statementView, setStatementView, shuffledQuestions, handleScore, finishCompany, timer, showSummary, sessionQuestions, closeSummary }) {
  const navigate = useNavigate();
  const learnProgress = useLearnProgress();
  const hasLearnProgress = learnProgress.progress.completedExercises.length > 0;
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const practiceChatContext = useMemo(() => buildPracticeChatContext(co), [co]);

  const handleCloseChat = useCallback(() => {
    setChatOpen(false);
  }, []);

  useEffect(() => {
    setChatOpen(false);
    setChatMessages([]);
  }, [co.id, co._scenarioId]);

  return (
    <div>
      {/* Soft gate: suggest learning first */}
      {!hasLearnProgress && (
        <SoftGate
          gateId="practice-before-learn"
          message="We recommend completing Section 1 of Learn before practicing."
          recommendedAction={() => navigate("/learn")}
          recommendedLabel="Go to Learn"
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold font-headline text-on-surface">{co.name}</h1>
            <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container">{co.industry}</span>
            {co._scenarioName && (
              <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container">
                Scenario: {co._scenarioName}
              </span>
            )}
          </div>
          <p className="text-sm text-on-surface-variant mt-1">{co.context}</p>
          {co._scenarioDescription && (
            <p className="text-sm text-on-secondary-container mt-1 bg-secondary-container/30 rounded-lg px-3 py-1.5">{co._scenarioDescription}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setChatOpen(true)}
            className="px-4 py-2 text-[11px] uppercase tracking-widest font-semibold bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">chat</span>
              Ask AI
            </span>
          </button>
          <button onClick={finishCompany} className="px-4 py-2 text-[11px] uppercase tracking-widest font-semibold bg-surface-container-low text-on-surface-variant rounded-lg hover:bg-surface-container-high transition-colors">
            Finish
          </button>
        </div>
      </div>

      <TimerBar
        formattedTime={timer.formattedTime}
        progress={timer.progress}
        isExpired={timer.isExpired}
        currentMilestone={timer.currentMilestone}
      />

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <div className={chatOpen ? "space-y-6" : "grid grid-cols-5 gap-6"}>
            {/* Left: Financials */}
            <div className={chatOpen ? "" : "col-span-3"}>
              <div className="bg-surface-container-lowest rounded-xl overflow-hidden ghost-border">
                <div className="flex">
                  {[
                    ["income", "Income Statement"],
                    ["balance", "Balance Sheet"],
                    ["cashflow", "Cash Flow"],
                    ["metrics", "Key Metrics"]
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setStatementView(key)}
                      className={`flex-1 py-2.5 text-[11px] uppercase tracking-widest font-medium transition-colors ${statementView === key ? "bg-surface-container-lowest text-on-surface border-b-2 border-primary" : "text-on-surface-variant bg-surface-container-low hover:text-on-surface"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="p-4">
                  <FinancialTable company={co} view={statementView} />
                </div>
              </div>

              {/* Red/Green Flags */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-surface-container-lowest ghost-border rounded-xl p-4">
                  <h3 className="text-[10px] uppercase tracking-widest text-error font-semibold mb-3">Red Flags</h3>
                  <ul className="space-y-2">
                    {co.redFlags.map((f, i) => (
                      <li key={i} className="text-xs text-on-surface-variant flex gap-2">
                        <span className="material-symbols-outlined text-[14px] text-error shrink-0 mt-0.5">warning</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-surface-container-lowest ghost-border rounded-xl p-4">
                  <h3 className="text-[10px] uppercase tracking-widest text-on-tertiary-container font-semibold mb-3">Positive Signals</h3>
                  <ul className="space-y-2">
                    {co.greenFlags.map((f, i) => (
                      <li key={i} className="text-xs text-on-surface-variant flex gap-2">
                        <span className="material-symbols-outlined text-[14px] text-on-tertiary-container shrink-0 mt-0.5">check_circle</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: Questions */}
            <div className={chatOpen ? "" : "col-span-2"}>
              <h2 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-3">Analysis Questions</h2>
              <div className="space-y-4">
                {shuffledQuestions.map((q, i) => (
                  <QuestionCard key={`${q.id || q.type}-${i}`} question={q} index={i} onScore={handleScore} companyContext={buildCompanyContext(co)} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {chatOpen && (
          <ChatDrawer
            title={co.name}
            subsection={{ id: `practice-${co.id}`, title: co.name, blocks: [] }}
            contextType="practice"
            practiceContext={practiceChatContext}
            messages={chatMessages}
            setMessages={setChatMessages}
            getNoteText={() => ""}
            setNoteText={() => {}}
            completedIds={[]}
            onClose={handleCloseChat}
          />
        )}
      </div>

      {showSummary && (
        <SessionSummary
          company={co}
          questions={sessionQuestions}
          elapsedMinutes={timer.elapsedMinutes}
          onClose={closeSummary}
        />
      )}
    </div>
  );
}
