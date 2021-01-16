import React, { useState, FC, FormEvent } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import parse from 'html-react-parser';
import {
  Box,
  FormHelperText,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  colors,
  makeStyles
} from '@material-ui/core';
import { Theme } from 'src/theme';
import { Post, Tag } from 'src/types/post';

interface PostReviewProps {
  className?: string;
  post?: Post;
  onBack?: () => void;
  onComplete?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  typeOption: {
    alignItems: 'flex-start',
    display: 'flex',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2)
  },
  stepButton: {
    '& + &': {
      marginLeft: theme.spacing(2)
    }
  },
  chip: {
    marginLeft: theme.spacing(1)
  },
  box: {
    padding: theme.spacing(7),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3)
    }
  },
  content: {
    fontFamily: theme.typography.fontFamily,
    marginBottom: theme.spacing(2)
  },
  disclosure: {
    fontFamily: theme.typography.fontFamily,
    '& p': {
      color: colors.grey[500],
      fontSize: '0.9rem'
    }
  }
}));

const PostReview: FC<PostReviewProps> = ({
  className,
  post,
  onBack,
  onComplete,
  ...rest
}) => {
  const classes = useStyles();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      setSubmitting(true);

      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Typography variant="h3" color="textPrimary">
        Review
      </Typography>
      <Box mt={2}>
        <Typography variant="subtitle1" color="textSecondary">
          Make sure everything looks good.
        </Typography>
      </Box>
      <Box mt={3} border={1} className={classes.box}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" color="textPrimary">
              {post.title}
            </Typography>
            <Box mt={3}>
              <Box mt={1}>
                {post.tags.map((tag: Tag) => (
                  <Chip
                    key={tag.symbol}
                    variant="outlined"
                    label={tag.symbol}
                    className={classes.chip}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box mt={3} className={classes.content}>
          {parse(post.content)}
        </Box>
        <Divider />
        <Box mt={3} className={classes.disclosure}>
          {parse(post.disclosure)}
        </Box>
      </Box>
      {error && (
        <Box mt={2}>
          <FormHelperText error>{error}</FormHelperText>
        </Box>
      )}
      <Box mt={6} display="flex">
        {onBack && (
          <Button onClick={onBack} size="large">
            Previous
          </Button>
        )}
        <Box flexGrow={1} />
        <Button
          color="secondary"
          disabled={isSubmitting}
          type="submit"
          variant="contained"
          size="large"
        >
          Complete
        </Button>
      </Box>
    </form>
  );
};

PostReview.propTypes = {
  className: PropTypes.string,
  onComplete: PropTypes.func,
  onBack: PropTypes.func
};

PostReview.defaultProps = {
  onComplete: () => {},
  onBack: () => {}
};

export default PostReview;
