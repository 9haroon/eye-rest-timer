```typescript
import React from 'react';

interface TimerDisplayProps {
  remainingTime: number; // in seconds
  isWorkTime: boolean;   // To determine the label (Work/Break)
}

// Helper function to format seconds into MM:SS format
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${paddedMinutes}:${paddedSeconds}`;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({ remainingTime, isWorkTime }) => {
  const timerLabel = isWorkTime ? 'Work Time' : 'Break Time';

  return (
    <div>
      <h2>{timerLabel}</h2>
      <h1>{formatTime(remainingTime)}</h1>
    </div>
  );
};

export default TimerDisplay;
```
