import React, { FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Grid,
  Hidden,
  Typography,
  makeStyles
} from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';
import { Theme } from 'src/theme';
import useAuth from 'src/hooks/useAuth';

interface HeaderProps {
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  action: {
    backgroundColor: theme.palette.common.white
  },
  image: {
    width: '100%',
    maxHeight: 400
  }
}));

const Header: FC<HeaderProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const name =
    user.firstName && user.lastName
      ? user.firstName + ' ' + user.lastName
      : user.name;

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid alignItems="center" container justify="space-between" spacing={3}>
        <Grid item md={6} xs={12}>
          <Typography variant="overline" color="textSecondary">
            Overview
          </Typography>
          <Typography variant="h3" color="textPrimary">
            Good Morning, {name}
          </Typography>
          <Typography variant="subtitle1" color="textPrimary">
            Here’s what’s happening with you today
          </Typography>
          <Box mt={2}>
            <Button
              className={classes.action}
              variant="contained"
              startIcon={<BarChartIcon />}
            >
              View summary
            </Button>
          </Box>
        </Grid>
        <Hidden smDown>
          <Grid item md={6}>
            <img
              alt="Cover"
              className={classes.image}
              src="/static/images/undraw_growth_analytics_8btt.svg"
            />
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
