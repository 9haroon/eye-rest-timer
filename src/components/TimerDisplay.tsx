import React from 'react';

interface TimerDisplayProps {
  timeRemaining: number;
  isWorkTime: boolean;
  isActive: boolean;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeRemaining, isWorkTime, isActive }) => {
  const stateText = isWorkTime ? 'Work' : 'Break';
  const displayStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '4rem',
    fontWeight: 'bold',
    margin: '20px 0',
    color: isWorkTime ? '#34D399' : '#FCA5A5', // Green for work, Red for break
  };

  // Indicate paused state if timer is not active and time is not zero
  const statusText = isActive ? stateText : (timeRemaining === 0 ? stateText : `${stateText} (Paused)`);

  return (
    <div style={displayStyle}>
      <span>{statusText}</span>
      <span>{formatTime(timeRemaining)}</span>
    </div>
  );
};

export default TimerDisplay;
