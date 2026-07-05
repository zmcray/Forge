import { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useReviewQueue from "../hooks/useReviewQueue";
import { useScoringDispatch } from "../contexts/ScoringContext";
import { resolveAtom } from "../utils/resolveAtom";
import { buildCompanyContext } from "../utils/buildCompanyContext";
import QuestionCard from "./QuestionCard";

// Again/Good/Easy self-marks map onto the 1-5 score scale so review outcomes
// flow through the exact same addScore -> watermark -> SRS path as practice.
const SELF_MARKS = [
  { label: "Again", score: 2, classes: "bg-error-container text-on-error-container" },
  { label: "Good", score: 4, classes: "bg-primary-container text-on-primary-container" },
  { label: "Easy", score: 5, classes: "bg-tertiary-container text-on-tertiary-container" },
];

function SelfMarkCard({ atom, resolved, onMark }) {
  return (
    <div className="bg-surface-container-lowest ghost-border rounded-2xl p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-2">
        {resolved.kind}
      </p>
      <h3 className="text-lg font-bold text-on-surface mb-3">{resolved.title}</h3>
      <p className="text-sm text-on-surface-variant mb-4">
        Recall what you know, then revisit the material if you need it.{" "}
        <Link to={resolved.link} className="text-primary font-medium hover:underline">
          Open in Learn
        </Link>
      </p>
      <div className="flex gap-2">
        {SELF_MARKS.map(({ label, score, classes }) => (
          <button
            key={label}
            onClick={() => onMark(atom, score)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity ${classes}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * v1 review session: walks due atoms in priority order. Company questions
 * replay through QuestionCard against the real company; learn atoms
 * (concept/lever/bridge/playbook) self-mark. Atoms drop out of the queue as
 * their rescheduled nextDue moves into the future.
 */
export default function ReviewScreen() {
  const navigate = useNavigate();
  const { dueAtoms } = useReviewQueue();
  const { addScore } = useScoringDispatch();
  const [reviewedCount, setReviewedCount] = useState(0);
  // Guards against re-surfacing mid-propagation; the SRS reschedule removes
  // reviewed atoms from dueAtoms on the next snapshot anyway.
  const [reviewedIds, setReviewedIds] = useState(() => new Set());

  const markReviewed = useCallback((atomId) => {
    setReviewedIds((prev) => new Set(prev).add(atomId));
    setReviewedCount((c) => c + 1);
  }, []);

  const handleSelfMark = useCallback(
    (atom, score) => {
      addScore({
        companyId: "review",
        questionType: atom.atomType,
        score,
        atomId: atom.atomId,
        atomType: atom.atomType,
      });
      markReviewed(atom.atomId);
    },
    [addScore, markReviewed],
  );

  const remaining = dueAtoms.filter((a) => !reviewedIds.has(a.atomId));
  const current = remaining[0] ?? null;
  const resolved = current ? resolveAtom(current.atomId, current.atomType) : null;

  // Stale atom (content renamed/removed): skip it without counting a review.
  const staleId = current && !resolved ? current.atomId : null;
  useEffect(() => {
    if (staleId) setReviewedIds((prev) => new Set(prev).add(staleId));
  }, [staleId]);
  if (staleId) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">
            Review
          </h2>
          <p className="text-sm text-on-surface-variant mt-2">
            {current
              ? `${remaining.length} due, spaced by how well you knew them`
              : "Queue clear"}
          </p>
        </div>
        <button
          onClick={() => navigate("/learn")}
          className="px-4 py-2 text-sm font-medium bg-surface-container-lowest border border-outline-variant rounded-lg hover:bg-surface-container transition-colors"
        >
          Done
        </button>
      </div>

      {!current ? (
        <div className="bg-surface-container-lowest ghost-border rounded-2xl p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-primary mb-2">
            task_alt
          </span>
          <p className="text-lg font-bold text-on-surface">
            {reviewedCount > 0
              ? `Nice. ${reviewedCount} atom${reviewedCount === 1 ? "" : "s"} reviewed.`
              : "Nothing due for review."}
          </p>
          <p className="text-sm text-on-surface-variant mt-1">
            Keep practicing; atoms come due as their intervals lapse.
          </p>
        </div>
      ) : resolved.kind === "company-question" ? (
        <QuestionCard
          key={current.atomId}
          question={resolved.question}
          index={reviewedCount}
          companyContext={buildCompanyContext(resolved.company)}
          onScore={(type, score, meta) => {
            addScore({
              companyId: resolved.company.id,
              questionType: type,
              score,
              delta: meta?.delta ?? null,
              unit: meta?.unit ?? null,
              atomId: meta?.atomId ?? current.atomId,
              atomType: meta?.atomType ?? "company-question",
              feedback: meta?.feedback ?? null,
            });
            markReviewed(current.atomId);
          }}
        />
      ) : (
        <SelfMarkCard atom={current} resolved={resolved} onMark={handleSelfMark} />
      )}
    </div>
  );
}
