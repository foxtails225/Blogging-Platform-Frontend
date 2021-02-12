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
  Hidden,
  useTheme,
  useMediaQuery,
  makeStyles,
  colors
} from '@material-ui/core';
import { MessageCircle as MessageCircleIcon } from 'react-feather';
import FlagIcon from '@material-ui/icons/Flag';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import CustomIcon from 'src/components/CustomIcon';
import axios from 'src/utils/axios';
import useAuth from 'src/hooks/useAuth';
import { Theme } from 'src/theme';
import { CommentsWithUser } from 'src/types/comment';
import FlagModal from './FlagModal';

interface CommentProps {
  className?: string;
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
  },
  date: {
    marginLeft: theme.spacing(1)
  }
}));

const Comment: FC<CommentProps> = ({
  className,
  comment,
  reply,
  onComment,
  ...rest
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const match = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<Status>(initialStatus);
  const [isLiked, setLiked] = useState<boolean>(false);
  const [isFlag, setFlag] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(comment.liked.count);
  const style = {
    marginLeft: theme.typography.pxToRem((match ? 10 : 20) * comment.depth)
  };

  useEffect(() => {
    //@ts-ignore
    isAuthenticated &&
      user._id === comment.user._id &&
      setStatus(prevState => ({ ...prevState, disabled: true }));
    !isAuthenticated &&
      setStatus(prevState => ({ ...prevState, disabled: true }));
  }, [user, isAuthenticated, comment.user]);

  useEffect(() => {
    isAuthenticated &&
      comment.liked.users.forEach(item => item === user._id && setLiked(true));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment.liked.users]);

  useEffect(() => {
    if (user) {
      const value = reply === comment._id && comment.user._id !== user._id;
      const disable = comment.user._id === user._id;
      setStatus({ reply: value, disable });
    }
  }, [reply, comment, user]);

  const updateLiked = async (): Promise<void> => {
    const params = { commentId: comment._id, isLiked: !isLiked };
    await axios.put<{ comment: CommentsWithUser }>('/comments/liked', params);
  };

  const handleReply = (): void => {
    const depth = comment.depth + 1;
    onComment(comment._id, depth);
  };

  const handleLiked = (): void => {
    setLiked(true);
    setLikes(prevLikes => prevLikes + 1);
    updateLiked();
  };

  const handleUnLiked = (): void => {
    setLiked(false);
    setLikes(prevLikes => prevLikes - 1);
    updateLiked();
  };

  const handleFlag = (): void => {
    setOpen(true);
  };

  const handleFlagSubmit = (): void => {
    setFlag(true);
  };

  const handleOpen = () => {
    setOpen(!open);
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
            <Hidden smUp>
              <Typography
                color="textSecondary"
                variant="caption"
                className={classes.date}
              >
                {moment(comment.createdAt).fromNow()}
              </Typography>
            </Hidden>
          </Box>
          <Box flexGrow={1} />
          <Button
            size="small"
            className={classes.replybtn}
            onClick={handleReply}
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
          {isLiked ? (
            <Button
              size="small"
              className={classes.replybtn}
              onClick={handleUnLiked}
              disabled={status.disable}
              startIcon={<CustomIcon src="/static/icons/trending_filled.svg" />}
            >
              {likes} likes
            </Button>
          ) : (
            <Button
              size="small"
              className={classes.replybtn}
              onClick={handleLiked}
              disabled={status.disable}
              startIcon={
                <CustomIcon src="/static/icons/trending_outlined.svg" />
              }
            >
              {likes} likes
            </Button>
          )}
          <Button
            size="small"
            className={classes.replybtn}
            onClick={handleFlag}
            disabled={status.disable || isFlag}
            startIcon={isFlag ? <FlagIcon /> : <FlagOutlinedIcon />}
          >
            Flag
          </Button>
          <Hidden smDown>
            <Typography
              color="textSecondary"
              variant="caption"
              className={classes.date}
            >
              {moment(comment.createdAt).fromNow()}
            </Typography>
          </Hidden>
        </Box>
        <Typography variant="body1" color="textPrimary">
          {comment.comment}
        </Typography>
      </Box>
      {open && (
        <FlagModal
          open={open}
          user={user}
          comment={comment}
          onOpen={handleOpen}
          onFlag={handleFlagSubmit}
        />
      )}
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
