import React, { useState, useEffect, useCallback, FC } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import {
  Card,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  makeStyles
} from '@material-ui/core';
import { Theme } from 'src/theme';
import axios from 'src/utils/axios-mock';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { Referral } from 'src/types/reports';

interface FeaturesProps {
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  avatar: {
    fontSize: 14,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.common.white
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
  typography: {
    marginLeft: 10
  },
  listItemText: {
    whiteSpace: 'nowrap'
  }
}));

const Features: FC<FeaturesProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [referrals, setReferrals] = useState<Referral[]>([]);

  const getReferrals = useCallback(async () => {
    try {
      const response = await axios.get<{ referrals: Referral[] }>(
        '/api/reports/top-referrals'
      );

      if (isMountedRef.current) {
        setReferrals(response.data.referrals);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getReferrals();
  }, [getReferrals]);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Features" />
      <Divider />
      <PerfectScrollbar options={{ suppressScrollY: true }}>
        <List disablePadding className={classes.list}>
          {referrals.map((referral, i) => (
            <ListItem divider={i < referrals.length - 1} key={referral.name}>
              <ListItemText
                primary={referral.name}
                primaryTypographyProps={{ variant: 'body2' }}
                className={classes.listItemText}
              />
              {`:`}
              <Typography
                variant="body2"
                color="textSecondary"
                className={classes.typography}
              >
                {numeral(referral.value).format('0,0')}
              </Typography>
            </ListItem>
          ))}
        </List>
      </PerfectScrollbar>
    </Card>
  );
};

Features.propTypes = {
  className: PropTypes.string
};

export default Features;
