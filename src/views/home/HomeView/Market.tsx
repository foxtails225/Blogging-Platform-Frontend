import React, { FC, useState, useEffect, useCallback } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  Divider,
  List,
  ListItem,
  ButtonGroup,
  Button,
  makeStyles,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { Theme } from 'src/theme';
import VisxWrapper from 'src/components/VisxWrapper';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { Quote } from 'src/types/stock';

interface MarketProps {
  className?: string;
}

const initialStocks = ['SPY', 'DIA', 'IWM'];

const buttons = [
  { name: 'dynamic', label: '1D', visible: true },
  { name: '5d', label: '5D', visible: true },
  { name: '1m', label: '1M', visible: true },
  { name: '3m', label: '3M', visible: false },
  { name: '1y', label: '1Y', visible: true },
  { name: '5y', label: '5Y', visible: false },
  { name: 'max', label: 'ALL', visible: true }
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  avatar: {
    fontSize: 14,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.common.white
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    marginBottom: theme.spacing(3)
  },
  scrollbar: {
    '& .ps__rail-x': {
      display: 'block',
      minWidth: 400
    }
  }
}));

const Market: FC<MarketProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMountedRef = useIsMountedRef();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [period, setPeriod] = useState<string>('dynamic');
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const getQuotes = useCallback(async () => {
    try {
      const data = [];

      for (let stock of initialStocks) {
        const response = await axios.get<Quote>(`/stock/quote/${stock}`);

        if (isMountedRef.current && response.data) {
          let quoteData = {
            symbol: response.data.symbol,
            latestPrice: response.data.latestPrice ?? 'N/A',
            change: response.data.change ?? 'N/A',
            changePercent: response.data.changePercent ?? 'N/A',
            extendedPrice: response.data.extendedPrice ?? 'N/A',
            extendedChange: response.data.extendedChange ?? 'N/A',
            extendedChangePercent: response.data.extendedChangePercent ?? 'N/A'
          };
          data.push(quoteData);
        }
      }

      if (isMountedRef.current) {
        setQuotes(data);
      }
    } catch (err) {
      setQuotes([]);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getQuotes();
  }, [getQuotes]);

  const handleClick = (event): void => setPeriod(event.currentTarget.name);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader
        title="Market"
        action={
          <ButtonGroup color="primary" size="small">
            {buttons
              .filter(
                button => (mobileDevice && button.visible) || !mobileDevice
              )
              .map(button => (
                <Button
                  key={button.name}
                  name={button.name}
                  onClick={handleClick}
                  variant={period === button.name ? 'contained' : 'outlined'}
                >
                  {button.label}
                </Button>
              ))}
          </ButtonGroup>
        }
      />
      <Divider />
      <PerfectScrollbar className={classes.scrollbar}>
        <List disablePadding className={classes.list}>
          {quotes.map((quote, i) => (
            <ListItem key={quote.symbol}>
              <VisxWrapper
                quote={quote}
                period={period}
                path={quote.symbol}
                width={350}
                ratio={0.5}
              />
            </ListItem>
          ))}
        </List>
      </PerfectScrollbar>
    </Card>
  );
};

Market.propTypes = {
  className: PropTypes.string
};

export default Market;
