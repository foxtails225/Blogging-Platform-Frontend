import React, { FC, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Grid,
  DialogContent,
  DialogActions,
  InputAdornment,
  Button,
  makeStyles,
  TextField
} from '@material-ui/core';
import { Theme } from 'src/theme';
import { User } from 'src/types/user';
import axios from 'src/utils/axios';

interface CustomFormProps {
  className?: string;
  open: boolean;
  author: User;
  onOpen: () => void;
  onNext: (secret: string, amount: number) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {}
}));

const CustomForm: FC<CustomFormProps> = ({
  className,
  author,
  open,
  onOpen,
  onNext,
  ...rest
}) => {
  const classes = useStyles();
  const [amount, setAmount] = useState<number>();

  const handleSubmit = async () => {
    const params = { stripeId: author.stripeId, amount };
    const response = await axios.post<{ secret: string }>(
      '/stripe/secret',
      params
    );
    if (response.data) {
      onNext(response.data.secret, (amount * 4) / 5);
    }
  };

  const handleChange = event => setAmount(event.target.value);

  const handleClose = () => onOpen();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <DialogContent>
        <Grid container justify="center">
          <Grid item md={5}>
            <TextField
              label="Name"
              defaultValue={author.name}
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>
          <Grid item md={5}>
            <TextField
              label="Amount"
              type="number"
              placeholder="Must be larger than 3"
              value={amount}
              onChange={handleChange}
              error={amount < 3}
              InputProps={{
                inputProps: { min: 3 },
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={amount < 3 || !amount}
          color="primary"
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  );
};

CustomForm.propTypes = {
  className: PropTypes.string,
  //@ts-ignore
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onNext: PropTypes.func
};

export default CustomForm;
