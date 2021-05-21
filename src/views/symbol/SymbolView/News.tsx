import React, { FC, useEffect, useState } from 'react';
import axios from 'src/utils/axios';
import {
  Container,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Link,
  Grid,
  Chip,
  Button,
  Typography,
  makeStyles
} from '@material-ui/core';
import { StockNews } from 'src/types/stock';
import { Theme } from 'src/theme';

interface NewsProps {
  path: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: 32
  },
  image: {
    height: '15vh',
    marginRight: '2vw',
    [theme.breakpoints.down('sm')]: {
      height: '20vh'
    }
  },
  content: {
    paddingTop: 0,
    paddingBottom: 0
  },
  item: {
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      textAlign: 'center'
    }
  },
  chip: {
    margin: theme.spacing(0.5)
  }
}));

const News: FC<NewsProps> = ({ path }) => {
  const classes = useStyles();
  const [results, setResults] = useState<StockNews[]>([]);
  const [amount, setAmount] = useState<number>(10);

  useEffect(() => {
    const fetchData = async (value: string) => {
      const response = await axios.get<{ data: StockNews[] }>(
        `/stock/news/${value}?items=${amount}`
      );

      if (response.data.data && response.data.data.length > 0) {
        setResults(response.data.data);
      }
    };
    path && fetchData(path);
  }, [path, amount]);

  const handleClick = (): void => setAmount(amount + 10);

  return (
    <Container className={classes.root} maxWidth={false}>
      {results.length > 0 && (
        <Grid container spacing={3} justify="center">
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <CardContent className={classes.content}>
                <List>
                  {results.map((result: StockNews, id) => (
                    <ListItem
                      key={id}
                      disableGutters
                      divider
                      className={classes.item}
                    >
                      <img
                        alt="Stock News"
                        src={result.image_url}
                        className={classes.image}
                      />
                      <ListItemText
                        primary={
                          <Link
                            color="textPrimary"
                            target="_blank"
                            href={result.news_url}
                            variant="h5"
                          >
                            {result.title}
                          </Link>
                        }
                        primaryTypographyProps={{
                          variant: 'body1',
                          color: 'textPrimary'
                        }}
                        secondary={
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            component={'span'}
                          >
                            {result.text}
                            <br />
                            {result.tickers.slice(0, 2).map((ticker, i) => (
                              <Chip
                                variant="outlined"
                                key={i}
                                size="small"
                                label={ticker}
                                className={classes.chip}
                              />
                            ))}
                            {` | Date`}: {result.date}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={3}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleClick}
              disabled={amount > 40}
              fullWidth
            >
              Read More
            </Button>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default News;
