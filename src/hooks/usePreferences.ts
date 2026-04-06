import { useState, useEffect } from 'react';

export interface UserPreferences {
  timerDuration: number;
  breakDuration: number;
  soundEnabled: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  timerDuration: 20,
  breakDuration: 20,
  soundEnabled: true,
};

const STORAGE_KEY = 'eye_rest_preferences';

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPrefs }));
  };

  return { preferences, updatePreferences };
};
