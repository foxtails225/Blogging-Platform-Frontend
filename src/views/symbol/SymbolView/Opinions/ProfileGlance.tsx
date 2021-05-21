import React, { FC, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'src/utils/axios';
import numeral from 'numeral';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Paper,
  Grid,
  Link,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Hidden,
  makeStyles
} from '@material-ui/core';
import { Profile } from 'src/types/stock';
import { Theme } from 'src/theme';

interface ProfileGlanceProps {
  className?: string;
  path: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  collapse: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': '3'
  },
  box: {
    padding: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3)
    }
  }
}));

const ProfileGlance: FC<ProfileGlanceProps> = ({
  className,
  path,
  ...rest
}) => {
  const classes = useStyles();
  const [profile, setProfile] = useState<Profile>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<Profile>(`/stock/company/${path}`);

      if (response.data) {
        setProfile(response.data);
      }
    };
    path && fetchData();
  }, [path]);

  const handleExpand = () => setExpanded(!expanded);

  return (
    <Paper className={clsx(classes.root, className)} {...rest}>
      <PerfectScrollbar>
        <Box className={classes.box}>
          <Grid container justify="space-between">
            <Grid item>
              <Typography variant="h3" color="textPrimary">
                Company Profile
              </Typography>
            </Grid>
          </Grid>
          {profile && (
            <>
              <Box my={4}>
                <Grid container justify="space-between" spacing={3}>
                  {' '}
                  <Grid item lg={12} xs={12}>
                    <Typography
                      variant="body1"
                      color="textPrimary"
                      className={clsx(!expanded && classes.collapse)}
                    >
                      {profile.description}
                    </Typography>
                    <Link onClick={handleExpand}>
                      Read {expanded ? 'less' : 'more'}
                    </Link>
                  </Grid>
                  <Hidden mdDown>
                    <Grid item lg={6} xs={12}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell align="center">Sector</TableCell>
                            <TableCell align="center">
                              {profile.sector}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">Industry</TableCell>
                            <TableCell align="center">
                              {profile.industry}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">Employees</TableCell>
                            <TableCell align="center">
                              {numeral(profile.employees).format('0,0')}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Grid>
                    <Grid item lg={6} xs={12}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell align="center">Address</TableCell>
                            <TableCell align="center">
                              {profile.address} {profile.city} {profile.state}{' '}
                              {profile.zip} {profile.country}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">Phone Number</TableCell>
                            <TableCell align="center">
                              +{profile.phone}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">CEO</TableCell>
                            <TableCell align="center">{profile.CEO}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Grid>
                  </Hidden>
                  <Hidden lgUp>
                    <Grid item lg={12} xs={12}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell align="center">Sector</TableCell>
                            <TableCell align="center">
                              {profile.sector}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">Industry</TableCell>
                            <TableCell align="center">
                              {profile.industry}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">Employees</TableCell>
                            <TableCell align="center">
                              {numeral(profile.employees).format('0,0')}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">Address</TableCell>
                            <TableCell align="center">
                              {profile.address} {profile.city} {profile.state}{' '}
                              {profile.zip} {profile.country}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">Phone Number</TableCell>
                            <TableCell align="center">
                              +{profile.phone}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">CEO</TableCell>
                            <TableCell align="center">{profile.CEO}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Grid>
                  </Hidden>
                </Grid>
              </Box>
              <Box mt={2}>
                <Typography gutterBottom variant="h5" color="textPrimary">
                  <Link href={profile.website ?? '#'} target="blank">
                    {profile.website}
                  </Link>
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </PerfectScrollbar>
    </Paper>
  );
};

ProfileGlance.propTypes = {
  className: PropTypes.string,
  path: PropTypes.string
};

export default ProfileGlance;
