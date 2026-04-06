import React, { useState, useEffect } from 'react';
import { useTimer } from './hooks/useTimer';
import { useNotification } from './hooks/useNotification';
import { ControlButtons } from './components/ControlButtons';
import { SettingsPanel } from './components/SettingsPanel';
import './index.css';

const App: React.FC = () => {
  const { timeLeft, mode, isActive, start, pause, reset } = useTimer();
  const { permission, requestPermission, showNotification } = useNotification();
  const [showSettings, setShowSettings] = useState(false);

  // Request permission on initial mount if not already granted
  useEffect(() => {
    if (permission === 'default') {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Trigger notification on mode change to break
  useEffect(() => {
    if (mode === 'break' && timeLeft === 20) {
      showNotification('Time for a 20-second break!', {
        body: 'Look at something 20 feet away for 20 seconds.',
        icon: '/favicon.ico', // Placeholder for app icon
      });
    }
  }, [mode, timeLeft, showNotification]);

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
        <button onClick={() => setShowSettings(true)}>Settings</button>
      </header>
      <main>
        {showSettings ? (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
};

export default App;
