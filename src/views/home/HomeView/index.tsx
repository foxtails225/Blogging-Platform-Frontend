import React, { FC } from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import TrendStocks from './TrendStocks';
import TrendAuthors from './TrendAuthors';
import TrendNews from './TrendNews';
import Market from './Market';
import Features from './Futures';

const useStyles = makeStyles(() => ({
  root: {
    paddingTop: 32
  }
}));

const HomeView: FC = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="World Class Stock News">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={6} xs={12}>
            <Market />
          </Grid>
          <Grid item lg={6} xs={12}>
            <Features />
          </Grid>
          <Grid item lg={9} xs={12}>
            <Grid container spacing={3}>
              <Grid item lg={6} xs={12}>
                <TrendStocks />
              </Grid>
              <Grid item lg={6} xs={12}>
                <TrendNews />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={3} xs={12}>
            <TrendAuthors />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default HomeView;
