import React from 'react';
import { TimerType } from '../hooks/useTimer';

interface TimerDisplayProps {
  timeRemaining: number;
  timerType: TimerType;
}

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeRemaining, timerType }) => {
  const displayColorClass = timerType === 'work' ? 'text-green-500' : 'text-blue-500';

  return (
    <div className={`text-center p-8 ${displayColorClass}`}>
      <h1 className="text-6xl font-bold mb-4">
        {formatTime(timeRemaining)}
      </h1>
      <p className="text-2xl">
        {timerType === 'work' ? 'Work Timer' : 'Break Timer'}
      </p>
    </div>
  );
};

export default TimerDisplay;
