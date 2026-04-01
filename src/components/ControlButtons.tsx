import React from 'react';

interface ControlButtonsProps {
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  isActive: boolean;
  timeRemaining: number;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  onStart,
  onPause,
  onReset,
  isActive,
  timeRemaining,
}) => {
  // Determine if the timer has finished its last cycle and is ready for a new one.
  // This happens when isActive is false and timeRemaining indicates the end of a cycle.
  // A simple heuristic is that if isActive is false and timeRemaining is NOT the initial work duration,
  // it implies a cycle has completed and needs to be reset or started fresh.
  // However, the hook's logic ensures that after a cycle finishes, timeRemaining is set to the *next* duration.
  // So, timeRemaining === 0 is a transient state.
  // A more robust check is if it's not active and timeRemaining is not the default work duration.
  // For this P0 task, we can simplify and consider "Start New" when not active and time is not the default starting value.
  // But given the reset() function sets it to DEFAULT_WORK_DURATION, we can infer from isActive.

  const isTimerAtStartOrReset = timeRemaining === (20 * 60); // Assuming default work duration is 20*60

  return (
    <div className="control-buttons">
      {isActive ? (
        <button onClick={onPause}>Pause</button>
      ) : (
        <>
          <button onClick={onStart}>
            {isTimerAtStartOrReset ? 'Start' : 'Resume'}
          </button>
          <button onClick={onReset}>Reset</button>
        </>
      )}
    </div>
  );
};

export default ControlButtons;
