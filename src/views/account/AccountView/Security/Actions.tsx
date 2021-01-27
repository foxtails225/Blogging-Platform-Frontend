import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Typography,
  makeStyles
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import type { Theme } from 'src/theme';

interface OtherActionsProps {
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  deleteAction: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark
    }
  }
}));

const Actions: FC<OtherActionsProps> = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader title="Actions" />
      <Divider />
      <CardContent>
        <Box
          mt={1}
          mb={2}
        >
          <Typography
            variant="body2"
            color="textSecondary"
          >
            Remove this customer’s data if he requested that, if not please
            be aware that what has been deleted can never brough back
          </Typography>
        </Box>
        <Button
          className={classes.deleteAction}
          startIcon={<DeleteIcon />}
        >
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
};

Actions.propTypes = {
  className: PropTypes.string
};

export default Actions;
