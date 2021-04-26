import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
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
  Table,
  TableBody,
  TableCell,
  TableRow,
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
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Dank News" />
      <Divider />
      <PerfectScrollbar>
        <Box>
          <Table>
            <TableBody>
              {posts.map((post: PostWithAuthor, idx) => (
                <TableRow hover key={post._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar alt="PostNumber">{idx + 1}</Avatar>
                      <Box ml={2}>
                        <Link
                          color="textPrimary"
                          component={RouterLink}
                          to={'/posts/public/' + post.slug}
                          variant="h6"
                        >
                          {post.title}
                        </Link>
                        <Link
                          color="textSecondary"
                          component={RouterLink}
                          to={'/users/' + post.author.name}
                          variant="body2"
                          display="block"
                        >
                          {post.author.name}
                        </Link>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className={classes.date}
                    >
                      {moment(post.createdAt).fromNow()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
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

TrendNews.propTypes = {
  className: PropTypes.string
};

export default TrendNews;
