```typescript
import React from 'react';

interface ControlButtonsProps {
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    isActive: boolean;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ onStart, onPause, onReset, isActive }) => {
    return (
        <div className="control-buttons">
            {!isActive ? (
                <button onClick={onStart} className="start-button">
                    Start
                </button>
            ) : (
                <button onClick={onPause} className="pause-button">
                    Pause
                </button>
            )}
            <button onClick={onReset} className="reset-button">
                Reset
            </button>
        </div>
    );
};

export default ControlButtons;
```
