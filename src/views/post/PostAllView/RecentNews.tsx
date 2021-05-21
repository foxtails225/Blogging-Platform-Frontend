import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Link,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Hidden,
  colors,
  makeStyles
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'src/utils/axios';
import { Theme } from 'src/theme';
import { PostWithAuthor, Picker } from 'src/types/post';

interface RecentNewsProps {
  className?: string;
}

interface Status {
  page: number;
  limit: number;
  count: number;
}

interface PickerStatus {
  name: Picker;
  text: string;
}

const chips: PickerStatus[] = [
  { name: 'bullish', text: 'Bullish' },
  { name: 'bearish', text: 'Bearish' },
  { name: 'neutral', text: 'Neutral' },
  { name: 'no_opinion', text: 'No Opinion' }
];

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
  },
  picker: {
    marginRight: theme.spacing(1)
  }
}));

const initialStatus: Status = {
  page: 1,
  limit: 50,
  count: 0
};

const RecentNews: FC<RecentNewsProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const history = useHistory();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);

  const getProducts = useCallback(async () => {
    try {
      const params = { page: status.page - 1, limit: status.limit };
      const response = await axios.post<{
        posts: PostWithAuthor[];
        count: number;
      }>('/posts/all', params);

      setPosts(response.data.posts);
      setStatus(prevState => ({ ...prevState, count: response.data.count }));
    } catch (err) {
      setPosts([]);
    }
    // eslint-disable-next-line
  }, [status.page]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleChangePage = (event: unknown, page: number) => {
    setStatus(prevState => ({ ...prevState, page }));
  };

  const handleChip = (route: string): void => history.push(`/symbol/${route}`);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Recent Articles" />
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
                <>
                  <Link
                    color="textSecondary"
                    component={RouterLink}
                    to={'/users/' + post.author.name}
                    underline="none"
                    variant="body2"
                    display="block"
                  >
                    {`${post.author.name} | Likes: ${
                      post.liked.count
                    } | ${moment(post.createdAt).fromNow()}`}
                  </Link>
                  <Hidden mdUp>
                    <Box mt={1}>
                      <Chip
                        variant="outlined"
                        color="primary"
                        label={
                          chips.find(item => item.name === post.picker).text
                        }
                        className={classes.picker}
                      />
                      <Chip
                        variant="outlined"
                        clickable={true}
                        color="primary"
                        label={post.tags.find(item => item.main).symbol}
                        onClick={() =>
                          handleChip(post.tags.find(item => item.main).symbol)
                        }
                      />
                    </Box>
                  </Hidden>
                </>
              }
            />
            <Hidden smDown>
              <Chip
                variant="outlined"
                color="primary"
                label={chips.find(item => item.name === post.picker).text}
                className={classes.picker}
              />
              <Chip
                variant="outlined"
                clickable={true}
                color="primary"
                label={post.tags.find(item => item.main).symbol}
                onClick={() =>
                  handleChip(post.tags.find(item => item.main).symbol)
                }
              />
            </Hidden>
          </ListItem>
        ))}
      </List>
      <Box p={2} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(status.count / status.limit)}
          page={status.page}
          color="primary"
          onChange={handleChangePage}
        />
      </Box>
    </Card>
  );
};

RecentNews.propTypes = {
  className: PropTypes.string
};

export default RecentNews;
