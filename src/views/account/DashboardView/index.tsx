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
import Posts from './Posts';
import Reading from './Reading';
import Archive from './Archive';
import Authors from './Authors';
import Followers from './Followers';
import Payment from './Payment';

const tabs = [
  { value: 'posts', label: 'posts' },
  { value: 'reading', label: 'dank reads' },
  { value: 'archive', label: 'Archive' },
  { value: 'payment', label: 'payment' },
  { value: 'followers', label: 'followers' },
  { value: 'tags', label: 'tickers followed' },
  { value: 'authors', label: 'Authors Followed' }
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
  const [currentTab, setCurrentTab] = useState<string>('payment');
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
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth="lg">
        <Header />
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
          {currentTab === 'posts' && <Posts profile={profile} />}
          {currentTab === 'reading' && <Reading profile={profile} />}
          {currentTab === 'authors' && <Authors profile={profile} />}
          {currentTab === 'followers' && <Followers profile={profile} />}
          {currentTab === 'archive' && <Archive profile={profile} />}
          {currentTab === 'payment' && <Payment profile={profile} />}
        </Box>
      </Container>
    </Page>
  );
};

export default OverviewView;
