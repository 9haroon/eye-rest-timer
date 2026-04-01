import { useState, useEffect, useRef, useCallback } from 'react';

const WORK_DURATION = 20 * 60; // 20 minutes in seconds
const BREAK_DURATION = 20; // 20 seconds

export type TimerState = 'work' | 'break';

interface TimerHook {
  timeRemaining: number;
  currentState: TimerState;
  isActive: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}

export const useTimer = (): TimerHook => {
  const [timeRemaining, setTimeRemaining] = useState(WORK_DURATION);
  const [currentState, setCurrentState] = useState<TimerState>('work');
  const [isActive, setIsActive] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const tick = useCallback(() => {
    setTimeRemaining(prevTime => {
      if (prevTime <= 1) { // Time is up
        // Clear the interval that called us
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        if (currentState === 'work') {
          // Work period ended, switch to break
          setCurrentState('break');
          setTimeRemaining(BREAK_DURATION);
          // Start the break countdown using setTimeout
          timeoutRef.current = setTimeout(() => {
            // Break duration is over, switch back to work and stop timer
            setCurrentState('work');
            setTimeRemaining(WORK_DURATION);
            setIsActive(false); // Stop timer, requires user to press start again
            if (timeoutRef.current) { // Clean up the timeout itself
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
          }, BREAK_DURATION * 1000);
        } else { // currentState === 'break'
          // Break period ended, switch back to work and stop timer
          setCurrentState('work');
          setTimeRemaining(WORK_DURATION);
          setIsActive(false); // Stop timer, requires user to press start again
          // No need to clear timeoutRef here as it was for the break itself, which has ended.
        }
        return 0; // Ensure time is 0 before state transition
      }
      // Continue countdown
      return prevTime - 1;
    });
  }, [currentState]); // tick depends on currentState to decide next action

  // Effect to manage the main interval
  useEffect(() => {
    if (isActive) {
      // Start interval if not already running
      if (intervalRef.current === null) {
        intervalRef.current = setInterval(tick, 1000);
      }
    } else {
      // Clear interval if not active
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive, tick]); // Depend on isActive to start/stop the interval

  const startTimer = useCallback(() => {
    if (isActive) return; // Already running

    // If we were in a break and user hits start, reset to work.
    if (currentState === 'break') {
        // Clear any pending break timeout if user hits start during break
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setCurrentState('work');
        setTimeRemaining(WORK_DURATION);
    }
    // Set isActive to true to trigger the setInterval in useEffect
    setIsActive(true);
  }, [isActive, currentState]);

  const pauseTimer = useCallback(() => {
    setIsActive(false); // This will cause the useEffect to clear the interval
    // Explicitly clear interval and timeout references for safety
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    setIsActive(false); // Stop timer
    // Clear any running intervals or timeouts
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
    }
    // Reset state
    setCurrentState('work');
    setTimeRemaining(WORK_DURATION);
  }, []);

  return {
    timeRemaining,
    currentState,
    isActive,
    startTimer,
    pauseTimer,
    resetTimer,
  };
};
