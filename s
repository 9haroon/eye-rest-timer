rc/App.tsx>>>
import React from 'react';
import './index.css'; // Assuming index.css provides basic styling for the app and its components
import ControlButtons from './components/ControlButtons';
import TimerDisplay from './components/TimerDisplay';
import { useTimer } from './hooks/useTimer'; // Assuming useTimer hook is implemented and exported

function App() {
  const {
    timeRemaining,
    isWorkTime,
    isActive,
    startTimer,
    pauseTimer,
    resetTimer,
    workDuration,
    breakDuration,
  } = useTimer();

  // --- Button State Logic ---
  // The logic here determines when each button should be enabled or disabled.

  // Start Button:
  // - Disabled if the timer is currently active.
  // - Enabled if the timer is paused or has just finished a cycle (timeRemaining is 0) and needs to start a new one.
  const disableStart = isActive;

  // Pause Button:
  // - Disabled if the timer is not active (paused or at the beginning/end of a cycle).
  // - Enabled if the timer is actively running.
  const disablePause = !isActive;

  // Reset Button:
  // - Disabled if the timer is at its initial state (i.e., timeRemaining === workDuration and !isActive).
  //   This prevents resetting when there's nothing to reset.
  // - Enabled otherwise (if timer is running, paused, or has finished a cycle).
  const disableReset = !isActive && timeRemaining === workDuration;

  // Format time for display (e.g., MM:SS)
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app-container">
      <h1>Eye Rest Timer</h1>
      <TimerDisplay
        timeRemaining={formatTime(timeRemaining)}
        isWorkTime={isWorkTime}
        isActive={isActive}
      />
      <div className="controls-wrapper">
        <ControlButtons
          onStart={() => {
            // When Start is pressed:
            // If timer is at 0 (finished cycle), `useTimer`'s startTimer handles resetting to the appropriate duration for the next cycle.
            // If timer is paused, it resumes.
            // If timer is at initial state, it starts.
            startTimer();
          }}
          onPause={pauseTimer}
          onReset={() => {
            // Resetting always brings the timer back to the default work duration and state.
            resetTimer();
          }}
          isStartDisabled={disableStart}
          isPauseDisabled={disablePause}
          isResetDisabled={disableReset}
        />
      </div>
      {/* Placeholder for other components like SettingsPanel, History, etc. */}
    </div>
  );
}

export default App;
