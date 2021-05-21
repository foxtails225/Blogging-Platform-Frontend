import React, { FC, useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Grid,
  Dialog,
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
import { PostWithAuthor } from 'src/types/post';
import useAuth from 'src/hooks/useAuth';

interface CustomFormProps {
  className?: string;
  open: boolean;
  postId: string;
  onOpen: () => void;
  onSuccess: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {}
}));

const CustomForm: FC<CustomFormProps> = ({
  className,
  postId,
  open,
  onOpen,
  onSuccess,
  ...rest
}) => {
  const classes = useStyles();
  const { user } = useAuth();
  const [amount, setAmount] = useState<number>();
  const [author, setAuthor] = useState<User>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<{ post: PostWithAuthor }>(
        '/posts/getById/' + postId
      );

      if (response.data) {
        setAuthor(response.data.post.author);
      }
    };
    fetchData();
  }, [postId]);

  const handleSubmit = async () => {
    const params = {
      stripeId: author.stripeId,
      author: author._id,
      type: 'payment_success',
      amount
    };
    const response = await axios.post<{ secret: string }>(
      '/stripe/transfer',
      params
    );

    await axios.post('/transactions/create', {
      user: author._id,
      client: user._id,
      amount: amount,
      fee: 0,
      type: 'post_approved'
    });
    if (response.data) {
      onSuccess();
    }
  };

  const handleChange = event => setAmount(event.target.value);

  const handleClose = () => onOpen();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      {author && (
        <Dialog
          open={open}
          keepMounted
          onClose={handleClose}
          aria-labelledby="checkform-dialog"
          fullWidth
        >
          <DialogContent>
            <Grid container justify="center">
              <Grid item md={5}>
                <TextField
                  label="Email"
                  defaultValue={author.email}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item md={5}>
                <TextField
                  label="Amount"
                  onChange={handleChange}
                  InputProps={{
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
            <Button onClick={handleSubmit} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

CustomForm.propTypes = {
  className: PropTypes.string,
  //@ts-ignore
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onSuccess: PropTypes.func
};

export default CustomForm;
