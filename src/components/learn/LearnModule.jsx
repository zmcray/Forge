import { useState, useEffect } from "react";
import { LEARN_CONTENT } from "../../data/learnContent";
import useLearnProgress from "../../hooks/useLearnProgress";
import LearnNav from "./LearnNav";
import LearnSection from "./LearnSection";

export default function LearnModule({ onBack }) {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentSubsection, setCurrentSubsection] = useState(0);
  const { markComplete, isComplete, markVisited, getSubsectionProgress } = useLearnProgress();

  const sections = LEARN_CONTENT;
  const activeSub = sections[currentSection]?.subsections[currentSubsection];

  useEffect(() => {
    if (activeSub) {
      markVisited(activeSub.id);
    }
  }, [activeSub, markVisited]);

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Learn the Fundamentals</h1>
            <p className="text-sm text-gray-600 mt-1">PE financial statement analysis, step by step</p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {"\u2190"} Back to Home
          </button>
        </div>

        {/* Two-column layout */}
        <div className="flex gap-6">
          {/* Sidebar nav */}
          <div className="w-64 shrink-0">
            <div className="sticky top-6 bg-white border border-gray-200 rounded-xl p-4">
              <LearnNav
                sections={sections}
                currentSection={currentSection}
                currentSubsection={currentSubsection}
                onNavigate={handleNavigate}
                getSubsectionProgress={getSubsectionProgress}
              />
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              {activeSub && (
                <LearnSection
                  subsection={activeSub}
                  isComplete={isComplete}
                  onExerciseComplete={markComplete}
                />
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={handlePrev}
                  disabled={isFirst}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${isFirst ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  {"\u2190"} Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={isLast}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${isLast ? "text-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                >
                  Next {"\u2192"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
