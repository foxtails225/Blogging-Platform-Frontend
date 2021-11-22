import React, { FC, useState } from 'react';
import {
  Container,
  Box,
  Button,
  makeStyles,
  Typography
} from '@material-ui/core';
import IncomeStatement from './IncomeStatement';
import BalanceSheet from './BalanceSheet';
import CashFlow from './CashFlow';

interface FinancialsProps {
  path: string;
}

const buttons = [
  { value: 'income', label: 'Income Statement' },
  { value: 'balance', label: 'Balance Sheet' },
  { value: 'flow', label: 'Cash Flow' }
];

const useStyles = makeStyles(() => ({
  root: {
    paddingTop: 32,
    minHeight: '30vh'
  }
}));

const Financials: FC<FinancialsProps> = ({ path }) => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState<string>('income');

  const handleTab = (event): void => setCurrentTab(event.currentTarget.value);

  return (
    <Container className={classes.root} maxWidth={false}>
      <Box mt={1} display="flex">
        {buttons.map(item => (
          <Box key={item.value} mr={2}>
            <Button
              value={item.value}
              variant="outlined"
              size="small"
              onClick={handleTab}
              color={item.value === currentTab ? 'primary' : 'default'}
            >
              {item.label}
            </Button>
          </Box>
        ))}
        <Box flexGrow={1} />
        <Box>
          <Typography variant="h5" component="h5" color="textPrimary">
            (In millions)
          </Typography>
        </Box>
      </Box>
      <Box pb={6}>
        {currentTab === 'income' && <IncomeStatement path={path} />}
        {currentTab === 'balance' && <BalanceSheet path={path} />}
        {currentTab === 'flow' && <CashFlow path={path} />}
      </Box>
    </Container>
  );
};

export default Financials;
