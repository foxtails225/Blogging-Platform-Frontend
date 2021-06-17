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
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import FlagIcon from '@material-ui/icons/Flag';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import { MessageCircle as MessageCircleIcon } from 'react-feather';
import CustomIcon from 'src/components/CustomIcon';
import useAuth from 'src/hooks/useAuth';
import { Bookmark } from 'src/types/bookmark';
import { Post } from 'src/types/post';
import { Flag } from 'src/types/flag';
import { Theme } from 'src/theme';
import StripeCheckout from 'src/components/PaymentIntent';

interface ReactionsProps {
  className?: string;
  post: Post;
  isBookmarked: boolean;
  onRef: () => void;
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
    left: '10vw',
    [theme.breakpoints.up('xl')]: {
      left: '26vw'
    }
  },
  reaction: {
    [theme.breakpoints.down('md')]: {
      paddingRight: theme.spacing(5)
    }
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
  onRef,
  onBookmarked,
  ...rest
}) => {
  const classes = useStyles();
  const { user, isAuthenticated } = useAuth();
  const [isLiked, setLiked] = useState<boolean>(false);
  const [likedDisabled, setLikedDisabled] = useState<boolean>(false);
  const [isFlag, setFlag] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(post.liked.count);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      //@ts-ignore
      user._id === post.author._id && setDisabled(true);
      setLikedDisabled(false);
    } else {
      setDisabled(true);
      setLikedDisabled(true);
    }
  }, [user, isAuthenticated, post.author]);

  useEffect(() => {
    if (isAuthenticated) {
      post.liked?.users.forEach(item => item === user._id && setLiked(true));
      //@ts-ignore
      post.flags.map((flag: Flag) => flag.user === user._id && setFlag(true));
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.liked.users]);

  const updateLiked = async (): Promise<void> => {
    const params = { postId: post._id, isLiked: !isLiked };
    await axios.put<{ post: Post }>('/posts/liked', params);
  };

  const updateFlag = async (): Promise<void> => {
    const params = {
      post: post._id,
      type: 'post',
      isFlag: !isFlag
    };
    await axios.put<{ post: Post }>('/posts/flaged', params);
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

  const handleFlag = (): void => {
    setFlag(true);
    updateFlag();
  };

  const handleUnflag = (): void => {
    setFlag(false);
    updateFlag();
  };

  const handleSaved = (): void => {
    onBookmarked(true);
    updateSaved();
  };

  const handleUnsaved = (): void => {
    onBookmarked(false);
    updateSaved();
  };

  const handleOpen = (): void => setOpen(!open);

  return (
    <div
      className={clsx(
        classes.root,
        classes[className],
        className === 'div' && classes.reaction
      )}
      {...rest}
    >
      {isLiked ? (
        <Tooltip
          title="Unlike"
          disableTouchListener
          disableHoverListener={likedDisabled}
        >
          <span>
            <IconButton
              className={clsx(classes.likedButton, classes.likedIcon)}
              onClick={handleUnlike}
              disabled={likedDisabled}
            >
              <CustomIcon src="/static/icons/trending_filled.svg" />
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <Tooltip
          title="Like"
          disableTouchListener
          disableHoverListener={likedDisabled}
        >
          <span>
            <IconButton
              className={classes.likedIcon}
              onClick={handleLike}
              disabled={likedDisabled}
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
        <IconButton
          className={classes.likedIcon}
          onClick={onRef}
          disabled={likedDisabled}
        >
          <MessageCircleIcon className={classes.commentIcon} size="20" />
        </IconButton>
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
          <IconButton disabled={disabled} onClick={handleOpen}>
            <AttachMoneyIcon fontSize="small" />
          </IconButton>
        </span>
      </Box>
      {isFlag ? (
        <Tooltip
          title="Unflag"
          disableTouchListener
          disableHoverListener={disabled}
        >
          <span>
            <IconButton
              className={clsx(classes.iconBox)}
              onClick={handleUnflag}
              disabled={disabled}
            >
              <FlagIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <Tooltip
          title="Flag"
          disableTouchListener
          disableHoverListener={disabled}
        >
          <span>
            <IconButton
              className={classes.iconBox}
              onClick={handleFlag}
              disabled={disabled}
            >
              <FlagOutlinedIcon fontSize="small" />
            </IconButton>
          </span>
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
  isBookmarked: PropTypes.bool,
  onBookmarked: PropTypes.func
};

export default Reactions;
