import React, { FC } from 'react';
import { capitalCase } from 'change-case';
import {
  Box,
  FormControlLabel,
  Switch,
  colors,
  makeStyles,
  Theme
} from '@material-ui/core';
import useSettings from 'src/hooks/useSettings';
import { THEMES } from 'src/constants';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .MuiSwitch-track': {
      backgroundColor: `${colors.green[800]} !important`
    }
  }
}));

const Settings: FC = () => {
  const classes = useStyles();
  const { settings, saveSettings } = useSettings();

  const handleChange = (value: boolean): void => {
    const theme = value ? THEMES.ONE_DARK : THEMES.LIGHT;
    saveSettings({
      responsiveFontSizes: settings.responsiveFontSizes,
      theme
    });
  };

  return (
    <Box className={classes.root}>
      <FormControlLabel
        control={
          <Switch
            edge="start"
            name="direction"
            checked={settings.theme === THEMES.ONE_DARK}
            onChange={event => handleChange(event.target.checked)}
            style={{ color: colors.green[800] }}
          />
        }
        label={capitalCase('Dark')}
      />
    </Box>
  );
};

export default Settings;
