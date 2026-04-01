import React from 'react';

interface ControlButtonsProps {
  isActive: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  isActive,
  onStart,
  onPause,
  onReset,
}) => {
  return (
    <div style={{ textAlign: 'center' }}>
      {!isActive ? (
        <button onClick={onStart} style={{ marginRight: '0.5rem' }}>Start</button>
      ) : (
        <button onClick={onPause} style={{ marginRight: '0.5rem' }}>Pause</button>
      )}
      <button onClick={onReset}>Reset</button>
    </div>
  );
};

export default ControlButtons;
