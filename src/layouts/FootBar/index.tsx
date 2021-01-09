import React, { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Container,
  Divider,
  Grid,
  Typography,
  makeStyles,
  withStyles
} from '@material-ui/core';
import { THEMES } from '../../constants';
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
    color: '#e6e5e8'
  }
})(Typography);

const SecondaryTypography = withStyles({
  root: {
    color: '#8a85ff'
  }
})(Typography);

const WhiteSecondaryTypography = withStyles({
  root: {
    color: '#546e7a'
  }
})(Typography);

const FootBar: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <WhiteTextTypography variant="h1">
          Terms and Privacy
        </WhiteTextTypography>
        <Box my={3}>
          <Divider className={classes.divider} />
        </Box>
        <Grid container spacing={3} component="dl">
          <Grid item xs={12} md={6}>
            <SecondaryTypography variant="overline">
              Technical &amp; Licensing
            </SecondaryTypography>
            <Box mt={6}>
              <dt>
                <WhiteTextTypography variant="h4">
                  What do we use for styling our components?
                </WhiteTextTypography>
              </dt>
              <dd>
                <WhiteSecondaryTypography variant="body1">
                  We use Material-ui&apos;s hooks api as we think it’s the best
                  way of avoiding clutter.
                </WhiteSecondaryTypography>
              </dd>
            </Box>
            <Box mt={6}>
              <dt>
                <WhiteTextTypography variant="h4">
                  Is Typescript available?
                </WhiteTextTypography>
              </dt>
              <dd>
                <WhiteSecondaryTypography variant="body1">
                  Yes, we have the Typescript version available for Standard
                  Plus and Extended license.
                </WhiteSecondaryTypography>
              </dd>
            </Box>
            <Box mt={6}>
              <dt>
                <WhiteTextTypography variant="h4">
                  Are you providing support for setting up my project?
                </WhiteTextTypography>
              </dt>
              <dd>
                <WhiteSecondaryTypography variant="body1">
                  Yes, we offer email support for all our customers &amp; even
                  skype meetings for our extended license customers.
                </WhiteSecondaryTypography>
              </dd>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <SecondaryTypography variant="overline">Design</SecondaryTypography>
            <Box mt={6}>
              <dt>
                <WhiteTextTypography variant="h4">
                  Are the design files (Sketch, Figma) included in the Standard
                  License?
                </WhiteTextTypography>
              </dt>
              <dd>
                <WhiteSecondaryTypography variant="body1">
                  No, we offer the design source file only to Standard Plus and
                  Extended License.
                </WhiteSecondaryTypography>
              </dd>
            </Box>
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
