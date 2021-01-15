import React, { useState } from 'react';
import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  Container,
  Hidden,
  useMediaQuery
} from '@material-ui/core';
import { Theme } from 'src/theme';
import TopBar from './TopBar';
import NavBar from './NavBar';
import FootBar from './FootBar';

interface LayoutProps {
  children?: ReactNode;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    flexWrap: 'wrap',
    height: '100%',
    overflow: 'auto',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64
  },
  footer: {
    marginTop: 40,
    flexBasis: '100%'
  },
  containerLg: {
    maxWidth: '90vw'
  },
  containerXs: {
    maxWidth: '100vw'
  }
}));

const MainLayout: FC<LayoutProps> = ({ children }) => {
  const [isMobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const matches = useMediaQuery('(min-width: 1280px)');
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <Hidden lgUp>
        <NavBar
          onMobileClose={() => setMobileNavOpen(false)}
          openMobile={isMobileNavOpen}
        />
      </Hidden>
      <div className={classes.wrapper}>
        <Container
          maxWidth="lg"
          className={matches ? classes.containerLg : classes.containerXs}
        >
          {children}
        </Container>
      </div>
      <div className={classes.footer}>
        <FootBar />
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node
};

export default MainLayout;
