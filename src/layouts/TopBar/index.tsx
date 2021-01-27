import React, { useState, ReactNode, FC } from 'react';
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
  Link
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
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
import { sections } from '../Sections';
import NavItem from './NavItem';

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
          backgroundColor: theme.palette.primary.main
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
    backgroundColor: theme.name === THEMES.ONE_DARK ? '#8a85ff' : '#e6e5e8',
    '&:hover': {
      backgroundColor: theme.name === THEMES.ONE_DARK ? '#3d38a5' : grey[400]
    }
  },
  link: {
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.name === THEMES.ONE_DARK ? '#e6e5e8' : '#3949ab',
    '& + &': {
      marginLeft: theme.spacing(2)
    }
  }
}));

const reduceChildRoutes: React.FC<any> = ({
  item,
  depth,
  anchorEl,
  onAnchorEl
}: {
  item: Item;
  depth: number;
  anchorEl?: any;
  onAnchorEl?: (val: any) => void;
}) => {
  const key = item.title + depth;

  if (item.items) {
    return (
      <div key={key}>
        <NavItem
          depth={depth}
          icon={item.icon}
          info={item.info}
          title={item.title}
          anchorEl={anchorEl}
          onAnchorEl={onAnchorEl}
          href={item.href}
        >
          {item.items.map(subsection => {
            return reduceChildRoutes({
              item: subsection,
              depth: depth + 1,
              anchorEl,
              onAnchorEl
            });
          })}
        </NavItem>
      </div>
    );
  } else {
    return (
      <div key={key}>
        <NavItem
          depth={depth}
          href={item.href}
          icon={item.icon}
          info={item.info}
          title={item.title}
        />
      </div>
    );
  }
};

const TopBar: FC<TopBarProps> = ({ className, onMobileNavOpen, ...rest }) => {
  const { isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  const handleAnchorEl = (el: any): void => {
    setAnchorEl(el);
  };

  return (
    <AppBar className={clsx(classes.root, className)} {...rest}>
      <Toolbar className={classes.toolbar}>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <SvgIcon fontSize="small">
              <MenuIcon />
            </SvgIcon>
          </IconButton>
        </Hidden>
        <Hidden mdDown>
          <RouterLink to="/">
            <Logo static="true" />
          </RouterLink>
        </Hidden>
        <Hidden mdDown>
          <Search />
        </Hidden>

        {/* TODO: activate icons justify-content */}
        {/* <Box ml={2} flexGrow={1} /> */}
        
        <Hidden mdDown>
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
        </Hidden>
        <Box ml={2} flexGrow={1} />
        <Settings />
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
                color="textPrimary"
                component={RouterLink}
                to="/login"
                underline="none"
                variant="body2"
              >
                Log In / Sign Up
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
