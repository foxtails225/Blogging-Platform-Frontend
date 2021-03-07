import React, { FC, useState, useEffect } from 'react';
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
    [theme.breakpoints.down('sm')]: {
      width: '100%'
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
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const [post, setPost] = useState<PostWithAuthor>();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [isBookmarked, setBookmarked] = useState<boolean>(false);

  useEffect(() => {
    handleFetch();
    socket.on('fetchPost', data => {
      handleFetch();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleBookmark = (value: boolean): void => {
    setBookmarked(value);
  };

  const handleComment = (id: string, depth: number): void => {
    const parent = status.parent !== id ? id : null;
    setStatus({ parent, depth });
  };

  return (
    <>
      {post && !matches && (
        <Reactions
          post={post}
          isBookmarked={isBookmarked}
          onBookmarked={handleBookmark}
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
                        variant="outlined"
                        label={tag.symbol}
                        className={classes.chip}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
              <Box mt={3} className={classes.content}>
                {parse(post.content)}
              </Box>
              <Divider />
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
                        reply={status.parent}
                        onComment={handleComment}
                      />
                    </React.Fragment>
                  ))}
                  <Box my={2}>
                    <Divider />
                  </Box>
                  <CommentAdd
                    post={post}
                    status={status}
                    onFetch={handleFetch}
                  />
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
