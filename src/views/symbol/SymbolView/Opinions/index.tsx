import React, { FC } from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import DankNews from './DankNews';
import ProfileGlance from './ProfileGlance';
import KeyGlance from './KeyGlance';

interface OpinionsProps {
  path: string;
}

const useStyles = makeStyles(() => ({
  root: {
    paddingTop: 32
  }
}));

const Opinions: FC<OpinionsProps> = ({ path }) => {
  const classes = useStyles();

  return (
    <Container className={classes.root} maxWidth={false}>
      <Grid container spacing={3}>
        <Grid item lg={6} xs={12}>
          <DankNews path={path} />
        </Grid>
        <Grid item lg={6} xs={12}>
          <KeyGlance path={path} />
        </Grid>
        <Grid item lg={12} xs={12}>
          <ProfileGlance path={path} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Opinions;
