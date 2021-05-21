import React, { FC, ChangeEvent, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles
} from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import axios from 'src/utils/axios';
import { Theme } from 'src/theme';
import { User } from 'src/types/user';

interface Modal {
  _id: string;
  status: boolean;
  banned: Date;
  reason: string;
}

interface StatusProps {
  className?: string;
  open: boolean;
  data: Modal;
  onOpen: () => void;
  onFetch: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  toggleBtn: {
    '&.MuiToggleButton-root': {
      color: theme.palette.text.primary
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white
    }
  }
}));

const StatusModal: FC<StatusProps> = ({
  open,
  data,
  onOpen,
  onFetch,
  className,
  ...rest
}) => {
  const classes = useStyles();
  const [status, setStatus] = useState<boolean>(data.status);
  const [value, setValue] = useState<string>(data.reason);
  const [banned, setBanned] = useState<Date>(data.banned);

  const handleConfirm = async () => {
    const params = { _id: data._id, status, reason: value, banned };
    await axios.put<{ user: User }>('/users/update/status', params);
    onFetch();
    onOpen();
  };

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    setStatus(Boolean(newAlignment));
  };

  const handleClose = () => {
    onOpen();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const handlePicker = date => {
    setBanned(date);
  };
  console.log(banned);
  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-labelledby="status-dialog"
      >
        <DialogTitle>User Status</DialogTitle>
        <DialogContent>
          <Grid container justify="center">
            <Grid item md={5} xs={12}>
              <ToggleButtonGroup
                value={status}
                exclusive
                size="small"
                onChange={handleClick}
                aria-label="user alignment"
              >
                <ToggleButton value={true} className={classes.toggleBtn}>
                  Active
                </ToggleButton>
                <ToggleButton value={false} className={classes.toggleBtn}>
                  Block
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item md={7} xs={12}>
              <DateTimePicker
                fullWidth
                inputVariant="standard"
                label="Date"
                name="banned"
                onChange={handlePicker}
                value={banned}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                value={value}
                margin="dense"
                type="text"
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            color="primary"
            disabled={!status && !banned}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

StatusModal.propTypes = {
  className: PropTypes.string,
  //@ts-ignore
  data: PropTypes.object,
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onFetch: PropTypes.func
};

export default StatusModal;
