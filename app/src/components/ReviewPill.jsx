import { useNavigate } from "react-router-dom";
import useReviewQueue from "../hooks/useReviewQueue";

/**
 * Passive "Review (N due)" chip. Renders nothing when the queue is empty, so
 * host surfaces (Learn hub, session summary) can mount it unconditionally.
 */
export default function ReviewPill({ className = "" }) {
  const { dueCount } = useReviewQueue();
  const navigate = useNavigate();

  if (dueCount === 0) return null;

  return (
    <button
      onClick={() => navigate("/review")}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-tertiary-container text-on-tertiary-container hover:opacity-90 transition-opacity ${className}`}
    >
      <span className="material-symbols-outlined text-[16px]">history</span>
      Review ({dueCount} due)
    </button>
  );
}
