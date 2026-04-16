import { useState, useCallback } from "react";

const STORAGE_KEY = "forge-data";
const DEFAULT_STATE = { sessions: [], streak: { current: 0, lastDate: null } };

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.sessions)) {
      console.warn(`[Forge] Invalid shape in ${STORAGE_KEY}, resetting`);
      return DEFAULT_STATE;
    }
    if (!parsed.streak || typeof parsed.streak !== "object") {
      console.warn(`[Forge] Invalid shape in ${STORAGE_KEY}, resetting`);
      return DEFAULT_STATE;
    }
    return parsed;
  } catch (err) {
    console.warn(`[Forge] Corrupt data in ${STORAGE_KEY}, resetting:`, err.message);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) localStorage.setItem(`${STORAGE_KEY}-corrupt-backup`, raw);
    } catch {}
    return DEFAULT_STATE;
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn(`[Forge] Failed to save ${STORAGE_KEY}:`, err.message);
  }
}

export default function useScoring() {
  const [data, setData] = useState(loadData);

  const addScore = useCallback((entry) => {
    // entry: { companyId, questionType, score, delta, unit, timestamp }
    setData(prev => {
      const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
      let session = prev.sessions.find(
        s => s.date === today && s.companyId === entry.companyId
      );
      if (!session) {
        session = { date: today, companyId: entry.companyId, duration: 0, questions: [] };
        prev = { ...prev, sessions: [...prev.sessions, session] };
      } else {
        prev = {
          ...prev,
          sessions: prev.sessions.map(s =>
            s.date === today && s.companyId === entry.companyId
              ? { ...s, questions: [...s.questions, { type: entry.questionType, score: entry.score, delta: entry.delta, unit: entry.unit }] }
              : s
          ),
        };
        const next = { ...prev, streak: updateStreak(prev.streak, today) };
        saveData(next);
        return next;
      }
      // Add the question to the new session
      const sessions = prev.sessions.map(s =>
        s.date === today && s.companyId === entry.companyId
          ? { ...s, questions: [...s.questions, { type: entry.questionType, score: entry.score, delta: entry.delta, unit: entry.unit }] }
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
    if (all.length < 10) return null;

    const byType = getScoresByType();
    const weaknesses = Object.entries(byType)
      .map(([type, scores]) => ({
        type,
        avg: scores.reduce((a, b) => a + b, 0) / scores.length,
        count: scores.length,
      }))
      .filter(w => w.avg < 3.5 && w.count >= 2)
      .sort((a, b) => a.avg - b.avg);

    return weaknesses.length > 0 ? weaknesses : null;
  }, [getAllScores, getScoresByType]);

  const getQuantitativeAccuracy = useCallback(() => {
    const quantitative = data.sessions
      .flatMap(s => s.questions)
      .filter(q => q.delta != null);
    if (quantitative.length === 0) return null;
    const avgDelta = quantitative.reduce((sum, q) => sum + Math.abs(q.delta), 0) / quantitative.length;
    return { avgDelta: avgDelta.toFixed(1), count: quantitative.length };
  }, [data.sessions]);

  return {
    data,
    addScore,
    updateSessionDuration,
    getAllScores,
    getScoresByType,
    getWeakSpots,
    getQuantitativeAccuracy,
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
export { loadData, saveData, updateStreak };
