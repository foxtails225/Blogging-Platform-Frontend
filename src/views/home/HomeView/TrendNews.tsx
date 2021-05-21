import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Link,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { Theme } from 'src/theme';
import { PostWithAuthor } from 'src/types/post';

interface TrendNewsProps {
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  image: {
    flexShrink: 0,
    height: 56,
    width: 56
  },
  subscriptions: {
    fontWeight: theme.typography.fontWeightMedium
  },
  value: {
    color: colors.green[600],
    fontWeight: theme.typography.fontWeightMedium
  },
  date: {
    fontSize: '0.8rem'
  }
}));

const TrendNews: FC<TrendNewsProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);

  const getProducts = useCallback(async () => {
    try {
      const response = await axios.post<{ posts: PostWithAuthor[] }>(
        '/posts/all',
        { page: 0 }
      );

      if (isMountedRef.current) {
        setPosts(response.data.posts);
      }
    } catch (err) {
      setPosts([]);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <>
      <Card className={clsx(classes.root, className)} {...rest}>
        <CardHeader title="Dank Reads" />
        <Divider />
        <List disablePadding>
          {posts.map((post: PostWithAuthor, idx) => (
            <ListItem divider={idx < posts.length} key={post._id}>
              <ListItemAvatar>
                <Avatar alt="PostNumber">{idx + 1}</Avatar>
              </ListItemAvatar>
              <ListItemText
                disableTypography
                primary={
                  <Link
                    color="textPrimary"
                    component={RouterLink}
                    to={'/posts/public/' + post.slug}
                    underline="none"
                    variant="h6"
                  >
                    {post.title}
                  </Link>
                }
                secondary={
                  <Link
                    color="textSecondary"
                    component={RouterLink}
                    to={'/users/' + post.author.name}
                    underline="none"
                    variant="body2"
                    display="block"
                  >
                    {post.author.name}
                  </Link>
                }
              />
              <Typography color="textSecondary" noWrap variant="caption">
                {moment(post.createdAt).fromNow()}
              </Typography>
            </ListItem>
          ))}
        </List>
        <Box p={2} display="flex" justifyContent="flex-end">
          <Button
            component={RouterLink}
            size="small"
            to={'/posts/all'}
            endIcon={<NavigateNextIcon />}
          >
            See all
          </Button>
        </Box>
      </Card>
    </>
  );
};

TrendNews.propTypes = {
  className: PropTypes.string
};

export default TrendNews;
