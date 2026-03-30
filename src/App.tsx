import React, { useState, useEffect } from 'react';
import TimerDisplay from './components/TimerDisplay';
import { useTimer } from './hooks/useTimer';
import './App.css'; // Assuming this file contains global styles

function App() {
  const {
    secondsRemaining,
    isWorkTime,
    isActive,
    start,
    pause,
    reset,
  } = useTimer();

  // Placeholder for notification logic - will be integrated later
  useEffect(() => {
    if (secondsRemaining === 0 && !isActive) {
      console.log("Timer finished, showing alert (placeholder)");
      // This is where notification logic would be triggered
      // e.g., showNotification(isWorkTime ? "Break Time!" : "Work Time!");
    }
  }, [secondsRemaining, isActive, isWorkTime]);

  const handleStartPause = () => {
    if (isActive) {
      pause();
    } else {
      start();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8 text-blue-700">Eye Rest Timer</h1>
      <TimerDisplay
        secondsRemaining={secondsRemaining}
        isWorkTime={isWorkTime}
        isActive={isActive}
      />
      <div className="flex space-x-4 mt-8">
        <button
          onClick={handleStartPause}
          className={`px-8 py-4 rounded-lg text-2xl font-semibold transition-colors duration-300
                      ${isActive ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={reset}
          className="px-8 py-4 rounded-lg text-2xl font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
        >
          Reset
        </button>
      </div>
      {/* Placeholder for Settings and History links/components */}
      <div className="mt-16 text-sm text-gray-600">
        <p>Completed Work Sessions: <span className="font-bold">0</span></p> {/* Placeholder */}
      </div>
    </div>
  );
}

export default App;
