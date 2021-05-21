import React, { useState, useEffect, FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import { MessageCircle as MessageCircleIcon } from 'react-feather';
import CustomIcon from 'src/components/CustomIcon';
import axios from 'src/utils/axios';
import useAuth from 'src/hooks/useAuth';
import { Post } from 'src/types/post';
import { Bookmark } from 'src/types/bookmark';

interface ReactionsProps {
  className?: string;
  post: Post;
  onFetch: () => void;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  likedButton: {
    color: colors.red[600]
  },
  commentIcon: {
    color: colors.grey[700]
  }
}));

const Reactions: FC<ReactionsProps> = ({
  className,
  post,
  onFetch,
  ...rest
}) => {
  const classes = useStyles();
  const { user, isAuthenticated } = useAuth();
  const [isLiked, setLiked] = useState<boolean>(false);
  const [isBookmarked, setBookmarked] = useState<boolean>(true);
  const [likes, setLikes] = useState<number>(post.liked.count);

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
    setBookmarked(true);
    updateSaved();
    onFetch();
  };

  const handleUnsaved = (): void => {
    setBookmarked(false);
    updateSaved();
    onFetch();
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box flexGrow={1} />
      {isLiked ? (
        <Tooltip title="Unlike">
          <IconButton className={classes.likedButton} onClick={handleUnlike}>
            <CustomIcon src="/static/icons/trending_filled.svg" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Like">
          <IconButton onClick={handleLike}>
            <CustomIcon src="/static/icons/trending_outlined.svg" />
          </IconButton>
        </Tooltip>
      )}
      <Typography color="textSecondary" variant="h6">
        {likes}
      </Typography>
      <Box ml={2} mr={1} marginTop="2px">
        <MessageCircleIcon className={classes.commentIcon} size="20" />
      </Box>
      <Typography color="textSecondary" variant="h6">
        {post.comments.length}
      </Typography>
      {isBookmarked ? (
        <Tooltip title="Unsaved">
          <IconButton className={classes.likedButton} onClick={handleUnsaved}>
            <BookmarkBorderOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Saved">
          <IconButton onClick={handleSaved}>
            <BookmarkBorderOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

Reactions.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  post: PropTypes.object.isRequired
};

export default Reactions;
