import React, { useState } from 'react';
import { useTimer } from './hooks/useTimer';
import TimerDisplay from './components/TimerDisplay';
import ControlButtons from './components/ControlButtons';
import './index.css'; // Assuming global styles are imported here

const WORK_DURATION_SECONDS = 20 * 60; // 20 minutes
const BREAK_DURATION_SECONDS = 20; // 20 seconds

function App() {
  const [sessionCount, setSessionCount] = useState(0);

  const {
    countdown,
    timerType,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime,
  } = useTimer({
    initialWorkDuration: WORK_DURATION_SECONDS,
    initialBreakDuration: BREAK_DURATION_SECONDS,
    onWorkComplete: () => {
      console.log('Work timer completed. Starting break.');
      setSessionCount(prev => prev + 1); // Increment session count
      // Future: Trigger notifications here
    },
    onBreakComplete: () => {
      console.log('Break timer completed. Starting next work session.');
      // Future: Trigger notifications or other actions
    },
  });

  // Determine the display label based on timerType
  const displayLabel = timerType === 'work' ? 'Work Time' : 'Break Time';

  return (
    <div className="app-container">
      <h1>Eye Rest Timer</h1>
      <div className={`timer-display ${timerType}`}>
        <TimerDisplay
          time={formatTime(countdown)}
          label={displayLabel}
        />
      </div>
      <div className="controls">
        <ControlButtons
          isRunning={isRunning}
          onStart={startTimer}
          onPause={pauseTimer}
          onReset={() => {
            resetTimer();
            // For this task, we don't reset sessionCount on reset.
          }}
        />
      </div>
      <div className="session-info">
        <p>Completed Sessions: {sessionCount}</p>
      </div>
      {/* SettingsPanel and other components will be added later */}
    </div>
  );
}

export default App;
