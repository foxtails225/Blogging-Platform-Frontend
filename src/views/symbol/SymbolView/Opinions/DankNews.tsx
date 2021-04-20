import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import axios from 'src/utils/axios';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Link,
  Table,
  TableBody,
  TableCell,
  TableRow,
  colors,
  makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { Theme } from 'src/theme';
import { PostWithAuthor } from 'src/types/post';
import getInitials from 'src/utils/getInitials';

interface DankNewsProps {
  className?: string;
  path: string;
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
  }
}));

const DankNews: FC<DankNewsProps> = ({ className, path, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);

  const getPosts = useCallback(async () => {
    if (!path) return;

    try {
      const response = await axios.get<{ posts: PostWithAuthor[] }>(
        `/posts/get/stock/${path}`
      );

      if (isMountedRef.current) {
        setPosts(response.data.posts);
      }
    } catch (err) {
      setPosts([]);
    }
  }, [isMountedRef, path]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Dank News" />
      <Divider />
      <PerfectScrollbar>
        <Box>
          <Table>
            <TableBody>
              {posts.map(post => (
                <TableRow hover key={post._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        alt="Author"
                        src={post.author.avatar}
                        component={RouterLink}
                        to={'/users/' + post.author.name}
                      >
                        {getInitials(post.author.name)}
                      </Avatar>
                      <Box ml={2}>
                        <Link
                          color="textPrimary"
                          component={RouterLink}
                          to={'/posts/public/' + post.slug}
                          variant="h6"
                        >
                          {post.title}
                        </Link>
                      </Box>
                    </Box>
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

DankNews.propTypes = {
  className: PropTypes.string,
  path: PropTypes.string
};

export default DankNews;
