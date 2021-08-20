import React, { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Container,
  Divider,
  Grid,
  Link,
  Typography,
  makeStyles,
  withStyles
} from '@material-ui/core';
import { THEMES } from '../../../constants';
import { Theme } from 'src/theme';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor:
      theme.name === THEMES.ONE_DARK
        ? theme.palette.background.default
        : '#1b1642',
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    '& dt': {
      marginTop: theme.spacing(2)
    }
  },
  divider: {
    background:
      theme.name === THEMES.ONE_DARK ? theme.palette.divider : '#546e7a'
  }
}));

const WhiteTextTypography = withStyles({
  root: {
    color: '#fff'
  }
})(Typography);

const SecondaryTypography = withStyles({
  root: {
    color: '#fff'
  }
})(Typography);

const FootBar: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <Grid container spacing={3} component="dl">
          <Grid item xs={12} md={12}>
            <SecondaryTypography variant="overline">
              <Link
                component={RouterLink}
                to="/docs/policy"
                variant="h5"
                color="textPrimary"
              >
                Privacy Policy
              </Link>
            </SecondaryTypography>
          </Grid>
          <Grid item xs={12} md={12}>
            <SecondaryTypography variant="overline">
              <Link
                component={RouterLink}
                to="/docs/terms"
                variant="h5"
                color="textPrimary"
              >
                Terms and Conditions
              </Link>
            </SecondaryTypography>
          </Grid>
          <Grid item xs={12} md={12}>
            <SecondaryTypography variant="overline">
              <Link
                component={RouterLink}
                to="/contact"
                variant="h5"
                color="textPrimary"
              >
                Contact Us
              </Link>
            </SecondaryTypography>
          </Grid>
        </Grid>
        <Box my={3}>
          <Divider className={classes.divider} />
        </Box>
        <Grid container justify="center" alignItems="center">
          <Grid item>
            <WhiteTextTypography variant="h6">
              Dankstocks Copyright 2021
            </WhiteTextTypography>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

FootBar.propTypes = {
  className: PropTypes.string
};

export default FootBar;
