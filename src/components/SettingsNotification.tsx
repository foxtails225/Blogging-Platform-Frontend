import React, { useState, useEffect, FC } from 'react';
import Cookies from 'js-cookie';
import {
  Box,
  Button,
  Paper,
  Portal,
  Typography,
  makeStyles
} from '@material-ui/core';
import useSettings from 'src/hooks/useSettings';
import { Theme } from 'src/theme';
import { THEMES } from 'src/constants';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 420,
    position: 'fixed',
    top: 0,
    right: 0,
    margin: theme.spacing(3),
    outline: 'none',
    zIndex: 2000,
    padding: theme.spacing(2)
  }
}));

const SettingsNotification: FC = () => {
  const classes = useStyles();
  const [isOpen, setOpen] = useState<boolean>(false);
  const { saveSettings } = useSettings();

  const handleSwitch = (): void => {
    const storedData: string | null = window.localStorage.getItem('settings');
    const setting = storedData
      ? JSON.parse(storedData)
      : { responsiveFontSizes: true, theme: THEMES.LIGHT };
      
    saveSettings(setting);
    Cookies.set('settingsUpdated', 'true');
    setOpen(false);
  };

  const handleClose = (): void => {
    Cookies.set('settingsUpdated', 'true');
    setOpen(false);
  };

  useEffect(() => {
    const settingsUpdated = Cookies.get('settingsUpdated');

    if (!settingsUpdated) {
      setOpen(true);
    }
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
      <Paper className={classes.root} elevation={3}>
        <Typography variant="h4" color="textPrimary" gutterBottom>
          Settings Updated
        </Typography>
        <Typography variant="body2" color="textSecondary">
          We automatically updated your settings. You change the settings any
          time from your dashboard settings.
        </Typography>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={handleClose}>Close</Button>
          <Button color="secondary" variant="contained" onClick={handleSwitch}>
            Switch
          </Button>
        </Box>
      </Paper>
    </Portal>
  );
};

export default SettingsNotification;
