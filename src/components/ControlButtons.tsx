import React from 'react';

interface ControlButtonsProps {
  isActive: boolean;
  isWorkTime: boolean; // To potentially disable pause/reset during break if needed, or for logic.
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  isActive,
  isWorkTime,
  onStart,
  onPause,
  onReset,
}) => {
  return (
    <div className="control-buttons">
      {!isActive ? (
        <button onClick={onStart} className="btn btn-primary">
          Start
        </button>
      ) : (
        <button onClick={onPause} className="btn btn-secondary">
          Pause
        </button>
      )}
      <button onClick={onReset} className="btn btn-danger" disabled={!isActive && isWorkTime}>
        Reset
      </button>
    </div>
  );
};

export default ControlButtons;
