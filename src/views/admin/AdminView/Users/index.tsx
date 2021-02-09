import React, { FC, ChangeEvent, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Divider,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  makeStyles
} from '@material-ui/core';
import Label from 'src/components/Label';
import getInitials from 'src/utils/getInitials';
import { Theme } from 'src/theme';
import axios from 'src/utils/axios';
import GenericMoreButton from 'src/components/GenericMoreButton';
import { User } from 'src/types/user';
import StatusModal from './StatusModal';

interface UsersProps {
  className?: string;
}

type OrderByStatus = 'desc' | 'asc';

interface Status {
  page: number;
  limit: number;
  count: number;
  order: string;
  orderBy: OrderByStatus;
}

interface Modal {
  _id: string;
  status: boolean;
  reason: string;
}

const columns = [
  { name: 'name', value: 'Name' },
  { name: 'email', value: 'Email' },
  { name: 'role', value: 'Role' },
  { name: 'status', value: 'Status' },
  { name: 'createdAt', value: 'Date' }
];

const initialStatus: Status = {
  page: 0,
  limit: 5,
  count: 0,
  order: 'createdAt',
  orderBy: 'desc'
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {}
}));

const Users: FC<UsersProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [modal, setModal] = useState<Modal>();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = async () => {
    try {
      const sortBy = { [status.order]: status.orderBy === 'desc' ? -1 : 1 };
      const params = { page: status.page, sortBy, limit: status.limit };
      const response = await axios.post<{
        users: User[];
        count: number;
      }>('/admin/users/all/', params);

      setUsers(response.data.users);
      setStatus(prevState => ({ ...prevState, count: response.data.count }));
    } catch (err) {
      setStatus(initialStatus);
      setUsers([]);
    }
  };

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.page, status.limit, status.order, status.orderBy]);

  const createSortHandler = (event): void => {
    const order = event.currentTarget.id;
    const orderBy = status.orderBy !== 'desc' ? 'desc' : 'asc';
    setStatus(prevState => ({ ...prevState, order, orderBy }));
  };

  const handleChangePage = (event: unknown, page: number) => {
    setStatus(prevState => ({ ...prevState, page }));
  };

  const handleSortDirection = (name: string): OrderByStatus => {
    const direction =
      status.order === name && status.orderBy ? status.orderBy : 'desc';
    return direction;
  };

  const handleChangeLimit = (event: ChangeEvent<HTMLInputElement>): void => {
    const limit = parseInt(event.target.value, 10);
    setStatus(prevState => ({ ...prevState, limit, page: 0 }));
  };

  const handleStatus = (data: User) => {
    setModal({ _id: data._id, status: data.status, reason: data.reason });
    setOpen(!open);
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader action={<GenericMoreButton />} title="All Users" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell key={column.name} align="center">
                    <TableSortLabel
                      id={column.name}
                      active={status.order === column.name}
                      onClick={createSortHandler}
                      direction={handleSortDirection(column.name)}
                      disabled={column.name === 'no'}
                    >
                      {column.value}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow hover key={user._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        alt="Author"
                        src={user.avatar}
                        component={RouterLink}
                        to={'/users/' + user.name}
                      >
                        {getInitials(user.name)}
                      </Avatar>
                      <Box ml={1}>
                        <Link
                          color="textPrimary"
                          component={RouterLink}
                          to={'/users/' + user.name}
                          variant="body2"
                        >
                          {user.name}
                        </Link>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {user.email}
                  </TableCell>
                  <TableCell align="center">
                    {user.role}
                  </TableCell>
                  <TableCell align="center" onClick={() => handleStatus(user)}>
                    <Label color={user.status ? 'success' : 'error'}>
                      {user.status ? 'Active' : 'Banned'}
                    </Label>
                  </TableCell>
                  <TableCell align="center">
                    {moment(user.createdAt).format('DD MMM, YYYY hh:mm:ss')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={status.count}
            rowsPerPage={status.limit}
            page={status.page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeLimit}
          />
        </Box>
      </PerfectScrollbar>
      <Box p={2} display="flex" justifyContent="flex-end" />
      {open && (
        <StatusModal
          open={open}
          data={modal}
          onOpen={handleOpen}
          onFetch={getUsers}
        />
      )}
    </Card>
  );
};

Users.propTypes = {
  className: PropTypes.string
};

export default Users;
