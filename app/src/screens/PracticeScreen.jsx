import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { buildPracticeChatContext } from "../utils/chatPrompts";
import { buildCompanyContext } from "../utils/buildCompanyContext";
import FinancialTable from "../components/FinancialTable";
import QuestionCard from "../components/QuestionCard";
import TimerBar from "../components/TimerBar";
import SessionSummary from "../components/SessionSummary";
import SoftGate from "../components/onboarding/SoftGate";
import GeneratedWarningsBanner from "../components/GeneratedWarningsBanner";
import ChatDrawer from "../components/learn/ChatDrawer";
import useLearnProgress from "../hooks/useLearnProgress";

export default function PracticeScreen({ session }) {
  const {
    selectedCompany: co,
    statementView,
    setStatementView,
    shuffledQuestions,
    handleScore,
    finishCompany,
    timer,
    showSummary,
    sessionQuestions,
    closeSummary,
  } = session;
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

      {/* AI-generated companies can ship with flagged inconsistencies; surface them */}
      {co._generated && (
        <GeneratedWarningsBanner key={co.id} warnings={co._warnings} />
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
