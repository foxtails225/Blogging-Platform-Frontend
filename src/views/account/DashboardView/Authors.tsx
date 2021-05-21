import React, { useState, useEffect, useCallback, FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Card,
  Divider,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import Pagination from '@material-ui/lab/Pagination';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { User } from 'src/types/user';
import { Theme } from 'src/theme';
import getInitials from 'src/utils/getInitials';

interface AuthorsProps {
  className?: string;
  profile: User;
}

interface Status {
  page: number;
  limit: number;
  count: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  date: {
    marginLeft: 6
  },
  media: {
    height: 500,
    backgroundPosition: 'top'
  },
  title: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    }
  }
}));

const initialStatus: Status = {
  page: 1,
  limit: 10,
  count: 0
};

const Authors: FC<AuthorsProps> = ({ className, profile, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [authors, setAuhtors] = useState<User[]>([]);
  const [status, setStatus] = useState<Status>(initialStatus);

  const getAurhtors = useCallback(async () => {
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
  }, [isMountedRef, status.page, status.limit]);
  
  useEffect(() => {
    getAurhtors();
  }, [getAurhtors]);

  const handleChangePage = (event: unknown, page: number) => {
    setStatus(prevState => ({ ...prevState, page }));
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Divider />
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
                  variant="h5"
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
    </Card>
  );
};

Authors.propTypes = {
  className: PropTypes.string
};

export default Authors;
