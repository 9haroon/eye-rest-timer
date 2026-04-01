rc/App.tsx
import React from 'react';
import TimerDisplay from './components/TimerDisplay';
import ControlButtons from './components/ControlButtons';
// Assuming useTimer hook is correctly implemented and exported,
// providing at least: timeRemaining, isWorkTime, isActive, start, pause, reset.
import useTimer from './hooks/useTimer'; 
import './App.css'; // For general app layout/styling
import './index.css'; // Import global styles including state-specific classes

function App() {
  // Destructure relevant states and controls from the custom hook
  // isWorkTime will be used to apply styling for visual state indicators.
  const { timeRemaining, isWorkTime, isActive, start, pause, reset } = useTimer();

  // Apply state-specific class to the root container for global styling
  // This allows .work-state and .break-state classes defined in index.css
  // to influence the overall app appearance.
  const appContainerClasses = `app-container ${isWorkTime ? 'work-state' : 'break-state'}`;

  return (
    <div className={appContainerClasses}> 
      <header>
        <h1>Eye Rest Timer</h1>
      </header>
      <main>
        <TimerDisplay 
          timeRemaining={timeRemaining} 
          isWorkTime={isWorkTime} // Pass down the current work/break state for visual differentiation
        />
        <ControlButtons 
          isActive={isActive}
          start={start}
          pause={pause}
          reset={reset}
          // Note: isWorkTime could also be passed to ControlButtons if buttons need state-dependent styling
        />
        {/* Placeholders for Settings and History components */}
      </main>
    </div>
  );
}

export default App;
