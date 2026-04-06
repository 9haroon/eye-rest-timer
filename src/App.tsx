import React from 'react';
import { useTimer } from './hooks/useTimer';
import './index.css';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const App: React.FC = () => {
  const { timeLeft, mode, isActive, start, pause, reset } = useTimer({
    workDuration: 1200,
    breakDuration: 20,
    onTimerEnd: (mode) => {
      console.log(`Timer finished in ${mode} mode`);
    },
  });

  return (
    <div className="container">
      <header>
        <h1>Eye Rest Timer</h1>
      </header>

      <main className={`timer-display ${mode}`}>
        <div className="status">
          {mode === 'work' ? 'Work Session' : 'Eye Break'}
        </div>
        <div className="time">
          {formatTime(timeLeft)}
        </div>
      </main>

      <div className="controls">
        {!isActive ? (
          <button onClick={start}>Start</button>
        ) : (
          <button onClick={pause}>Pause</button>
        )}
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
};

export default App;
