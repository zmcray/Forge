import { useState, useCallback, useMemo } from "react";
import { isRecord } from "../utils/normalizeRecordMap";
import { average, averageAbsDelta, attemptedCompanyIds } from "../utils/scoreMath";
import { loadJSON, saveJSON } from "../utils/storage";

const STORAGE_KEY = "forge-data";
const V1_BACKUP_KEY = "forge-data-v1-backup";
const SCHEMA_VERSION = 2;

/**
 * Schema v2 (current):
 * {
 *   version: 2,
 *   sessions: [{
 *     date: "YYYY-MM-DD",
 *     companyId: string,
 *     duration: number,
 *     questions: [{
 *       type: string,                 // questionType (metric/adjustment/valuation/risk/diagnostic/thesis)
 *       score: number,                // 1-5
 *       delta: number | null,         // quantitative delta vs model answer
 *       unit: string | null,          // "$M" | "%" | "x" | etc
 *       atomId: string | null,        // stable ID of the learnable atom (e.g., "summit-q3", "ebitda-add-backs")
 *       atomType: string | null,      // "company-question" | "concept" | "lever" | "bridge" | "playbook" | null
 *       feedback: { strengths, gaps, suggestion } | null,  // full LLM feedback when qualitative
 *       timestamp: string | null,     // ISO8601 of when scored
 *     }]
 *   }],
 *   streak: { current: number, lastDate: string | null }
 * }
 *
 * Schema v1 (legacy, auto-migrated on first read):
 * Same shape but no `version` field and questions only have `{type, score, delta, unit}`.
 */
const DEFAULT_STATE = {
  version: SCHEMA_VERSION,
  sessions: [],
  streak: { current: 0, lastDate: null },
};

/**
 * Migrate a v1-shape parsed object to v2 in place.
 * Adds `version: 2` at root and `{atomId, atomType, feedback, timestamp}` (all null) to every question entry.
 * Pre-existing v1 data isn't lost; it just lacks the new signal.
 */
function migrateV1ToV2(parsed) {
  // Backup v1 to a separate key before overwriting. Best-effort; failure shouldn't block the migration.
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) localStorage.setItem(V1_BACKUP_KEY, raw);
  } catch {
    // localStorage write failures (quota, disabled) shouldn't crash the app.
  }

  const sessions = (parsed.sessions || []).map(session => ({
    ...session,
    questions: (session.questions || []).map(q => ({
      type: q.type,
      score: q.score,
      delta: q.delta ?? null,
      unit: q.unit ?? null,
      atomId: q.atomId ?? null,
      atomType: q.atomType ?? null,
      feedback: q.feedback ?? null,
      timestamp: q.timestamp ?? null,
    })),
  }));

  return {
    version: SCHEMA_VERSION,
    sessions,
    streak: parsed.streak,
  };
}

/**
 * Deep-sanitize a parsed payload's sessions: drop non-object session entries,
 * coerce each session's questions to an array of object entries. Consumers
 * (`getAllScores`, dashboards, QuickFire) assume every session is an object
 * with an array of object questions, so this is the single trust boundary.
 */
function normalizeSessions(sessions) {
  return sessions.filter(isRecord).map((session) => ({
    ...session,
    questions: (Array.isArray(session.questions) ? session.questions : []).filter(isRecord),
  }));
}

/** Coerce streak to `{current: number, lastDate: string|null}` with safe defaults. */
function normalizeStreak(streak) {
  return {
    current: isRecord(streak) && typeof streak.current === "number" ? streak.current : 0,
    lastDate: isRecord(streak) && typeof streak.lastDate === "string" ? streak.lastDate : null,
  };
}

function loadData() {
  // storage.js owns the parse/validate/corrupt-backup layer; the v1 -> v2
  // migration below is scoring-specific and stays here.
  const parsed = loadJSON(STORAGE_KEY, {
    validate: (data) => isRecord(data) && Array.isArray(data.sessions),
    fallback: DEFAULT_STATE,
  });
  if (parsed === DEFAULT_STATE) return DEFAULT_STATE;

  // Deep-sanitize before anything consumes the shape. A corrupt inner entry
  // (sessions:[null], questions:null, streak:{}) behaves as if absent.
  const sanitized = {
    ...parsed,
    sessions: normalizeSessions(parsed.sessions),
    streak: normalizeStreak(parsed.streak),
  };

  // Migrate v1 (no version field) to v2.
  if (sanitized.version !== SCHEMA_VERSION) {
    const migrated = migrateV1ToV2(sanitized);
    // Persist migrated shape immediately so subsequent reads are fast and consistent.
    saveData(migrated);
    return migrated;
  }

  return sanitized;
}

function saveData(data) {
  saveJSON(STORAGE_KEY, data);
}

