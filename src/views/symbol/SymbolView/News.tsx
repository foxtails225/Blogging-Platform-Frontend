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
      width: '100vw',
    }
  },
  content: {
    paddingTop: 0,
    paddingBottom: 0
  },
  chip: {
    margin: theme.spacing(0.5)
  }
}));

const News: FC<NewsProps> = ({ path }) => {
  const classes = useStyles();
  const [results, setResults] = useState<StockNews[]>([]);

  useEffect(() => {
    const fetchData = async (value: string) => {
      const response = await axios.get<{ data: StockNews[] }>(
        `/stock/news/${value}`
      );

      if (response.data.data && response.data.data.length > 0) {
        setResults(response.data.data);
      }
    };
    path && fetchData(path);
  }, [path]);

  return (
    <Container className={classes.root} maxWidth={false}>
      {results.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <CardContent className={classes.content}>
                <List>
                  {results.map((result: StockNews, id) => (
                    <ListItem key={id} disableGutters divider>
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
                            // className={classes.text}
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
        </Grid>
      )}
    </Container>
  );
};

export default News;
