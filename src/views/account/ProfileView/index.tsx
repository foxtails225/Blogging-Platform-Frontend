import React, { useCallback, useState, useEffect, FC } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Box, Container, Divider, makeStyles } from '@material-ui/core';
import { Theme } from 'src/theme';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Page from 'src/components/Page';
import { User } from 'src/types/user';
import Header from './Header';
import Profile from './Profile';

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
  const [profile, setProfile] = useState<User | null>(null);

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
        <Box py={3} pb={6}>
          <Profile profile={profile} />
        </Box>
        <Divider />
      </Container>
    </Page>
  );
};

export default ProfileView;
