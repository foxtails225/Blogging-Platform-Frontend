import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Divider,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Typography,
  makeStyles,
  colors,
  Grid
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'src/utils/axios';
import { Theme } from 'src/theme';
import { User } from 'src/types/user';
import getInitials from 'src/utils/getInitials';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { THEMES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';

interface FollowingProps {
  className?: string;
}

interface Status {
  page: number;
  limit: number;
  count: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  grid: {
    minHeight: '20vh'
  },
  button: {
    backgroundColor: theme.name === THEMES.ONE_DARK ? '#8a85ff' : '#e6e5e8',
    '&:hover': {
      backgroundColor:
        theme.name === THEMES.ONE_DARK ? '#3d38a5' : colors.grey[400]
    }
  },
  link: {
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.name === THEMES.ONE_DARK ? '#e6e5e8' : '#3949ab',
    '& + &': {
      marginLeft: theme.spacing(2)
    }
  }
}));

const initialStatus: Status = {
  page: 1,
  limit: 10,
  count: 0
};

const Following: FC<FollowingProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { isAuthenticated } = useAuth();
  const isMountedRef = useIsMountedRef();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [authors, setAuhtors] = useState<User[]>([]);

  const getAuthors = useCallback(async () => {
    try {
      const params = { page: status.page - 1, limit: status.limit };
      const response = await axios.post<{ users: User[]; count: number }>(
        `/account/following`,
        params
      );

      if (isMountedRef.current) {
        setAuhtors(response.data.users);
        setStatus(prevState => ({
          ...prevState,
          count: response.data.count
        }));
      }
    } catch (err) {
      setAuhtors([]);
    }
    // eslint-disable-next-line
  }, [isMountedRef, status.page]);

  useEffect(() => {
    isAuthenticated && getAuthors();
  }, [getAuthors, isAuthenticated]);

  const handleChangePage = (event: unknown, page: number) => {
    setStatus(prevState => ({ ...prevState, page }));
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Following" />
      <Divider />
      {isAuthenticated ? (
        <>
          {authors.length > 0 ? (
            <>
              <List disablePadding>
                {authors.map((author: User, i) => (
                  <ListItem divider={i < authors.length} key={author._id}>
                    <ListItemAvatar>
                      <Avatar
                        alt="Customer"
                        component={RouterLink}
                        src={author.avatar}
                        to={'/users/' + author.name}
                      >
                        {getInitials(author.name)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      disableTypography
                      primary={
                        <Link
                          color="textPrimary"
                          component={RouterLink}
                          to={'/users/' + author.name}
                          underline="none"
                          variant="h6"
                        >
                          {author.name}
                        </Link>
                      }
                      secondary={
                        <Typography variant="body2" color="textSecondary">
                          {author.bio}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Box p={2} display="flex" justifyContent="center">
                <Pagination
                  count={Math.ceil(status.count / status.limit)}
                  page={status.page}
                  color="primary"
                  onChange={handleChangePage}
                />
              </Box>
            </>
          ) : (
            <Grid
              container
              justify="center"
              alignItems="center"
              className={classes.grid}
            >
              <Grid item>
                <Typography variant="h5" component="b" color="textSecondary">
                  No one here yet
                </Typography>
              </Grid>
            </Grid>
          )}
        </>
      ) : (
        <Grid
          container
          justify="center"
          alignItems="center"
          className={classes.grid}
        >
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              size="small"
              className={classes.button}
            >
              <Link
                className={classes.link}
                color="textPrimary"
                component={RouterLink}
                to="/login"
                underline="none"
                variant="body2"
              >
                Log In / Sign Up
              </Link>
            </Button>
          </Grid>
        </Grid>
      )}
    </Card>
  );
};

Following.propTypes = {
  className: PropTypes.string
};

export default Following;
