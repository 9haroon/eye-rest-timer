```typescript
import { useState, useEffect, useRef, useCallback } from 'react';

// Define default durations in seconds
const DEFAULT_WORK_DURATION_SECONDS = 20 * 60; // 20 minutes
const DEFAULT_BREAK_DURATION_SECONDS = 20;     // 20 seconds

interface TimerState {
  remainingTime: number; // in seconds
  isWorkTime: boolean;   // true if currently in a work interval, false for break
  isActive: boolean;     // true if the timer is currently running
  currentDuration: number; // the duration of the current interval (work or break) in seconds
}

interface TimerControls {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  // These setters would be used for future customization features
  // setWorkDuration: (duration: number) => void;
  // setBreakDuration: (duration: number) => void;
}

export const useTimer = (): TimerState & TimerControls => {
  // State for the time remaining in the current interval
  const [remainingTime, setRemainingTime] = useState<number>(DEFAULT_WORK_DURATION_SECONDS);
  // State to track if the current interval is a work interval or a break interval
  const [isWorkTime, setIsWorkTime] = useState<boolean>(true);
  // State to track if the timer is actively counting down
  const [isActive, setIsActive] = useState<boolean>(false);
  // State to hold the total duration of the current interval (work or break)
  const [currentDuration, setCurrentDuration] = useState<number>(DEFAULT_WORK_DURATION_SECONDS);

  // Refs to hold the interval ID and the durations, allowing them to persist across renders
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const workDurationRef = useRef<number>(DEFAULT_WORK_DURATION_SECONDS);
  const breakDurationRef = useRef<number>(DEFAULT_BREAK_DURATION_SECONDS);

  // Function to handle the timer ticking every second
  const tick = useCallback(() => {
    setRemainingTime((prevTime) => {
      if (prevTime <= 1) { // If it's the last second or less
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null; // Clear the interval reference
        setIsActive(false); // Timer has stopped

        // Determine the next interval type (work or break)
        const nextIsWorkTime = !isWorkTime;
        setIsWorkTime(nextIsWorkTime);

        // Set the duration for the *next* interval
        const nextDuration = nextIsWorkTime ? workDurationRef.current : breakDurationRef.current;
        setCurrentDuration(nextDuration); // Update current duration state
        setRemainingTime(nextDuration);   // Reset time to the new duration for the next interval

        // TODO: Trigger notification logic here when implemented in a future task.
        // This task focuses solely on managing the timer's state.

        return 0; // Ensure it displays 00:00 before the state fully updates or for a brief moment
      }
      return prevTime - 1; // Decrement time by 1 second
    });
  }, [isWorkTime]); // Dependency on isWorkTime to know which duration to switch to

  // Effect to manage the setInterval for the timer
  useEffect(() => {
    if (isActive) {
      // Start the interval if the timer is active
      intervalRef.current = setInterval(tick, 1000);
    } else {
      // Clear the interval if the timer is not active
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    // Cleanup function to clear interval on component unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, tick]); // Re-run effect if isActive state or tick function changes

  // Function to start the timer
  const startTimer = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      // The interval is managed by the useEffect hook, setting isActive is sufficient to start it.
    }
  }, [isActive]);

  // Function to pause the timer
  const pauseTimer = useCallback(() => {
    setIsActive(false); // This will trigger the useEffect to clear the interval
  }, []);

  // Function to reset the timer to its initial state (work time, default duration)
  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
    setIsWorkTime(true); // Always reset to work time
    setCurrentDuration(workDurationRef.current); // Reset current duration to default work duration
    setRemainingTime(workDurationRef.current); // Reset remaining time to default work duration
  }, []);

  // --- Optional: Setters for durations if customization is added later ---
  // const setWorkDuration = useCallback((duration: number) => {
  //   workDurationRef.current = duration;
  //   if (!isActive && isWorkTime) { // If not active and in work time, update immediately
  //     setRemainingTime(duration);
  //     setCurrentDuration(duration);
  //   }
  // }, [isActive, isWorkTime]);

  // const setBreakDuration = useCallback((duration: number) => {
  //   breakDurationRef.current = duration;
  //   if (!isActive && !isWorkTime) { // If not active and in break time, update immediately
  //     setRemainingTime(duration);
  //     setCurrentDuration(duration);
  //   }
  // }, [isActive, isWorkTime]);
  // --- End Optional ---

  // Effect to reset remaining time if duration changes while timer is not active,
  // or when switching between work/break without the timer running.
  useEffect(() => {
    if (!isActive) {
      // If timer is not active, ensure remaining time matches the current mode's duration.
      const newRemainingTime = isWorkTime ? workDurationRef.current : breakDurationRef.current;
      setRemainingTime(newRemainingTime);
      setCurrentDuration(newRemainingTime);
    }
  }, [isWorkTime, isActive]); // Re-evaluate when isWorkTime or isActive state changes

  return {
    remainingTime,
    isWorkTime,
    isActive,
    currentDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    // setWorkDuration, // Expose if needed for customization
    // setBreakDuration, // Expose if needed for customization
  };
};
```
