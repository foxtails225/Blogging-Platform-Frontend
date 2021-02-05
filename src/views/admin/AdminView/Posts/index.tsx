import React, { FC, ChangeEvent, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import numeral from 'numeral';
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
import { Theme } from 'src/theme';
import axios from 'src/utils/axios';
import GenericMoreButton from 'src/components/GenericMoreButton';
import { PostWithAuthor, PostStatus } from 'src/types/post';
import StatusModal from './StatusModal';

interface PostsProps {
  className?: string;
}

type OrderByStatus = 'desc' | 'asc';

interface Status {
  page: number;
  limit: number;
  count: number;
  order: string;
  orderBy: OrderByStatus;
}

interface Modal {
  _id: string;
  status: PostStatus;
  reason: string;
}

const labelColors: Record<PostStatus, 'success' | 'warning' | 'error'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'error'
};

const columns = [
  { name: 'title', value: 'Title' },
  { name: 'author', value: 'Author' },
  { name: 'total', value: 'Total' },
  { name: 'status', value: 'Status' },
  { name: 'createdAt', value: 'Date' }
];

const initialStatus: Status = {
  page: 0,
  limit: 5,
  count: 0,
  order: 'createdAt',
  orderBy: 'desc'
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {}
}));

const Posts: FC<PostsProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [modal, setModal] = useState<Modal>();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);

  const getPosts = async () => {
    try {
      const sortBy = { [status.order]: status.orderBy === 'desc' ? -1 : 1 };
      const params = { page: status.page, sortBy, limit: status.limit };
      const response = await axios.post<{
        posts: PostWithAuthor[];
        count: number;
      }>('/admin/posts/all/', params);

      setPosts(response.data.posts);
      setStatus(prevState => ({ ...prevState, count: response.data.count }));
    } catch (err) {
      setStatus(initialStatus);
      setPosts([]);
    }
  };

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.page, status.limit, status.order, status.orderBy]);

  const createSortHandler = (event): void => {
    const order = event.currentTarget.id;
    const orderBy = status.orderBy !== 'desc' ? 'desc' : 'asc';
    setStatus(prevState => ({ ...prevState, order, orderBy }));
  };

  const handleChangePage = (event: unknown, page: number) => {
    setStatus(prevState => ({ ...prevState, page }));
  };

  const handleSortDirection = (name: string): OrderByStatus => {
    const direction =
      status.order === name && status.orderBy ? status.orderBy : 'desc';
    return direction;
  };

  const handleChangeLimit = (event: ChangeEvent<HTMLInputElement>): void => {
    const limit = parseInt(event.target.value, 10);
    setStatus(prevState => ({ ...prevState, limit, page: 0 }));
  };

  const handleStatus = (data: PostWithAuthor) => {
    setModal({ _id: data._id, status: data.status, reason: data.reason });
    setOpen(!open);
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader action={<GenericMoreButton />} title="Posts" />
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
                      active={status.order === column.name}
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
              {posts.map(post => (
                <TableRow hover key={post._id}>
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
                  <TableCell>
                    {/** TODO: remove in next dev cycle */}
                    {/* <Box display="flex" alignItems="center"> */}
                      {/* <Avatar
                        alt="Author"
                        src={post.author.avatar}
                        component={RouterLink}
                        to={'/users/' + post.author.name}
                      >
                        {getInitials(post.author.name)}
                      </Avatar> */}
                      {/* <Box ml={1}> */}
                        <Link
                          color="textPrimary"
                          component={RouterLink}
                          to={'/users/' + post.author.name}
                          variant="body2"
                        >
                          {post.author.name}
                        </Link>
                      {/* </Box> */}
                    {/* </Box> */}
                  </TableCell>
                  <TableCell align="center">
                    {numeral(0).format(`$0,0.00`)}
                  </TableCell>
                  <TableCell align="center" onClick={() => handleStatus(post)}>
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
            count={status.count}
            rowsPerPage={status.limit}
            page={status.page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeLimit}
          />
        </Box>
      </PerfectScrollbar>
      <Box p={2} display="flex" justifyContent="flex-end" />
      {open && (
        <StatusModal
          open={open}
          data={modal}
          onOpen={handleOpen}
          onFetch={getPosts}
        />
      )}
    </Card>
  );
};

Posts.propTypes = {
  className: PropTypes.string
};

export default Posts;
