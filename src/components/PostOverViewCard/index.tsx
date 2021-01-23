import React, { useState, FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
// @ts-ignore
import { Lightbox } from 'react-modal-image';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Link,
  Typography,
  makeStyles
} from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { Post } from 'src/types/post';
import Reactions from './Reactions';
import { Theme } from 'src/theme';

interface PostOverViewCardProps {
  className?: string;
  author: boolean;
  post: Post;
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

const PostOverViewCard: FC<PostOverViewCardProps> = ({
  className,
  author,
  post,
  ...rest
}) => {
  const classes = useStyles();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <Card className={clsx(classes.root, className)} {...rest}>
        <CardHeader
          avatar={
            <Avatar
              alt="Person"
              component={RouterLink}
              src={typeof post.author !== 'string' && post.author.avatar}
              to="#"
            />
          }
          disableTypography
          subheader={
            <Box display="flex" alignItems="center">
              <AccessTimeIcon fontSize="small" />
              <Typography
                variant="caption"
                color="textSecondary"
                className={classes.date}
              >
                {moment(post.createdAt).fromNow()}
              </Typography>
            </Box>
          }
          title={
            <Link
              color="textPrimary"
              component={RouterLink}
              to="#"
              variant="h6"
            >
              {typeof post.author !== 'string' && post.author.name}
            </Link>
          }
        />
        <Box px={3} pb={1} className={classes.title}>
          <Link color="textPrimary" component={RouterLink} to="#" variant="h3">
            {post.title}
          </Link>
        </Box>
        <Box mt={2} pb={2} px={3}>
          <Reactions post={post} author={author} />
        </Box>
      </Card>
      {selectedImage && (
        <Lightbox
          large={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
};

PostOverViewCard.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  post: PropTypes.object.isRequired,
  author: PropTypes.bool
};

export default PostOverViewCard;
