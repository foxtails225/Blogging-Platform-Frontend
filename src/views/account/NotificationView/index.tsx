import React, { FC, useState, useEffect } from 'react';
import moment from 'moment';
import parser from 'html-react-parser';
import {
  Avatar,
  Box,
  Container,
  Card,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import { MessageCircle as MessageIcon } from 'react-feather';
import Pagination from '@material-ui/lab/Pagination';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import PaymentIcon from '@material-ui/icons/Payment';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { Theme } from 'src/theme';
import axios from 'src/utils/axios';
import Page from 'src/components/Page';
import { Notification } from 'src/types/notification';

interface Status {
  page: number;
  limit: number;
  count: number;
}

const initialStatus: Status = {
  page: 1,
  limit: 5,
  count: 0
};

const sections = ['today', 'earlier'];

const iconsMap = {
  new_comment: MessageIcon,
  post_approved: CheckIcon,
  post_rejected: ClearIcon,
  payment_success: PaymentIcon,
  tips_success: AttachMoneyIcon
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  icon: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText
  },
  card: {
    marginBottom: theme.spacing(3)
  }
}));

const NotificationView: FC = () => {
  const classes = useStyles();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [notifications, setNotifications] = useState({
    today: [],
    earlier: []
  });

  const markAll = async () => {
    await axios.post<{ notification: Notification }>(
      `/notifications/update/read/all`
    );
  };

  const fetchData = async (section: string) => {
    const params =
      section !== 'today'
        ? { limit: status.limit, page: status.page - 1 }
        : { limit: null, page: 0 };

    const response = await axios.post<{
      notifications: Notification[];
      count: number;
    }>(`/notifications/get/${section}`, params);

    if (response.data) {
      setNotifications(prevState => ({
        ...prevState,
        [section]: response.data.notifications
      }));
      section !== 'today' &&
        setStatus(prevState => ({ ...prevState, count: response.data.count }));
    }
  };

  useEffect(() => {
    for (let section of sections) {
      fetchData(section);
    }
    markAll();
    // eslint-disable-next-line
  }, [status.page]);

  const handleChangePage = (event: unknown, page: number) => {
    setStatus(prevState => ({ ...prevState, page }));
  };

  return (
    <Page className={classes.root} title="Notifications">
      <Container maxWidth="lg">
        {sections.map(section => (
          <Card className={classes.card}>
            <CardHeader
              title={section.charAt(0).toUpperCase() + section.slice(1)}
            />
            <Divider />
            <List disablePadding>
              {notifications[section].map((notification: Notification, idx) => {
                const Icon = iconsMap[notification.type];

                return (
                  <ListItem
                    divider={idx < notifications[section].length}
                    key={notification._id}
                  >
                    <ListItemAvatar>
                      <ListItemAvatar>
                        <Avatar className={classes.icon}>
                          <SvgIcon fontSize="small">
                            <Icon />
                          </SvgIcon>
                        </Avatar>
                      </ListItemAvatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.title}
                      primaryTypographyProps={{
                        variant: 'h5',
                        color: 'textPrimary'
                      }}
                      secondary={
                        <>
                          {parser(notification.description)}
                          <br />
                          {moment(notification.createdAt).fromNow()}
                        </>
                      }
                      secondaryTypographyProps={{
                        variant: 'body2',
                        color: 'textSecondary'
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
            {section === 'earlier' && (
              <Box p={2} display="flex" justifyContent="center">
                <Pagination
                  count={Math.ceil(status.count / status.limit)}
                  page={status.page}
                  color="primary"
                  onChange={handleChangePage}
                />
              </Box>
            )}
          </Card>
        ))}
      </Container>
    </Page>
  );
};

export default NotificationView;
