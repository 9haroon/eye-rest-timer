import React from 'react';
import TimerDisplay from './components/TimerDisplay';
import ControlButtons from './components/ControlButtons';
import { useTimer } from './hooks/useTimer';
import './App.css'; // Assuming a CSS file might exist for general styling

function App() {
  const [{ timeRemaining, isWorkTime, isActive }, { start, pause, reset }] = useTimer();

  // The automatic transition logic is handled within the useTimer hook's useEffect.
  // This App component orchestrates the rendering of the UI elements.

  return (
    <div className="App" style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '50px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Eye Rest Timer</h1>
      <TimerDisplay timeRemaining={timeRemaining} isWorkTime={isWorkTime} isActive={isActive} />
      <ControlButtons
        onStart={start}
        onPause={pause}
        onReset={reset}
        isActive={isActive}
      />
      {/* Display a message during the brief transition phase when the timer is not active but waiting to restart */}
      {timeRemaining === 0 && !isActive && (isWorkTime ?
        <p>Work session ended. Starting break...</p> :
        <p>Break ended. Starting next work session...</p>
      )}
    </div>
  );
}

export default App;
