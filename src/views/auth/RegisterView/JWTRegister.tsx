import React, { FC, useState } from 'react';
import { useHistory } from 'react-router';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  FormHelperText,
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  makeStyles
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

interface JWTRegisterProps {
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {}
}));

const JWTRegister: FC<JWTRegisterProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const history = useHistory();
  const { register } = useAuth() as any;
  const isMountedRef = useIsMountedRef();
  const [show, setShow] = useState<boolean>(false);

  const handleClick = (): void => setShow(!show);

  return (
    <Formik
      initialValues={{
        email: '',
        name: '',
        password: '',
        policy: false,
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required'),
        name: Yup.string()
          .max(255)
          .required('Name is required'),
        password: Yup.string()
          .max(255)
          .required('Password is required')
          .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d-_,./()@$!%*#?&]{8,}$/,
            'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
          ),
        policy: Yup.boolean().oneOf([true], 'This field must be checked')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await register(values.email, values.name, values.password);

          if (isMountedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
            history.push({
              pathname: '/verify-code',
              state: { username: values.email }
            });
          }
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
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
          className={clsx(classes.root, className)}
          onSubmit={handleSubmit}
          {...rest}
        >
          <TextField
            error={Boolean(touched.name && errors.name)}
            fullWidth
            helperText={touched.name && errors.name}
            label="Name"
            margin="normal"
            name="name"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.name}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
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
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type={show ? 'text' : 'password'}
            value={values.password}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton name="password" onClick={handleClick} edge="end">
                    {!show ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Box alignItems="center" display="flex" mt={2} ml={-1}>
            <Checkbox
              checked={values.policy}
              name="policy"
              onChange={handleChange}
            />
            <Typography variant="body2" color="textSecondary">
              I have read the{' '}
              <Link component="a" href="/docs" color="secondary">
                Terms and Conditions
              </Link>
            </Typography>
          </Box>
          {Boolean(touched.policy && errors.policy) && (
            <FormHelperText error>{errors.policy}</FormHelperText>
          )}
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
              Register
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

JWTRegister.propTypes = {
  className: PropTypes.string
};

export default JWTRegister;
