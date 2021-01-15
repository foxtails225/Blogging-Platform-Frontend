import React, { FC } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  colors,
  makeStyles,
  Box,
  Chip
} from '@material-ui/core';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import {
  Hash as HashIcon,
  MessageCircle as MessageCircleIcon
} from 'react-feather';
import { Theme } from 'src/theme';
import { User } from 'src/types/user';

interface AboutProps {
  className?: string;
  profile: User;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  blueAvatar: {
    backgroundColor: theme.palette.secondary.main
  },
  redAvatar: {
    backgroundColor: colors.red[600]
  },
  cardContent: {
    paddingTop: 0
  }
}));

const About: FC<AboutProps> = ({ className, profile, ...rest }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box mt={2}>
        <Card>
          <CardHeader title="Profile Status" />
          <Divider />
          <CardContent className={classes.cardContent}>
            <List>
              <ListItem disableGutters divider>
                <ListItemAvatar>
                  <Avatar className={classes.blueAvatar}>
                    <DescriptionOutlinedIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="0 posts published"
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: 'textSecondary'
                  }}
                />
                <Chip color="secondary" size="small" label="Contribute" />
              </ListItem>
              <ListItem disableGutters divider>
                <ListItemAvatar>
                  <Avatar className={classes.redAvatar}>
                    <MessageCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="8 comments written"
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: 'textSecondary'
                  }}
                />
              </ListItem>
              <ListItem disableGutters divider>
                <ListItemAvatar>
                  <Avatar className={classes.redAvatar}>
                    <HashIcon size={22} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="0 tag followed"
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: 'textSecondary'
                  }}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

About.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  profile: PropTypes.object.isRequired
};

export default About;
