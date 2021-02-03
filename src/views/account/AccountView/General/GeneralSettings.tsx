import React, { FC } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  Switch,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { User } from 'src/types/user';
import axios from 'src/utils/axios';
import countries from './countries';

interface GeneralSettingsProps {
  className?: string;
  user: User;
  onLoading(param: boolean): void;
}

const useStyles = makeStyles(() => ({
  root: {}
}));

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const GeneralSettings: FC<GeneralSettingsProps> = ({
  user,
  className,
  onLoading,
  ...rest
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const handleUpdate = async (values: any): Promise<void> => {
    const country = countries.find(item => item.text === values.country)
      ? values.country
      : '';
    let data = { ...values, country };
    await axios.put<{ user: User }>('/account/update', {
      userData: data
    });
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        country: user.country || '',
        email: user.email || '',
        isPublic: user.isPublic,
        name: user.name || '',
        phone: user.phone || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        city: Yup.string().max(255),
        country: Yup.string().max(255),
        email: Yup.string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required'),
        isPublic: Yup.bool(),
        name: Yup.string()
          .max(255)
          .required('Name is required'),
        firstName: Yup.string().max(255),
        LastName: Yup.string().max(255),
        bio: Yup.string().max(50),
        phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
        state: Yup.string().max(255)
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          handleUpdate(values);
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
        onLoading(true);
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
          <Card className={clsx(classes.root, className)} {...rest}>
            <CardHeader title="Profile" />
            <Divider />
            <CardContent>
              <Grid container spacing={4}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Username"
                    name="name"
                    required
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={
                      touched.email && errors.email
                        ? errors.email
                        : 'We will use this email to contact you'
                    }
                    label="Email Address"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    type="email"
                    value={values.email}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.phone && errors.phone)}
                    fullWidth
                    helperText={touched.phone && errors.phone}
                    label="Phone Number"
                    name="phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phone}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    getOptionLabel={option => option.text}
                    options={countries}
                    filterSelectedOptions
                    value={countries.find(
                      option => option.text === user.country
                    )}
                    renderInput={params => (
                      <TextField
                        fullWidth
                        label="Country"
                        name="country"
                        variant="outlined"
                        onChange={handleChange}
                        onSelect={handleChange}
                        {...params}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.firstName && errors.firstName)}
                    fullWidth
                    helperText={touched.firstName && errors.firstName}
                    label="First Name"
                    name="firstName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.lastName && errors.lastName)}
                    fullWidth
                    helperText={touched.lastName && errors.lastName}
                    label="Last Name"
                    name="lastName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <TextField
                    error={Boolean(touched.bio && errors.bio)}
                    fullWidth
                    helperText={touched.bio && errors.bio}
                    label="Bio"
                    name="bio"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.bio}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Typography variant="h6" color="textPrimary">
                    Make Profile Info Public
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Means that anyone viewing your profile will be able to see
                    your details
                  </Typography>
                  <Switch
                    checked={values.isPublic}
                    edge="start"
                    name="isPublic"
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              {errors.submit && (
                <Box mt={3}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Box>
              )}
            </CardContent>
            <Divider />
            <Box p={2} display="flex" justifyContent="flex-end">
              <Button
                color="secondary"
                disabled={isSubmitting}
                type="submit"
                variant="contained"
              >
                Save Changes
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

GeneralSettings.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  user: PropTypes.object.isRequired
};

export default GeneralSettings;
