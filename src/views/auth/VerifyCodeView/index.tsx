import React, { FC } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Location } from 'history';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  Typography,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import VerifyCode from './VerifyCode';
import Logo from 'src/components/Logo';
import Page from 'src/components/Page';
import useAuth from 'src/hooks/useAuth';
import { Theme } from 'src/theme';

interface LocationState {
  username?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  methodIcon: {
    height: 30,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  cardContainer: {
    paddingBottom: 80,
    paddingTop: 80
  },
  cardContent: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    minHeight: 400
  }
}));

const VerifyCodeView: FC = () => {
  const classes = useStyles();
  const { method } = useAuth() as any;
  const location = useLocation() as Location<LocationState>;
  const email = location.state?.username;

  const handleClick = async () => {
    await axios.post('/resend-code', { email });
  };

  return (
    <Page className={classes.root} title="Verify Code">
      <Container className={classes.cardContainer} maxWidth="sm">
        <Box mb={8} display="flex" justifyContent="center">
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
                <Typography color="textPrimary" gutterBottom variant="h2">
                  Verify Code
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Confirm registration using your verification code
                </Typography>
              </div>
            </Box>
            <Box flexGrow={1} mt={1}>
              {method === 'JWT' && <VerifyCode />}
            </Box>
            <Box my={3}>
              <Divider />
            </Box>
            <Box display="flex">
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                color="textSecondary"
              >
                Have an account?
              </Link>
              <Box flexGrow={1} />
              <Link variant="body2" component="button" onClick={handleClick}>
                Resend Code
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
};

export default VerifyCodeView;
