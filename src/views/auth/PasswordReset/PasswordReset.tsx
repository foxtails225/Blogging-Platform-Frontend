import React, { FC, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import {
  Box,
  Button,
  InputAdornment,
  IconButton,
  TextField,
  makeStyles,
  FormHelperText
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

interface JWTLoginProps {
  className?: string;
}

interface State {
  password: boolean;
  confirm: boolean;
}

const initialState: State = {
  password: false,
  confirm: false
};

const useStyles = makeStyles(() => ({
  root: {}
}));

const PasswordRecovery: FC<JWTLoginProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const isMountedRef = useIsMountedRef();
  const [state, setState] = useState<State>(initialState);

  const handleClick = (event): void => {
    const { name } = event.currentTarget;
    setState(prevState => ({ ...prevState, [name]: !state[name] }));
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        password: '',
        passwordConfirm: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string()
          .min(7, 'Must be at least 7 characters')
          .max(255)
          .required('Required')
          .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d-_,./()@$!%*#?&]{8,}$/,
            'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
          ),
        passwordConfirm: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const recoveryToken = id.split('=')[1];
          await axios.post('/password-reset', {
            recoveryToken,
            password: values.password
          });

          if (isMountedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
            history.push('/login');
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
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="New Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type={state.password ? 'text' : 'password'}
            value={values.password}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton name="password" onClick={handleClick} edge="end">
                    {!state.password ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            error={Boolean(touched.passwordConfirm && errors.passwordConfirm)}
            fullWidth
            helperText={touched.passwordConfirm && errors.passwordConfirm}
            label="Confirm Password"
            margin="normal"
            name="passwordConfirm"
            onBlur={handleBlur}
            onChange={handleChange}
            type={state.confirm ? 'text' : 'password'}
            value={values.passwordConfirm}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton name="confirm" onClick={handleClick} edge="end">
                    {!state.confirm ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box mt={2}>
            <Button
              color="secondary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Reset Password
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
