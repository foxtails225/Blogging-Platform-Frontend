import React, { FC, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
  Avatar,
  Box,
  Link,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  makeStyles,
  colors
} from '@material-ui/core';
import { MessageCircle as MessageCircleIcon } from 'react-feather';
import { Theme } from 'src/theme';
import { User } from 'src/types/user';
import { CommentsWithUser } from 'src/types/comment';

interface CommentProps {
  className?: string;
  user: User;
  reply: string;
  commentId?: string;
  comment: CommentsWithUser;
  onComment: (parent: string, depth: number) => void;
}

interface Status {
  reply: boolean;
  disable: boolean;
}

const initialStatus = {
  reply: false,
  disable: true
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    marginBottom: theme.spacing(2)
  },
  bubble: {
    borderRadius: theme.shape.borderRadius
  },
  header: {
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap'
    }
  },
  name: {
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  replybtn: {
    marginRight: theme.spacing(1)
  },
  replyIcon: {
    color: colors.grey[700]
  },
  replyClickIcon: {
    color: colors.red[700]
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4)
  },
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5)
  }
}));

const Comment: FC<CommentProps> = ({
  className,
  user,
  comment,
  reply,
  onComment,
  ...rest
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const match = useMediaQuery(theme.breakpoints.down('sm'));
  const [status, setStatus] = useState<Status>(initialStatus);
  const style = {
    marginLeft: theme.typography.pxToRem((match ? 10 : 20) * comment.depth)
  };

  useEffect(() => {
    if (user) {
      const value = reply === comment._id && comment.user._id !== user._id;
      const disable = comment.user._id === user._id;
      setStatus({ reply: value, disable });
    }
  }, [reply, comment, user]);

  const handleClick = (event): void => {
    const depth = comment.depth + 1;
    onComment(event.currentTarget.id, depth);
  };

  return (
    <div className={clsx(classes.root, className)} style={style} {...rest}>
      <Avatar
        alt="Person"
        component={RouterLink}
        src={comment.user.avatar}
        className={clsx(match ? classes.small : classes.large)}
        to="#"
      />
      <Box
        flexGrow={1}
        p={2}
        ml={2}
        bgcolor="background.dark"
        className={classes.bubble}
      >
        <Box
          display="flex"
          alignItems="center"
          className={classes.header}
          mb={1}
        >
          <Box className={classes.name}>
            <Link
              color="textPrimary"
              component={RouterLink}
              to="#"
              variant="h6"
            >
              {comment.user.name}
            </Link>
          </Box>
          <Box flexGrow={1} />
          <Button
            id={comment._id}
            size="small"
            className={classes.replybtn}
            onClick={handleClick}
            disabled={status.disable}
            startIcon={
              <MessageCircleIcon
                size="20"
                className={
                  status.reply ? classes.replyClickIcon : classes.replyIcon
                }
              />
            }
          >
            Reply
          </Button>
          <Typography color="textSecondary" variant="caption">
            {moment(comment.createdAt).fromNow()}
          </Typography>
        </Box>
        <Typography variant="body1" color="textPrimary">
          {comment.comment}
        </Typography>
      </Box>
    </div>
  );
};

Comment.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  comment: PropTypes.object.isRequired,
  onReply: PropTypes.func
};

export default Comment;
