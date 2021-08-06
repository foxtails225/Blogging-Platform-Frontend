import React, {
  FC,
  useState,
  useEffect,
  useCallback,
  ChangeEvent
} from 'react';
import { Container, Box, Tab, Tabs, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { Theme } from 'src/theme';
import { User } from 'src/types/user';
import Overview from './Overview';
import Payment from './Payment';
import Announcement from './Announcement';

const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'alert', label: 'Announcement' },
  { value: 'payment', label: 'Transactions' }
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const AdminView: FC = () => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [profile, setProfile] = useState<User | null>(null);

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

  const handleTabsChange = (event: ChangeEvent, value: string): void =>
    setCurrentTab(value);

  return (
    <Page className={classes.root} title="Administrator">
      <Container maxWidth={false}>
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
        <Box py={3} pb={6}>
          {currentTab === 'alert' && <Announcement profile={profile} />}
          {currentTab === 'overview' && <Overview />}
          {currentTab === 'payment' && <Payment profile={profile} />}
        </Box>
      </Container>
    </Page>
  );
};

export default AdminView;
