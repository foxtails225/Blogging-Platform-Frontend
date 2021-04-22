import React, { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Elements } from '@stripe/react-stripe-js';
import {
  Dialog,
  Step,
  StepLabel,
  Stepper,
  makeStyles
} from '@material-ui/core';
import { Theme } from 'src/theme';
import { User } from 'src/types/user';
import axios from 'src/utils/axios';
import { stripePromise } from 'src/constants';
import CheckoutForm from './CheckoutForm';
import CustomForm from './CustomForm';
import { PostWithAuthor } from 'src/types/post';

interface StripeCheckoutProps {
  className?: string;
  postId: string;
  open: boolean;
  onOpen: () => void;
  onSuccess?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  backButton: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

const getSteps = () => ['Author Info', 'Card Details'];

const StripeCheckout: FC<StripeCheckoutProps> = ({
  className,
  postId,
  open,
  onOpen,
  onSuccess,
  ...rest
}) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [secret, setSecret] = useState<string>();
  const [author, setAuthor] = useState<User>();
  const steps = getSteps();

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

  const handleNext = (value: string) => {
    setSecret(value);
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

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
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === 0 && (
            <CustomForm
              open={open}
              author={author}
              onOpen={onOpen}
              onNext={handleNext}
            />
          )}
          {activeStep === 1 && (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                open={open}
                author={author}
                secret={secret}
                onOpen={onOpen}
                onBack={handleBack}
                onSuccess={onSuccess}
              />
            </Elements>
          )}
        </Dialog>
      )}
    </div>
  );
};

export default StripeCheckout;
