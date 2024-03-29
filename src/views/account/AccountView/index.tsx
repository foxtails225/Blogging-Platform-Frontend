import React, { useState, FC, ChangeEvent } from 'react';
import {
  Box,
  Container,
  Divider,
  Tab,
  Tabs,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { Theme } from 'src/theme';
import General from './General';
import Subscription from './Subscription';
import Notifications from './Notifications';
import Security from './Security';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const AccountView: FC = () => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState<string>('general');

  const tabs = [
    { value: 'general', label: 'General' },
    { value: 'security', label: 'Security' }

    // TODO: activate in next dev cycle
    // { value: 'subscription', label: 'Subscription' },
    // { value: 'notifications', label: 'Notifications' },
  ];

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <Page className={classes.root} title="Settings">
      <Container maxWidth="lg">
        <Typography variant="h3" color="textPrimary">
          Settings
        </Typography>
        <Box mt={3}>
          <Tabs
            onChange={handleTabsChange}
            scrollButtons="auto"
            value={currentTab}
            variant="scrollable"
            textColor="secondary"
          >
            {tabs.map(tab => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>
        <Divider />
        <Box mt={3}>
          {currentTab === 'general' && <General />}
          {currentTab === 'subscription' && <Subscription />}
          {currentTab === 'notifications' && <Notifications />}
          {currentTab === 'security' && <Security />}
        </Box>
      </Container>
    </Page>
  );
};

export default AccountView;
