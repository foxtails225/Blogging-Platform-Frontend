import React, { FC } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Card,
  Paper,
  Input,
  FormControl,
  InputLabel,
  Switch,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
  FormHelperText,
  makeStyles
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { Theme } from 'src/theme';
import axios from 'src/utils/axios';
import { User } from 'src/types/user';

interface AnnouncementProps {
  className?: string;
  profile: User;
}

const types = ['success', 'info', 'warning', 'error'];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    marginLeft: theme.spacing(1)
  },
  control: {
    minWidth: 300,
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  inputContainer: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  box: {
    alignItems: 'center',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap'
    }
  }
}));

const Announcement: FC<AnnouncementProps> = ({
  className,
  profile,
  ...rest
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        alert: profile.alert || '',
        alertType: profile.alertType || '',
        alertChecked: profile.alertChecked || false,
        submit: null
      }}
      validationSchema={Yup.object().shape({
        alert: Yup.string().required('Content is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await axios.post('/admin/alert', { ...values });
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar('Announcement Updated', {
            variant: 'success'
          });
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleChange, handleSubmit, isSubmitting, values }) => (
        <form onSubmit={handleSubmit}>
          <Card className={clsx(classes.root, className)} {...rest}>
            <Box flexGrow={1}>
              <Box display="flex">
                <FormControl
                  className={classes.control}
                  variant="outlined"
                  required
                >
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="alertType"
                    value={values.alertType}
                    onChange={handleChange}
                    label="Type"
                  >
                    {types.map((type, i) => (
                      <MenuItem key={i} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box flexGrow={1} />
                <Box mr={2}>
                  <Switch
                    color="primary"
                    name="alertChecked"
                    checked={values.alertChecked}
                    onChange={handleChange}
                  />
                </Box>
              </Box>
              <Box className={classes.box}>
                <Paper className={classes.inputContainer} variant="outlined">
                  <Input
                    name="alert"
                    value={values.alert}
                    disableUnderline
                    fullWidth
                    multiline
                    rows={6}
                    onChange={handleChange}
                  />
                </Paper>
                <Tooltip title="Send">
                  <span>
                    <IconButton
                      color="primary"
                      disabled={isSubmitting}
                      type="submit"
                    >
                      <SendIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
              {errors.alert && (
                <Box mt={3}>
                  <FormHelperText error>{errors.alert}</FormHelperText>
                </Box>
              )}
              {errors.submit && (
                <Box mt={3}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Box>
              )}
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

Announcement.propTypes = {
  className: PropTypes.string
};

export default Announcement;
