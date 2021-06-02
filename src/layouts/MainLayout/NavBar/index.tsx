/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import React, { useEffect, FC, ReactNode } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  Link,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import Logo from 'src/components/Logo';
import useAuth from 'src/hooks/useAuth';
import NavItem from './NavItem';
import { sections } from '../Sections';

interface NavBarProps {
  onMobileClose: () => void;
  openMobile: boolean;
}

interface Item {
  href?: string;
  icon?: ReactNode;
  info?: ReactNode;
  items?: Item[];
  title: string;
}

function reduceChildRoutes({
  pathname,
  item,
  depth
}: {
  pathname: string;
  item: Item;
  depth: number;
}) {
  const key = item.title + depth;

  if (item.items) {
    const open = matchPath(pathname, {
      path: item.href,
      exact: false
    });

    return (
      <NavItem
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        open={Boolean(open)}
        title={item.title}
      >
        {item.items.map(subsection => (
          <List disablePadding key={subsection.title}>
            {reduceChildRoutes({
              item: subsection,
              depth: depth + 1,
              pathname: subsection.href
            })}
          </List>
        ))}
      </NavItem>
    );
  } else {
    return (
      <NavItem
        depth={depth}
        href={item.href}
        icon={item.icon}
        info={item.info}
        key={key}
        title={item.title}
      />
    );
  }
}

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar: FC<NavBarProps> = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <PerfectScrollbar options={{ suppressScrollX: true }}>
        <Box p={2} display="flex" justifyContent="center">
          <RouterLink to="/">
            <Logo />
          </RouterLink>
        </Box>
        {isAuthenticated && (
          <>
            <Box p={2}>
              <Box display="flex" justifyContent="center">
                <RouterLink to="/account/profile">
                  <Avatar
                    alt="User"
                    className={classes.avatar}
                    src={user.avatar}
                  />
                </RouterLink>
              </Box>
              <Box mt={2} textAlign="center">
                <Link
                  component={RouterLink}
                  to="/account/profile"
                  variant="h5"
                  color="textPrimary"
                  underline="none"
                >
                  {user.name}
                </Link>
                <Typography variant="body2" color="textSecondary">
                  Your tier: {/* <Link component={RouterLink} to="/pricing"> */}
                  {user.tier}
                  {/* </Link> */}
                </Typography>
              </Box>
            </Box>
          </>
        )}
        <Divider />
        <Box p={2}>
          {sections
            .filter(
              section =>
                (!isAuthenticated && !section.href.includes('account')) ||
                isAuthenticated
            )
            .map(section => (
              <React.Fragment key={section.title}>
                {reduceChildRoutes({
                  pathname: location.pathname,
                  item: section,
                  depth: 0
                })}
              </React.Fragment>
            ))}
        </Box>
        <Divider />
      </PerfectScrollbar>
    </Box>
  );

  return (
    <Hidden lgUp>
      <Drawer
        anchor="left"
        classes={{ paper: classes.mobileDrawer }}
        onClose={onMobileClose}
        open={openMobile}
        variant="temporary"
      >
        {content}
      </Drawer>
    </Hidden>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default NavBar;
