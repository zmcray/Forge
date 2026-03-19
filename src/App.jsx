import { useState, useCallback, useMemo } from "react";
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
import StreakBadge from "./components/StreakBadge";
import WeakSpotCard from "./components/WeakSpotCard";
import SessionSummary from "./components/SessionSummary";
import QuickFireScreen from "./components/QuickFireScreen";
import useScoring from "./hooks/useScoring";
import useTimer from "./hooks/useTimer";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";

export default function App() {
  const [view, setView] = useState("home"); // home, practice, progress, learn, quickfire
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [statementView, setStatementView] = useState("income");
  const [showSummary, setShowSummary] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  const scoring = useScoring();
  const timer = useTimer(15);

  useKeyboardShortcuts({
    enabled: view === "practice",
    onBack: () => finishCompany(),
  });

  const completedCompanies = useMemo(() => {
    const ids = new Set();
    for (const session of scoring.sessions) {
      if (session.questions.length > 0) ids.add(session.companyId);
    }
    return ids;
  }, [scoring.sessions]);

  const totalQuestions = useMemo(() => {
    return scoring.sessions.reduce((sum, s) => sum + s.questions.length, 0);
  }, [scoring.sessions]);

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
    scoring.addScore({
      companyId: selectedCompany._scenarioId || selectedCompany.id,
      questionType: type,
      score,
      delta: meta?.delta ?? null,
      unit: meta?.unit ?? null,
      timestamp: Date.now(),
    });
    setSessionQuestions(prev => [...prev, { type, score, delta: meta?.delta ?? null, unit: meta?.unit ?? null }]);
  }, [selectedCompany, scoring]);

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
    setView("practice");
    setStatementView("income");
  }, [timer]);

  const finishCompany = useCallback(() => {
    timer.stop();
    if (selectedCompany) {
      scoring.updateSessionDuration(
        selectedCompany._scenarioId || selectedCompany.id,
        timer.elapsedMinutes
      );
      if (sessionQuestions.length > 0) {
        setShowSummary(true);
        return;
      }
    }
    setView("home");
    setSelectedCompany(null);
  }, [selectedCompany, timer, scoring, sessionQuestions]);

  const closeSummary = useCallback(() => {
    setShowSummary(false);
    setView("home");
    setSelectedCompany(null);
  }, []);

  // Home screen
  if (view === "home") {
    const weakSpots = scoring.getWeakSpots();
    const quantitativeAccuracy = scoring.getQuantitativeAccuracy();

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-900">PE Financial Analyst</h1>
              <button
                onClick={() => setView("progress")}
                className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <span>{"\u{1F4C8}"}</span> Progress
              </button>
            </div>
            <p className="text-gray-600">Practice analyzing lower-middle-market companies through a PE lens. Pick a company, review the financials, and work through the analysis questions.</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <StreakBadge streak={scoring.streak} totalQuestions={totalQuestions} />
            <WeakSpotCard weakSpots={weakSpots} quantitativeAccuracy={quantitativeAccuracy} />
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setView("learn")}
              className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-left hover:bg-indigo-100 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-indigo-900">Learn the Fundamentals</p>
                  <p className="text-sm text-indigo-700 mt-0.5">Financial statements, screening metrics, and due diligence</p>
                </div>
                <span className="text-indigo-400 group-hover:text-indigo-600 text-lg">{"\u2192"}</span>
              </div>
            </button>
            <button
              onClick={() => setView("quickfire")}
              className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left hover:bg-amber-100 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-amber-900">Quick Screen</p>
                  <p className="text-sm text-amber-700 mt-0.5">60-second go/no-go decisions on shuffled companies</p>
                </div>
                <span className="text-amber-400 group-hover:text-amber-600 text-lg">{"\u2192"}</span>
              </div>
            </button>
          </div>

          {/* Company cards */}
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Deep Dive Practice</h2>
          <div className="grid gap-4">
            {COMPANIES.map(company => (
              <div key={company.id}>
                <CompanyCard
                  company={company}
                  completed={completedCompanies.has(company.id)}
                  onSelect={() => startPractice(company)}
                />
                {scenariosByCompany[company.id] && (
                  <div className="ml-6 mt-2 flex gap-2 flex-wrap">
                    {scenariosByCompany[company.id].map(scenario => (
                      <button
                        key={scenario.id}
                        onClick={() => startPractice(company, scenario.id)}
                        className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full hover:bg-purple-100 transition-colors"
                      >
                        Scenario: {scenario.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
            <p className="font-semibold mb-1">How to use this tool:</p>
            <p>Select a company, review the financial statements (income statement, balance sheet, cash flow), then work through each analysis question. Write your answer first, then reveal the model answer and score yourself honestly. Track your progress across question types to see where you're strongest and where to focus.</p>
          </div>

          <p className="text-xs text-gray-400 mt-4 text-center">Keyboard shortcuts: 1-5 to score, Enter to reveal, Esc to go back</p>
        </div>
      </div>
    );
  }

  // Quick Fire screen
  if (view === "quickfire") {
    return <QuickFireScreen onBack={() => setView("home")} />;
  }

  // Progress screen
  if (view === "progress") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
            <button onClick={() => setView("home")} className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              {"\u2190"} Back
            </button>
          </div>
          <ProgressDashboard
            scores={scoring.getScoresByType()}
            streak={scoring.streak}
            quantitativeAccuracy={scoring.getQuantitativeAccuracy()}
          />
        </div>
      </div>
    );
  }

  // Learn screen
  if (view === "learn") {
    return <LearnModule onBack={() => setView("home")} />;
  }

  // Practice screen
  if (view === "practice" && selectedCompany) {
    const co = selectedCompany;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900">{co.name}</h1>
                <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">{co.industry}</span>
                {co._scenarioName && (
                  <span className="text-sm text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded">
                    Scenario: {co._scenarioName}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{co.context}</p>
              {co._scenarioDescription && (
                <p className="text-sm text-purple-700 mt-1 bg-purple-50 rounded px-2 py-1">{co._scenarioDescription}</p>
              )}
            </div>
            <button onClick={finishCompany} className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex border-b border-gray-200">
                  {[
                    ["income", "Income Statement"],
                    ["balance", "Balance Sheet"],
                    ["cashflow", "Cash Flow"],
                    ["metrics", "Key Metrics"]
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setStatementView(key)}
                      className={`flex-1 py-2.5 text-sm font-medium transition-colors ${statementView === key ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
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
                <div className="bg-white border border-red-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-red-800 mb-2">Red Flags to Investigate</h3>
                  <ul className="space-y-1.5">
                    {co.redFlags.map((f, i) => (
                      <li key={i} className="text-xs text-red-700 flex gap-1.5">
                        <span className="shrink-0 mt-0.5">{"\u26A0"}</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border border-green-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-green-800 mb-2">Positive Signals</h3>
                  <ul className="space-y-1.5">
                    {co.greenFlags.map((f, i) => (
                      <li key={i} className="text-xs text-green-700 flex gap-1.5">
                        <span className="shrink-0 mt-0.5">{"\u2713"}</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: Questions */}
            <div className="col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Analysis Questions</h2>
              <div className="space-y-4">
                {shuffledQuestions.map((q, i) => (
                  <QuestionCard key={`${q.type}-${i}`} question={q} index={i} onScore={handleScore} />
                ))}
              </div>
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

  return null;
}
