rc/hooks/useTimer.ts
import { useState, useEffect, useRef } from 'react';

const WORK_DURATION = 20 * 60; // 20 minutes in seconds
const BREAK_DURATION = 20;    // 20 seconds

export const useTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState(WORK_DURATION);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [isTimerActive, setIsTimerActive] = useState(false); // Controls the interval ticking

  const intervalIdRef = useRef<number | null>(null); // Use number for browser environment

  const startTimer = () => {
    setIsTimerActive(true);
  };

  const pauseTimer = () => {
    setIsTimerActive(false);
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    setTimeRemaining(WORK_DURATION);
    setIsWorkTime(true);
  };

  useEffect(() => {
    const handleTimerEnd = () => {
      // Timer reached zero, transition to the next phase
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }

      const nextIsWorkTime = !isWorkTime;
      setIsWorkTime(nextIsWorkTime);
      setTimeRemaining(nextIsWorkTime ? WORK_DURATION : BREAK_DURATION);

      // If the timer was active and ran out, the next phase should also be active
      // This is handled by `isTimerActive` still being true, which will trigger the interval start again below.
      // No need to call setIsTimerActive(true) here explicitly if it was already true.
    };

    if (isTimerActive) {
      if (timeRemaining > 0) {
        // If timer is active and time remaining, set interval
        intervalIdRef.current = setInterval(() => {
          setTimeRemaining(prevTime => prevTime - 1);
        }, 1000);
      } else {
        // If timeRemaining is 0, it means a transition needs to happen.
        // Call handleTimerEnd to switch state and reset timeRemaining.
        handleTimerEnd();
      }
    } else {
      // If timer is not active, clear any existing interval
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    }

    // Cleanup function: clear interval when the component unmounts or dependencies change
    return () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [isTimerActive, timeRemaining, isWorkTime]); // Re-run effect if these state values change

  return {
    timeRemaining,
    isWorkTime,
    isTimerActive,
    startTimer,
    pauseTimer,
    resetTimer,
  };
};
