import React, { FC, ReactNode } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Button, makeStyles, Menu, MenuItem } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { Theme } from 'src/theme';
import { THEMES } from 'src/constants';

interface NavItemProps {
  children?: ReactNode;
  className?: string;
  depth: number;
  href?: string;
  icon?: any;
  info?: any;
  title: string;
  anchorEl?: any;
  onAnchorEl?: (val: any) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    display: 'block',
    paddingTop: 0,
    paddingBottom: 0
  },
  itemLeaf: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color:
      theme.name === THEMES.ONE_DARK ? theme.palette.text.secondary : grey[300],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%'
  },
  buttonColor: {
    color:
      theme.name === THEMES.ONE_DARK ? theme.palette.text.secondary : grey[700],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%'
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  title: {
    marginRight: 'auto'
  },
  active: {
    color:
      theme.name === THEMES.ONE_DARK ? theme.palette.secondary.main : grey[400],
    '& $title': {
      fontWeight: theme.typography.fontWeightMedium
    },
    '& $icon': {
      color:
        theme.name === THEMES.ONE_DARK
          ? theme.palette.secondary.main
          : grey[500]
    }
  },
  popover: {
    width: 200
  }
}));

const NavItem: FC<NavItemProps> = ({
  children,
  className,
  depth,
  href,
  icon: Icon,
  info: Info,
  title,
  anchorEl,
  onAnchorEl,
  ...rest
}) => {
  const classes = useStyles();

  const handleOpen = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    onAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    onAnchorEl(null);
  };

  let paddingLeft = 8;

  if (depth > 0) {
    paddingLeft = 32 + 8 * depth;
  }

  const style = { paddingLeft };

  if (children) {
    return (
      <>
        <Button
          id={href}
          className={classes.button}
          onClick={handleOpen}
          style={style}
        >
          {Icon && <Icon className={classes.icon} size="20" />}
          <span className={classes.title}>{title}</span>
          {Boolean(anchorEl) &&
          anchorEl.getAttribute('id') === href &&
          depth === 0 ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )}
        </Button>
        <Menu
          open={Boolean(anchorEl) && anchorEl.getAttribute('id') === href}
          anchorEl={anchorEl}
          onClose={handleClose}
          keepMounted
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          PaperProps={{ className: classes.popover }}
          getContentAnchorEl={null}
          className={clsx(classes.item, className)}
          key={title}
          {...rest}
        >
          {children}
        </Menu>
      </>
    );
  }

  return (
    <>
      {depth === 0 ? (
        <Button
          activeClassName={classes.active}
          className={classes.button}
          style={style}
          exact
          component={RouterLink}
          to={href}
        >
          {Icon && <Icon className={classes.icon} size="20" />}
          <span className={classes.title}>{title}</span>
        </Button>
      ) : (
        <MenuItem
          className={clsx(classes.button, classes.buttonColor)}
          activeClassName={classes.active}
          style={style}
          exact
          component={RouterLink}
          to={href}
        >
          {Icon && <Icon className={classes.icon} size="20" />}
          <span className={classes.title}>{title}</span>
        </MenuItem>
      )}
    </>
  );
};

NavItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  depth: PropTypes.number.isRequired,
  href: PropTypes.string,
  icon: PropTypes.elementType,
  info: PropTypes.elementType,
  title: PropTypes.string.isRequired
};

export default NavItem;
