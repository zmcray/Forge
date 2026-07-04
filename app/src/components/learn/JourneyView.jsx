import { useMemo } from "react";
import ProgressRing from "./ProgressRing";

export default function JourneyView({
  allSteps,
  currentStepId,
  getStepStatus,
  getSubsectionProgress,
  overallStats,
  pct,
  onStartLesson,
  onNavigate,
}) {
  // Group steps by section
  const sectionGroups = useMemo(() => {
    const groups = [];
    let currentTitle = null;
    let currentGroup = null;
    for (const step of allSteps) {
      if (step._sectionTitle !== currentTitle) {
        currentTitle = step._sectionTitle;
        currentGroup = { title: currentTitle, steps: [] };
        groups.push(currentGroup);
      }
      currentGroup.steps.push(step);
    }
    return groups;
  }, [allSteps]);

  return (
    <>
      {/* Journey header */}
      <div className="flex items-center gap-4 mb-7">
        <ProgressRing size={56} pct={pct} strokeWidth={4} fontSize={16} />
        <div>
          <div className="text-lg font-bold font-headline text-on-surface">
            Your Journey
          </div>
          <div className="text-sm text-outline-variant">
            {overallStats.completedSteps} of {overallStats.totalSteps} steps complete ...
            ~{overallStats.remainingTime} min remaining
          </div>
        </div>
      </div>

      {/* Vertical path grouped by section */}
      {sectionGroups.map((group, gi) => (
        <div key={gi} className="mb-6">
          <h4 className="text-[10px] uppercase tracking-widest text-outline-variant font-semibold mb-3 pl-1">
            {group.title}
          </h4>
          <div className="relative pl-7">
            {/* Vertical line */}
            <div className="absolute left-[13px] top-0 bottom-0 w-0.5 bg-outline-variant/20" />

            {group.steps.map((step) => {
              const status = getStepStatus(step);
              const isCurrent = step.id === currentStepId;
              const progress = getSubsectionProgress(step);

              return (
                <div key={step.id} className="relative mb-1.5">
                  {/* Dot */}
                  <div
                    className={`absolute -left-[21px] top-3 w-3.5 h-3.5 rounded-full border-2 z-10 ${
                      status === "completed"
                        ? "bg-on-tertiary-container border-on-tertiary-container"
                        : isCurrent
                          ? "bg-primary border-primary shadow-[0_0_8px_rgba(var(--primary-rgb,160,196,255),0.4)]"
                          : "bg-surface-container-low border-outline-variant/30 opacity-30"
                    }`}
                  />

                  {/* Card */}
                  <div
                    className={`rounded-[10px] px-4 py-2.5 transition-colors ${
                      isCurrent ? "bg-primary/8" : status === "locked" ? "opacity-40" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`text-sm font-medium ${status === "completed" ? "text-on-surface-variant/60" : "text-on-surface"}`}
                      >
                        {status === "completed" && (
                          <span className="text-on-tertiary-container mr-1.5">
                            &#10003;
                          </span>
                        )}
                        {step.title}
                      </div>
                      {progress && status === "completed" && (
                        <span className="text-xs font-semibold text-on-tertiary-container flex items-center gap-1">
                          <span
                            className="material-symbols-outlined text-[14px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                          {progress.completed}/{progress.total}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-outline-variant">
                      <span className="material-symbols-outlined text-[13px]">timer</span>
                      {status === "completed"
                        ? `${step.timeEstimate || 8}m`
                        : `~${step.timeEstimate || 8}m`}
                      {isCurrent && (
                        <span className="text-primary font-medium">In progress</span>
                      )}
                    </div>

                    {/* Skill tags and CTA on active node */}
                    {isCurrent && (
                      <>
                        {step.skillTags && (
                          <div className="flex gap-1.5 flex-wrap mt-2">
                            {step.skillTags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() =>
                            onStartLesson(step._sectionIndex, step._subsectionIndex)
                          }
                          className="inline-flex items-center gap-1.5 mt-2.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary/15 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            play_arrow
                          </span>
                          Continue
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Reference modules */}
      <div className="mt-4 pt-4 border-t border-outline-variant/20">
        <h4 className="text-[10px] uppercase tracking-widest text-outline-variant font-semibold mb-3 pl-1">
          Reference & Practice Modules
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              path: "/learn/concepts",
              icon: "lightbulb",
              label: "Key Concepts",
              desc: "Deep-dive concept cards",
            },
            {
              path: "/learn/compare",
              icon: "compare_arrows",
              label: "Cross-Industry Compare",
              desc: "Compare companies side by side",
            },
            {
              path: "/learn/levers",
              icon: "account_tree",
              label: "Value Creation Levers",
              desc: "Revenue, margin, multiple, debt",
            },
            {
              path: "/learn/bridge",
              icon: "stacked_bar_chart",
              label: "Bridge Calculator",
              desc: "Model value creation waterfalls",
            },
            {
              path: "/learn/playbooks",
              icon: "assignment",
              label: "Playbooks",
              desc: "Operating playbooks and frameworks",
            },
          ].map((m) => (
            <button
              key={m.path}
              onClick={() => onNavigate(m.path)}
              className="flex items-center gap-3 bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-left hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-primary">
                {m.icon}
              </span>
              <div>
                <div className="text-sm font-medium text-on-surface">{m.label}</div>
                <div className="text-[11px] text-outline-variant">{m.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
