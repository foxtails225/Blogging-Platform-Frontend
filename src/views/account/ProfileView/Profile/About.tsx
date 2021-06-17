import React, { useState, useEffect, FC } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  colors,
  makeStyles,
  Box,
  Chip
} from '@material-ui/core';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import {
  Hash as HashIcon,
  MessageCircle as MessageCircleIcon
} from 'react-feather';
import axios from 'src/utils/axios';
import useAuth from 'src/hooks/useAuth';
import { Theme } from 'src/theme';
import { User, Status } from 'src/types/user';

interface AboutProps {
  className?: string;
  profile: User;
}

const initialStatus = {
  published: 0,
  pending: 0,
  comments: 0,
  tags: 0
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  blueAvatar: {
    backgroundColor: theme.palette.secondary.main
  },
  redAvatar: {
    backgroundColor: colors.red[600]
  },
  cardContent: {
    paddingTop: 0
  }
}));

const About: FC<AboutProps> = ({ className, profile, ...rest }) => {
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const { user } = useAuth();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      let response: any;

      if (location.pathname === '/account/profile') {
        response = await axios.get<{ user: User }>('/account/status');
      } else {
        response = await axios.get<{ user: User }>(
          location.pathname + '/status'
        );
      }
      setStatus(response.data.status);
    };
    fetchData();
  }, [location.pathname]);

  useEffect(() => {
    const disable = user && user.email !== profile.email;
    setDisabled(disable ?? true);
  }, [user, profile]);

  const handleClick = () => history.push('/posts/new');

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box mt={2}>
        <Card>
          <CardHeader title="Profile Status" />
          <Divider />
          <CardContent className={classes.cardContent}>
            <List>
              <ListItem disableGutters divider>
                <ListItemAvatar>
                  <Avatar className={classes.blueAvatar}>
                    <DescriptionOutlinedIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${status.published} posts published`}
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: 'textSecondary'
                  }}
                />
                {!disabled && (
                  <Chip
                    color="secondary"
                    size="small"
                    label="Contribute"
                    onClick={handleClick}
                  />
                )}
              </ListItem>
              <ListItem disableGutters divider>
                <ListItemAvatar>
                  <Avatar className={classes.blueAvatar}>
                    <MoreHorizIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${status.pending} posts pending`}
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: 'textSecondary'
                  }}
                />
              </ListItem>
              <ListItem disableGutters divider>
                <ListItemAvatar>
                  <Avatar className={classes.redAvatar}>
                    <MessageCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${status.comments} comments written`}
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: 'textSecondary'
                  }}
                />
              </ListItem>
              <ListItem disableGutters divider>
                <ListItemAvatar>
                  <Avatar className={classes.redAvatar}>
                    <HashIcon size={22} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${status.tags} tickers followed`}
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: 'textSecondary'
                  }}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

About.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  profile: PropTypes.object.isRequired
};

export default About;
