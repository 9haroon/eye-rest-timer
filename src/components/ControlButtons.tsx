import React from 'react';

interface ControlButtonsProps {
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  isActive: boolean;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ onStart, onPause, onReset, isActive }) => {
  const buttonBaseStyle: React.CSSProperties = {
    padding: '12px 24px',
    margin: '0 10px',
    fontSize: '1.1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease',
  };

  const startButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#4CAF50', // Green
    color: 'white',
  };

  const pauseButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#FFC107', // Amber/Yellow
    color: 'black',
  };

  const resetButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#F44336', // Red
    color: 'white',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', marginBottom: '20px' }}>
      <button onClick={onStart} style={startButtonStyle} disabled={isActive}>
        Start
      </button>
      <button onClick={onPause} style={pauseButtonStyle} disabled={!isActive}>
        Pause
      </button>
      <button onClick={onReset} style={resetButtonStyle}>
        Reset
      </button>
    </div>
  );
};

export default ControlButtons;
