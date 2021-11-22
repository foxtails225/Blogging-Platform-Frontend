import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { Balance } from 'src/types/stock';

interface PostsProps {
  path: string;
}

const labels = {
  currentCash: 'Current Cash',
  shortTermInvestments: 'Short Term Investments',
  receivables: 'Receivables',
  inventory: 'Inventory',
  otherCurrentAssets: 'Other Current Assets',
  currentAssets: 'Current Assets',
  longTermInvestments: 'Long Term Investments',
  propertyPlantEquipment: 'Property Plant Equipment',
  goodwill: 'Goodwill',
  intangibleAssets: 'Intangible Assets',
  otherAssets: 'Other Assets',
  totalAssets: 'Total Assets',
  accountsPayable: 'Accounts Payable',
  currentLongTermDebt: 'Current Long Term Debt',
  otherCurrentLiabilities: 'Other Current Liabilities',
  totalCurrentLiabilities: 'Total Current Liabilities',
  longTermDebt: 'long Term Debt',
  otherLiabilities: 'Other Liabilities',
  minorityInterest: 'Minority Interest',
  totalLiabilities: 'Total Liabilities',
  commonStock: 'Common Stock',
  retainedEarnings: 'Retained Earnings',
  treasuryStock: 'Treasury Stock',
  capitalSurplus: 'Capital Surplus',
  shareholderEquity: 'Shareholder Equity',
  netTangibleAssets: 'Net Tangible Assets',
  fiscalYear: 'Year'
};

const BalanceSheet: FC<PostsProps> = ({ path }) => {
  const [results, setResults] = useState<Balance[]>([]);
  const [columns, setColumns] = useState<number[]>([]);

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(`/stock/balance-sheet/${path}`);

      if (response.data) {
        const data = response.data.map(item => {
          const temp = {};
          Object.keys(labels).forEach(label => {
            temp[label] = item[label];
          });
          return temp;
        });
        setResults(data);
      }
    };
    path && getData();
  }, [path]);

  useEffect(() => {
    if (results.length === 0) return;

    const data = results.map(result => result?.fiscalYear);
    data.shift();
    setColumns(data);
  }, [results]);

  return (
    <Box minWidth={700}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" />
            <TableCell align="center">YTD</TableCell>
            {columns.map(column => (
              <TableCell key={column} align="center">
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        {results.length > 0 && (
          <TableBody>
            {Object.keys(results[0])
              .filter(key => key !== 'fiscalYear')
              .map(key => (
                <TableRow hover key={key}>
                  <TableCell align="center" width={100}>
                    {labels[key]}
                  </TableCell>
                  {Array.from({ length: columns.length + 1 }).map((v, idx) => (
                    <TableCell key={idx} align="center">
                      {results[idx][key]
                        ? typeof results[idx][key] === 'number'
                          ? results[idx][key] >= 0
                            ? numeral(results[idx][key] / (10 ^ 6)).format(
                                '0,0'
                              )
                            : `(${numeral(
                                // @ts-ignore
                                Math.abs(results[idx][key] / (10 ^ 6))
                              ).format('0,0')})`
                          : results[idx][key]
                        : '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        )}
      </Table>
    </Box>
  );
};

BalanceSheet.propTypes = {
  path: PropTypes.string
};

export default BalanceSheet;
