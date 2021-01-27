import React, { useState, useEffect, FC } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Grid, makeStyles } from '@material-ui/core';
import axios from 'src/utils/axios';
import useAuth from 'src/hooks/useAuth';
import ProfileDetails from './ProfileDetails';
import GeneralSettings from './GeneralSettings';
import { User } from 'src/types/user';

interface GeneralProps {
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {}
}));

const General: FC<GeneralProps> = ({ className, ...rest }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useAuth();
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<{ user: User }>('/account/about');
      setUser(response.data.user);
    };
    isLoading && fetchData();
    setIsLoading(false);
  }, [isLoading, setUser]);

  const handleLoad = (value: boolean): void => {
    setIsLoading(value);
  };

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      spacing={3}
      {...rest}
    >
      <Grid item lg={4} md={6} xl={3} xs={12}>
        <ProfileDetails user={user} />
      </Grid>
      <Grid item lg={8} md={6} xl={9} xs={12}>
        <GeneralSettings user={user} onLoading={handleLoad} />
      </Grid>
    </Grid>
  );
};

General.propTypes = {
  className: PropTypes.string
};

export default General;
