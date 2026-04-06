import { useState, useEffect, useCallback, useRef } from 'react';

export type TimerMode = 'work' | 'break';

export interface TimerOptions {
  workDuration: number; // in seconds
  breakDuration: number; // in seconds
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
 * Handles countdown, start, pause, and reset functionalities.
 */
export const useTimer = ({
  workDuration,
  breakDuration,
  onTimerEnd,
}: TimerOptions): TimerState => {
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
    const initialTime = mode === 'work' ? workDuration : breakDuration;
    setTimeLeft(initialTime);
  }, [clearTimer, mode, workDuration, breakDuration]);

  const toggleMode = useCallback(() => {
    setIsActive(false);
    clearTimer();
    const nextMode = mode === 'work' ? 'break' : 'work';
    setMode(nextMode);
    setTimeLeft(nextMode === 'work' ? workDuration : breakDuration);
  }, [mode, workDuration, breakDuration, clearTimer]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // This handles the transition when the timer reaches zero
      setIsActive(false);
      clearTimer();
    }

    return () => clearTimer();
  }, [isActive, timeLeft, clearTimer]);

  // Trigger onTimerEnd when timeLeft hits 0
  useEffect(() => {
    if (timeLeft === 0 && !isActive) {
      if (onTimerEnd) {
        onTimerEnd(mode);
      }
    }
  }, [timeLeft, isActive, mode, onTimerEnd]);

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
