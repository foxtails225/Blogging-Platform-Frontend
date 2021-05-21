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
  ListItemText,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { Theme } from 'src/theme';
import HighchartsWrapper from './HighchartsWrapper';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { Quote } from 'src/types/stock';

interface MarketProps {
  className?: string;
}

const initialStocks = ['SPY', 'DIA', 'IWM'];

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
    padding: 0
  },
  typography: {
    marginLeft: 10
  },
  listItemText: {
    whiteSpace: 'nowrap'
  },
  listItemSecondaryText: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  item: {
    width: '10vw',
    [theme.breakpoints.down('sm')]: {
      width: '35vw'
    }
  }
}));

const Market: FC<MarketProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [quotes, setQuotes] = useState<Quote[]>([]);

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

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Market" />
      <Divider />
      <PerfectScrollbar options={{ suppressScrollY: true }}>
        <List disablePadding className={classes.list}>
          {quotes.map((quote, i) => {
            const color = {
              color:
                quote.changePercent > 0 ? colors.green[300] : colors.red[300]
            };
            return (
              <ListItem key={quote.symbol}>
                <ListItemText
                  primary={quote.symbol}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondary={quote.latestPrice}
                  className={classes.listItemText}
                />
                <ListItemText
                  primary={
                    <Typography style={color} variant="body2">
                      {quote.change >= 0 ? '+' : '-'}$
                      {typeof quote.change === 'number'
                        ? Math.abs(quote.change)
                        : quote.change}{' '}
                    </Typography>
                  }
                  secondary={
                    <Typography style={color} variant="body2">
                      {quote.changePercent >= 0 && '+'}
                      {quote.changePercent}%
                    </Typography>
                  }
                  className={classes.listItemSecondaryText}
                />

                <div className={classes.item}>
                  <HighchartsWrapper path={quote.symbol} />
                </div>
              </ListItem>
            );
          })}
        </List>
      </PerfectScrollbar>
    </Card>
  );
};

Market.propTypes = {
  className: PropTypes.string
};

export default Market;
