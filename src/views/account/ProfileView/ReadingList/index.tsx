import React, { useState, useEffect, useCallback, FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Grid,
  Card,
  CardContent,
  List,
  Hidden,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { User } from 'src/types/user';
import { Bookmark, BookmarkWithPost } from 'src/types/bookmark';
import { Theme } from 'src/theme';
import ListItemCard from './ListItemCard';
import ListItemMobileCard from './ListItemMobileCard';

interface ReadingListProps {
  className?: string;
  profile: User;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  date: {
    marginLeft: 6
  },
  media: {
    height: 500,
    backgroundPosition: 'top'
  },
  title: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    }
  }
}));

const cardContentStyle = {
  paddingTop: 0,
  paddingBottom: 0
};

const ReadingList: FC<ReadingListProps> = ({ className, profile, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [page, setPage] = useState<number>(1);

  const getPosts = useCallback(async () => {
    try {
      const params = { page };
      const response = await axios.get<{ bookmarks: Bookmark[]; page: number }>(
        '/bookmarks/all',
        {
          params
        }
      );
      if (isMountedRef.current) {
        console.log(response.data.bookmarks)
        setBookmarks(response.data.bookmarks);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardContent style={cardContentStyle}>
              <List>
                {bookmarks.map((bookmark: BookmarkWithPost) => (
                  <React.Fragment key={bookmark._id}>
                    <Hidden smDown>
                      <ListItemCard post={bookmark.post} />
                    </Hidden>
                    <Hidden mdUp>
                      <ListItemMobileCard post={bookmark.post} />
                    </Hidden>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

ReadingList.propTypes = {
  className: PropTypes.string
};

export default ReadingList;
