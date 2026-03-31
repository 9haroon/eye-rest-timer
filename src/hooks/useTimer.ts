```typescript
import { useState, useEffect, useRef } from 'react';

const WORK_DURATION_SECONDS = 20 * 60; // 20 minutes
const BREAK_DURATION_SECONDS = 20;     // 20 seconds

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
    const [secondsRemaining, setSecondsRemaining] = useState<number>(WORK_DURATION_SECONDS);
    const [isWorkTime, setIsWorkTime] = useState<boolean>(true);
    const [isActive, setIsActive] = useState<boolean>(false);

    const timerId = useRef<NodeJS.Timeout | null>(null);

    // Function to start the timer
    const start = () => {
        if (!isActive) {
            setIsActive(true);
        }
    };

    // Function to pause the timer
    const pause = () => {
        setIsActive(false);
    };

    // Function to reset the timer
    const reset = () => {
        setIsActive(false);
        setIsWorkTime(true);
        setSecondsRemaining(WORK_DURATION_SECONDS);
        if (timerId.current) {
            clearInterval(timerId.current);
            timerId.current = null;
        }
    };

    // Effect for the countdown logic
    useEffect(() => {
        if (isActive) {
            timerId.current = setInterval(() => {
                setSecondsRemaining(prevSeconds => {
                    if (prevSeconds <= 1) {
                        clearInterval(timerId.current!);
                        timerId.current = null;

                        if (isWorkTime) {
                            // Work timer finished, switch to break
                            setIsWorkTime(false);
                            setSecondsRemaining(BREAK_DURATION_SECONDS);
                            // The effect will re-run due to isWorkTime change, starting the break timer
                        } else {
                            // Break timer finished, switch back to work
                            setIsWorkTime(true);
                            setSecondsRemaining(WORK_DURATION_SECONDS);
                            // The effect will re-run due to isWorkTime change, starting the work timer again
                        }
                        return 0; // Indicate timer reached 0
                    }
                    return prevSeconds - 1;
                });
            }, 1000);
        } else {
            // If not active, clear the interval
            if (timerId.current) {
                clearInterval(timerId.current);
                timerId.current = null;
            }
        }

        // Cleanup function to clear the interval on component unmount or when dependencies change
        return () => {
            if (timerId.current) {
                clearInterval(timerId.current);
            }
        };
    }, [isActive, isWorkTime]); // Rerun effect when isActive or isWorkTime changes

    return {
        secondsRemaining,
        isWorkTime,
        isActive,
        start,
        pause,
        reset,
    };
}
```
