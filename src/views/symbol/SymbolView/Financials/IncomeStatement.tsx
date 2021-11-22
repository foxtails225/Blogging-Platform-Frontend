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
import { Income } from 'src/types/stock';

interface PostsProps {
  path: string;
}

const labels = {
  totalRevenue: 'Total Revenue',
  costOfRevenue: 'Cost of Revenue',
  grossProfit: 'Gross Profit',
  researchAndDevelopment: 'Research & Development',
  sellingGeneralAndAdmin: 'General, Selling, & Admin Costs',
  operatingExpense: 'Operating Expense',
  operatingIncome: 'Operating Income',
  otherIncomeExpenseNet: 'Other Income Next Expenses',
  ebit: 'EBIT',
  interestIncome: 'Interest Income',
  pretaxIncome: 'Pretax Income',
  incomeTax: 'Income Tax',
  minorityInterest: 'Minority Interest',
  netIncome: 'Net Income',
  netIncomeBasic: 'Net Income Basic',
  fiscalYear: 'Year'
};

const IncomeStatement: FC<PostsProps> = ({ path }) => {
  const [results, setResults] = useState<Income[]>([]);
  const [columns, setColumns] = useState<number[]>([]);

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(`/stock/income/${path}`);

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

IncomeStatement.propTypes = {
  path: PropTypes.string
};

export default IncomeStatement;
