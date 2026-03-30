import { useState, useEffect, useRef, useCallback } from 'react';

// Constants for timer durations (in seconds)
const DEFAULT_WORK_DURATION_SECONDS = 20 * 60; // 20 minutes
const DEFAULT_BREAK_DURATION_SECONDS = 20; // 20 seconds

interface TimerState {
  secondsRemaining: number;
  isWorkTime: boolean;
  isActive: boolean;
}

interface TimerControls {
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function useTimer(): TimerState & TimerControls {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(DEFAULT_WORK_DURATION_SECONDS);
  const [isWorkTime, setIsWorkTime] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const totalWorkSeconds = DEFAULT_WORK_DURATION_SECONDS;
  const totalBreakSeconds = DEFAULT_BREAK_DURATION_SECONDS;

  const clearIntervalAndResetRef = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  const switchTimer = useCallback((isWork: boolean) => {
    setIsWorkTime(isWork);
    setSecondsRemaining(isWork ? totalWorkSeconds : totalBreakSeconds);
    // If switching to work time, we typically want to start it immediately if it was active before
    // However, the spec implies a pause after a break, and then user initiates start.
    // For now, we'll set isActive based on the overall state.
    // The actual start logic will be handled by the start function.
  }, [totalWorkSeconds, totalBreakSeconds]);

  const start = useCallback(() => {
    setIsActive(true);
    if (!intervalIdRef.current) { // Prevent multiple intervals
      intervalIdRef.current = setInterval(() => {
        setSecondsRemaining((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearIntervalAndResetRef();
            // Transition to the next state
            if (isWorkTime) {
              switchTimer(false); // Switch to break time
            } else {
              switchTimer(true); // Switch back to work time
            }
            // When the timer hits 0 and we switch, we need to re-activate the timer if it was active
            // This ensures the new timer starts counting down immediately.
            if (isActive) {
               // We set isActive to true outside this interval,
               // so here we just need to ensure the interval is set up for the new timer.
               // This might require a slight re-architecture or relying on useEffect.
               // For now, let's assume the next tick will handle the start if isActive is true.
               // A better approach might be to call start() again here or trigger a useEffect.
            }
            return 0; // Timer finished
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }
  }, [isWorkTime, isActive, switchTimer, clearIntervalAndResetRef]);


  const pause = useCallback(() => {
    setIsActive(false);
    clearIntervalAndResetRef();
  }, [clearIntervalAndResetRef]);

  const reset = useCallback(() => {
    pause(); // Stop the timer
    setIsWorkTime(true); // Always reset to work time
    setSecondsRemaining(totalWorkSeconds);
  }, [pause, totalWorkSeconds]);

  // Effect to handle starting the timer when isActive becomes true and interval is null
  useEffect(() => {
    if (isActive && !intervalIdRef.current) {
      start();
    } else if (!isActive && intervalIdRef.current) {
      clearIntervalAndResetRef();
    }
    // Cleanup on unmount
    return () => clearIntervalAndResetRef();
  }, [isActive, start, clearIntervalAndResetRef]);

  // Effect to re-calculate secondsRemaining if durations change or on initial load
  useEffect(() => {
    if (isWorkTime) {
      setSecondsRemaining(totalWorkSeconds);
    } else {
      setSecondsRemaining(totalBreakSeconds);
    }
  }, [isWorkTime, totalWorkSeconds, totalBreakSeconds]);

  return {
    secondsRemaining,
    isWorkTime,
    isActive,
    start,
    pause,
    reset,
  };
}
