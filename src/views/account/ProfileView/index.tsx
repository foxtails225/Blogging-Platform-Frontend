import React, {
  useCallback,
  useState,
  useEffect,
  FC,
  ChangeEvent
} from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {
  Box,
  Container,
  Divider,
  Tab,
  Tabs,
  makeStyles
} from '@material-ui/core';
import { Theme } from 'src/theme';
import axios from 'src/utils/axios';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Page from 'src/components/Page';
import { User } from 'src/types/user';
import Header from './Header';
import Profile from './Profile';
import ReadingList from './ReadingList';
import Dashboard from './Dashboard';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%'
  }
}));

const ProfileView: FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const isMountedRef = useIsMountedRef();
  const { user } = useAuth();
  const [tabs, setTabs] = useState<any[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    if (profile) {
      let values =
        profile.email === user.email
          ? [
              { value: 'profile', label: 'Profile' },
              { value: 'reading', label: 'reading list' },
              { value: 'dashboard', label: 'Dashboard' }
            ]
          : [{ value: 'profile', label: 'Profile' }];
      setTabs(values);
    }
  }, [user, profile]);

  const handleTabsChange = (event: ChangeEvent, value: string): void => {
    setCurrentTab(value);
  };

  const getPosts = useCallback(async () => {
    let response: any;

    try {
      if (location.pathname === '/account/profile') {
        response = await axios.get<{ user: User }>('/account/about');
      } else {
        response = await axios.get<{ user: User }>(
          location.pathname + '/about'
        );
      }

      if (isMountedRef.current) {
        setProfile(response.data.user);
      }
    } catch (err) {
      history.push('/404');
    }
  }, [isMountedRef, location.pathname, history]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  if (!profile) {
    return null;
  }

  return (
    <Page className={classes.root} title="Profile">
      <Header profile={profile} />
      <Container maxWidth="lg">
        <Box mt={3}>
          <Tabs
            onChange={handleTabsChange}
            scrollButtons="auto"
            value={currentTab}
            textColor="secondary"
            variant="scrollable"
          >
            {tabs.map(tab => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>
        <Divider />
        <Box py={3} pb={6}>
          {currentTab === 'profile' && <Profile profile={profile} />}
          {currentTab === 'reading' && <ReadingList profile={profile} />}
          {currentTab === 'dashboard' && <Dashboard profile={profile} />}
        </Box>
      </Container>
    </Page>
  );
};

export default ProfileView;
