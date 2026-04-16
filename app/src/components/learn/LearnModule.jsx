import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { LEARN_CONTENT } from "../../data/learnContent";
import useLearnProgress from "../../hooks/useLearnProgress";
import useNotes from "../../hooks/useNotes";
import LearnNav from "./LearnNav";
import LearnSection from "./LearnSection";
import ChatDrawer from "./ChatDrawer";
import ComparisonList from "./ComparisonList";
import ComparisonView from "./ComparisonView";
import ConceptList from "./ConceptList";
import ConceptCard from "./ConceptCard";
import LeverList from "./LeverList";
import LeverCard from "./LeverCard";
import BridgeList from "./BridgeList";
import BridgeCalculator from "./BridgeCalculator";
import PlaybookList from "./PlaybookList";
import PlaybookDetail from "./PlaybookDetail";

export default function LearnModule() {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentSubsection, setCurrentSubsection] = useState(0);
  const { markComplete, isComplete, markVisited, getSubsectionProgress, resetSubsection } = useLearnProgress();
  const { getNoteText, setNoteText } = useNotes();
  const location = useLocation();

  // Chat drawer state (lifted per eng review)
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const isCompareRoute = location.pathname.startsWith("/learn/compare");
  const isCompareDetail = location.pathname.match(/^\/learn\/compare\/[^/]+$/);
  const isConceptRoute = location.pathname.startsWith("/learn/concepts");
  const isConceptDetail = location.pathname.match(/^\/learn\/concepts\/[^/]+$/);
  const isLeverRoute = location.pathname.startsWith("/learn/levers");
  const isLeverDetail = location.pathname.match(/^\/learn\/levers\/[^/]+$/);
  const isBridgeRoute = location.pathname.startsWith("/learn/bridge");
  const isBridgeDetail = location.pathname.match(/^\/learn\/bridge\/[^/]+$/);
  const isPlaybookRoute = location.pathname.startsWith("/learn/playbooks");
  const isPlaybookDetail = location.pathname.match(/^\/learn\/playbooks\/[^/]+$/);

  const sections = LEARN_CONTENT;
  const activeSub = sections[currentSection]?.subsections[currentSubsection];

  // Get completed exercise IDs for current subsection
  const completedIds = activeSub?.blocks
    ?.filter(b => b.type === "exercise" && isComplete(b.id))
    .map(b => b.id) || [];

  useEffect(() => {
    if (activeSub && !isCompareRoute && !isConceptRoute && !isLeverRoute && !isBridgeRoute && !isPlaybookRoute) {
      markVisited(activeSub.id);
    }
  }, [activeSub, markVisited, isCompareRoute, isConceptRoute, isLeverRoute, isBridgeRoute]);

  // Clear chat when navigating to a different subsection
  useEffect(() => {
    setChatOpen(false);
    setChatContext(null);
    setChatMessages([]);
  }, [currentSection, currentSubsection]);

  const handleOpenChat = useCallback((context) => {
    setChatContext(context || null);
    setChatOpen(true);
  }, []);

  const handleCloseChat = useCallback(() => {
    setChatOpen(false);
  }, []);

  const handleNavigate = (si, ssi) => {
    setCurrentSection(si);
    setCurrentSubsection(ssi);
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    const section = sections[currentSection];
    if (currentSubsection < section.subsections.length - 1) {
      handleNavigate(currentSection, currentSubsection + 1);
    } else if (currentSection < sections.length - 1) {
      handleNavigate(currentSection + 1, 0);
    }
  };

  const handlePrev = () => {
    if (currentSubsection > 0) {
      handleNavigate(currentSection, currentSubsection - 1);
    } else if (currentSection > 0) {
      const prevSection = sections[currentSection - 1];
      handleNavigate(currentSection - 1, prevSection.subsections.length - 1);
    }
  };

  const isFirst = currentSection === 0 && currentSubsection === 0;
  const isLast = currentSection === sections.length - 1 &&
    currentSubsection === sections[sections.length - 1].subsections.length - 1;

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">Learn the Fundamentals</h2>
        <p className="text-sm text-on-surface-variant mt-2">PE financial statement analysis, step by step</p>
      </div>

      {/* Two-column layout (three when chat open) */}
      <div className="flex gap-6">
        {/* Section nav -- auto-collapse to icons when chat open on narrow screens */}
        <div className={`shrink-0 ${chatOpen ? "max-xl:w-16 w-64" : "w-64"}`}>
          <div className="sticky top-20 bg-surface-container-lowest ghost-border rounded-xl p-4">
            <LearnNav
              sections={sections}
              currentSection={currentSection}
              currentSubsection={currentSubsection}
              onNavigate={handleNavigate}
              getSubsectionProgress={getSubsectionProgress}
              onResetSubsection={resetSubsection}
              collapsed={chatOpen}
            />
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          <div className="bg-surface-container-lowest ghost-border rounded-xl p-6">
            {isPlaybookDetail ? (
              <PlaybookDetail />
            ) : isPlaybookRoute ? (
              <PlaybookList />
            ) : isBridgeDetail ? (
              <BridgeCalculator />
            ) : isBridgeRoute ? (
              <BridgeList />
            ) : isLeverDetail ? (
              <LeverCard />
            ) : isLeverRoute ? (
              <LeverList />
            ) : isConceptDetail ? (
              <ConceptCard />
            ) : isConceptRoute ? (
              <ConceptList />
            ) : isCompareDetail ? (
              <ComparisonView />
            ) : isCompareRoute ? (
              <ComparisonList />
            ) : (
              <>
                {activeSub && (
                  <LearnSection
                    subsection={activeSub}
                    isComplete={isComplete}
                    onExerciseComplete={markComplete}
                    onOpenChat={handleOpenChat}
                    getNoteText={getNoteText}
                    setNoteText={setNoteText}
                  />
                )}

                {/* Navigation buttons */}
                <div className="flex justify-between mt-8 pt-4 border-t border-outline-variant/30">
                  <button
                    onClick={handlePrev}
                    disabled={isFirst}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${isFirst ? "text-outline-variant cursor-not-allowed" : "text-on-surface-variant hover:bg-surface-container-low"}`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={isLast}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${isLast ? "text-outline-variant cursor-not-allowed" : "bg-primary text-on-primary hover:opacity-90"}`}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chat drawer */}
        {chatOpen && activeSub && (
          <ChatDrawer
            subsection={activeSub}
            chatContext={chatContext}
            messages={chatMessages}
            setMessages={setChatMessages}
            getNoteText={getNoteText}
            setNoteText={setNoteText}
            completedIds={completedIds}
            onClose={handleCloseChat}
          />
        )}
      </div>
    </div>
  );
}
