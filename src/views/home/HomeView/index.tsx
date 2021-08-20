import React, { FC, useState, useEffect } from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'src/utils/axios';
import { Theme } from 'src/theme';
import Page from 'src/components/Page';
import DankStocks from './DankStocks';
import DankNews from './DankNews';
import DankReads from './DankReads';
import Market from './Market';

interface Alert {
  alert: string;
  alertType: string;
  alertChecked: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: 2
  },
  alert: {
    position: 'absolute',
    left: 0,
    right: 0
  },
  container: {
    paddingTop: 60,
    [theme.breakpoints.down('md')]: {
      paddingTop: 100
    }
  }
}));

const HomeView: FC = () => {
  const classes = useStyles();
  const [alert, setAlert] = useState<Alert | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/admin/alert');
      response.data && setAlert(response.data);
    };
    fetchData();
  }, []);

  return (
    <Page className={classes.root} title="Homepage">
      {alert && alert.alertChecked && (
        <>
          {/** @ts-ignore */}
          <Alert severity={alert.alertType} className={classes.alert}>
            {alert.alert}
          </Alert>
        </>
      )}
      <Container maxWidth="lg">
        <Grid container spacing={3} className={classes.container}>
          <Grid item lg={12} xs={12}>
            <Market />
          </Grid>
          <Grid item lg={12} xs={12}>
            <Grid container spacing={3}>
              <Grid item lg={6} xs={12}>
                <DankStocks />
              </Grid>
              <Grid item lg={6} xs={12}>
                <Grid container spacing={3}>
                  <Grid item lg={12} xs={12}>
                    <DankReads />
                  </Grid>
                  <Grid item lg={12} xs={12}>
                    <DankNews />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default HomeView;
