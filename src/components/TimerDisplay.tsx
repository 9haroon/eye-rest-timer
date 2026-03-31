```typescript
import React from 'react';

interface TimerDisplayProps {
    secondsRemaining: number;
    isWorkTime: boolean;
}

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({ secondsRemaining, isWorkTime }) => {
    const displayLabel = isWorkTime ? 'Work Time' : 'Break Time';

    return (
        <div className="timer-display">
            <div className="time">{formatTime(secondsRemaining)}</div>
            <div className="label">{displayLabel}</div>
        </div>
    );
};

export default TimerDisplay;
```
