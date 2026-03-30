import React from 'react';

interface TimerDisplayProps {
  timeRemaining: number; // in milliseconds
  isWorkTime: boolean;
  isActive: boolean;
}

const formatTime = (ms: number): string => {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  return `${paddedMinutes}:${paddedSeconds}`;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeRemaining, isWorkTime, isActive }) => {
  const displayTime = formatTime(timeRemaining);

  // Determine background class based on state
  const getContainerClasses = (): string => {
    if (!isActive) return 'timer-container paused';
    if (isWorkTime) return 'timer-container work';
    return 'timer-container break';
  };

  return (
    <div className={getContainerClasses()}>
      <div className="timer-value">{displayTime}</div>
      <div className="timer-label">
        {isWorkTime ? 'Work Interval' : 'Break Time'}
      </div>
    </div>
  );
};

export default TimerDisplay;
