import React, { useCallback, useEffect, useState, FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardHeader,
  Divider,
  Box,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Button,
  makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Theme } from 'src/theme';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { CommentsWithPostAndUser } from 'src/types/comment';
import { User } from 'src/types/user';

interface PostsProps {
  className?: string;
  profile: User;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  item: {
    padding: theme.spacing(3),
    flexGrow: 1,
    '&:first-of-type': {
      borderRight: `1px solid ${theme.palette.divider}`
    }
  },
  comment: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': '1'
  }
}));

const RecentComments: FC<PostsProps> = ({ className, profile, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [comments, setComments] = useState<CommentsWithPostAndUser[]>([]);
  const getComments = useCallback(async () => {
    try {
      const response = await axios.post<{
        comments: CommentsWithPostAndUser[];
      }>('/comments/get', { user: profile._id });

      if (isMountedRef.current) {
        setComments(response.data.comments);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef, profile]);

  useEffect(() => {
    getComments();
  }, [getComments]);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Recent Comments" />
      <Divider />
      <List disablePadding>
        {comments.map((comment, i) => (
          <ListItem divider={i < comments.length - 1} key={comment._id}>
            <ListItemAvatar>
              <Avatar alt="Comment Number">{i + 1}</Avatar>
            </ListItemAvatar>
            <ListItemText
              disableTypography
              primary={
                <Link
                  component={RouterLink}
                  to={
                    comment.post && comment.post.slug
                      ? '/posts/public/' + comment.post.slug
                      : '#'
                  }
                  color="textPrimary"
                  variant="body2"
                  className={classes.comment}
                >
                  {comment.comment}
                </Link>
              }
              secondary={
                <Typography variant="body2" color="textSecondary">
                  {moment(comment.createdAt).fromNow()}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box p={2} display="flex" justifyContent="flex-end">
        <Button
          component={RouterLink}
          size="small"
          to="#"
          endIcon={<NavigateNextIcon />}
        >
          See all
        </Button>
      </Box>
    </Card>
  );
};

RecentComments.propTypes = {
  className: PropTypes.string
};

export default RecentComments;
