import React, { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Link,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { Theme } from 'src/theme';
import { StockNews } from 'src/types/stock';

interface TrendAuthorsProps {
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  text: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': '2'
  }
}));

const DankNews: FC<TrendAuthorsProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const [results, setResults] = useState<StockNews[]>([]);

  const getData = async () => {
    const fetchData = async () => {
      const response = await axios.get<{ data: StockNews[] }>(
        `/stock/news/general?items=${5}`
      );

      if (response.data.data && response.data.data.length > 0) {
        setResults(response.data.data);
      }
    };
    fetchData();
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Dank News" />
      <Divider />
      <List disablePadding>
        {results.map((result: StockNews, i) => (
          <ListItem divider={i < results.length - 1} key={i}>
            <ListItemAvatar>
              <Avatar alt="PostNumber">{i + 1}</Avatar>
            </ListItemAvatar>
            <ListItemText
              disableTypography
              primary={
                <Link
                  color="textPrimary"
                  href={result.news_url}
                  underline="none"
                  variant="h6"
                  target="blank"
                >
                  {result.title}
                </Link>
              }
              secondary={
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className={classes.text}
                >
                  {result.text && result.text}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

DankNews.propTypes = {
  className: PropTypes.string
};

export default DankNews;
