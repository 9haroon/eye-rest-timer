import React, { useState } from 'react';
import { usePreferences, UserPreferences } from '../hooks/usePreferences';

export const SettingsPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { preferences, updatePreferences } = usePreferences();
  const [localPrefs, setLocalPrefs] = useState<UserPreferences>(preferences);

  const handleSave = () => {
    updatePreferences(localPrefs);
    onClose();
  };

  return (
    <div className="settings-panel">
      <h2>Settings</h2>
      <label>
        Work Duration (minutes):
        <input
          type="number"
          value={localPrefs.timerDuration}
          onChange={(e) => setLocalPrefs({ ...localPrefs, timerDuration: parseInt(e.target.value) })}
        />
      </label>
      <label>
        Break Duration (seconds):
        <input
          type="number"
          value={localPrefs.breakDuration}
          onChange={(e) => setLocalPrefs({ ...localPrefs, breakDuration: parseInt(e.target.value) })}
        />
      </label>
      <label>
        Enable Sound Notifications:
        <input
          type="checkbox"
          checked={localPrefs.soundEnabled}
          onChange={(e) => setLocalPrefs({ ...localPrefs, soundEnabled: e.target.checked })}
        />
      </label>
      <div className="actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};
