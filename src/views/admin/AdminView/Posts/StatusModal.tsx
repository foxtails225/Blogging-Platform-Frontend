import React, { FC, ChangeEvent, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles
} from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import axios from 'src/utils/axios';
import { Theme } from 'src/theme';
import { Post, PostStatus } from 'src/types/post';

interface Modal {
  _id: string;
  status: PostStatus;
  reason: string;
}

interface StatusProps {
  className?: string;
  open: boolean;
  data: Modal;
  onOpen: (value?: any) => void;
  onFetch: () => void;
}

interface Status {
  name: PostStatus;
  text: string;
}

const buttons: Status[] = [
  { name: 'pending', text: 'pending' },
  { name: 'approved', text: 'approve' },
  { name: 'rejected', text: 'reject' }
];

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
  const [status, setStatus] = useState<string>(data.status);
  const [value, setValue] = useState<string>(data.reason);

  const handleConfirm = async () => {
    const params = { _id: data._id, status, reason: value };
    await axios.put<{ post: Post }>('/posts/update/status', params);
    onFetch();
    onOpen(params);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    setStatus(newAlignment);
  };

  const handleClose = () => onOpen();

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-labelledby="status-dialog"
      >
        <DialogTitle>Post Status</DialogTitle>
        <DialogContent>
          <ToggleButtonGroup
            value={status}
            exclusive
            size="small"
            onChange={handleClick}
            aria-label="text alignment"
          >
            {buttons.map((item: Status, idx: number) => (
              <ToggleButton
                key={item.name + idx}
                value={item.name}
                className={classes.toggleBtn}
              >
                {item.text}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <TextField
            value={value}
            margin="dense"
            type="text"
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={status === data.status}
            color="primary"
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
