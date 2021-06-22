import React, { FC, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Hidden,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  makeStyles,
  Theme
} from '@material-ui/core';
import Page from 'src/components/Page';
import ContactForm from './ContactForm';

type Type = 'ads' | 'support';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: 32
  },
  container: {
    minHeight: '100%',
    padding: theme.spacing(8),
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3)
    }
  },
  group: {
    color: '#fff',
    flexDirection: 'row'
  }
}));

const ContactView: FC = () => {
  const classes = useStyles();
  const [value, setValue] = useState<Type>('support');

  const handleChange = event => setValue(event.target.value);

  return (
    <Page className={classes.root} title="Contact">
      <Container maxWidth="md" className={classes.container}>
        <Box pb={3}>
          <Grid container justify="center" alignItems="center">
            <Hidden smDown>
              <Grid item md={12}>
                <Typography color="textPrimary" variant="h5">
                  Choose the Email
                </Typography>
              </Grid>
            </Hidden>
            <Grid item md={12}>
              <RadioGroup
                value={value}
                onChange={handleChange}
                className={classes.group}
              >
                <FormControlLabel
                  value="support"
                  control={<Radio />}
                  label="Support"
                />
                <FormControlLabel
                  value="ads"
                  control={<Radio />}
                  label="Advertisement"
                />
              </RadioGroup>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <ContactForm value={value} />
        </Box>
      </Container>
    </Page>
  );
};

export default ContactView;
