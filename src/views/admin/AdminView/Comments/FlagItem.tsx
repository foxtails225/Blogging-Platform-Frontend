import React, { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemProps,
  ListItemText,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Theme } from 'src/theme';
import { FlagWithUser } from 'src/types/flag';
import { FLAG_OPTIONS } from 'src/constants';

interface FlagItemProps extends ListItemProps {
  className?: string;
  flag: FlagWithUser;
  button?: any; // Fix warning
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  viewButton: {
    marginLeft: theme.spacing(2)
  }
}));

const FlagItem: FC<FlagItemProps> = ({ className, flag, ...rest }) => {
  const classes = useStyles();

  return (
    <ListItem className={clsx(classes.root, className)} {...rest}>
      <ListItemText
        primary={FLAG_OPTIONS.find(item => item.name === flag.reason).label}
        primaryTypographyProps={{ variant: 'h6', noWrap: true }}
        secondary={moment(flag.createdAt).fromNow()}
      />
      <Tooltip key={flag.user._id} title="View Profile">
        <Avatar
          src={flag.user.avatar}
          alt="Person"
          component={RouterLink}
          to={'/users/' + flag.user.name}
        />
      </Tooltip>
      <Tooltip title="View Post">
        <IconButton className={classes.viewButton} edge="end">
          <OpenInNewIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </ListItem>
  );
};

FlagItem.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  flag: PropTypes.object.isRequired
};

export default FlagItem;
