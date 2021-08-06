import React, { FC } from 'react';
import clsx from 'clsx';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import {
  DialogContent,
  DialogActions,
  Button,
  Box,
  makeStyles,
  colors
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { Theme } from 'src/theme';
import { User } from 'src/types/user';
import useAuth from 'src/hooks/useAuth';

interface CheckoutFormProps {
  className?: string;
  open: boolean;
  secret: string;
  author: User;
  amount: number;
  onOpen: () => void;
  onBack: () => void;
  onSuccess: () => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: colors.grey[500],
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: colors.grey[500]
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {}
}));

const CheckoutForm: FC<CheckoutFormProps> = ({
  className,
  open,
  author,
  secret,
  amount,
  onOpen,
  onBack,
  onSuccess,
  ...rest
}) => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const classes = useStyles();

  const handleSubmit = async event => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmCardPayment(secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: author.email
        }
      }
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
        await axios.post<{ notification: Notification }>(
          '/notifications/create',
          {
            user: author._id,
            type: 'tips_success',
            title: `New payment received`,
            description: `You got the new tips. You received $${amount} from ${user.name}`,
            isRead: false,
            url: '#'
          }
        );
        await axios.post('/transactions/create', {
          user: author._id,
          client: user._id,
          amount: (amount * 5) / 4,
          fee: amount / 4,
          paymentId: result.paymentIntent.id,
          type: 'tips'
        });
        onSuccess();
      }
    }
  };

  const handleClose = () => onOpen();

  const handleBack = () => onBack();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box border={1} padding={2} borderRadius={5}>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleBack} color="primary">
            Back
          </Button>
          <Button disabled={!stripe} type="submit" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </form>
    </div>
  );
};

CheckoutForm.propTypes = {
  className: PropTypes.string,
  //@ts-ignore
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onBack: PropTypes.func
};

export default CheckoutForm;
