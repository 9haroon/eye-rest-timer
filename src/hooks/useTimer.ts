import { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_WORK_DURATION = 20 * 60; // 20 minutes in seconds
const DEFAULT_BREAK_DURATION = 20; // 20 seconds

export interface TimerState {
  timeRemaining: number;
  isWorkTime: boolean;
  isActive: boolean;
}

export type TimerControls = {
  start: () => void;
  pause: () => void;
  reset: () => void;
};

export function useTimer(): TimerState & TimerControls {
  const [timeRemaining, setTimeRemaining] = useState<number>(DEFAULT_WORK_DURATION);
  const [isWorkTime, setIsWorkTime] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const tick = useCallback(() => {
    setTimeRemaining((prevTime) => {
      if (prevTime <= 1) {
        // Time is up, transition to next state
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }

        if (isWorkTime) {
          // Transition from work to break
          setIsWorkTime(false);
          setTimeRemaining(DEFAULT_BREAK_DURATION);
          setIsActive(false); // Timer stops after work period ends, waiting for next start/reset
        } else {
          // Transition from break to work
          setIsWorkTime(true);
          setTimeRemaining(DEFAULT_WORK_DURATION);
          setIsActive(false); // Timer stops after break period ends, waiting for next start/reset
        }
        return 0; // Ensure timeRemaining is 0 for the transition moment
      }
      return prevTime - 1;
    });
  }, [isWorkTime]);

  const start = useCallback(() => {
    if (isActive) return; // Already running

    // If timer was reset or finished and timeRemaining is 0,
    // reset() must have been called to prepare for a new cycle.
    // The actual timer state (work/break duration) is handled by reset() and tick().
    // We just need to activate the interval if it's not already active.

    setIsActive(true);
    if (intervalIdRef.current === null) {
      intervalIdRef.current = setInterval(tick, 1000);
    }
  }, [isActive, tick]);

  const pause = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    }
  }, [isActive]);

  const reset = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    setIsActive(false);
    setIsWorkTime(true);
    setTimeRemaining(DEFAULT_WORK_DURATION);
  }, []);

  // Effect to manage the interval based on isActive state
  useEffect(() => {
      if (isActive && timeRemaining > 0) {
          intervalIdRef.current = setInterval(tick, 1000);
      } else if (!isActive && intervalIdRef.current !== null) {
          // Clear interval if not active (paused or finished)
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
      }
      // Cleanup on unmount
      return () => {
          if (intervalIdRef.current) {
              clearInterval(intervalIdRef.current);
          }
      };
  }, [isActive, timeRemaining, tick]); // timeRemaining is included because tick might set it to 0, which should stop the interval

  return {
    timeRemaining,
    isWorkTime,
    isActive,
    start,
    pause,
    reset,
  };
}

// Helper to format time for display
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${paddedMinutes}:${paddedSeconds}`;
}
