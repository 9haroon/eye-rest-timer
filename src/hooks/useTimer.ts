import { useState, useEffect, useRef, useCallback } from 'react';

const WORK_DURATION_SECONDS = 20 * 60; // 20 minutes
const BREAK_DURATION_SECONDS = 20; // 20 seconds

export type TimerType = 'work' | 'break';

interface TimerState {
  timeRemaining: number;
  timerType: TimerType;
  isRunning: boolean;
  intervalId: NodeJS.Timeout | null;
}

interface TimerControls {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setTimerType: (type: TimerType) => void;
  setWorkDuration: (duration: number) => void;
  setBreakDuration: (duration: number) => void;
}

export const useTimer = (): TimerState & TimerControls => {
  const [timeRemaining, setTimeRemaining] = useState<number>(WORK_DURATION_SECONDS);
  const [timerType, setTimerType] = useState<TimerType>('work');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const currentWorkDuration = useRef(WORK_DURATION_SECONDS);
  const currentBreakDuration = useRef(BREAK_DURATION_SECONDS);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimerType('work');
    setTimeRemaining(currentWorkDuration.current);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [intervalId]);

  const setWorkDuration = useCallback((duration: number) => {
    currentWorkDuration.current = duration;
    if (timerType === 'work' && !isRunning) {
      setTimeRemaining(duration);
    }
  }, [isRunning, timerType]);

  const setBreakDuration = useCallback((duration: number) => {
    currentBreakDuration.current = duration;
    if (timerType === 'break' && !isRunning) {
      setTimeRemaining(duration);
    }
  }, [isRunning, timerType]);


  useEffect(() => {
    if (isRunning) {
      const id = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            // Timer finished
            if (intervalId) {
              clearInterval(intervalId);
              setIntervalId(null);
            }

            if (timerType === 'work') {
              setTimerType('break');
              setTimeRemaining(currentBreakDuration.current);
            } else { // timerType === 'break'
              setTimerType('work');
              setTimeRemaining(currentWorkDuration.current);
            }
            // Automatically start the next timer phase
            // `setIsRunning(true)` will be handled by the caller or implicitly by state changes
            // For now, we rely on this effect re-running after state changes.
            // A more robust solution might return state and setter functions.
            // For this task, we'll let the state changes trigger the next effect run.
            return 0; // This return value will be overwritten by the next state set
          }
          return prevTime - 1;
        });
      }, 1000);
      setIntervalId(id);
      // Cleanup function to clear the interval when the component unmounts or dependencies change
      return () => {
        if (id) {
          clearInterval(id);
        }
      };
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [isRunning, timerType, intervalId]); // Dependencies include intervalId to ensure cleanup

  // Effect to handle the initial state and transitions when isRunning is controlled externally or by state changes
  useEffect(() => {
      if (isRunning && timeRemaining === 0) {
          if (timerType === 'work') {
              setTimerType('break');
              setTimeRemaining(currentBreakDuration.current);
          } else { // timerType === 'break'
              setTimerType('work');
              setTimeRemaining(currentWorkDuration.current);
          }
      }
  }, [timeRemaining, isRunning, timerType]);


  return {
    timeRemaining,
    timerType,
    isRunning,
    intervalId,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerType, // This might be useful for external control or debugging
    setWorkDuration,
    setBreakDuration,
  };
};
