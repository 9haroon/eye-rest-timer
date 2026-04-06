import { useState, useEffect, useRef } from 'react';

const WORK_DURATION = 20 * 60; // 20 minutes in seconds
const BREAK_DURATION = 20;     // 20 seconds

interface TimerState {
  timeRemaining: number;
  isWorkTime: boolean;
  isActive: boolean;
}

type TimerControls = {
  start: () => void;
  pause: () => void;
  reset: () => void;
};

export const useTimer = (): [TimerState, TimerControls] => {
  const [timeRemaining, setTimeRemaining] = useState<number>(WORK_DURATION);
  const [isWorkTime, setIsWorkTime] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    setIsActive(true);
  };

  const pause = () => {
    setIsActive(false);
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  };

  const reset = () => {
    setIsActive(false);
    setIsWorkTime(true);
    setTimeRemaining(WORK_DURATION);
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  };

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      timerIdRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      // Timer reached zero, transition
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }

      // Use setTimeout to allow for a visual cue before the next phase starts automatically
      // and to prevent potential infinite loops if 'start()' is called immediately.
      setTimeout(() => {
        if (isWorkTime) {
          // Transition from work to break
          setIsWorkTime(false);
          setTimeRemaining(BREAK_DURATION);
          start(); // Start the break timer
        } else {
          // Transition from break back to work
          setIsWorkTime(true);
          setTimeRemaining(WORK_DURATION);
          start(); // Start the next work timer
        }
      }, 1000); // Brief delay before transition
    } else if (!isActive && timerIdRef.current) {
      // If paused, ensure interval is cleared
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, [isActive, timeRemaining, isWorkTime]); // Dependencies for effect

  return [{ timeRemaining, isWorkTime, isActive }, { start, pause, reset }];
};
