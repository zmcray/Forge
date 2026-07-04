import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { COMPANIES } from "./data/companies";
import AppShellWrapper from "./components/AppShellWrapper";

// Loaded on first Cmd+K / search click, not eagerly: the modal indexes learn
// content and is invisible until invoked.
const SearchModal = lazy(() => import("./components/SearchModal"));
import useTheme from "./hooks/useTheme";

export default function App() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  // Mounts the lazy SearchModal chunk on first open; stays mounted after.
  const [searchMounted, setSearchMounted] = useState(false);
  // Lives here (not HomeScreen) so generated companies survive navigation.
  const [generatedCompanies, setGeneratedCompanies] = useState([]);

  // Cmd+K global shortcut
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchMounted(true);
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const setView = useCallback(
    (v) => {
      const routes = {
        home: "/",
        practice: "/practice",
        progress: "/progress",
        learn: "/learn",
        quickfire: "/quickfire",
      };
      navigate(routes[v] || "/");
    },
    [navigate],
  );

  // Navigation only; PracticeRoute owns the session (timer + questions), so
  // ticks re-render just the practice subtree and stop when the route unmounts.
  const handleSearchCompany = useCallback((companyId) => {
    const company = COMPANIES.find(c => c.id === companyId);
    if (company) navigate(`/practice/${company.id}`);
  }, [navigate]);

  const handleSearchLearn = useCallback(() => {
    navigate("/learn");
  }, [navigate]);

  const handleGeneratedCompany = useCallback((company) => {
    setGeneratedCompanies((prev) => [
      company,
      ...prev.filter((c) => c.id !== company.id),
    ]);
  }, []);

  return (
    <>
      {searchMounted && (
        <Suspense fallback={null}>
          <SearchModal
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
            onNavigateCompany={handleSearchCompany}
            onNavigateLearn={handleSearchLearn}
            onNavigateView={setView}
          />
        </Suspense>
      )}
      <Routes>
        <Route
          path="/*"
          element={
            <AppShellWrapper
              setView={setView}
              theme={theme}
              toggleTheme={toggleTheme}
              onSearchOpen={() => {
                setSearchMounted(true);
                setSearchOpen(true);
              }}
              generatedCompanies={generatedCompanies}
              onGeneratedCompany={handleGeneratedCompany}
            />
          }
        />
      </Routes>
    </>
  );
}
