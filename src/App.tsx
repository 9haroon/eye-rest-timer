import React from 'react';
import TimerDisplay from './components/TimerDisplay';
import ControlButtons from './components/ControlButtons';
import { useTimer } from './hooks/useTimer';
import './index.css'; // Assuming basic CSS is imported globally

function App() {
  const {
    timeRemaining,
    isWorkTime,
    isActive,
    start,
    pause,
    reset,
  } = useTimer();

  // Handler for starting the timer.
  // If the timer is not active, it will start the current state (work or break).
  // The useTimer hook manages transitioning to the next state when time runs out.
  const handleStart = () => {
    start();
  };

  // Handler for pausing the timer.
  const handlePause = () => {
    pause();
  };

  // Handler for resetting the timer.
  // This will stop the timer and set it back to the initial work duration.
  const handleReset = () => {
    reset();
  };

  // Prepare display information
  const timerLabel = isWorkTime ? 'Work' : 'Break';

  return (
    <div className="app-container">
      <h1>Eye Rest Timer</h1>
      <TimerDisplay
        timeRemaining={timeRemaining}
        isWorkTime={isWorkTime}
        isActive={isActive}
      />
      <ControlButtons
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        isActive={isActive}
        timeRemaining={timeRemaining}
      />
      
      {/* Status indicators for debugging or user feedback - can be removed later */}
      <div className="status-indicators" style={{ marginTop: '20px', fontSize: '0.9em', color: '#555' }}>
        <p>Timer State: {isActive ? 'Running' : 'Paused/Stopped'}</p>
        <p>Current Mode: {timerLabel}</p>
        <p>Time Remaining: {timeRemaining}s</p>
      </div>
    </div>
  );
}

export default App;
