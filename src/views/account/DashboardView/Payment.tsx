import React, { FC, useEffect, useState, ChangeEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import numeral from 'numeral';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  makeStyles,
  Typography,
  Link
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { User } from 'src/types/user';
import useAuth from 'src/hooks/useAuth';
import { Theme } from 'src/theme';
import {
  Balance,
  Transaction,
  TransactionWithClient
} from 'src/types/transaction';

interface PaymentProps {
  className?: string;
  profile: User;
}

type OrderByStatus = 'desc' | 'asc';

interface Status {
  page: number;
  limit: number;
  order: string;
  orderBy: OrderByStatus;
}

const columns = [
  { name: 'no', value: 'No' },
  { name: 'createdAt', value: 'Date' },
  { name: 'status', value: 'Status' },
  { name: 'type', value: 'Type' },
  { name: 'client', value: 'Client' },
  { name: 'amount', value: 'Initial Pyament' },
  { name: 'fee', value: 'Fee' },
  { name: 'income', value: 'Net Income' },
  { name: 'refund', value: '' }
];

const initialStatus: Status = {
  page: 0,
  limit: 5,
  order: 'createdAt',
  orderBy: 'desc'
};

const initialBalance: Balance = {
  available: 0,
  instant_available: 0,
  pending: 0
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  action: {
    margin: theme.spacing(1)
  }
}));

const Payment: FC<PaymentProps> = ({ className, profile, ...rest }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const [count, setCount] = useState<number>(0);
  const [status, setStatus] = useState<Status>(initialStatus);
  const [balance, setBalance] = useState<Balance>(initialBalance);
  const [transactions, setTransactions] = useState<TransactionWithClient[]>([]);

  const getPosts = async () => {
    try {
      const sortBy = { [status.order]: status.orderBy === 'desc' ? -1 : 1 };
      const params = { page: status.page, sortBy, limit: status.limit, user };
      const response = await axios.post<{
        transactions: TransactionWithClient[];
        count: number;
      }>('/transactions/all/', params);

      setTransactions(response.data.transactions);
      setCount(response.data.count);
    } catch (err) {
      console.error(err);
    }
  };

  const getBalance = async () => {
    try {
      const response = await axios.get('/stripe/balance');

      if (response.data) {
        Object.keys(balance).forEach(item => {
          const amount = response.data[item].reduce(
            (a, b) => a + (b['amount'] || 0),
            0
          );
          setBalance(prevState => ({ ...prevState, [item]: amount / 100 }));
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getBalance();
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, user]);

  const createSortHandler = (event): void => {
    const { id } = event.currentTarget;
    const value = status.orderBy !== 'desc' ? 'desc' : 'asc';
    setStatus(prevState => ({
      ...prevState,
      order: id,
      orderBy: value
    }));
  };

  const handleChangePage = (event: unknown, newPage: number) =>
    setStatus(prevState => ({ ...prevState, page: newPage }));

  const handleSortDirection = (name: string): OrderByStatus => {
    const direction =
      status.order === name && status.orderBy ? status.orderBy : 'desc';
    return direction;
  };

  const handleChangeLimit = (event: ChangeEvent<HTMLInputElement>): void => {
    setStatus(prevState => ({
      ...prevState,
      limit: parseInt(event.target.value, 10),
      page: 0
    }));
  };

  const handleRefund = async event => {
    const params = { _id: event.currentTarget.name };
    if (event.currentTarget.name) {
      await axios.put<{ transaction: Transaction }>(
        '/transactions/refund/',
        params
      );
    }
    getPosts();
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader
        action={
          <Typography variant="h5" color="textSecondary">
            Balance: {numeral(balance.instant_available).format(`$0,0.00`)}
          </Typography>
        }
        classes={{ action: classes.action }}
        title="Latest Transactions"
      />
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
                      disabled={
                        column.name === 'no' ||
                        column.name === 'income' ||
                        column.name === 'refund' ||
                        column.name === 'status' ||
                        column.name === 'client'
                      }
                    >
                      {column.value}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map(
                (transaction: TransactionWithClient, idx: number) => (
                  <TableRow hover key={transaction._id}>
                    <TableCell align="center">{idx + 1}</TableCell>
                    <TableCell align="center">
                      {moment(transaction.createdAt).format(
                        'DD MMM, YYYY hh:mm:ss'
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {transaction.user === profile._id ? 'Received' : 'Sent'}
                    </TableCell>
                    <TableCell align="center">
                      {transaction.type
                        .split('_')
                        .map(
                          item =>
                            item.charAt(0).toUpperCase() +
                            item.slice(1).toLowerCase()
                        )
                        .join(' ')}
                    </TableCell>
                    <TableCell align="center">
                      {transaction.client._id !== profile._id && (
                        <Link
                          color="inherit"
                          component={RouterLink}
                          to={'/users/' + transaction.client.name}
                          variant="body2"
                        >
                          {transaction.client?.name}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell align="center">${transaction.amount}</TableCell>
                    <TableCell align="center">${transaction.fee}</TableCell>
                    <TableCell align="center">
                      ${transaction.amount - transaction.fee}
                    </TableCell>
                    <TableCell width="10%">
                      {moment().diff(moment(transaction.createdAt), 'h') <=
                        24 && (
                        <Button
                          name={transaction?._id}
                          color="primary"
                          variant="contained"
                          size="small"
                          onClick={handleRefund}
                          disabled={
                            transaction.user === profile._id ||
                            transaction.requestRefund
                          }
                        >
                          Refund
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={count}
            rowsPerPage={status.limit}
            page={status.page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeLimit}
          />
        </Box>
      </PerfectScrollbar>
      <Box p={2} display="flex" justifyContent="flex-end" />
    </Card>
  );
};

Payment.propTypes = {
  className: PropTypes.string,
  //@ts-ignore
  profile: PropTypes.object
};

export default Payment;
