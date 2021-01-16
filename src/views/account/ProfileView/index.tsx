import React, {
  useCallback,
  useState,
  useEffect,
  FC,
  ChangeEvent
} from 'react';
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
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Page from 'src/components/Page';
import { User } from 'src/types/user';
import Header from './Header';
import Profile from './Profile';
// import ReadingList from './ReadingList';
// import Connections from './Connections';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%'
  }
}));

const ProfileView: FC = () => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [currentTab, setCurrentTab] = useState<string>('profile');
  const [profile, setProfile] = useState<User | null>(null);

  const tabs = [
    { value: 'profile', label: 'Profile' },
    { value: 'reading', label: 'reading list' },
    { value: 'dashboard', label: 'Dashboard' }
    // { value: 'connections', label: 'Connections' }
  ];

  const handleTabsChange = (event: ChangeEvent, value: string): void => {
    setCurrentTab(value);
  };

  const getPosts = useCallback(async () => {
    try {
      const response = await axios.get<{ user: User }>('/account/about');

      if (isMountedRef.current) {
        setProfile(response.data.user);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

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
          {/* {currentTab === 'reading' && <ReadingList profile={profile} />} */}
          {/* {currentTab === 'connections' && <Connections />} */}
        </Box>
      </Container>
    </Page>
  );
};

export default ProfileView;
