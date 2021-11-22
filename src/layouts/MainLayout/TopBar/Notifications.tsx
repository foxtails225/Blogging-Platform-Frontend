import React, { FC, useRef, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  SvgIcon,
  Tooltip,
  Badge,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import { Bell as BellIcon, MessageCircle as MessageIcon } from 'react-feather';
import { Theme } from 'src/theme';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import PaymentIcon from '@material-ui/icons/Payment';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { useDispatch, useSelector } from 'src/store';
import { getNotifications } from 'src/slices/notification';
import axios from 'src/utils/axios';
import { socket, THEMES } from 'src/constants';

const iconsMap = {
  new_comment: MessageIcon,
  post_approved: CheckIcon,
  post_rejected: ClearIcon,
  payment_success: PaymentIcon,
  tips_success: AttachMoneyIcon
};

const useStyles = makeStyles((theme: Theme) => ({
  popover: {
    width: 320
  },
  icon: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText
  },
  collapse: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': '2'
  },
  unread: {
    backgroundColor:
      theme.name === THEMES.ONE_DARK ? colors.blue[900] : colors.lightBlue[50]
  }
}));

const Notifications: FC = () => {
  const classes = useStyles();
  const ref = useRef<any>(null);
  const dispatch = useDispatch();
  const [isOpen, setOpen] = useState<boolean>(false);
  const { notifications, count } = useSelector(state => state.notifications);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  useEffect(() => {
    socket.on('Notify', data => {
      dispatch(getNotifications());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = async (id: string) => {
    await axios.put<{ notification: Notification }>(
      `/notifications/update/read/${id}`
    );
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton color="primary" ref={ref} onClick={handleOpen}>
          {count > 0 ? (
            <Badge badgeContent={count} color="error">
              <SvgIcon>
                <BellIcon />
              </SvgIcon>
            </Badge>
          ) : (
            <SvgIcon>
              <BellIcon />
            </SvgIcon>
          )}
        </IconButton>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        classes={{ paper: classes.popover }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
      >
        <Box p={2}>
          <Typography variant="h5" color="textPrimary">
            Notifications
          </Typography>
        </Box>
        {notifications.length === 0 ? (
          <Box p={2}>
            <Typography variant="h6" color="textPrimary">
              There are no notifications
            </Typography>
          </Box>
        ) : (
          <>
            <List disablePadding>
              {notifications.map(notification => {
                const Icon = iconsMap[notification.type];

                return (
                  <ListItem
                    component={RouterLink}
                    divider
                    className={clsx(!notification.isRead && classes.unread)}
                    key={notification._id}
                    to={notification.url}
                    onClick={() => handleClick(notification._id)}
                  >
                    <ListItemAvatar>
                      <Avatar className={classes.icon}>
                        <SvgIcon fontSize="small">
                          <Icon />
                        </SvgIcon>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.title}
                      primaryTypographyProps={{
                        variant: 'subtitle2',
                        color: 'textPrimary'
                      }}
                      className={classes.collapse}
                      secondary={notification.description}
                    />
                  </ListItem>
                );
              })}
            </List>
            <Box p={1} display="flex" justifyContent="center">
              <Button
                component={RouterLink}
                size="small"
                to="/account/notification"
              >
                See All
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
};

export default Notifications;
