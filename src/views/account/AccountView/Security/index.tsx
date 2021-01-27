import React, { FC } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Grid, makeStyles } from '@material-ui/core';
import Password from './Password';
import Actions from './Actions';

interface GeneralProps {
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {}
}));

const General: FC<GeneralProps> = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      spacing={3}
      {...rest}
    >
      <Grid item lg={12} md={12} xs={12}>
        <Password />
      </Grid>
      <Grid item lg={12} md={12} xs={12}>
        <Actions />
      </Grid>
    </Grid>
  );
};

General.propTypes = {
  className: PropTypes.string
};

export default General;
