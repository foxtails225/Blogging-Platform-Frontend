import React, { useCallback, useEffect, useState } from 'react';
import { FC } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardHeader,
  Divider,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import { Theme } from 'src/theme';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { Quote } from 'src/types/stock';

interface TrendStocksProps {
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  item: {
    padding: theme.spacing(3),
    flexGrow: 1,
    '&:first-of-type': {
      borderRight: `1px solid ${theme.palette.divider}`
    }
  }
}));

const DankStocks: FC<TrendStocksProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const history = useHistory();
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const getQuotes = useCallback(async () => {
    try {
      const response = await axios.get<{ quotes: Quote[] }>('/stock/top');

      if (isMountedRef.current) {
        setQuotes(response.data.quotes);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getQuotes();
  }, [getQuotes]);

  const handleChip = (route: string): void => history.push(`/symbol/${route}`);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Dank Stocks" />
      <Divider />
      <List disablePadding>
        {quotes.map((quote: Quote, i) => (
          <ListItem divider={i < quotes.length - 1} key={i}>
            <ListItemAvatar>
              <Avatar alt="QuoteNumber">{i + 1}</Avatar>
            </ListItemAvatar>
            <ListItemText
              disableTypography
              primary={
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to={`/symbol/${quote.symbol}`}
                  underline="none"
                  variant="h6"
                >
                  {quote.companyName}
                </Link>
              }
              secondary={
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{
                    color:
                      quote.changePercent > 0
                        ? colors.green[300]
                        : colors.red[300]
                  }}
                >
                  {`$${quote.latestPrice} ${
                    quote.changePercent > 0 ? '+' : ''
                  }${quote.change} (${quote.changePercent}%)`}
                </Typography>
              }
            />
            <Chip
              variant="outlined"
              clickable={true}
              label={quote.symbol}
              onClick={() => handleChip(quote.symbol)}
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

DankStocks.propTypes = {
  className: PropTypes.string
};

export default DankStocks;
