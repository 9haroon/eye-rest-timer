import React, { useState, useEffect } from 'react';
import './App.css'; // Assuming basic styling will be in App.css
import TimerDisplay from './components/TimerDisplay';
import ControlButtons from './components/ControlButtons';
import { useTimer } from './hooks/useTimer';

// Define default durations in milliseconds
const WORK_DURATION_MS = 20 * 60 * 1000; // 20 minutes
const BREAK_DURATION_MS = 20 * 1000; // 20 seconds

function App() {
  // Use the custom hook for timer logic
  const [
    { timeRemaining, isWorkTime, isActive },
    { start, pause, reset, setIsActive, setIsWorkTime, setTimeRemaining }
  ] = useTimer(WORK_DURATION_MS, BREAK_DURATION_MS);

  // --- Notification Logic Placeholder ---
  // This part will be expanded in later tasks to handle actual notifications
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    if (!isActive && timeRemaining <= 0) {
      if (isWorkTime) { // Just finished a work interval
        // Transition to break state
        setIsWorkTime(false);
        setTimeRemaining(BREAK_DURATION_MS);
        setNotificationMessage("Time for a 20-second break! Look 20 feet away.");
        setShowNotification(true);
        // Optionally play a sound
      } else { // Just finished a break interval
        // Transition back to work state
        setIsWorkTime(true);
        setTimeRemaining(WORK_DURATION_MS);
        // No notification needed for end of break, auto-starts work
      }
    } else if (isActive && timeRemaining <= 0 && !isWorkTime) {
        // This case should ideally not be hit if logic above is correct,
        // but ensures break ends and work starts.
        setIsWorkTime(true);
        setTimeRemaining(WORK_DURATION_MS);
        setShowNotification(false); // Hide break notification if still somehow visible
    }
  }, [isActive, timeRemaining, isWorkTime, setIsActive, setIsWorkTime, setTimeRemaining]);

  // Handle dismissing the notification
  const handleDismissNotification = () => {
    setShowNotification(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Eye Rest Timer</h1>
      </header>
      <main>
        <TimerDisplay
          timeRemaining={timeRemaining}
          isWorkTime={isWorkTime}
          isActive={isActive}
        />
        <ControlButtons
          isActive={isActive}
          isWorkTime={isWorkTime}
          onStart={start}
          onPause={pause}
          onReset={reset}
        />

        {/* Placeholder for Break Notification */}
        {showNotification && !isActive && ( // Show notification only when not actively running and break is over
          <div className="notification-overlay">
            <div className="notification-content">
              <p>{notificationMessage}</p>
              <button onClick={handleDismissNotification} className="btn btn-secondary">
                Got it
              </button>
            </div>
          </div>
        )}
      </main>
      <footer>
        {/* Placeholder for Settings and History links/components */}
        <p>© 2026 Eye Rest Timer</p>
      </footer>
    </div>
  );
}

export default App;
