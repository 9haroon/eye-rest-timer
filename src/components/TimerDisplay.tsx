import React from 'react';
import { formatTime } from '../hooks/useTimer';

interface TimerDisplayProps {
  timeRemaining: number;
  isWorkTime: boolean;
  isActive: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeRemaining, isWorkTime, isActive }) => {
  const formattedTime = formatTime(timeRemaining);
  const timerStateLabel = isWorkTime ? 'Work' : 'Break';
  
  // Basic styling classes - these would be expanded in CSS
  const containerClassName = `timer-display ${isWorkTime ? 'work-state' : 'break-state'} ${isActive ? 'active' : ''}`;

  return (
    <div className={containerClassName}>
      <div className="time-value">{formattedTime}</div>
      <div className="state-label">{timerStateLabel}</div>
    </div>
  );
};

export default TimerDisplay;
