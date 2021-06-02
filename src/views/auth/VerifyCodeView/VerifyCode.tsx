import React, { FC, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Location } from 'history';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Typography,
  makeStyles,
  Theme
} from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

interface LocationState {
  username?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    display: 'grid',
    columnGap: '16px',
    gridTemplateColumns: 'repeat(7, 1fr)'
  },
  digit: {
    display: 'inline-block',
    textAlign: 'center',
    '& .MuiInputBase-input': {
      textAlign: 'center'
    }
  },
  helper: {
    mx: '14px'
  }
}));

const VerifyCodeView: FC = () => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const { verifyCode } = useAuth() as any;
  const location = useLocation() as Location<LocationState>;
  const itemsRef = useRef([]);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, 6);
  }, []);

  return (
    <Formik
      initialValues={{
        email: location.state?.username || '',
        code: ['', '', '', '', '', ''],
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required'),
        code: Yup.array().of(Yup.string().required('Code is required'))
      })}
      onSubmit={async (
        values,
        { setErrors, setStatus, setSubmitting }
      ): Promise<void> => {
        try {
          await verifyCode(values.email, values.code.join(''));
        } catch (err) {
          console.error(err);
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
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values
      }): JSX.Element => (
        <form noValidate onSubmit={handleSubmit}>
          <Box mt={3}>
            <Typography color="textSecondary" variant="subtitle2">
              Verification code
            </Typography>
          </Box>
          <Box pt={1} className={classes.box}>
            {[1, 2, 3, 4, 5, 6].map((ref, i) => (
              <TextField
                error={Boolean(
                  Array.isArray(touched.code) &&
                    touched.code.length === 6 &&
                    errors.code
                )}
                fullWidth
                inputRef={el => (itemsRef.current[i] = el)}
                // eslint-disable-next-line react/no-array-index-key
                key={`code-${i}`}
                name={`code[${i}]`}
                onBlur={handleBlur}
                onKeyDown={event => {
                  // @ts-ignore
                  if (event.code === 'ENTER') {
                    if (values.code[i]) {
                      setFieldValue(`code[${i}]`, '');
                      return;
                    }

                    if (i > 0) {
                      setFieldValue(`code[${i}]`, '');
                      itemsRef.current[i - 1].focus();
                      return;
                    }
                  }

                  if (Number.isInteger(parseInt(event.key, 10))) {
                    setFieldValue(`code[${i}]`, event.key);

                    if (i < 5) {
                      itemsRef.current[i + 1].focus();
                    }
                  }
                }}
                onPaste={event => {
                  const paste = event.clipboardData.getData('text');
                  const pasteArray = paste.split('');

                  if (pasteArray.length !== 6) {
                    return;
                  }

                  let valid = true;

                  pasteArray.forEach(x => {
                    if (!Number.isInteger(parseInt(x, 10))) {
                      valid = false;
                    }
                  });

                  if (valid) {
                    setFieldValue('code', pasteArray);
                    itemsRef.current[5].focus();
                  }
                }}
                value={values.code[i]}
                variant="outlined"
                className={classes.digit}
              />
            ))}
          </Box>
          {Boolean(
            Array.isArray(touched.code) &&
              touched.code.length === 6 &&
              errors.code
          ) && (
            <FormHelperText error className={classes.helper}>
              {Array.isArray(errors.code) &&
                errors.code.find(x => x !== undefined)}
            </FormHelperText>
          )}
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box mt={3}>
            <Button
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Verify
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default VerifyCodeView;
