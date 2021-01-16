import React, { useState, useEffect, useCallback, FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, makeStyles } from '@material-ui/core';
import axios from 'src/utils/axios';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import PostOverViewCard from 'src/components/PostOverViewCard';
import { Post } from 'src/types/social';
import { User } from 'src/types/user';
import About from './About';
import Posts from './Posts';

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);

  const getPosts = useCallback(async () => {
    try {
      const params = { email: user.email, page };
      const response = await axios.get<{ posts: Post[]; page: number }>(
        '/posts/all/',
        { params }
      );

      if (isMountedRef.current) {
        console.log(response)
        setPosts(response.data.posts);
        setPage(response.data.page);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef, user]);

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
              {/* <Posts /> */}
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item xs={12} md={6} lg={8}>
          {posts.map(post => (
            <Box mt={2} key={post.id}>
              <PostOverViewCard post={post} />
            </Box>
          ))}
        </Grid> */}
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
