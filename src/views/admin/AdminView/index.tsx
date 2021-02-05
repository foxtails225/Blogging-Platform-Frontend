import React, { FC } from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import { Theme } from 'src/theme';
import Posts from './Posts';
import NewProjects from './NewPosts';
import RoiPerCustomer from './TotalIncome';
import SystemHealth from './SystemHealth';
import TeamTasks from './TeamTasks';
import NewSubscriber from './NewSubscriber';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const DashboardView: FC = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Administrator">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xs={12}>
            <NewSubscriber />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <NewProjects />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <SystemHealth />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <RoiPerCustomer />
          </Grid>
          <Grid item lg={12} xl={12} xs={12}>
            <Posts />
          </Grid>
          <Grid item lg={5} xl={4} xs={12}>
            <TeamTasks />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default DashboardView;
