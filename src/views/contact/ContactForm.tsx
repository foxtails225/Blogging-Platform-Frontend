import React, { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
  FormHelperText
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { Support } from 'src/types/support';

type Type = 'ads' | 'support';
interface ContactFormProps {
  value: Type;
}

const ContactForm: FC<ContactFormProps> = ({ value }) => {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: '',
        email: '',
        company: '',
        position: '',
        message: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .max(255)
          .required('Name is required'),
        email: Yup.string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required'),
        company: Yup.string().max(255),
        position: Yup.string().max(255),
        message: Yup.string().required()
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const params = { ...values, type: value };
          await axios.post<{ support: Support }>('/support/contact', params);
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar('Profile updated', {
            variant: 'success'
          });
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
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box mb={1}>
                <Typography color="textPrimary" variant="subtitle2">
                  {value === 'support' ? 'User Name *' : 'Full Name *'}
                </Typography>
              </Box>
              <TextField
                error={Boolean(touched.name && errors.name)}
                fullWidth
                helperText={touched.name && errors.name}
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={1}>
                <Typography color="textPrimary" variant="subtitle2">
                  Email *
                </Typography>
              </Box>
              <TextField
                error={Boolean(touched.email && errors.email)}
                fullWidth
                helperText={touched.email && errors.email}
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                variant="outlined"
              />
            </Grid>
            {value === 'ads' && (
              <>
                <Grid item xs={12} sm={6}>
                  <Box mb={1}>
                    <Typography color="textPrimary" variant="subtitle2">
                      Position in Company (Optional)
                    </Typography>
                  </Box>
                  <TextField
                    error={Boolean(touched.position && errors.position)}
                    fullWidth
                    helperText={touched.position && errors.position}
                    name="position"
                    value={values.position}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box mb={1}>
                    <Typography color="textPrimary" variant="subtitle2">
                      Company Name (Optional)
                    </Typography>
                  </Box>
                  <TextField
                    error={Boolean(touched.company && errors.company)}
                    fullWidth
                    helperText={touched.company && errors.company}
                    name="company"
                    value={values.company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="outlined"
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Box mb={1}>
                <Typography color="textPrimary" variant="subtitle2">
                  Message
                </Typography>
              </Box>
              <TextField
                error={Boolean(touched.message && errors.message)}
                fullWidth
                helperText={touched.message && errors.message}
                name="message"
                required
                multiline
                rows={6}
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                variant="outlined"
              />
            </Grid>
          </Grid>
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              color="primary"
              fullWidth
              size="large"
              variant="contained"
              disabled={isSubmitting}
              type="submit"
            >
              Send
            </Button>
          </Box>
          <Box mt={3} mb={3}>
            <Typography color="textSecondary" variant="body2">
              By submitting this, you agree to the{' '}
              <Link
                color="textPrimary"
                component={RouterLink}
                to="/docs/policy"
                variant="subtitle2"
              >
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link
                color="textPrimary"
                component={RouterLink}
                to="/docs/terms"
                variant="subtitle2"
              >
                Terms
              </Link>
              .
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default ContactForm;
