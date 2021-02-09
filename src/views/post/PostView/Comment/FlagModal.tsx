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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { Theme } from 'src/theme';
import { Comments, CommentsWithUser } from 'src/types/comment';
import { User } from 'src/types/user';

interface FlagProps {
  className?: string;
  open: boolean;
  user: User;
  comment: CommentsWithUser;
  onOpen: () => void;
  onFlag: () => void;
}

const buttons = [
  { name: 'market', label: 'Market Manipulation' },
  { name: 'abuse', label: 'Abuse' },
  { name: 'other', label: 'Other' }
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

const FlagModal: FC<FlagProps> = ({
  open,
  user,
  comment,
  onOpen,
  onFlag,
  className,
  ...rest
}) => {
  const classes = useStyles();
  const [option, setOption] = useState<string>('');
  const [value, setValue] = useState<string>('');

  const handleConfirm = async () => {
    const params = { _id: comment._id, user: user._id };
    // await axios.put<{ comment: Comments }>('/comments/update/status', params);
    onOpen();
    onFlag();
  };

  const handleClose = () => {
    onOpen();
  };

  const handleOption = (event: ChangeEvent<HTMLInputElement>): void => {
    setOption(event.target.value);
  };

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
        <DialogTitle>Report</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <FormLabel component="legend">Please choose the reason</FormLabel>
            <RadioGroup
              aria-label="spam-flag-report"
              name="report"
              value={option}
              onChange={handleOption}
            >
              {buttons.map((item, idx: number) => (
                <FormControlLabel
                  key={item.name + idx}
                  value={item.name}
                  control={<Radio />}
                  label={item.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <TextField
            value={value}
            margin="dense"
            type="text"
            onChange={handleChange}
            disabled={option !== 'other'}
            fullWidth
          />
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

FlagModal.propTypes = {
  className: PropTypes.string,
  //@ts-ignore
  user: PropTypes.object,
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onFlag: PropTypes.func
};

export default FlagModal;
