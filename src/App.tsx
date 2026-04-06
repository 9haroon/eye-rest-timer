import React from 'react';
import { useTimer } from './hooks/useTimer';
import { ControlButtons } from './components/ControlButtons';
import './index.css';

const App: React.FC = () => {
  const { timeLeft, isActive, start, pause, reset } = useTimer();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="app-container">
      <header>
        <h1>Eye Rest Timer</h1>
      </header>
      <main>
        <div className="timer-display">
          {formatTime(timeLeft)}
        </div>
        <ControlButtons 
          onStart={start} 
          onPause={pause} 
          onReset={reset} 
          isActive={isActive} 
        />
      </main>
    </div>
  );
};

export default App;
