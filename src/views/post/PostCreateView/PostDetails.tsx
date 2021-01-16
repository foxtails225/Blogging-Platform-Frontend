import React, { useState, FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Chip,
  FormHelperText,
  IconButton,
  SvgIcon,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import { Plus as PlusIcon } from 'react-feather';
import { Theme } from 'src/theme';
import { Post, Tag } from 'src/types/post';

interface PostDetailsProps {
  className?: string;
  post?: Post;
  onPost?: (param: any) => void;
  onNext?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  addTab: {
    marginLeft: theme.spacing(2)
  },
  tag: {
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  },
  datePicker: {
    '& + &': {
      marginLeft: theme.spacing(2)
    }
  }
}));

const initialTag: Tag = {
  symbol: '',
  name: ''
};

const PostDetails: FC<PostDetailsProps> = ({
  className,
  post,
  onPost,
  onNext,
  ...rest
}) => {
  const classes = useStyles();
  const [tag, setTag] = useState<Tag>(initialTag);

  const handleChangeTag = event => {
    const { value } = event.target;
    setTag({ symbol: value, name: value });
  };

  return (
    <Formik
      initialValues={{
        title: post.title || '',
        tags: post.tags || [],
        submit: null
      }}
      validationSchema={Yup.object().shape({
        title: Yup.string()
          .min(3, 'Must be at least 3 characters')
          .max(255)
          .required('Required'),
        tags: Yup.array().required()
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          onPost({ title: values.title.trim(), tags: values.tags });
          setStatus({ success: true });
          setSubmitting(false);

          if (onNext) {
            onNext();
          }
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values
      }) => (
        <form
          onSubmit={handleSubmit}
          className={clsx(classes.root, className)}
          {...rest}
        >
          <Typography variant="h3" color="textPrimary">
            Details
          </Typography>
          <Box mt={2}>
            <Typography variant="subtitle1" color="textSecondary">
              Do not spam tags. <br />
              Title should not be spammy. <br />
              Title and article contents may be subject to grammatical and
              punctual editing to ensure quality.
            </Typography>
          </Box>
          <Box mt={2}>
            <TextField
              error={Boolean(touched.title && errors.title)}
              fullWidth
              helperText={touched.title && errors.title}
              label="Article Title"
              name="title"
              placeholder="Please type article title."
              value={values.title}
              onBlur={handleBlur}
              onChange={handleChange}
              variant="outlined"
            />
            <Box mt={3} display="flex" alignItems="center">
              <TextField
                fullWidth
                label="Article Tags"
                name="tags"
                value={tag.symbol}
                placeholder="Please choose at least one tag."
                onChange={handleChangeTag}
                variant="outlined"
              />
              <IconButton
                className={classes.addTab}
                onClick={() => {
                  if (tag.symbol === '' || tag.name === '') {
                    return;
                  }
                  setFieldValue('tags', [...values.tags, tag]);
                  setTag(initialTag);
                }}
              >
                <SvgIcon>
                  <PlusIcon />
                </SvgIcon>
              </IconButton>
            </Box>
            <Box mt={2}>
              {values.tags.map((tag, i) => (
                <Chip
                  variant="outlined"
                  key={i}
                  label={tag.symbol}
                  className={classes.tag}
                  onDelete={() => {
                    const newTags = values.tags.filter(
                      t => t.symbol !== tag.symbol && t.name !== tag.name
                    );

                    setFieldValue('tags', newTags);
                  }}
                />
              ))}
            </Box>
            {Boolean(touched.tags && errors.tags) && (
              <Box mt={2}>
                <FormHelperText error>{errors.tags}</FormHelperText>
              </Box>
            )}
          </Box>
          <Box mt={6} display="flex">
            <Box flexGrow={1} />
            <Button
              color="secondary"
              disabled={isSubmitting}
              type="submit"
              variant="contained"
              size="large"
            >
              Next
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

PostDetails.propTypes = {
  className: PropTypes.string,
  onPost: PropTypes.func,
  onNext: PropTypes.func
};

PostDetails.defaultProps = {
  onPost: () => {},
  onNext: () => {}
};

export default PostDetails;
