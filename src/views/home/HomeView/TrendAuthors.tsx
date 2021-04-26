import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
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
import axios from 'src/utils/axios';
import { Theme } from 'src/theme';
import { User } from 'src/types/user';
import getInitials from 'src/utils/getInitials';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

interface TrendAuthorsProps {
  className?: string;
}

interface TopAuthor {
  _id: string;
  author: User;
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

const TrendAuthors: FC<TrendAuthorsProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [authors, setAuhtors] = useState<TopAuthor[]>([]);

  const getAurhtors = useCallback(async () => {
    try {
      const response = await axios.post<{ users: TopAuthor[] }>('/users/top', {
        page: 0
      });

      if (isMountedRef.current) {
        setAuhtors(response.data.users);
      }
    } catch (err) {
      setAuhtors([]);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getAurhtors();
  }, [getAurhtors]);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Dank Authors" />
      <Divider />
      <List disablePadding>
        {authors.map((author: TopAuthor, i) => (
          <ListItem divider={i < authors.length - 1} key={author._id}>
            <ListItemAvatar>
              <Avatar
                alt="Customer"
                component={RouterLink}
                src={author.author.avatar}
                to={'/users/' + author.author.name}
              >
                {getInitials(author.author.name)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              disableTypography
              primary={
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to={'/users/' + author.author.name}
                  underline="none"
                  variant="h6"
                >
                  {author.author.name}
                </Link>
              }
              secondary={
                <Typography variant="body2" color="textSecondary">
                  {author.author.bio}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

TrendAuthors.propTypes = {
  className: PropTypes.string
};

export default TrendAuthors;
