import React, { useState, useEffect, useCallback, FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Grid,
  Card,
  CardContent,
  List,
  Hidden,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios-mock';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { Profile, Post } from 'src/types/social';
import { Theme } from 'src/theme';
import ListItemCard from './ListItemCard';
import ListItemMobileCard from './ListItemMobileCard';

interface ReadingListProps {
  className?: string;
  profile: Profile;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  date: {
    marginLeft: 6
  },
  media: {
    height: 500,
    backgroundPosition: 'top'
  },
  title: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    }
  }
}));

const cardContentStyle = {
  paddingTop: 0,
  paddingBottom: 0
};

const ReadingList: FC<ReadingListProps> = ({ className, profile, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [posts, setPosts] = useState<Post[]>([]);

  const getPosts = useCallback(async () => {
    try {
      const response = await axios.get<{ posts: Post[] }>(
        '/api/social/posts-demo'
      );

      if (isMountedRef.current) {
        setPosts(response.data.posts);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardContent style={cardContentStyle}>
              <List>
                {posts.map(post => (
                  <React.Fragment key={post.id}>
                    <Hidden smDown>
                      <ListItemCard post={post} />
                    </Hidden>
                    <Hidden mdUp>
                      <ListItemMobileCard post={post} />
                    </Hidden>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

ReadingList.propTypes = {
  className: PropTypes.string
};

export default ReadingList;
