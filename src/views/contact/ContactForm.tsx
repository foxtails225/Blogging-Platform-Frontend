import React, { FC, FormEvent } from 'react';
import {
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography
} from '@material-ui/core';

const ContactForm: FC = () => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box mb={1}>
            <Typography color="textPrimary" variant="subtitle2">
              Full Name *
            </Typography>
          </Box>
          <TextField fullWidth name="name" required variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box mb={1}>
            <Typography color="textPrimary" variant="subtitle2">
              Work Email *
            </Typography>
          </Box>
          <TextField
            fullWidth
            name="email"
            type="email"
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Box mb={1}>
            <Typography color="textPrimary" variant="subtitle2">
              Message
            </Typography>
          </Box>
          <TextField
            fullWidth
            name="message"
            required
            multiline
            rows={6}
            variant="outlined"
          />
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="center" mt={3}>
        <Button color="primary" fullWidth size="large" variant="contained">
          Let&apos;s Talk
        </Button>
      </Box>
      <Box mt={3} mb={3}>
        <Typography color="textSecondary" variant="body2">
          By submitting this, you agree to the{' '}
          <Link
            color="textPrimary"
            href="#"
            underline="always"
            variant="subtitle2"
          >
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link
            color="textPrimary"
            href="#"
            underline="always"
            variant="subtitle2"
          >
            Cookie Policy
          </Link>
          .
        </Typography>
      </Box>
    </form>
  );
};

export default ContactForm;
