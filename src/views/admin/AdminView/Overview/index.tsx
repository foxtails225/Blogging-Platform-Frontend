import React, { FC } from 'react';
import { Grid } from '@material-ui/core';
import Posts from './Posts';
import Users from './Users';
// import NewProjects from './NewPosts';
// import TotalIncome from './TotalIncome';
// import SystemHealth from './SystemHealth';
import Comments from './Comments';
// import NewSubscriber from './NewSubscriber';

const Overview: FC = () => (
  <Grid container spacing={3}>
    {/* <Grid item lg={3} sm={6} xs={12}>
      <NewSubscriber />
    </Grid>
    <Grid item lg={3} sm={6} xs={12}>
      <NewProjects />
    </Grid>
    <Grid item lg={3} sm={6} xs={12}>
      <SystemHealth />
    </Grid>
    <Grid item lg={3} sm={6} xs={12}>
      <TotalIncome />
    </Grid> */}
    <Grid item lg={12} xl={12} xs={12}>
      <Posts />
    </Grid>
    <Grid item lg={4} xl={4} xs={12}>
      <Comments />
    </Grid>
    <Grid item lg={8} xl={8} xs={12}>
      <Users />
    </Grid>
  </Grid>
);

export default Overview;