export default function useScoring() {
  const [data, setData] = useState(loadData);

  /**
   * Persist a question score entry.
   *
   * @param {Object} entry
   * @param {string} entry.companyId
   * @param {string} entry.questionType            metric | adjustment | valuation | risk | diagnostic | thesis
   * @param {number} entry.score                   1-5
   * @param {number|null} [entry.delta]            quantitative delta vs model answer
   * @param {string|null} [entry.unit]
   * @param {string|null} [entry.atomId]           stable ID of the learnable atom (e.g., "summit-q3")
   * @param {string|null} [entry.atomType]         "company-question" | "concept" | "lever" | "bridge" | "playbook"
   * @param {{strengths: string[], gaps: string[], suggestion: string}|null} [entry.feedback]   full LLM feedback (qualitative only)
   * @param {string} [entry.timestamp]             ISO8601; defaults to now
   */
  const addScore = useCallback((entry) => {
    setData(prev => {
      const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
      const question = {
        type: entry.questionType,
        score: entry.score,
        delta: entry.delta ?? null,
        unit: entry.unit ?? null,
        atomId: entry.atomId ?? null,
        atomType: entry.atomType ?? null,
        feedback: entry.feedback ?? null,
        timestamp: entry.timestamp ?? new Date().toISOString(),
      };

      let session = prev.sessions.find(
        s => s.date === today && s.companyId === entry.companyId
      );
      if (!session) {
        session = { date: today, companyId: entry.companyId, duration: 0, questions: [question] };
        const next = {
          ...prev,
          sessions: [...prev.sessions, session],
          streak: updateStreak(prev.streak, today),
        };
        saveData(next);
        return next;
      }

      const sessions = prev.sessions.map(s =>
        s.date === today && s.companyId === entry.companyId
          ? { ...s, questions: [...s.questions, question] }
          : s
      );
      const next = { ...prev, sessions, streak: updateStreak(prev.streak, today) };
      saveData(next);
      return next;
    });
  }, []);

  const updateSessionDuration = useCallback((companyId, duration) => {
    setData(prev => {
      const today = new Date().toLocaleDateString("en-CA");
      const sessions = prev.sessions.map(s =>
        s.date === today && s.companyId === companyId
          ? { ...s, duration }
          : s
      );
      const next = { ...prev, sessions };
      saveData(next);
      return next;
    });
  }, []);

  const getAllScores = useCallback(() => {
    return data.sessions.flatMap(s => s.questions);
  }, [data.sessions]);

  const getScoresByType = useCallback(() => {
    const byType = {};
    for (const session of data.sessions) {
      for (const q of session.questions) {
        if (!byType[q.type]) byType[q.type] = [];
        byType[q.type].push(q.score);
      }
    }
    return byType;
  }, [data.sessions]);

  const getWeakSpots = useCallback(() => {
    const all = getAllScores();
    // Intentional minimum sample size: weak spots are noise until at least
    // 10 total scored questions exist, regardless of per-type counts.
    if (all.length < 10) return null;

    const byType = getScoresByType();
    const weaknesses = Object.entries(byType)
      .map(([type, scores]) => ({
        type,
        avg: average(scores),
        count: scores.length,
      }))
      .filter(w => w.avg < 3.5 && w.count >= 2)
      .sort((a, b) => a.avg - b.avg);

    return weaknesses.length > 0 ? weaknesses : null;
  }, [getAllScores, getScoresByType]);

  const getQuantitativeAccuracy = useCallback(() => {
    const questions = data.sessions.flatMap(s => s.questions);
    const avgDelta = averageAbsDelta(questions);
    if (avgDelta === null) return null;
    return { avgDelta: avgDelta.toFixed(1), count: questions.filter(q => q.delta != null).length };
  }, [data.sessions]);

  // Memoized so consumers get a referentially stable Set per sessions snapshot.
  const attemptedIds = useMemo(() => attemptedCompanyIds(data.sessions), [data.sessions]);
  const getAttemptedCompanyIds = useCallback(() => attemptedIds, [attemptedIds]);

  return {
    data,
    addScore,
    updateSessionDuration,
    getAllScores,
    getScoresByType,
    getWeakSpots,
    getQuantitativeAccuracy,
    getAttemptedCompanyIds,
    streak: data.streak,
    sessions: data.sessions,
  };
}

function updateStreak(streak, today) {
  if (streak.lastDate === today) return streak;

  const d = new Date(today + "T00:00:00");
  d.setDate(d.getDate() - 1);
  const yesterdayStr = d.toLocaleDateString("en-CA");

  if (streak.lastDate === yesterdayStr) {
    return { current: streak.current + 1, lastDate: today };
  }

  return { current: 1, lastDate: today };
}

// Exported for testing
export { loadData, saveData, updateStreak, migrateV1ToV2, SCHEMA_VERSION, STORAGE_KEY, V1_BACKUP_KEY };
