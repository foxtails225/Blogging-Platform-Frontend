import React, { FC } from 'react';
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';

interface FinancialsProps {
  path: string;
}

const useStyles = makeStyles(() => ({
  root: {
    paddingTop: 32,
    minHeight: '30vh'
  }
}));

const Financials: FC<FinancialsProps> = ({ path }) => {
  const classes = useStyles();

  return (
    <Container className={classes.root} maxWidth={false}>
      <Grid container justify="center" alignItems="center" spacing={3}>
        <Grid item>
          <Typography variant="h4" component="b" color="textSecondary">
            Being worked on
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Financials;
