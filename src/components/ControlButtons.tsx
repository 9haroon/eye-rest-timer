```typescript
import React from 'react';

interface ControlButtonsProps {
  isActive: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ isActive, startTimer, pauseTimer, resetTimer }) => {
  return (
    <div>
      {!isActive ? (
        <button onClick={startTimer}>Start</button>
      ) : (
        <button onClick={pauseTimer}>Pause</button>
      )}
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
};

export default ControlButtons;
```
