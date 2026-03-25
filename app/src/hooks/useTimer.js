import { useState, useEffect, useCallback, useRef } from "react";

const PACE_MILESTONES = [
  { minutes: 5, message: "5 min in. Have you checked margins and growth?" },
  { minutes: 10, message: "10 min in. Time to form your investment thesis." },
  { minutes: 15, message: "15 min. A real screening call would be wrapping up." },
];

export default function useTimer(defaultLimit = 15) {
  const [elapsed, setElapsed] = useState(0); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [limit] = useState(defaultLimit * 60); // convert to seconds
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          const next = prev + 1;
          if (next >= limit && !isExpired) {
            setIsExpired(true);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, limit, isExpired]);

  const start = useCallback(() => {
    setElapsed(0);
    setIsExpired(false);
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    setElapsed(0);
    setIsExpired(false);
    setIsRunning(false);
    clearInterval(intervalRef.current);
  }, []);

  const elapsedMinutes = Math.floor(elapsed / 60);
  const elapsedSeconds = elapsed % 60;
  const formattedTime = `${elapsedMinutes}:${String(elapsedSeconds).padStart(2, "0")}`;

  const currentMilestone = PACE_MILESTONES
    .filter(m => elapsedMinutes >= m.minutes)
    .pop();

  const progress = Math.min(elapsed / limit, 1);

  return {
    elapsed,
    elapsedMinutes,
    formattedTime,
    isRunning,
    isExpired,
    progress,
    currentMilestone,
    start,
    stop,
    reset,
  };
}
