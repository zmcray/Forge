import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { COMPANIES } from "../../data/companies";
import { LEARN_CONTENT } from "../../data/learnContent";
import { useScoringState, useScoringDispatch } from "../../contexts/ScoringContext";
import useLearnProgress from "../../hooks/useLearnProgress";

function getRecommendations(sessions, streak, weakSpots, learnProgress) {
  const recs = [];
  const { progress, getSubsectionProgress } = learnProgress;

  // Compute learn state
  const hasLearnProgress = progress.completedExercises.length > 0 || progress.visitedSubsections.length > 0;
  let incompleteSection = null;

  for (const section of LEARN_CONTENT) {
    for (const sub of section.subsections) {
      const prog = getSubsectionProgress(sub);
      if (prog && prog.completed > 0 && prog.completed < prog.total) {
        incompleteSection = { section, sub, progress: prog };
        break;
      }
    }
    if (incompleteSection) break;
  }

  // Compute practice state
  const attemptedCompanyIds = new Set();
  for (const session of sessions) {
    if (session.questions.length > 0) attemptedCompanyIds.add(session.companyId);
  }

  const practicedToday = sessions.some((s) => {
    const today = new Date().toLocaleDateString("en-CA");
    return s.date === today && s.questions.length > 0;
  });

  // Priority 1: Continue Learning
  if (incompleteSection) {
    recs.push({
      id: "continue-learning",
      icon: "menu_book",
      title: "Continue Learning",
      description: `${incompleteSection.sub.title} ... ${incompleteSection.progress.completed}/${incompleteSection.progress.total} exercises done.`,
      ctaLabel: "Continue",
      route: "/learn",
      progress: incompleteSection.progress.total > 0 ? (incompleteSection.progress.completed / incompleteSection.progress.total) * 100 : 0,
    });
  }

  // Priority 2: Next Company
  if (attemptedCompanyIds.size > 0) {
    const sortedByDifficulty = [...COMPANIES].sort((a, b) => a.difficulty - b.difficulty);
    const nextUnattempted = sortedByDifficulty.find((c) => !attemptedCompanyIds.has(c.id));
    if (nextUnattempted) {
      recs.push({
        id: "next-company",
        icon: "trending_up",
        title: "Next Company",
        description: `Try ${nextUnattempted.name}. ${nextUnattempted.industry}.`,
        ctaLabel: "Practice",
        route: `/practice/${nextUnattempted.id}`,
        companyId: nextUnattempted.id,
      });
    } else {
      // All attempted, suggest lowest-scored for retry
      const companyScores = {};
      for (const session of sessions) {
        if (session.questions.length === 0) continue;
        const avg = session.questions.reduce((sum, q) => sum + q.score, 0) / session.questions.length;
        if (!companyScores[session.companyId] || avg < companyScores[session.companyId]) {
          companyScores[session.companyId] = avg;
        }
      }
      const lowestScored = Object.entries(companyScores).sort((a, b) => a[1] - b[1])[0];
      if (lowestScored) {
        const company = COMPANIES.find((c) => c.id === lowestScored[0]);
        if (company) {
          recs.push({
            id: "retry-company",
            icon: "replay",
            title: "Retry Weakest",
            description: `Improve your score on ${company.name}.`,
            ctaLabel: "Practice",
            route: `/practice/${company.id}`,
            companyId: company.id,
          });
        }
      }
    }
  }

  // Priority 3: Start Learning (no learn progress and no practice)
  if (!hasLearnProgress && attemptedCompanyIds.size === 0) {
    recs.push({
      id: "start-learning",
      icon: "school",
      title: "Start Learning",
      description: "Build your foundation first. Interactive exercises on financial statements and screening metrics.",
      ctaLabel: "Begin Section 1",
      route: "/learn",
    });
  }

  // Priority 4: Keep Your Streak
  if (streak.current > 0 && !practicedToday) {
    const sortedByDifficulty = [...COMPANIES].sort((a, b) => a.difficulty - b.difficulty);
    const suggestedCompany = sortedByDifficulty.find((c) => !attemptedCompanyIds.has(c.id)) || sortedByDifficulty[0];
    recs.push({
      id: "keep-streak",
      icon: "local_fire_department",
      title: "Keep Your Streak",
      description: `${streak.current}-day streak! Don't break it.`,
      ctaLabel: "Quick Practice",
      route: `/practice/${suggestedCompany.id}`,
      companyId: suggestedCompany.id,
    });
  }

  // Priority 5: Work on Weak Spots
  if (weakSpots && weakSpots.length > 0) {
    const weakest = weakSpots[0];
    const companyWithType = COMPANIES.find((c) =>
      c.questions.some((q) => q.type === weakest.type),
    );
    if (companyWithType) {
      recs.push({
        id: "weak-spots",
        icon: "target",
        title: "Work on Weak Spots",
        description: `Your ${weakest.type} answers average ${weakest.avg.toFixed(1)}/5. Practice with ${companyWithType.name}.`,
        ctaLabel: `Practice ${weakest.type}`,
        route: `/practice/${companyWithType.id}`,
        companyId: companyWithType.id,
      });
    }
  }

  // Priority 6: Try Quick Screen
  if (attemptedCompanyIds.size >= 3) {
    const hasQuickScreenSession = sessions.some((s) => s.companyId === "quickfire");
    if (!hasQuickScreenSession) {
      recs.push({
        id: "try-quickfire",
        icon: "bolt",
        title: "Try Quick Screen",
        description: "Ready to test your screening instincts? 60-second go/no-go decisions.",
        ctaLabel: "Start Quick Screen",
        route: "/quickfire",
      });
    }
  }

  return recs.slice(0, 3);
}

export default function SmartHomeRecommendations({ startPracticeById }) {
  const { sessions, streak } = useScoringState();
  const { getWeakSpots } = useScoringDispatch();
  const learnProgress = useLearnProgress();
  const navigate = useNavigate();

  const weakSpots = getWeakSpots();
  const recommendations = useMemo(
    () => getRecommendations(sessions, streak, weakSpots, learnProgress),
    [sessions, streak, weakSpots, learnProgress],
  );

  if (recommendations.length === 0) return null;

  return (
    <section className="mb-8">
      <h3 className="text-sm uppercase tracking-widest text-on-surface-variant font-semibold mb-4">
        Recommended Next
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <button
            key={rec.id}
            onClick={() => {
              if (rec.companyId && startPracticeById) {
                startPracticeById(rec.companyId);
              } else {
                navigate(rec.route);
              }
            }}
            className="bg-surface-container-lowest rounded-xl p-5 text-left ghost-border hover:shadow-md transition-all duration-200 group border-b-2 border-transparent hover:border-primary"
          >
            <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[20px] text-on-secondary-container">
                {rec.icon}
              </span>
            </div>
            <h4 className="text-base font-bold font-headline text-on-surface mb-1">
              {rec.title}
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              {rec.description}
            </p>
            {rec.progress != null && (
              <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(rec.progress, 100)}%` }}
                />
              </div>
            )}
            <span className="flex items-center gap-1 text-[11px] uppercase tracking-widest font-semibold text-on-surface-variant group-hover:text-primary transition-colors">
              {rec.ctaLabel}
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export { getRecommendations };
