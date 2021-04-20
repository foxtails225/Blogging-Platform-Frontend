import React, { FC, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'src/utils/axios';
import { Grid, Typography, Box, makeStyles, colors } from '@material-ui/core';
import { Theme } from 'src/theme';
import { Quote } from 'src/types/stock';
import HighchartsWrapper from './HighchartsWrapper';

interface HeaderProps {
  className?: string;
  path: string;
}

interface Color {
  quote: string;
  preQuote: string;
}

const initialColor: Color = {
  quote: colors.green[300],
  preQuote: colors.green[300]
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  action: {
    backgroundColor: theme.palette.common.white
  },
  image: {
    width: '100%',
    maxHeight: 400
  },
  item: {
    padding: theme.spacing(3),
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      '&:not(:last-of-type)': {
        borderRight: `1px solid ${theme.palette.divider}`
      }
    },
    [theme.breakpoints.down('sm')]: {
      '&:not(:last-of-type)': {
        borderBottom: `1px solid ${theme.palette.divider}`
      }
    }
  },
  label: {
    marginLeft: theme.spacing(1)
  },
  overline: {
    marginTop: theme.spacing(1)
  }
}));

const Header: FC<HeaderProps> = ({ className, path, ...rest }) => {
  const classes = useStyles();
  const [name, setName] = useState<string>('');
  const [quote, setQuote] = useState<Quote>();
  const [color, setColor] = useState<Color>(initialColor);

  useEffect(() => {
    if (!path) return;

    const fecthQuote = async (value: string) => {
      const response = await axios.get<Quote>(`/stock/quote/${value}`);

      if (response.data) {
        let quoteData = {
          latestPrice: response.data.latestPrice ?? 'N/A',
          change: response.data.change ?? 'N/A',
          changePercent: response.data.changePercent ?? 'N/A',
          extendedPrice: response.data.extendedPrice ?? 'N/A',
          extendedChange: response.data.extendedChange ?? 'N/A',
          extendedChangePercent: response.data.extendedChangePercent ?? 'N/A'
        };

        setQuote(quoteData);
        setName(value + ' : ' + response.data.companyName);
      }
    };

    fecthQuote(path);
  }, [path]);

  useEffect(() => {
    if (!quote) return;
    let quoteColor = quote.change >= 0 ? colors.green[300] : colors.red[300];
    let preQuoteColor =
      quote.extendedChange >= 0 ? colors.green[300] : colors.red[300];

    setColor({ quote: quoteColor, preQuote: preQuoteColor });
  }, [quote]);

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid alignItems="center" container justify="space-between" spacing={3}>
        <Grid item md={6} xs={12}>
          <Typography variant="h3" color="textPrimary" display="inline">
            {`${name} - `}
          </Typography>
          {quote && (
            <Typography
              variant="body1"
              display="inline"
              style={{ color: color.quote }}
            >
              ${quote.latestPrice} {quote.change >= 0 ? '+' : '-'}$
              {typeof quote.change === 'number'
                ? Math.abs(quote.change)
                : quote.change}{' '}
              ({quote.changePercent >= 0 && '+'}
              {quote.changePercent}%)
            </Typography>
          )}
          <Typography variant="subtitle1" color="textSecondary">
            {`After Hours - `}
            {quote && (
              <Typography
                variant="body1"
                display="inline"
                style={{ color: color.preQuote }}
              >
                ${quote.extendedPrice} {quote.extendedChange >= 0 ? '+' : '-'}$
                {typeof quote.extendedChange === 'number'
                  ? Math.abs(quote.extendedChange)
                  : quote.extendedChange}{' '}
                ({quote.extendedChangePercent >= 0 && '+'}
                {quote.extendedChangePercent}%)
              </Typography>
            )}
          </Typography>
          <Box mt={3}>
            <HighchartsWrapper path={path} />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string,
  path: PropTypes.string
};

export default Header;
