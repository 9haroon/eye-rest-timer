import { useState, useEffect, useRef, useCallback } from 'react';

interface TimerState {
  timeRemaining: number;
  isWorkTime: boolean;
  isActive: boolean;
}

interface TimerControls {
  start: () => void;
  pause: () => void;
  reset: () => void;
  setTimeRemaining: (time: number) => void;
  setIsWorkTime: (isWork: boolean) => void;
  setIsActive: (isActive: boolean) => void;
}

const DEFAULT_WORK_DURATION_MS = 20 * 60 * 1000; // 20 minutes in milliseconds
const DEFAULT_BREAK_DURATION_MS = 20 * 1000; // 20 seconds in milliseconds

export const useTimer = (
  initialWorkDuration: number = DEFAULT_WORK_DURATION_MS,
  initialBreakDuration: number = DEFAULT_BREAK_DURATION_MS,
): [TimerState, TimerControls] => {
  const [timeRemaining, setTimeRemaining] = useState<number>(initialWorkDuration);
  const [isWorkTime, setIsWorkTime] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const workDurationRef = useRef(initialWorkDuration);
  const breakDurationRef = useRef(initialBreakDuration);

  // Update durations if they change
  useEffect(() => {
    workDurationRef.current = initialWorkDuration;
    breakDurationRef.current = initialBreakDuration;
    // If timer is not active, reset timeRemaining to current work/break duration
    if (!isActive) {
      setTimeRemaining(isWorkTime ? initialWorkDuration : initialBreakDuration);
    }
  }, [initialWorkDuration, initialBreakDuration, isActive, isWorkTime]);


  const tick = useCallback(() => {
    setTimeRemaining((prevTime) => {
      if (prevTime <= 1000) { // Time is up (within 1 second tolerance for interval precision)
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        if (isWorkTime) {
          // Transition from work to break
          setIsWorkTime(false);
          setTimeRemaining(breakDurationRef.current);
          // Optionally trigger a notification here or via an event emitter
          // For now, just setting state and letting the main app handle notifications
        } else {
          // Transition from break to work
          setIsWorkTime(true);
          setTimeRemaining(workDurationRef.current);
        }
        return 0; // Ensure it's exactly 0 when time is up
      }
      return prevTime - 1000; // Decrement by 1 second
    });
  }, [isWorkTime]);

  const start = useCallback(() => {
    if (intervalRef.current === null) {
      setIsActive(true);
      // If timeRemaining is 0, reset to current work/break duration before starting
      if (timeRemaining <= 0) {
        setTimeRemaining(isWorkTime ? workDurationRef.current : breakDurationRef.current);
      }
      intervalRef.current = setInterval(tick, 1000);
    }
  }, [tick, timeRemaining, isWorkTime]);

  const pause = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    pause(); // Stop the timer
    setIsWorkTime(true); // Always reset to work time
    setTimeRemaining(workDurationRef.current); // Reset to full work duration
    setIsActive(false); // Ensure it's marked as inactive
  }, [pause]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const timerState: TimerState = {
    timeRemaining,
    isWorkTime,
    isActive,
  };

  const timerControls: TimerControls = {
    start,
    pause,
    reset,
    setTimeRemaining,
    setIsWorkTime,
    setIsActive,
  };

  return [timerState, timerControls];
};
