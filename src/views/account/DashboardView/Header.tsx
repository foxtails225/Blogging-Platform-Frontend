import React, { FC, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import numeral from 'numeral';
import {
  Box,
  Button,
  Grid,
  Card,
  SvgIcon,
  Menu,
  MenuItem,
  Typography,
  makeStyles
} from '@material-ui/core';
import { Calendar as CalendarIcon } from 'react-feather';
import axios from 'src/utils/axios';
import Label from 'src/components/Label';
import { Theme } from 'src/theme';
import useAuth from 'src/hooks/useAuth';

interface HeaderProps {
  className?: string;
}

interface Statistics {
  viewers: number;
  likes: number;
}

const initialStatistics: Statistics = {
  viewers: 0,
  likes: 0
};

const timeRanges = [
  {
    value: 'today',
    text: 'Today',
    params: ['day', 'week', 'month', 'year']
  },
  {
    value: 'week',
    text: 'Week',
    params: ['week', 'month', 'year']
  },
  {
    value: 'month',
    text: 'Month',
    params: ['month', 'year']
  },
  {
    value: 'year',
    text: 'Year',
    params: ['year']
  },
  {
    value: 'total',
    text: 'Total',
    params: []
  }
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  action: {
    backgroundColor: theme.palette.common.white
  },
  image: {
    width: '100%',
    maxHeight: 400
  },
  item: {
    padding: theme.spacing(3),
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      '&:not(:last-of-type)': {
        borderRight: `1px solid ${theme.palette.divider}`
      }
    },
    [theme.breakpoints.down('sm')]: {
      '&:not(:last-of-type)': {
        borderBottom: `1px solid ${theme.palette.divider}`
      }
    }
  },
  label: {
    marginLeft: theme.spacing(1)
  },
  overline: {
    marginTop: theme.spacing(1)
  }
}));

const Header: FC<HeaderProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const actionRef = useRef<any>(null);
  const [name, setName] = useState<string>('');
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<string>(timeRanges[0].text);
  const [statistics, setStatistics] = useState<Statistics>(initialStatistics);

  useEffect(() => {
    const value =
      user.firstName && user.lastName
        ? user.firstName + ' ' + user.lastName
        : user.name;
    setName(value);
  }, [user]);

  useEffect(() => {
    const getStatistics = async () => {
      try {
        const params = timeRanges.find(item => item.text === timeRange).params;
        const response = await axios.get<{ data: Statistics }>(
          '/account/statistics',
          { params }
        );
        setStatistics(response.data.data);
      } catch (err) {
        setStatistics(initialStatistics);
      }
    };
    getStatistics();
  }, [timeRange]);

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
              ref={actionRef}
              className={classes.action}
              variant="contained"
              onClick={() => setMenuOpen(true)}
              startIcon={
                <SvgIcon fontSize="small">
                  <CalendarIcon />
                </SvgIcon>
              }
            >
              {timeRange} summary
            </Button>
            <Menu
              anchorEl={actionRef.current}
              onClose={() => setMenuOpen(false)}
              open={isMenuOpen}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
            >
              {timeRanges.map(_timeRange => (
                <MenuItem
                  key={_timeRange.value}
                  onClick={() => setTimeRange(_timeRange.text)}
                >
                  {_timeRange.text} Summary
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Grid>
      </Grid>
      <Box mt={3}>
        <Card className={clsx(classes.root, className)} {...rest}>
          <Grid alignItems="center" container justify="space-between">
            <Grid className={classes.item} item md={3} sm={6} xs={12}>
              <Typography variant="h2" color="textPrimary">
                {numeral(0).format('$0,0.00')}
              </Typography>
              <Typography
                className={classes.overline}
                variant="overline"
                color="textSecondary"
              >
                {timeRange} income
              </Typography>
            </Grid>
            <Grid className={classes.item} item md={3} sm={6} xs={12}>
              <Typography variant="h2" color="textPrimary">
                {numeral(0).format('$0,0.00')}
              </Typography>
              <Typography
                className={classes.overline}
                variant="overline"
                color="textSecondary"
              >
                {timeRange} tips
              </Typography>
            </Grid>
            <Grid className={classes.item} item md={3} sm={6} xs={12}>
              <Typography variant="h2" color="textPrimary">
                {statistics.viewers}
              </Typography>
              <Typography
                className={classes.overline}
                variant="overline"
                color="textSecondary"
              >
                {timeRange} views
              </Typography>
            </Grid>
            <Grid className={classes.item} item md={3} sm={6} xs={12}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Typography component="span" variant="h2" color="textPrimary">
                  {statistics.likes}
                </Typography>
                <Label className={classes.label} color="primary">
                  Live
                </Label>
              </Box>
              <Typography
                className={classes.overline}
                variant="overline"
                color="textSecondary"
              >
                {timeRange} likes
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
