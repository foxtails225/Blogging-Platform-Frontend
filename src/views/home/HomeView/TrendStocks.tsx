import React, {
  useCallback,
  useEffect,
  useState
} from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardHeader,
  Divider,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  makeStyles
} from '@material-ui/core';
import type { Theme } from 'src/theme';
import axios from 'src/utils/axios-mock';
import getInitials from 'src/utils/getInitials';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import type { CustomerActivity as CustomerActivityType } from 'src/types/reports';

interface TrendStocksProps {
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  item: {
    padding: theme.spacing(3),
    flexGrow: 1,
    '&:first-of-type': {
      borderRight: `1px solid ${theme.palette.divider}`
    }
  }
}));

const TrendStocks: FC<TrendStocksProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [activities, setActivities] = useState<CustomerActivityType[]>([]);

  const getActivities = useCallback(async () => {
    try {
      const response = await axios.get<{ activities: CustomerActivityType[]; }>('/api/reports/customer-activity');

      if (isMountedRef.current) {
        setActivities(response.data.activities);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getActivities();
  }, [getActivities]);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader title="Dank Stocks"/>
      <Divider />
      <List disablePadding>
        {activities.map((activity, i) => (
          <ListItem
            divider={i < activities.length - 1}
            key={activity.id}
          >
            <ListItemAvatar>
              <Avatar
                alt="Customer"
                component={RouterLink}
                src={activity.customer.avatar}
                to="#"
              >
                {getInitials(activity.customer.name)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              disableTypography
              primary={(
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="#"
                  underline="none"
                  variant="h6"
                >
                  {activity.customer.name}
                </Link>
              )}
              secondary={(
                <Typography
                  variant="body2"
                  color="textSecondary"
                >
                  {activity.description}
                </Typography>
              )}
            />
            <Typography
              color="textSecondary"
              noWrap
              variant="caption"
            >
              {moment(activity.createdAt).fromNow()}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

TrendStocks.propTypes = {
  className: PropTypes.string
};

export default TrendStocks;
