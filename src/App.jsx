import { useState, useCallback, useMemo, useEffect } from "react";
import { Routes, Route, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { COMPANIES } from "./data/companies";
import { SCENARIOS } from "./data/scenarios";
import { shuffleArray } from "./utils/format";
import { mergeScenario } from "./utils/scenarios";
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
import { useScoringState, useScoringDispatch } from "./contexts/ScoringContext";
import useTimer from "./hooks/useTimer";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";
import useLearnProgress from "./hooks/useLearnProgress";
import useTheme from "./hooks/useTheme";
import { LEARN_CONTENT } from "./data/learnContent";

function viewFromPath(pathname) {
  if (pathname.startsWith("/practice")) return "practice";
  if (pathname.startsWith("/progress")) return "progress";
  if (pathname.startsWith("/learn")) return "learn";
  if (pathname.startsWith("/quickfire")) return "quickfire";
  return "home";
}

export default function App() {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [statementView, setStatementView] = useState("income");
  const [showSummary, setShowSummary] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  const { sessions, streak } = useScoringState();
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

  const scenariosByCompany = useMemo(() => {
    const map = {};
    for (const s of SCENARIOS) {
      if (!map[s.companyId]) map[s.companyId] = [];
      map[s.companyId].push(s);
    }
    return map;
  }, []);

  const masteryLevel = useMemo(() => {
    if (totalQuestions >= 200) return "Senior Analyst";
    if (totalQuestions >= 100) return "Analyst";
    if (totalQuestions >= 50) return "Associate";
    if (totalQuestions >= 20) return "Junior";
    return "Beginner";
  }, [totalQuestions]);

  const handleScore = useCallback((type, score, meta) => {
    if (!selectedCompany) return;
    addScore({
      companyId: selectedCompany._scenarioId || selectedCompany.id,
      questionType: type,
      score,
      delta: meta?.delta ?? null,
      unit: meta?.unit ?? null,
      timestamp: Date.now(),
    });
    setSessionQuestions(prev => [...prev, { type, score, delta: meta?.delta ?? null, unit: meta?.unit ?? null }]);
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
    setStatementView("income");
    const url = scenarioId ? `/practice/${company.id}?scenario=${scenarioId}` : `/practice/${company.id}`;
    navigate(url);
  }, [timer, navigate]);

  const finishCompany = useCallback(() => {
    timer.stop();
    if (selectedCompany) {
      updateSessionDuration(
        selectedCompany._scenarioId || selectedCompany.id,
        timer.elapsedMinutes
      );
      if (sessionQuestions.length > 0) {
        setShowSummary(true);
        return;
      }
    }
    navigate("/");
    setSelectedCompany(null);
  }, [selectedCompany, timer, updateSessionDuration, sessionQuestions, navigate]);

  const closeSummary = useCallback(() => {
    setShowSummary(false);
    navigate("/");
    setSelectedCompany(null);
  }, [navigate]);

  const handleSearchCompany = useCallback((companyId) => {
    const company = COMPANIES.find(c => c.id === companyId);
    if (company) startPractice(company);
  }, [startPractice]);

  const handleSearchLearn = useCallback((sectionIndex, subIndex) => {
    navigate("/learn");
  }, [navigate]);

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
            streak={streak}
            totalQuestions={totalQuestions}
            masteryLevel={masteryLevel}
            completedCompanies={completedCompanies}
            scenariosByCompany={scenariosByCompany}
            startPractice={startPractice}
            learnProgress={learnProgress}
            selectedCompany={selectedCompany}
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
  const navigate = useNavigate();
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
            completedCompanies={props.completedCompanies}
            scenariosByCompany={props.scenariosByCompany}
            startPractice={props.startPractice}
            setView={setView}
            learnProgress={props.learnProgress}
          />
        } />
        <Route path="progress" element={
          <ProgressDashboard />
        } />
        <Route path="practice/:companyId" element={
          props.selectedCompany ? (
            <PracticeScreen
              company={props.selectedCompany}
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
          ) : <PracticeRedirect />
        } />
        <Route path="learn" element={<LearnModule />} />
        <Route path="quickfire" element={<QuickFireScreen />} />
      </Routes>
    </AppShell>
  );
}

function PracticeRedirect() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/", { replace: true }); }, [navigate]);
  return null;
}

function getOverallLearnProgress(getSubsectionProgress) {
  let completed = 0;
  let total = 0;
  for (const section of LEARN_CONTENT) {
    for (const sub of section.subsections) {
      const prog = getSubsectionProgress(sub);
      if (prog) {
        completed += prog.completed;
        total += prog.total;
      }
    }
  }
  return { completed, total };
}

function HomeScreen({ completedCompanies, scenariosByCompany, startPractice, setView, learnProgress }) {
  const { sessions, streak } = useScoringState();
  const { getWeakSpots, getQuantitativeAccuracy } = useScoringDispatch();

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
  const learnStats = getOverallLearnProgress(learnProgress.getSubsectionProgress);

  return (
    <>
      {/* Page header */}
      <section className="mb-8">
        <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">PE Financial Analyst</h2>
        <p className="text-sm text-on-surface-variant mt-2 max-w-xl">
          Practice analyzing lower-middle-market companies through a PE lens. Review financials, commit your analysis, and track progress.
        </p>
        <button
          onClick={() => setView("progress")}
          className="mt-4 px-5 py-2.5 rounded-lg text-sm font-semibold text-on-primary bg-gradient-to-r from-primary to-primary-container hover:opacity-90 transition-opacity"
        >
          Check Progress
        </button>
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

      {/* Learning modules */}
      <section className="grid grid-cols-2 gap-4 mb-8">
        <ModuleCard
          icon="menu_book"
          title="Learn the Fundamentals"
          description="Financial statements, screening metrics, and due diligence frameworks for PE analysis."
          badges={[`${learnStats.completed}/${learnStats.total} Exercises`, "Interactive"]}
          ctaLabel={learnStats.completed > 0 ? "Continue Learning" : "Start Learning"}
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

      {/* Deep dive case studies */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm uppercase tracking-widest text-on-surface-variant font-semibold">Deep Dive Case Studies</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {COMPANIES.map(company => (
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
      </section>
    </>
  );
}

function PracticeScreen({ company: co, statementView, setStatementView, shuffledQuestions, handleScore, finishCompany, timer, showSummary, sessionQuestions, closeSummary }) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
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
        <button onClick={finishCompany} className="px-4 py-2 text-[11px] uppercase tracking-widest font-semibold bg-surface-container-low text-on-surface-variant rounded-lg hover:bg-surface-container-high transition-colors">
          Finish
        </button>
      </div>

      <TimerBar
        formattedTime={timer.formattedTime}
        progress={timer.progress}
        isExpired={timer.isExpired}
        currentMilestone={timer.currentMilestone}
      />

      <div className="grid grid-cols-5 gap-6">
        {/* Left: Financials */}
        <div className="col-span-3">
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
        <div className="col-span-2">
          <h2 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-3">Analysis Questions</h2>
          <div className="space-y-4">
            {shuffledQuestions.map((q, i) => (
              <QuestionCard key={`${q.type}-${i}`} question={q} index={i} onScore={handleScore} />
            ))}
          </div>
        </div>
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
