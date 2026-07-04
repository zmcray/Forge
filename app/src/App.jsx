import { useState, useCallback, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { COMPANIES } from "./data/companies";
import SearchModal from "./components/SearchModal";
import AppShellWrapper from "./components/AppShellWrapper";
import usePracticeSession from "./hooks/usePracticeSession";
import useTheme from "./hooks/useTheme";

export default function App() {
  const navigate = useNavigate();
  const session = usePracticeSession();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  // Lives here (not HomeScreen) so generated companies survive navigation.
  const [generatedCompanies, setGeneratedCompanies] = useState([]);

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

  const { startPractice } = session;

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
            theme={theme}
            toggleTheme={toggleTheme}
            onSearchOpen={() => setSearchOpen(true)}
            session={session}
            generatedCompanies={generatedCompanies}
            onGeneratedCompany={handleGeneratedCompany}
          />
        } />
      </Routes>
    </>
  );
}
