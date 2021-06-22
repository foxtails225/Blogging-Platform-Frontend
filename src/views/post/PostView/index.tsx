import React, { FC, useState, useEffect, useRef } from 'react';
import { useHistory, useLocation, Link as RouterLink } from 'react-router-dom';
import parse from 'html-react-parser';
import moment from 'moment';
import {
  Paper,
  Box,
  Grid,
  Avatar,
  Typography,
  Chip,
  Divider,
  Link,
  useTheme,
  useMediaQuery,
  makeStyles,
  colors
} from '@material-ui/core';
import axios from 'src/utils/axios';
import useAuth from 'src/hooks/useAuth';
import { Theme } from 'src/theme';
import { PostWithAuthor, Tag } from 'src/types/post';
import { Comments, CommentsWithUser } from 'src/types/comment';
import Page from 'src/components/Page';
import Reactions from './Reactions';
import Comment from './Comment';
import CommentAdd from './CommentAdd';
import { socket } from 'src/constants';

interface Status {
  depth: number;
  parent: string | null;
}

const initialStatus: Status = {
  depth: 0,
  parent: null
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    margin: '0 auto',
    width: '80%',
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      width: '70%'
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    },
    [theme.breakpoints.up('xl')]: {
      width: '45%'
    }
  },
  chip: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1)
  },
  box: {
    padding: theme.spacing(7),
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3)
    }
  },
  author: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  content: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.pxToRem(17),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(17)
    }
  },
  defaultDisclosure: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: colors.grey[500],
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem'
    }
  },
  disclosure: {
    fontFamily: theme.typography.fontFamily,
    color: colors.grey[500],
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem'
    }
  }
}));

const PostView: FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const { user, isAuthenticated } = useAuth();
  const inputRef = useRef<any>(null);
  const commentRef = useRef<any>(null);
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation<{ from: string; comment?: string }>();
  const [post, setPost] = useState<PostWithAuthor>();
  const [commentRefId, setCommentRefId] = useState<string>();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [isBookmarked, setBookmarked] = useState<boolean>(false);

  useEffect(() => {
    handleFetch();
    socket.on('fetchPost', data => {
      handleFetch();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    location.state?.from === 'admin' &&
      setCommentRefId(location.state?.comment);
    inputRef.current && location.state?.from === 'profile' && handleInputRef();
    !inputRef.current && history.replace({ ...location });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, history]);

  useEffect(() => {
    commentRef.current && commentRef.current.focus();
  }, [location, history]);

  const handleFetch = async (): Promise<void> => {
    try {
      const path = location.pathname.split('/')[3];
      const params = isAuthenticated && { user: user._id };
      const response = await axios.get<{
        post: PostWithAuthor;
        comments: Comments[];
        isBookmark: boolean;
      }>(`/posts/get/${path}`, {
        params
      });

      setPost(response.data.post);
      setBookmarked(response.data.isBookmark);
    } catch (err) {
      history.push('/404');
    }

    setStatus(initialStatus);
  };

  const handleBookmark = (value: boolean): void => setBookmarked(value);

  const handleComment = (id: string, depth: number): void => {
    const parent = status.parent !== id ? id : null;
    setStatus({ parent, depth });
  };

  const handleInputRef = (): void => {
    inputRef.current.click();
    history.replace({ ...location, state: undefined });
  };

  const handleChip = (route: string): void => history.push(`/symbol/${route}`);

  return (
    <>
      {post && !matches && (
        <Reactions
          post={post}
          isBookmarked={isBookmarked}
          onBookmarked={handleBookmark}
          onRef={handleInputRef}
          className="div"
        />
      )}
      <Page
        className={classes.root}
        title={post && post.title ? post.title : 'Post'}
      >
        <Paper>
          {post && (
            <Box mt={3} className={classes.box}>
              <Grid container spacing={3}>
                {matches && (
                  <>
                    <Box flexGrow={1} />
                    <Reactions
                      post={post}
                      isBookmarked={isBookmarked}
                      onBookmarked={handleBookmark}
                      onRef={handleInputRef}
                    />
                  </>
                )}
                <Grid item xs={12} md={10}>
                  <Typography
                    variant="h1"
                    component="header"
                    color="textPrimary"
                  >
                    {post.title}
                  </Typography>

                  <Box className={classes.author}>
                    <Avatar
                      alt="Person"
                      component={RouterLink}
                      src={post.author.avatar}
                      className={classes.avatar}
                      to={'/users/' + post.author.name}
                    />
                    <Typography variant="caption" color="textSecondary">
                      <Link
                        color="textSecondary"
                        component={RouterLink}
                        to={'/users/' + post.author.name}
                        variant="h6"
                      >
                        {post.author.name}
                      </Link>
                      {` `}
                      {moment(post.createdAt).fromNow()}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    {post.tags.map((tag: Tag) => (
                      <Chip
                        key={tag.symbol}
                        clickable={true}
                        variant="outlined"
                        label={tag.symbol}
                        className={classes.chip}
                        onClick={() => handleChip(tag.symbol)}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
              <Box mt={3} className={classes.content}>
                {parse(post.content)}
              </Box>
              <Divider />
              <Box mt={3} className={classes.defaultDisclosure}>
                Disclaimer: Nothing in this article is or should ever be taken
                as financial advice. This is purely the personal opinions of the
                author. Seek out financial advice from a licensed professional
                who is familiar with your personal financial status and risk
                tolerances.
              </Box>
              <Box mt={3} className={classes.disclosure}>
                {parse(post.disclosure)}
              </Box>
            </Box>
          )}
        </Paper>
        {post && (
          <Paper>
            <Box mt={3} className={classes.box}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  {post.comments.map((comment: CommentsWithUser) => (
                    <React.Fragment key={comment._id}>
                      <Comment
                        comment={comment}
                        commentRef={commentRefId === comment._id && commentRef}
                        postId={post._id}
                        reply={status.parent}
                        onComment={handleComment}
                      />
                    </React.Fragment>
                  ))}
                  {isAuthenticated && (
                    <>
                      <Box my={2}>
                        <Divider />
                      </Box>
                      <CommentAdd
                        post={post}
                        status={status}
                        inputRef={inputRef}
                        onFetch={handleFetch}
                      />
                    </>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}
      </Page>
    </>
  );
};

export default PostView;
