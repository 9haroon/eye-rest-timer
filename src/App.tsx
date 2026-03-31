```typescript
import React from 'react';
import TimerDisplay from './components/TimerDisplay';
import ControlButtons from './components/ControlButtons';
import { useTimer } from './hooks/useTimer';
import './App.css'; // Assuming basic styling will be added

function App() {
  const {
    remainingTime,
    isWorkTime,
    isActive,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimer();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Eye Rest Timer</h1>
        <TimerDisplay remainingTime={remainingTime} isWorkTime={isWorkTime} />
        <ControlButtons
          isActive={isActive}
          startTimer={startTimer}
          pauseTimer={pauseTimer}
          resetTimer={resetTimer}
        />
        {/* Placeholder for future settings and history components */}
        <div style={{ marginTop: '20px', fontSize: '0.8em' }}>
          <p>Settings Panel Placeholder</p>
          <p>Session History Placeholder</p>
        </div>
      </header>
    </div>
  );
}

export default App;
```
