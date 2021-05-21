import React, { FC, useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Button,
  Container,
  Hidden,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
// import AddPhotoIcon from '@material-ui/icons/AddPhotoAlternate';
import axios from 'src/utils/axios';
import { Theme } from 'src/theme';
import { User } from 'src/types/user';
import useAuth from 'src/hooks/useAuth';

interface HeaderProps {
  className?: string;
  profile: User;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  cover: {
    position: 'relative',
    height: 260,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    '&:before': {
      position: 'absolute',
      content: '" "',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      backgroundImage:
        'linear-gradient(-180deg, rgba(0,0,0,0.00) 58%, rgba(0,0,0,0.32) 100%)'
    },
    '&:hover': {
      '& $changeButton': {
        visibility: 'visible'
      }
    }
  },
  changeButton: {
    visibility: 'hidden',
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    backgroundColor: colors.blueGrey[900],
    color: theme.palette.common.white,
    [theme.breakpoints.down('md')]: {
      top: theme.spacing(3),
      bottom: 'auto'
    },
    '&:hover': {
      backgroundColor: colors.blueGrey[900]
    }
  },
  avatar: {
    border: `2px solid ${theme.palette.common.white}`,
    height: 120,
    width: 120,
    top: -60,
    left: theme.spacing(3),
    position: 'absolute',
    [theme.breakpoints.down('sm')]: {
      height: 100,
      width: 100,
      left: theme.spacing(1)
    }
  },
  action: {
    marginLeft: theme.spacing(1)
  },
  bioBox: {
    marginLeft: '160px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '120px'
    }
  }
}));

const Header: FC<HeaderProps> = ({ className, profile, ...rest }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const location = useLocation();
  const [isFollow, setIsFollow] = useState(false);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    const follow =
      profile.followers && user && profile.followers.includes(user._id);
    const isDisable = user
      ? user._id !== profile._id
      : location.pathname !== '/account/profile';

    setDisable(isDisable);
    setIsFollow(follow);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, profile]);

  const handleFollow = async () => {
    const params = { userId: profile._id, isFollow };
    await axios.put<{ user: User }>(`/account/follow`, params);
    setIsFollow(!isFollow);
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <div
        className={classes.cover}
        style={{ backgroundImage: `url(${profile.cover})` }}
      >
        {/* {!disable && (
          <Button
            className={classes.changeButton}
            variant="contained"
            startIcon={<AddPhotoIcon />}
          >
            Change Cover
          </Button>
        )} */}
      </div>
      <Container maxWidth="lg">
        <Box position="relative" mt={1} display="flex" alignItems="center">
          <Avatar
            alt="Person"
            className={classes.avatar}
            src={profile.avatar}
          />
          <Box className={classes.bioBox} mt={1}>
            <Typography variant="h4" color="textPrimary">
              {profile.name}
            </Typography>
            <Hidden smDown>
              <Typography variant="overline" color="textSecondary">
                {profile.bio}
              </Typography>
            </Hidden>
          </Box>
          <Box flexGrow={1} />
          {!disable ? (
            <Button
              color="secondary"
              component={RouterLink}
              size="small"
              to="/account/setting"
              variant="contained"
              className={classes.action}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              {user && (
                <Button
                  color="secondary"
                  size="small"
                  variant="contained"
                  className={classes.action}
                  onClick={handleFollow}
                >
                  {isFollow ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </>
          )}
        </Box>
        <Hidden mdUp>
          <Box textAlign="center">
            <Typography variant="overline" color="textSecondary">
              {profile.bio}
            </Typography>
          </Box>
        </Hidden>
      </Container>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  profile: PropTypes.object.isRequired
};

export default Header;
