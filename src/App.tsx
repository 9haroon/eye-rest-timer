import React from 'react';
import { useTimer } from './hooks/useTimer';
import { ControlButtons } from './components/ControlButtons';
import './index.css';

const App: React.FC = () => {
  const { timeLeft, mode, isActive, start, pause, reset } = useTimer();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const statusLabel = mode === 'work' ? 'Work Session' : 'Eye Rest Break';

  return (
    <div className={`app-container ${mode}`}>
      <header>
        <h1>Eye Rest Timer</h1>
      </header>
      <main>
        <div className={`timer-display ${mode}`}>
          <div className="status">{statusLabel}</div>
          <div className="time">{formatTime(timeLeft)}</div>
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
