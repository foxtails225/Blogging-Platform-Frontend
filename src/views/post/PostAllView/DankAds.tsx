import React, { FC } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  makeStyles
} from '@material-ui/core';
import { Theme } from 'src/theme';

interface DankAdsProps {
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  grid: {
    minHeight: '60vh'
  }
}));

const DankAds: FC<DankAdsProps> = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="center" alignItems="center" className={classes.grid}>
          <Typography variant="h4" component="b" color="textSecondary">
            Being worked on
          </Typography>
        </Grid>
      </CardContent>
    </Card>
  );
};

DankAds.propTypes = {
  className: PropTypes.string
};

export default DankAds;
