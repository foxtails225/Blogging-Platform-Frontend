import React, { FC, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'src/utils/axios';
import numeral from 'numeral';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  makeStyles
} from '@material-ui/core';
import { KeyStats } from 'src/types/stock';

interface KeyGlanceProps {
  className?: string;
  path: string;
}

const useStyles = makeStyles(() => ({
  root: {}
}));

const KeyGlance: FC<KeyGlanceProps> = ({ className, path, ...rest }) => {
  const classes = useStyles();
  const [source, setSource] = useState<KeyStats>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<KeyStats>(
        `/stock/advanced-stats/${path}`
      );

      if (response.data) {
        setSource(response.data);
      }
    };
    path && fetchData();
  }, [path]);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Key Stats" />
      <Divider />
      <PerfectScrollbar>
        <Box>
          {source && (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell align="center">10-Day Volume</TableCell>
                  <TableCell align="center">
                    {numeral(source.avg10Volume).format('0,0')}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">52 Week High</TableCell>
                  <TableCell align="center">
                    {numeral(source.week52high).format('0,0.00')}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">52 Week Low</TableCell>
                  <TableCell align="center">
                    {numeral(source.week52low).format('0,0.00')}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">Market Cap</TableCell>
                  <TableCell align="center">
                    {numeral(source.marketcap).format('0,0')}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">Shares Outstanding</TableCell>
                  <TableCell align="center">
                    {numeral(source.sharesOutstanding).format('0,0')}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">Beta</TableCell>
                  <TableCell align="center">
                    {numeral(source.beta).format('0,0.00')}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

KeyGlance.propTypes = {
  className: PropTypes.string,
  path: PropTypes.string
};

export default KeyGlance;
