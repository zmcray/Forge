import { useMemo, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { COMPANIES } from "../data/companies";
import { SCENARIOS } from "../data/scenarios";
import usePracticeSession from "../hooks/usePracticeSession";
import PracticeScreen from "./PracticeScreen";

// Owns the practice session (timer included) so ticks re-render only this
// subtree and the interval dies with the route. Syncs the URL (companyId +
// optional ?scenario=) with the session, starting one on deep links and
// bouncing invalid IDs back home.
export default function PracticeRoute({ generatedCompanies = [] }) {
  const session = usePracticeSession();
  const { selectedCompany, startPractice } = session;
  const { companyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const scenarioId = searchParams.get("scenario");
  const activePracticeId = selectedCompany?._scenarioId || selectedCompany?.id;
  const targetPracticeId = scenarioId || companyId;

  useEffect(() => {
    if (!companyId || activePracticeId === targetPracticeId) return;

    const company =
      COMPANIES.find(c => c.id === companyId) ||
      generatedCompanies.find(c => c.id === companyId);
    if (!company) {
      navigate("/", { replace: true });
      return;
    }

    if (scenarioId && !SCENARIOS.some(s => s.id === scenarioId && s.companyId === company.id)) {
      navigate(`/practice/${company.id}`, { replace: true });
      return;
    }

    startPractice(company, scenarioId || undefined);
  }, [activePracticeId, companyId, generatedCompanies, navigate, scenarioId, startPractice, targetPracticeId]);

  if (!selectedCompany || activePracticeId !== targetPracticeId) return null;

  return <PracticeScreen session={session} />;
}
