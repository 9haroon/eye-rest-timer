import React from 'react';

interface TimerDisplayProps {
  timeRemaining: number;
  currentState: 'work' | 'break';
}

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');
  return `${paddedMinutes}:${paddedSeconds}`;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeRemaining, currentState }) => {
  const formattedTime = formatTime(timeRemaining);
  // Example styling, actual styling will be in index.css or a dedicated CSS module
  const displayStyle = {
    color: currentState === 'work' ? '#4CAF50' : '#FFC107', // Green for work, Amber for break
    fontSize: '4rem',
    textAlign: 'center' as const,
    marginBottom: '2rem',
  };

  return (
    <div style={displayStyle}>
      {formattedTime}
    </div>
  );
};

export default TimerDisplay;
