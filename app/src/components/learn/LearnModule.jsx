import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { LEARN_CONTENT } from "../../data/learnContent";
import useLearnProgress from "../../hooks/useLearnProgress";
import useNotes from "../../hooks/useNotes";
import LearnHub from "./LearnHub";
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
  const [showHub, setShowHub] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentSubsection, setCurrentSubsection] = useState(0);
  const learnProgress = useLearnProgress();
  const { markComplete, isComplete, markVisited, getSubsectionProgress, resetSubsection } = learnProgress;
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

  // Show sub-module routes directly (not hub)
  const isSubRoute = isCompareRoute || isConceptRoute || isLeverRoute || isBridgeRoute || isPlaybookRoute;

  const sections = LEARN_CONTENT;
  const activeSub = sections[currentSection]?.subsections[currentSubsection];

  // Get completed exercise IDs for current subsection
  const completedIds = activeSub?.blocks
    ?.filter(b => b.type === "exercise" && isComplete(b.id))
    .map(b => b.id) || [];

  useEffect(() => {
    if (activeSub && !showHub && !isSubRoute) {
      markVisited(activeSub.id);
    }
  }, [activeSub, markVisited, showHub, isSubRoute]);

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

  const handleStartLesson = useCallback((sectionIdx, subsectionIdx) => {
    setCurrentSection(sectionIdx);
    setCurrentSubsection(subsectionIdx);
    setShowHub(false);
    window.scrollTo(0, 0);
  }, []);

  const handleBackToHub = useCallback(() => {
    setShowHub(true);
    setChatOpen(false);
    window.scrollTo(0, 0);
  }, []);

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

  // Compute flat step index for nav header
  let flatIdx = 0;
  for (let si = 0; si < currentSection; si++) {
    flatIdx += sections[si].subsections.length;
  }
  flatIdx += currentSubsection;
  const totalSteps = learnProgress.allSteps.length;

  // Sub-module routes render directly (concepts, levers, bridge, compare)
  if (isSubRoute) {
    return (
      <div>
        <div className="bg-surface-container-lowest ghost-border rounded-xl p-6">
          {isPlaybookDetail ? <PlaybookDetail />
            : isPlaybookRoute ? <PlaybookList />
            : isBridgeDetail ? <BridgeCalculator />
            : isBridgeRoute ? <BridgeList />
            : isLeverDetail ? <LeverCard />
            : isLeverRoute ? <LeverList />
            : isConceptDetail ? <ConceptCard />
            : isConceptRoute ? <ConceptList />
            : isCompareDetail ? <ComparisonView />
            : <ComparisonList />}
        </div>
      </div>
    );
  }

  // Hub view (default)
  if (showHub) {
    return <LearnHub learnProgress={learnProgress} onStartLesson={handleStartLesson} />;
  }

  // Lesson content view
  return (
    <div>
      {/* Compact lesson nav header */}
      <LearnNav
        currentStep={activeSub}
        stepIndex={flatIdx}
        totalSteps={totalSteps}
        isFirst={isFirst}
        isLast={isLast}
        onBack={handleBackToHub}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {/* Content + chat layout */}
      <div className={`flex gap-6 ${chatOpen ? "" : ""}`}>
        <div className="flex-1 min-w-0">
          <div className="bg-surface-container-lowest ghost-border rounded-xl p-6">
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
                onClick={isLast ? handleBackToHub : handleNext}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-on-primary hover:opacity-90 transition-colors"
              >
                {isLast ? "Back to Overview" : "Next"}
              </button>
            </div>
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
