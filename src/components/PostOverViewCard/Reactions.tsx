import React, { useState, FC, useEffect } from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  colors,
  makeStyles,
  Theme
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import EditIcon from '@material-ui/icons/Edit';
import { MessageCircle as MessageCircleIcon } from 'react-feather';
import CustomIcon from '../CustomIcon';
import axios from 'src/utils/axios';
import { Post, PostWithAuthor } from 'src/types/post';
import StripeCheckout from 'src/components/PaymentIntent';
import useAuth from 'src/hooks/useAuth';

interface ReactionsProps {
  className?: string;
  author: boolean;
  post: PostWithAuthor;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  iconRoot: {
    textAlign: 'center'
  },
  likedButton: {
    color: colors.red[600],
    padding: theme.spacing(1)
  },
  likedIcon: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit',
    padding: theme.spacing(1)
  },
  commentIcon: {
    color: colors.grey[500]
  }
}));

const Reactions: FC<ReactionsProps> = ({
  className,
  author,
  post,
  ...rest
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { user, isAuthenticated } = useAuth();
  const [isLiked, setLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(post.liked.count);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated)
      post.liked?.users.forEach(item => item === user._id && setLiked(true));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.liked.users]);

  const updateLiked = async (): Promise<void> => {
    const params = { postId: post._id, isLiked: !isLiked };
    await axios.put<{ post: Post }>('/posts/liked', params);
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

  const handleClick = (): void =>
    history.push('/posts/public/' + post.slug, { from: 'profile' });

  const handleOpen = (): void => setOpen(!open);

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      {isLiked ? (
        <Tooltip title="Unlike">
          <IconButton
            className={classes.likedButton}
            onClick={handleUnlike}
            disabled={!isAuthenticated}
          >
            <CustomIcon src="/static/icons/trending_filled.svg" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Like">
          <IconButton onClick={handleLike} disabled={!isAuthenticated}>
            <CustomIcon src="/static/icons/trending_outlined.svg" />
          </IconButton>
        </Tooltip>
      )}
      <Typography color="textSecondary" variant="h6">
        {likes}
      </Typography>
      <Box ml={2} marginTop="2px">
        <IconButton
          className={classes.likedIcon}
          onClick={handleClick}
          disabled={!isAuthenticated}
        >
          <MessageCircleIcon className={classes.commentIcon} size="20" />
        </IconButton>
      </Box>
      <Typography color="textSecondary" variant="h6">
        {post.comments.length}
      </Typography>
      {user && user._id !== post.author._id && (
        <IconButton onClick={handleOpen}>
          <AttachMoneyIcon fontSize="small" />
        </IconButton>
      )}
      <Box flexGrow={1} />
      {author && post.status === 'pending' && (
        <Tooltip title="Edit">
          <IconButton href={'/posts/edit/' + post.slug}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}
      {open && (
        <StripeCheckout
          open={open}
          postId={post._id}
          onOpen={handleOpen}
          onSuccess={handleOpen}
        />
      )}
    </div>
  );
};

Reactions.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  post: PropTypes.object.isRequired,
  author: PropTypes.bool
};

export default Reactions;
