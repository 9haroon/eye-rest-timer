import React from 'react';
import { useTimer } from './hooks/useTimer';
import TimerDisplay from './components/TimerDisplay';
import ControlButtons from './components/ControlButtons';
import './index.css'; // Assuming this contains basic styling

function App() {
  const {
    timeRemaining,
    currentState,
    isActive,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimer();

  return (
    <div className="App" style={{ paddingTop: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Eye Rest Timer</h1>
      <TimerDisplay timeRemaining={timeRemaining} currentState={currentState} />
      <ControlButtons
        isActive={isActive}
        onStart={startTimer}
        onPause={pauseTimer}
        onReset={resetTimer}
      />
      {/* Placeholder for potential settings or history later */}
      <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#555' }}>
        Current Timer State: {currentState.toUpperCase()}
      </p>
    </div>
  );
}

export default App;
