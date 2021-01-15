import React, { FC } from 'react';
import { Icon, makeStyles } from '@material-ui/core';

interface CustomIconProps {
  src: string;
  [key: string]: any;
}

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'center'
  },
  icon: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit'
  }
}));

const CustomIcon: FC<CustomIconProps> = props => {
  const classes = useStyles();
  return (
    <Icon classes={{ root: classes.root }} fontSize="small">
      <img
        alt="Custom Icon"
        className={classes.icon}
        src={props.src}
        {...props}
      />
    </Icon>
  );
};

export default CustomIcon;
