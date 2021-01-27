import React, { useState, useEffect, useCallback, FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, Box, makeStyles } from '@material-ui/core';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { Post } from 'src/types/post';
import { User } from 'src/types/user';
import { Theme } from 'src/theme';
import TodaysMoney from './TodaysMoney';
import TotalMoney from './TotalMoney';
import Viewers from './Viewers';

interface ProfileProps {
  className?: string;
  profile: User;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const Dashboard: FC<ProfileProps> = ({ className, profile, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();

  const getPosts = useCallback(async () => {
    try {
      const params = { email: profile.email };
      const response = await axios.post<{
        posts: Post[];
        page: number;
        isAuthor: boolean;
      }>('/posts/all/', params);

      if (isMountedRef.current) {
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef, profile]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={3}>
        <Grid item lg={3} sm={6} xs={12}>
          <TodaysMoney />
        </Grid>
        <Grid item lg={3} sm={6} xs={12}>
          <TotalMoney />
        </Grid>
        <Grid item lg={3} sm={6} xs={12}>
          <Viewers />
        </Grid>
      </Grid>
    </div>
  );
};

Dashboard.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  profile: PropTypes.object.isRequired
};

export default Dashboard;
