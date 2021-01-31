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
import ArchiveOutlinedIcon from '@material-ui/icons/ArchiveOutlined';
import UnarchiveOutlinedIcon from '@material-ui/icons/UnarchiveOutlined';
import ShareIcon from '@material-ui/icons/Share';
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

interface Status {
  isLiked: boolean;
  isBookmarked: boolean;
  isArchived: boolean;
}

const initialStatus = {
  isLiked: false,
  isBookmarked: false,
  isArchived: false
};

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
  const [status, setStatus] = useState<Status>(initialStatus);
  const [likes, setLikes] = useState<number>(post.liked.count);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = { postId: post._id };
        const response = await axios.get<{ bookmark: Bookmark }>(
          '/bookmarks/get',
          {
            params
          }
        );
        const isArchived = response.data.bookmark.archived;
        setStatus(prevState => ({
          ...prevState,
          isBookmarked: true,
          isArchived
        }));
      } catch (err) {
        setStatus(prevState => ({
          ...prevState,
          isBookmarked: false,
          isArchived: false
        }));
      }
    };
    fetchData();
  }, [post]);

  useEffect(() => {
    if (isAuthenticated) {
      post.liked.users.forEach(
        item =>
          item === user._id &&
          setStatus(prevState => ({ ...prevState, isLiked: true }))
      );
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.liked.users, user]);

  const updateLiked = async (): Promise<void> => {
    const params = { postId: post._id, isLiked: !status.isLiked };
    await axios.put<{ post: Post }>('/posts/liked', params);
  };

  const updateSaved = async (): Promise<void> => {
    const params = { postId: post._id };
    const path = status.isBookmarked ? 'delete' : 'create';
    await axios.post<{ bookmark: Bookmark }>(`/bookmarks/${path}`, params);
    onFetch();
  };

  const updateArchive = async (): Promise<void> => {
    const params = { postId: post._id, isArchived: !status.isArchived };
    await axios.put<{ bookmark: Bookmark }>(
      `/bookmarks/update/archived`,
      params
    );
    onFetch();
  };

  const handleLike = (): void => {
    setLikes(prevLikes => prevLikes + 1);
    setStatus(prevState => ({ ...prevState, isLiked: true }));
    updateLiked();
  };

  const handleUnlike = (): void => {
    setLikes(prevLikes => prevLikes - 1);
    setStatus(prevState => ({ ...prevState, isLiked: false }));
    updateLiked();
  };

  const handleSaved = (): void => {
    setStatus(prevState => ({
      ...prevState,
      isBookmarked: !status.isBookmarked
    }));
    updateSaved();
  };

  const handleArchive = (): void => {
    setStatus(prevState => ({
      ...prevState,
      isBookmarked: !status.isArchived
    }));
    updateArchive();
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box flexGrow={1} />
      {status.isLiked ? (
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
      {status.isBookmarked && status.isArchived ? (
        <Tooltip title="Unsaved">
          <IconButton className={classes.likedButton} onClick={handleArchive}>
            <UnarchiveOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Saved">
          <IconButton onClick={handleArchive}>
            <ArchiveOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {status.isBookmarked ? (
        <Tooltip title="Unsaved">
          <IconButton className={classes.likedButton} onClick={handleSaved}>
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
      <IconButton>
        <ShareIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

Reactions.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  post: PropTypes.object.isRequired
};

export default Reactions;
