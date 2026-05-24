'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseExamTimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
  autoStart?: boolean;
}

export function useExamTimer({ initialSeconds, onTimeUp, autoStart = false }: UseExamTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    setRemainingSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds, onTimeUp]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setRemainingSeconds(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  const getStatus = useCallback(() => {
    if (remainingSeconds <= 60) return 'critical';
    if (remainingSeconds <= 120) return 'warning';
    return 'normal';
  }, [remainingSeconds]);

  return {
    remainingSeconds,
    isRunning,
    start,
    pause,
    reset,
    getStatus,
  };
}
