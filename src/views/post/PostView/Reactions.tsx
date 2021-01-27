import React, { FC, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'src/utils/axios';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import ShareIcon from '@material-ui/icons/Share';
import { MessageCircle as MessageCircleIcon } from 'react-feather';
import CustomIcon from 'src/components/CustomIcon';
import useAuth from 'src/hooks/useAuth';
import { Bookmark } from 'src/types/bookmark';
import { Post } from 'src/types/post';
import { Theme } from 'src/theme';

interface ReactionsProps {
  className?: string;
  post: Post;
  isBookmarked: boolean;
  onBookmarked: (param: boolean) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  div: {
    flexDirection: 'column',
    position: 'sticky',
    float: 'left',
    top: '45vh',
    left: '10vw'
  },
  likedButton: {
    color: colors.red[600]
  },
  likedIcon: {
    padding: theme.spacing(1)
  },
  commentBox: {
    marginTop: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.typography.pxToRem(6),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(1)
    }
  },
  iconBox: {
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.typography.pxToRem(2)
    }
  },
  commentIcon: {
    color: colors.grey[700]
  }
}));

const Reactions: FC<ReactionsProps> = ({
  className,
  post,
  isBookmarked,
  onBookmarked,
  ...rest
}) => {
  const classes = useStyles();
  const { user, isAuthenticated } = useAuth();
  const [isLiked, setLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(post.liked.count);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    //@ts-ignore
    isAuthenticated && user._id === post.author._id && setDisabled(true);
    !isAuthenticated && setDisabled(true);
  }, [user, isAuthenticated, post.author]);

  useEffect(() => {
    isAuthenticated &&
      post.liked.users.forEach(item => item === user._id && setLiked(true));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.liked.users]);

  const updateLiked = async (): Promise<void> => {
    const params = { postId: post._id, isLiked: !isLiked };
    await axios.put<{ post: Post }>('/posts/liked', params);
  };

  const updateSaved = async (): Promise<void> => {
    const params = { postId: post._id };
    const path = isBookmarked ? 'delete' : 'create';
    await axios.post<{ bookmark: Bookmark }>(`/bookmarks/${path}`, params);
  };

  const handleLike = (): void => {
    setLiked(true);
    setLikes(prevLikes => prevLikes + 1);
    updateLiked();
  };

  const handleUnlike = (): void => {
    setLiked(false);
    setLikes(prevLikes => prevLikes - 1);
    updateLiked();
  };

  const handleSaved = (): void => {
    onBookmarked(true);
    updateSaved();
  };

  const handleUnsaved = (): void => {
    onBookmarked(false);
    updateSaved();
  };

  return (
    <div className={clsx(classes.root, classes[className])} {...rest}>
      {isLiked ? (
        <Tooltip
          title="Unlike"
          disableTouchListener
          disableHoverListener={disabled}
        >
          <span>
            <IconButton
              className={clsx(classes.likedButton, classes.likedIcon)}
              onClick={handleUnlike}
              disabled={disabled}
            >
              <CustomIcon src="/static/icons/trending_filled.svg" />
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <Tooltip
          title="Like"
          disableTouchListener
          disableHoverListener={disabled}
        >
          <span>
            <IconButton
              className={classes.likedIcon}
              onClick={handleLike}
              disabled={disabled}
            >
              <CustomIcon src="/static/icons/trending_outlined.svg" />
            </IconButton>
          </span>
        </Tooltip>
      )}
      <Typography color="textSecondary" variant="h6">
        {likes}
      </Typography>
      <Box className={classes.commentBox}>
        <MessageCircleIcon className={classes.commentIcon} size="20" />
      </Box>
      <Typography color="textSecondary" variant="h6">
        {post.comments.length}
      </Typography>
      <Box className={classes.iconBox}>
        {isBookmarked ? (
          <Tooltip
            title="Unsaved"
            disableTouchListener
            disableHoverListener={disabled}
          >
            <span>
              <IconButton
                className={classes.likedButton}
                onClick={handleUnsaved}
                disabled={disabled}
              >
                <BookmarkBorderOutlinedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        ) : (
          <Tooltip
            title="Saved"
            disableTouchListener
            disableHoverListener={disabled}
          >
            <span>
              <IconButton onClick={handleSaved} disabled={disabled}>
                <BookmarkBorderOutlinedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Box>
      <Box className={classes.iconBox}>
        <span>
          <IconButton disabled={disabled}>
            <ShareIcon fontSize="small" />
          </IconButton>
        </span>
      </Box>
    </div>
  );
};

Reactions.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  post: PropTypes.object.isRequired,
  isBookmarked: PropTypes.bool,
  onBookmarked: PropTypes.func
};

export default Reactions;
