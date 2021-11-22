import React, { FC, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'src/utils/axios';
import {
  Grid,
  ButtonGroup,
  Button,
  Box,
  makeStyles,
  colors
} from '@material-ui/core';
import { Theme } from 'src/theme';
import { Quote } from 'src/types/stock';
import StockVisxWrapper from 'src/components/StockVisxWrapper';

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
  const [period, setPeriod] = useState<string>('dynamic');

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

  const handleClick = (event): void => setPeriod(event.currentTarget.name);

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <StockVisxWrapper
            period={period}
            path={path}
            name={name}
            quote={quote}
            color={color}
            width={700}
            ratio={0.4}
          />
        </Grid>
        <Grid item md={6}>
          <Box mt={9} style={{ textAlign: 'end' }}>
            <ButtonGroup color="primary" size="small">
              {buttons.map(button => (
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
