import { useState, useEffect, useCallback, useRef } from 'react';

export type TimerMode = 'work' | 'break';

export interface TimerOptions {
  workDuration?: number; // in seconds
  breakDuration?: number; // in seconds
}

export interface TimerState {
  timeLeft: number;
  mode: TimerMode;
  isActive: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

/**
 * Custom hook to manage the core timer logic for the Eye Rest Timer.
 * Handles state management for countdown, work/break states, and remaining time.
 * Adheres to the 20-20-20 rule defaults.
 */
export const useTimer = (options: TimerOptions = {}): TimerState => {
  const {
    workDuration = 1200, // 20 minutes default
    breakDuration = 20,  // 20 seconds default
  } = options;

  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(workDuration);
  const [isActive, setIsActive] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(() => {
    setIsActive(false);
    clearTimer();
    setMode('work');
    setTimeLeft(workDuration);
  }, [clearTimer, workDuration]);

  // Manage countdown interval
  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Handle transition
            if (mode === 'work') {
              setMode('break');
              return breakDuration;
            } else {
              setMode('work');
              return workDuration;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return () => clearTimer();
  }, [isActive, mode, workDuration, breakDuration, clearTimer]);

  return {
    timeLeft,
    mode,
    isActive,
    start,
    pause,
    reset,
  };
};
