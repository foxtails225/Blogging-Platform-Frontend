import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import numeral from 'numeral';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Label from 'src/components/Label';
import GenericMoreButton from 'src/components/GenericMoreButton';
import axios from 'src/utils/axios-mock';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { Order, OrderStatus } from 'src/types/reports';

interface LatestOrdersProps {
  className?: string;
}

const labelColors: Record<OrderStatus, 'success' | 'warning' | 'error'> = {
  complete: 'success',
  pending: 'warning',
  rejected: 'error'
};

const columns = [
  { name: 'no', value: 'No' },
  { name: 'title', value: 'Title' },
  { name: 'tags', value: 'Tags' },
  { name: 'total', value: 'Total' },
  { name: 'status', value: 'Status' },
  { name: 'createdAt', value: 'Date' }
];

const useStyles = makeStyles(() => ({
  root: {}
}));

const LatestOrders: FC<LatestOrdersProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [orders, setOrders] = useState<Order[]>([]);

  const getOrders = useCallback(async () => {
    try {
      const response = await axios.get<{ orders: Order[] }>(
        '/api/reports/latest-orders'
      );

      if (isMountedRef.current) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader action={<GenericMoreButton />} title="Latest Orders" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  //@ts-ignore
                  <TableCell align="center">{column.value}</TableCell>
                ))}
                {/* <TableCell sortDirection="desc">
                  <Tooltip enterDelay={300} title="Sort">
                    <TableSortLabel active direction="desc">
                      No
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Date</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => (
                <TableRow hover key={order.id}>
                  <TableCell align="center">{order.number}</TableCell>
                  <TableCell align="center">{order.customer.name}</TableCell>
                  <TableCell align="center">{order.items}</TableCell>
                  <TableCell align="center">
                    {numeral(order.totalAmount).format(
                      `${order.currency}0,0.00`
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Label color={labelColors[order.status]}>
                      {order.status}
                    </Label>
                  </TableCell>
                  <TableCell align="center">
                    {moment(order.createdAt).format('DD MMM, YYYY hh:mm:ss')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box p={2} display="flex" justifyContent="flex-end">
        <Button
          component={RouterLink}
          size="small"
          to="/app/management/orders"
          endIcon={<NavigateNextIcon />}
        >
          See all
        </Button>
      </Box>
    </Card>
  );
};

LatestOrders.propTypes = {
  className: PropTypes.string
};

export default LatestOrders;
