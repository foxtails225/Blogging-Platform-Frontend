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
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import EditIcon from '@material-ui/icons/Edit';
import { MessageCircle as MessageCircleIcon } from 'react-feather';
import CustomIcon from '../CustomIcon';
import { PostWithAuthor } from 'src/types/post';
import StripeCheckout from 'src/components/PaymentIntent';
import useAuth from 'src/hooks/useAuth';

interface ReactionsProps {
  className?: string;
  author: boolean;
  post: PostWithAuthor;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  iconRoot: {
    textAlign: 'center'
  },
  likedButton: {
    color: colors.red[600]
  },
  likedIcon: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit'
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
  const { user } = useAuth();
  const [isLiked, setLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(post.liked.count);
  const [open, setOpen] = useState<boolean>(false);

  const handleLike = (): void => {
    setLiked(true);
    setLikes(prevLikes => prevLikes + 1);
  };

  const handleUnlike = (): void => {
    setLiked(false);
    setLikes(prevLikes => prevLikes - 1);
  };

  const handleOpen = (): void => setOpen(!open);

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      {author && (
        <IconButton onClick={handleLike} disabled={author}>
          <CustomIcon src="/static/icons/trending_outlined.svg" />
        </IconButton>
      )}
      {!author && (
        <>
          {isLiked ? (
            <Tooltip title="Unlike">
              <IconButton
                className={classes.likedButton}
                onClick={handleUnlike}
              >
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
        </>
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
      {user && user._id !== post.author._id && (
        <IconButton onClick={handleOpen}>
          <AttachMoneyIcon fontSize="small" />
        </IconButton>
      )}
      <Box flexGrow={1} />
      {author && post.status === 'pending' && (
        <Tooltip title="Edit">
          <IconButton onClick={handleLike} href={'/posts/edit/' + post.slug}>
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
