import React, { FC, useEffect, useState, ChangeEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  makeStyles
} from '@material-ui/core';
import Label from 'src/components/Label';
import GenericMoreButton from 'src/components/GenericMoreButton';
import axios from 'src/utils/axios';
import { Post, PostStatus } from 'src/types/post';
import { User } from 'src/types/user';

interface PostsProps {
  className?: string;
  profile: User;
}

type OrderByStatus = 'desc' | 'asc';

const labelColors: Record<PostStatus, 'success' | 'warning' | 'error'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'error'
};

const columns = [
  { name: 'no', value: 'No' },
  { name: 'title', value: 'Title' },
  { name: 'tags', value: 'Tags' },
  { name: 'total', value: 'Total' },
  { name: 'status', value: 'Status' },
  { name: 'createdAt', value: 'Date' }
];

const useStyles = makeStyles(() => ({
  root: {}
}));

const Posts: FC<PostsProps> = ({ className, profile, ...rest }) => {
  const classes = useStyles();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [count, setCount] = useState<number>(0);
  const [order, setOrder] = useState<string>('createdAt');
  const [orderBy, setOrderBy] = useState<OrderByStatus>('desc');
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const sortBy = { [order]: orderBy === 'desc' ? -1 : 1 };
        const params = { email: profile.email, page, sortBy, limit };
        const response = await axios.post<{
          posts: Post[];
          count: number;
          isAuthor: boolean;
        }>('/posts/all/', params);

        setPosts(response.data.posts);
        setCount(response.data.count);
      } catch (err) {
        console.error(err);
      }
    };
    getPosts();
  }, [page, profile.email, order, orderBy, limit]);

  const createSortHandler = (event): void => {
    const value = orderBy !== 'desc' ? 'desc' : 'asc';
    setOrder(event.currentTarget.id);
    setOrderBy(value);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSortDirection = (name: string): OrderByStatus => {
    const direction = order === name && orderBy ? orderBy : 'desc';
    return direction;
  };

  const handleChangeLimit = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader action={<GenericMoreButton />} title="Latest Posts" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell key={column.name} align="center">
                    <TableSortLabel
                      id={column.name}
                      active={order === column.name}
                      onClick={createSortHandler}
                      direction={handleSortDirection(column.name)}
                      disabled={column.name === 'no'}
                    >
                      {column.value}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post: Post, idx: number) => (
                <TableRow hover key={post._id}>
                  <TableCell align="center">{idx + 1}</TableCell>
                  <TableCell align="center">
                    <Link
                      color="textPrimary"
                      component={RouterLink}
                      to={'/posts/public/' + post.slug}
                      variant="body2"
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell align="center">{post.tags.length}</TableCell>
                  <TableCell align="center">$0</TableCell>
                  <TableCell align="center">
                    <Label color={labelColors[post.status]}>
                      {post.status}
                    </Label>
                  </TableCell>
                  <TableCell align="center">
                    {moment(post.createdAt).format('DD MMM, YYYY hh:mm:ss')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={count}
            rowsPerPage={limit}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeLimit}
          />
        </Box>
      </PerfectScrollbar>
      <Box p={2} display="flex" justifyContent="flex-end" />
    </Card>
  );
};

Posts.propTypes = {
  className: PropTypes.string,
  //@ts-ignore
  profile: PropTypes.object
};

export default Posts;
