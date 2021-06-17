import React, { FC } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
  Avatar,
  Link,
  ListItem,
  ListItemProps,
  ListItemText,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import { Theme } from 'src/theme';
import { FlagWithUserAndPost } from 'src/types/flag';
import { FLAG_OPTIONS } from 'src/constants';

interface FlagItemProps extends ListItemProps {
  className?: string;
  flag: FlagWithUserAndPost;
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
  const history = useHistory();

  const handleClick = (): void =>
    history.push('/posts/public/' + flag.post.slug, {
      from: 'admin',
      comment: flag.comment
    });

  return (
    <ListItem className={clsx(classes.root, className)} {...rest}>
      <ListItemText
        primary={
          <Link
            color="textPrimary"
            onClick={handleClick}
            underline="none"
            variant="h6"
          >
            {FLAG_OPTIONS.find(item => item.name === flag.reason)?.label}
          </Link>
        }
        primaryTypographyProps={{ variant: 'h6', noWrap: true }}
        secondary={
          <>
            {flag.description && flag.description !== '' && (
              <>
                {flag.description}
                <br />
              </>
            )}
            {moment(flag.createdAt).fromNow()}
          </>
        }
      />
      <Tooltip key={flag.user._id} title="View Profile">
        <Avatar
          src={flag.user.avatar}
          alt="Person"
          component={RouterLink}
          to={'/users/' + flag.user.name}
        />
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
