import React, {
  createContext,
  useEffect,
  useState
} from 'react';
import type { FC, ReactNode } from 'react';
import _ from 'lodash';
import { THEMES } from 'src/constants';

interface Settings {
  responsiveFontSizes?: boolean;
  theme?: string;
}

export interface SettingsContextValue {
  settings: Settings;
  saveSettings: (update: Settings) => void;
}

interface SettingsProviderProps {
  settings?: Settings;
  children?: ReactNode;
}

const defaultSettings: Settings = {
  responsiveFontSizes: true,
  theme: THEMES.ONE_DARK
};

export const restoreSettings = (): Settings | null => {
  let settings = null;

  try {
    const storedData: string | null = window.localStorage.getItem('settings');

    if (storedData) {
      settings = JSON.parse(storedData);
    }
  } catch (err) {
    console.error(err);
  }

  return settings;
};

export const storeSettings = (settings: Settings): void => {
  window.localStorage.setItem('settings', JSON.stringify(settings));
};

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  saveSettings: () => { }
});

export const SettingsProvider: FC<SettingsProviderProps> = ({ settings, children }) => {
  const [currentSettings, setCurrentSettings] = useState<Settings>(settings || defaultSettings);

  const handleSaveSettings = (update: Settings = {}): void => {
    const mergedSettings = _.merge({}, currentSettings, update);

    setCurrentSettings(mergedSettings);
    storeSettings(mergedSettings);
  };

  useEffect(() => {
    const restoredSettings = restoreSettings();

    if (restoredSettings) {
      setCurrentSettings(restoredSettings);
    }
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings: currentSettings,
        saveSettings: handleSaveSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const SettingsConsumer = SettingsContext.Consumer;

export default SettingsContext;
