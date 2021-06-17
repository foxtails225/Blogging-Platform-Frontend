import React, { FC } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  makeStyles
} from '@material-ui/core';
import { Theme } from 'src/theme';

interface DeleteModalProps {
  className?: string;
  open: boolean;
  onOpen: () => void;
  onConfirm: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {}
}));

const DeleteModal: FC<DeleteModalProps> = ({
  open,
  onOpen,
  onConfirm,
  className,
  ...rest
}) => {
  const classes = useStyles();

  const handleConfirm = () => {
    onConfirm();
    onOpen();
  };

  const handleClose = () => onOpen();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-labelledby="delete-dialog"
      >
        <DialogTitle>Confirm Remove</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

DeleteModal.propTypes = {
  className: PropTypes.string,
  //@ts-ignore
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onConfirm: PropTypes.func
};

export default DeleteModal;
