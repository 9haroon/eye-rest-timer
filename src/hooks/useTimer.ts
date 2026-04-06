import { useState, useEffect, useCallback, useRef } from 'react';

export type TimerMode = 'work' | 'break';

export interface TimerOptions {
  workDuration?: number; // in seconds
  breakDuration?: number; // in seconds
  onTimerEnd?: (mode: TimerMode) => void;
}

export interface TimerState {
  timeLeft: number;
  mode: TimerMode;
  isActive: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  toggleMode: () => void;
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
    onTimerEnd,
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
    if (timeLeft > 0) {
      setIsActive(true);
    }
  }, [timeLeft]);

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

  const toggleMode = useCallback(() => {
    setIsActive(false);
    clearTimer();
    setMode((prevMode) => {
      const nextMode = prevMode === 'work' ? 'break' : 'work';
      setTimeLeft(nextMode === 'work' ? workDuration : breakDuration);
      return nextMode;
    });
  }, [workDuration, breakDuration, clearTimer]);

  // Manage countdown interval
  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      clearTimer();
    }

    return () => clearTimer();
  }, [isActive, clearTimer]);

  // Handle timer reaching zero
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      setIsActive(false);
      clearTimer();
      if (onTimerEnd) {
        onTimerEnd(mode);
      }
    }
  }, [timeLeft, isActive, mode, onTimerEnd, clearTimer]);

  return {
    timeLeft,
    mode,
    isActive,
    start,
    pause,
    reset,
    toggleMode,
  };
};
