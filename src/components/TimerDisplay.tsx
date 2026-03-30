import React from 'react';

interface TimerDisplayProps {
  secondsRemaining: number;
  isWorkTime: boolean;
  isActive: boolean;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');
  return `${paddedMinutes}:${paddedSeconds}`;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ secondsRemaining, isWorkTime, isActive }) => {
  const timerLabel = isWorkTime ? 'Work Time' : 'Break Time';
  const timerClass = isWorkTime ? 'text-green-500' : 'text-red-500'; // Example styling, assuming Tailwind CSS

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`text-8xl font-bold ${timerClass} transition-colors duration-500 ease-in-out`}>
        {formatTime(secondsRemaining)}
      </div>
      <div className="mt-4 text-2xl font-semibold text-gray-700">
        {timerLabel}
      </div>
      {/* Visual indicator for active/paused state could be added here */}
      {!isActive && secondsRemaining > 0 && (
        <div className="mt-2 text-lg text-gray-500">Paused</div>
      )}
       {secondsRemaining === 0 && !isActive && (
        <div className="mt-2 text-lg text-gray-500">Time's up!</div>
      )}
    </div>
  );
};

export default TimerDisplay;
