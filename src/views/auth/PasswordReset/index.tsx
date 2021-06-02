import React from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Link,
  Card,
  CardContent,
  Divider,
  Container,
  Typography,
  makeStyles
} from '@material-ui/core';
import type { Theme } from 'src/theme';
import Page from 'src/components/Page';
import Logo from 'src/components/Logo';
import useAuth from 'src/hooks/useAuth';
import PasswordReset from './PasswordReset';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  banner: {
    backgroundColor: theme.palette.background.paper,
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  bannerChip: {
    marginRight: theme.spacing(2)
  },
  methodIcon: {
    height: 30,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  cardContainer: {
    paddingBottom: 80,
    paddingTop: 80,
  },
  cardContent: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    minHeight: 400
  },
}));

const PasswordResetView: FC = () => {
  const classes = useStyles();
  const { method } = useAuth();

  return (
    <Page
      className={classes.root}
      title="Password Reset"
    >
      <Container
        className={classes.cardContainer}
        maxWidth="sm"
      >
        <Box
          mb={8}
          display="flex"
          justifyContent="center"
        >
          <RouterLink to="/">
            <Logo />
          </RouterLink>
        </Box>
        <Card>
          <CardContent className={classes.cardContent}>
            <Box
              alignItems="center"
              display="flex"
              justifyContent="space-between"
              mb={3}
            >
              <div>
                <Typography
                  color="textPrimary"
                  gutterBottom
                  variant="h2"
                >
                  Password Reset
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                >
                 Reset your account password using your recovery link
                </Typography>
              </div>
            </Box>
            <Box
              flexGrow={1}
              mt={3}
            >
              {method === 'JWT' && <PasswordReset /> }
            </Box>
            <Box my={3}>
              <Divider />
            </Box>
            <Link
              component={RouterLink}
              to="/login"
              variant="body2"
              color="textSecondary"
            >
              Have an account?
            </Link>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
};

export default PasswordResetView;
