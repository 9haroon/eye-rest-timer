import React from 'react';

interface ControlButtonsProps {
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  isActive: boolean;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({ 
  onStart, 
  onPause, 
  onReset, 
  isActive 
}) => {
  return (
    <div className="control-buttons">
      {!isActive ? (
        <button onClick={onStart} aria-label="Start Timer">
          Start
        </button>
      ) : (
        <button onClick={onPause} aria-label="Pause Timer">
          Pause
        </button>
      )}
      <button onClick={onReset} aria-label="Reset Timer">
        Reset
      </button>
    </div>
  );
};
