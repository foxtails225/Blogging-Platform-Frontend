import React, { ReactNode, FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
  SvgIcon,
  Divider,
  Button,
  Link,
  colors
} from '@material-ui/core';
import { Menu as MenuIcon } from 'react-feather';
import Logo from 'src/components/Logo';
import { THEMES } from 'src/constants';
import { Theme } from 'src/theme';
import useAuth from 'src/hooks/useAuth';
import Account from './Account';
import Notifications from './Notifications';
import Settings from './Settings';
import SearchMobile from './SearchMobile';
import Search from './Search';

interface TopBarProps {
  className?: string;
  onMobileNavOpen?: () => void;
}

interface Item {
  href?: string;
  icon?: ReactNode;
  info?: ReactNode;
  items?: Item[];
  title: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 100,
    ...(theme.name === THEMES.LIGHT
      ? {
          boxShadow: 'none',
          backgroundColor: '#fff'
        }
      : {}),
    ...(theme.name === THEMES.ONE_DARK
      ? {
          backgroundColor: theme.palette.background.default
        }
      : {})
  },
  toolbar: {
    minHeight: 64
  },
  divider: {
    width: 1,
    height: 32,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    background:
      theme.name === THEMES.ONE_DARK ? theme.palette.divider : '#546e7a'
  },
  button: {
    backgroundColor: colors.green[800],
    '&:hover': {
      backgroundColor: colors.green[500]
    }
  },
  link: {
    fontWeight: theme.typography.fontWeightMedium,
    color: '#e6e5e8',
    '& + &': {
      marginLeft: theme.spacing(2)
    }
  }
}));

const TopBar: FC<TopBarProps> = ({ className, onMobileNavOpen, ...rest }) => {
  const { isAuthenticated } = useAuth();
  const classes = useStyles();

  return (
    <AppBar className={clsx(classes.root, className)} {...rest}>
      <Toolbar className={classes.toolbar}>
        <Hidden lgUp>
          <IconButton color="primary" onClick={onMobileNavOpen}>
            <SvgIcon fontSize="small">
              <MenuIcon />
            </SvgIcon>
          </IconButton>
        </Hidden>
        <Hidden mdDown>
          <RouterLink to="/">
            <Logo />
          </RouterLink>
        </Hidden>
        <Hidden mdDown>
          <Box flexGrow={1} />
          <Search />
        </Hidden>

        {/* TODO: activate icons justify-content */}
        {/* <Box ml={2} flexGrow={1} /> */}
        {/* <Hidden mdDown>
          {sections
            .filter(section => section.href !== '/account')
            .map(section => (
              <Box ml={1} key={section.title}>
                {reduceChildRoutes({
                  item: section,
                  depth: 0,
                  anchorEl,
                  onAnchorEl: handleAnchorEl
                })}
              </Box>
            ))}
        </Hidden> */}
        <Box ml={2} flexGrow={1} />
        <Hidden mdDown>
          <Settings />
        </Hidden>
        <Box ml={2} />
        <Hidden lgUp>
          <SearchMobile />
        </Hidden>
        {isAuthenticated && <Notifications />}
        {!isAuthenticated && (
          <>
            <Divider className={classes.divider} />
            <Button
              color="secondary"
              variant="contained"
              size="small"
              className={classes.button}
            >
              <Link
                className={classes.link}
                color="primary"
                component={RouterLink}
                to="/login"
                underline="none"
                variant="body2"
              >
                Log In
              </Link>
            </Button>
          </>
        )}
        {isAuthenticated && (
          <Box ml={2}>
            <Account />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

TopBar.defaultProps = {
  onMobileNavOpen: () => {}
};

export default TopBar;
