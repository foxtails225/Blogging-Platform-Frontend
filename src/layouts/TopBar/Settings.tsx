import React, { FC } from 'react';
import { capitalCase } from 'change-case';
import { Box, FormControlLabel, Switch } from '@material-ui/core';
import useSettings from 'src/hooks/useSettings';
import { THEMES } from 'src/constants';

const Settings: FC = () => {
  const { settings, saveSettings } = useSettings();

  const handleChange = (value: boolean): void => {
    const theme = value ? THEMES.ONE_DARK : THEMES.LIGHT;
    saveSettings({
      responsiveFontSizes: settings.responsiveFontSizes,
      theme
    });
  };

  return (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={settings.theme === THEMES.ONE_DARK}
            edge="start"
            name="direction"
            onChange={event => handleChange(event.target.checked)}
          />
        }
        label={capitalCase('Dark')}
      />
    </Box>
  );
};

export default Settings;
