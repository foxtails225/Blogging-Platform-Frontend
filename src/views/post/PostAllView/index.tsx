import React, { FC } from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import DankAds from './DankAds';
import Following from './Following';
import RecentNews from './RecentNews';

const useStyles = makeStyles(() => ({
  root: {
    paddingTop: 32
  }
}));

const PostAllView: FC = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Stock News">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={3} xs={12}>
            <Following />
          </Grid>
          <Grid item lg={6} xs={12}>
            <RecentNews />
          </Grid>
          <Grid item lg={3} xs={12}>
            <DankAds />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default PostAllView;
