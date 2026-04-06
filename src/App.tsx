import React, { useState, useEffect } from 'react';
import TimerDisplay from './components/TimerDisplay';
import { useTimer, TimerType } from './hooks/useTimer';
import './App.css'; // Assuming basic CSS for styling

function App() {
  const {
    timeRemaining,
    timerType,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    setWorkDuration, // Not directly used in this task but good to have
    setBreakDuration, // Not directly used in this task but good to have
  } = useTimer();

  const [isClient, setIsClient] = useState(false);

  // Hydration check for SSR or static rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Basic styling for work/break states. In a real app, this would be more sophisticated (CSS classes, themes)
  const getContainerClasses = (): string => {
    let classes = 'min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500 ';
    if (timerType === 'work') {
      classes += 'bg-gradient-to-br from-green-100 to-green-300';
    } else {
      classes += 'bg-gradient-to-br from-blue-100 to-blue-300';
    }
    return classes;
  };

  // Ensure timer is only active when isRunning is true AND timeRemaining > 0
  // The useTimer hook handles the internal logic for transitions, but we pass isRunning for button control
  const isTimerActive = isRunning && timeRemaining > 0;

  return (
    <div className={getContainerClasses()}>
      {isClient ? (
        <>
          <TimerDisplay timeRemaining={timeRemaining} timerType={timerType} />
          <div className="mt-8 flex space-x-4">
            {!isTimerActive ? (
              <button
                onClick={startTimer}
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Start
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
              >
                Pause
              </button>
            )}
            <button
              onClick={resetTimer}
              className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Reset
            </button>
          </div>
          {/* Placeholder for future Settings and History components */}
          <div className="absolute bottom-4 left-4 text-sm text-gray-600">
            {timerType === 'work' ? 'Focus on your tasks!' : 'Time to rest your eyes.'}
          </div>
        </>
      ) : (
        <div className="text-center p-8">
          <p className="text-2xl">Loading timer...</p>
        </div>
      )}
    </div>
  );
}

export default App;
