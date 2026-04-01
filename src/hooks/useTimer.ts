import { useState, useEffect, useRef } from 'react';

interface UseTimerProps {
  initialWorkDuration: number; // in seconds
  initialBreakDuration: number; // in seconds
  onWorkComplete?: () => void; // Callback for when work timer finishes
  onBreakComplete?: () => void; // Callback for when break timer finishes
}

export function useTimer({
  initialWorkDuration,
  initialBreakDuration,
  onWorkComplete,
  onBreakComplete,
}: UseTimerProps) {
  const [countdown, setCountdown] = useState(initialWorkDuration);
  const [timerType, setTimerType] = useState<'work' | 'break'>('work');
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Store durations in ref to ensure effect uses initial values consistently
  const workDurationRef = useRef(initialWorkDuration);
  const breakDurationRef = useRef(initialBreakDuration);

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setTimerType('work');
    setCountdown(workDurationRef.current);
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            // Timer has reached its end
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setIsRunning(false); // Stop the current interval

            if (timerType === 'work') {
              // Transition from work to break
              setTimerType('break');
              setCountdown(breakDurationRef.current);
              // Automatically start the break timer by re-setting isRunning
              setIsRunning(true);
              if (onWorkComplete) onWorkComplete();
            } else { // timerType === 'break'
              // Transition from break to work
              setTimerType('work');
              setCountdown(workDurationRef.current);
              // Automatically start the next work timer
              setIsRunning(true);
              if (onBreakComplete) onBreakComplete();
            }
            return 0; // Return 0 to indicate it just finished
          }
          return prevCountdown - 1; // Decrement countdown
        });
      }, 1000);
    } else {
      // If not running, ensure interval is cleared if it exists
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup function for when component unmounts or dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timerType, onWorkComplete, onBreakComplete]); // Dependencies

  // Format countdown for display (e.g., MM:SS)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    countdown,
    timerType,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime,
  };
}
