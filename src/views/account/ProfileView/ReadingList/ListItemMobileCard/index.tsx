import React, { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import clsx from 'clsx';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Link,
  makeStyles
} from '@material-ui/core';
import Reactions from '../Reactions';
import { Post } from 'src/types/social';
import { Theme } from 'src/theme';

interface ListItemMobileCardProps {
  className?: string;
  post: Post;
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

const ListItemMobileCard: FC<ListItemMobileCardProps> = ({
  className,
  post,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <ListItem
      disableGutters
      divider
      alignItems="flex-start"
      className={clsx(classes.root, className)}
      {...rest}
    >
      <ListItemAvatar>
        <Avatar
          alt="Person"
          component={RouterLink}
          src={post.author.avatar}
          to="#"
        />
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Link color="textPrimary" component={RouterLink} to="#" variant="h5">
            {post.message}
          </Link>
        }
        primaryTypographyProps={{
          variant: 'body1',
          color: 'textPrimary'
        }}
        secondary={
          <>
            <Typography variant="caption" color="textSecondary" component={'p'}>
              <Link
                color="textSecondary"
                component={RouterLink}
                to="#"
                variant="h6"
              >
                {post.author.name}
              </Link>
              {` `}
              {moment(post.createdAt).fromNow()}
            </Typography>
            <Reactions post={post} />
          </>
        }
      />
    </ListItem>
  );
};

ListItemMobileCard.propTypes = {
  className: PropTypes.string
};

export default ListItemMobileCard;
