import { useCallback, lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AppShell from "./AppShell";
import ProgressDashboard from "./ProgressDashboard";
import RouteLoader from "./RouteLoader";
import HomeScreen from "../screens/HomeScreen";
import PracticeRoute from "../screens/PracticeRoute";

// Route-level code splitting: the Learn tree carries ~300 kB of content data
// plus react-markdown, and QuickFire is a standalone mode. Lazy boundaries
// here keep them out of the entry chunk.
const LearnModule = lazy(() => import("./learn/LearnModule"));
const QuickFireScreen = lazy(() => import("./QuickFireScreen"));
// ReviewScreen resolves atoms against the full learn data surface, so it
// stays lazy like the Learn tree.
const ReviewScreen = lazy(() => import("./ReviewScreen"));

function viewFromPath(pathname) {
  if (pathname.startsWith("/practice")) return "practice";
  if (pathname.startsWith("/progress")) return "progress";
  if (pathname.startsWith("/learn")) return "learn";
  if (pathname.startsWith("/quickfire")) return "quickfire";
  return "home";
}

export default function AppShellWrapper({
  setView,
  theme,
  toggleTheme,
  onSearchOpen,
  generatedCompanies,
  onGeneratedCompany,
}) {
  const navigate = useNavigate();
  // Determine active view from current URL
  const activeView = viewFromPath(window.location.pathname);

  const handleNavigate = useCallback(
    (v) => {
      setView(v);
    },
    [setView],
  );

  // Starting practice is just navigation; PracticeRoute owns the session so
  // the timer mounts (and its interval dies) with the practice route.
  const startPractice = useCallback((company, scenarioId) => {
    navigate(scenarioId ? `/practice/${company.id}?scenario=${scenarioId}` : `/practice/${company.id}`);
  }, [navigate]);

  return (
    <AppShell
      activeView={activeView}
      onNavigate={handleNavigate}
      theme={theme}
      onToggleTheme={toggleTheme}
      onSearchOpen={onSearchOpen}
    >
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route
            index
            element={
              <HomeScreen
                startPractice={startPractice}
                setView={setView}
                generatedCompanies={generatedCompanies}
                onGeneratedCompany={onGeneratedCompany}
              />
            }
          />
          <Route path="progress" element={<ProgressDashboard />} />
          <Route
            path="practice/:companyId"
            element={<PracticeRoute generatedCompanies={generatedCompanies} />}
          />
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
          <Route path="review" element={<ReviewScreen />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
