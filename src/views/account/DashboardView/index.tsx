import React, {
  FC,
  useState,
  useEffect,
  useCallback,
  ChangeEvent
} from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Divider,
  makeStyles
} from '@material-ui/core';
import { Theme } from 'src/theme';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Page from 'src/components/Page';
import { User } from 'src/types/user';
import Header from './Header';
import Statistics from './Statistics';
import Notifications from './Notifications';
import Posts from './Posts';
import Reading from './Reading';
import Archive from './Archive';

const tabs = [
  { value: 'posts', label: 'posts' },
  { value: 'reading', label: 'dank read' },
  { value: 'archive', label: 'Archive' },
  { value: 'payment', label: 'payment' },
  { value: 'fowllers', label: 'followers' },
  { value: 'tags', label: 'following tags' },
  { value: 'authors', label: 'following Authors' }
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const OverviewView: FC = () => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [currentTab, setCurrentTab] = useState<string>('posts');
  const [profile, setProfile] = useState<User | null>(null);

  const handleTabsChange = (event: ChangeEvent, value: string): void => {
    setCurrentTab(value);
  };

  const getPosts = useCallback(async () => {
    const response = await axios.get<{ user: User }>('/account/about');

    if (isMountedRef.current) {
      setProfile(response.data.user);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  if (!profile) {
    return null;
  }

  return (
    <Page className={classes.root} title="Overview">
      <Container maxWidth="lg">
        <Header />
        <Box mt={3}>
          <Statistics />
        </Box>
        <Box mt={6}>
          <Notifications />
        </Box>
        <Box mt={6}>
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
          {currentTab === 'reading' && <Reading profile={profile} />}
          {currentTab === 'archive' && <Archive profile={profile} />}
          {currentTab === 'posts' && <Posts />}
        </Box>
      </Container>
    </Page>
  );
};

export default OverviewView;
