import React, { FC } from 'react';
import { useHistory } from 'react-router';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Box, Button, TextField, makeStyles } from '@material-ui/core';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

interface JWTLoginProps {
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {}
}));

const PasswordRecovery: FC<JWTLoginProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const history = useHistory();
  const isMountedRef = useIsMountedRef();

  return (
    <Formik
      initialValues={{
        email: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await axios.post('/recovery-password', { email: values.email });

          if (isMountedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
            history.push('/');
          }
        } catch (err) {
          if (isMountedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className={clsx(classes.root, className)}
          {...rest}
        >
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            autoFocus
            helperText={touched.email && errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <Box mt={2}>
            <Button
              color="secondary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Send Link
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

PasswordRecovery.propTypes = {
  className: PropTypes.string
};

export default PasswordRecovery;
