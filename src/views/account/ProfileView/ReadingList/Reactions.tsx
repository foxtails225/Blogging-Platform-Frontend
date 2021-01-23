import React, { useState, FC } from 'react';
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
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import ShareIcon from '@material-ui/icons/Share';
import { MessageCircle as MessageCircleIcon } from 'react-feather';
import { Post } from 'src/types/post';

interface ReactionsProps {
  className?: string;
  post: Post;
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
    color: colors.grey[500]
  }
}));

const Reactions: FC<ReactionsProps> = ({ className, post, ...rest }) => {
  const classes = useStyles();
  const [isLiked, setLiked] = useState<boolean>(false);
  const [isBookmarked, setBookmarked] = useState<boolean>(true);
  const [likes, setLikes] = useState<number>(post.liked.count);

  const handleLike = (): void => {
    setLiked(true);
    setLikes(prevLikes => prevLikes + 1);
  };

  const handleUnlike = (): void => {
    setLiked(false);
    setLikes(prevLikes => prevLikes - 1);
  };

  const handleSaved = (): void => {
    setBookmarked(true);
  };

  const handleUnsaved = (): void => {
    setBookmarked(false);
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box flexGrow={1} />
      {isLiked ? (
        <Tooltip title="Unlike">
          <IconButton className={classes.likedButton} onClick={handleUnlike}>
            <TrendingUpIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Like">
          <IconButton onClick={handleLike}>
            <TrendingUpIcon fontSize="small" />
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
        {likes}
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
