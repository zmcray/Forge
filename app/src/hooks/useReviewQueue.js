import { useEffect, useMemo } from "react";
import { useScoringState } from "../contexts/ScoringContext";
import { computeDueQueue } from "../utils/srs";
import { srsStore, ingestScores } from "./srsStore";
import { useStore } from "./progressStore";

/**
 * Review queue over the SRS store: ingests newly landed scores (any surface
 * that mounts this hook drives the watermark forward; ingestion is idempotent
 * so multiple instances are safe) and exposes due atoms sorted by weighted
 * overdue-ness (weak atoms jump the queue, see computeDueQueue).
 */
export default function useReviewQueue() {
  const { allScores } = useScoringState();
  const srs = useStore(srsStore);

  useEffect(() => {
    ingestScores(allScores);
  }, [allScores]);

  const dueAtoms = useMemo(() => computeDueQueue(srs.atoms, new Date()), [srs]);

  return { dueAtoms, dueCount: dueAtoms.length };
}
