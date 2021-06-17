import React, { FC } from 'react';
import { Link as BrowserLink } from 'react-router-dom';
import {
  Box,
  Container,
  Link,
  Typography,
  makeStyles,
  Theme
} from '@material-ui/core';
import Page from 'src/components/Page';
import Logo from 'src/components/Logo';
import ContactForm from './ContactForm';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: 32
  },
  container: {
    minHeight: '100%',
    display: 'grid',
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: 'repeat(2, 1fr)'
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(1, 1fr)'
    }
  },
  introBox: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  intro: {
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 15
    }
  },
  logo: {
    padding: theme.spacing(3)
  },
  formBox: {
    backgroundColor: theme.palette.background.paper,
  },
  box: {
    alignItems: 'center',
    display: 'flex',
    py: 3
  },
  form: {
    [theme.breakpoints.up('lg')]: {
      paddingRight: 15
    }
  }
}));

const ContactView: FC = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Contact">
      <Box className={classes.container}>
        <Box className={classes.introBox}>
          <Container maxWidth="md" className={classes.intro}>
            <Box className={classes.logo}>
              <Link component={BrowserLink} to="/">
                <Logo />
              </Link>
            </Box>
            <Box className={classes.box}>
              <Typography color="textPrimary" variant="overline">
                Contact to Support Team
              </Typography>
            </Box>
            <Typography color="textPrimary" component="strong" variant="h1">
              Talk to our customer support center
            </Typography>
            <Box py={3}>
              <Typography color="textPrimary" variant="body1">
                Have questions about integrating our APIs? Fill out the form and
                a senior web expert will be in touch shortly.
              </Typography>
            </Box>
            <Typography color="primary" variant="h6">
              Join 3,000+ forward-thinking companies:
            </Typography>
          </Container>
        </Box>
        <Box pt={8} className={classes.formBox}>
          <Container maxWidth="md" className={classes.form}>
            <Box pb={3}>
              <Typography color="textPrimary" variant="h6">
                Fill the form below
              </Typography>
            </Box>
            <Box>
              <ContactForm />
            </Box>
          </Container>
        </Box>
      </Box>
    </Page>
  );
};

export default ContactView;
