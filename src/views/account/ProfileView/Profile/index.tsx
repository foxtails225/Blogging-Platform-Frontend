import React, { useState, useEffect, useCallback, FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, Box, makeStyles } from '@material-ui/core';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import PostOverViewCard from 'src/components/PostOverViewCard';
import { PostWithAuthor } from 'src/types/post';
import { User } from 'src/types/user';
import About from './About';
import RecentComments from './RecentComments';
import useAuth from 'src/hooks/useAuth';

interface ProfileProps {
  className?: string;
  profile: User;
}

const useStyles = makeStyles(() => ({
  root: {}
}));

const Profile: FC<ProfileProps> = ({ className, profile, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  const getPosts = useCallback(async () => {
    try {
      const params = { email: profile.email, page: page ? page : 0, user };
      const response = await axios.post<{
        posts: PostWithAuthor[];
        page: number;
        isAuthor: boolean;
      }>('/posts/all/', params);

      if (isMountedRef.current) {
        setPosts(response.data.posts);
        setIsAuthor(response.data.isAuthor);
        setPage(response.data.page);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef, page, profile, user]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <About profile={profile} />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <RecentComments profile={profile} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          {posts.map(post => (
            <Box mt={2} key={post._id}>
              <PostOverViewCard post={post} author={isAuthor} />
            </Box>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  profile: PropTypes.object.isRequired
};

export default Profile;
