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
import { Post, Tag } from 'src/types/post';
import { Comments, CommentsWithUser, ReplyWithUser } from 'src/types/comment';
import Page from 'src/components/Page';
import Reactions from './Reactions';
import Comment from './Comment';
import CommentAdd from './CommentAdd';

interface ReplyStatus {
  value: string | null;
  depth: number;
  commentId: string | null;
}

const initialReply: ReplyStatus = {
  value: null,
  depth: 0,
  commentId: null
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
    '& p': {
      color: colors.grey[500],
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.9rem'
      }
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
  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Comments[]>([]);
  const [reply, setReply] = useState<ReplyStatus>(initialReply);
  const [isBookmarked, setBookmarked] = useState<boolean>(false);

  useEffect(() => {
    handleFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetch = async (): Promise<void> => {
    const path = location.pathname.split('/')[3];
    const params = isAuthenticated && { user: user._id };
    const response = await axios.get<{
      post: Post;
      comments: Comments[];
      isBookmark: boolean;
    }>(`/posts/get/${path}`, {
      params
    });

    if (response.data.post) {
      setPost(response.data.post);
      setBookmarked(response.data.isBookmark);
      setComments(response.data.comments);
      setReply(initialReply);
    } else {
      history.push('/404');
    }
  };

  const handleBookmark = (value: boolean): void => {
    setBookmarked(value);
  };

  const handleReply = (id: string, depth: number, commentId: string): void => {
    const value = reply.value !== id ? id : null;
    setReply({ value, depth, commentId });
  };

  return (
    <>
      {post && !matches && (
        <Reactions
          post={post}
          comments={comments.length}
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
                  <Reactions
                    post={post}
                    comments={comments.length}
                    isBookmarked={isBookmarked}
                    onBookmarked={handleBookmark}
                  />
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
                      src={
                        typeof post.author !== 'string' && post.author.avatar
                      }
                      className={classes.avatar}
                      to="#"
                    />
                    <Typography variant="caption" color="textSecondary">
                      <Link
                        color="textSecondary"
                        component={RouterLink}
                        to="#"
                        variant="h6"
                      >
                        {typeof post.author !== 'string' && post.author.name}
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
                  {comments.map((comment: CommentsWithUser) => (
                    <React.Fragment key={comment._id}>
                      <Comment
                        user={user}
                        comment={comment}
                        commentId={comment._id}
                        reply={reply.value}
                        depth={0}
                        onReply={handleReply}
                      />
                      {comment.reply.map((item: ReplyWithUser) => (
                        <Comment
                          user={user}
                          key={item._id}
                          comment={item}
                          commentId={comment._id}
                          reply={reply.value}
                          depth={item.depth}
                          onReply={handleReply}
                        />
                      ))}
                    </React.Fragment>
                  ))}
                  <Box my={2}>
                    <Divider />
                  </Box>
                  <CommentAdd post={post} reply={reply} onFetch={handleFetch} />
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
