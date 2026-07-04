import { useCallback, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
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
  session,
  generatedCompanies,
  onGeneratedCompany,
}) {
  // Determine active view from current URL
  const activeView = viewFromPath(window.location.pathname);

  const handleNavigate = useCallback(
    (v) => {
      setView(v);
    },
    [setView],
  );

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
                startPractice={session.startPractice}
                setView={setView}
                generatedCompanies={generatedCompanies}
                onGeneratedCompany={onGeneratedCompany}
              />
            }
          />
          <Route path="progress" element={<ProgressDashboard />} />
          <Route
            path="practice/:companyId"
            element={<PracticeRoute session={session} />}
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
        </Routes>
      </Suspense>
    </AppShell>
  );
}
