import React, { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import { Star as StarIcon } from 'react-feather';
import { Theme } from 'src/theme';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  avatar: {
    backgroundColor: colors.blue[600]
  },
  stepper: {
    backgroundColor: 'transparent'
  }
}));

const ThankYou: FC = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Thank You">
      <Container maxWidth="lg">
        <Card>
          <CardContent>
            <Box maxWidth={450} mx="auto">
              <Box display="flex" justifyContent="center">
                <Avatar className={classes.avatar}>
                  <StarIcon />
                </Avatar>
              </Box>
              <Box mt={2}>
                <Typography variant="h3" color="textPrimary" align="center">
                  Thank You!
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  align="center"
                >
                  Thank you for submitting your feedback to us. We will get back
                  to you...
                </Typography>
              </Box>
              <Box mt={2} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="secondary"
                  component={RouterLink}
                  to="/"
                >
                  Home
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
};

export default ThankYou;
