import React, { useState, useEffect, FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'src/utils/axios';
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
import Autocomplete from '@material-ui/lab/Autocomplete';
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
  securityName: ''
};

const PostDetails: FC<PostDetailsProps> = ({
  className,
  post,
  onPost,
  onNext,
  ...rest
}) => {
  const classes = useStyles();
  const [options, setOptions] = useState<Tag[]>([]);
  const [search, setSearch] = useState<string>('');
  const [tag, setTag] = useState<Tag>(initialTag);

  useEffect(() => {
    const fecthData = async () => {
      const response = await axios.get<Tag[]>(`/stock/search/${search}`);

      if (response.data && response.data.length > 0) {
        let data = response.data.map(item => {
          return { symbol: item.symbol, securityName: item.securityName };
        });
        setOptions(data);
      }
    };
    search !== '' ? fecthData() : setOptions([]);
  }, [search]);

  const handleChangeTag = (event, value) => {
    const val = value.split(': ');
    setTag({ symbol: val[0], securityName: val[1] });
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
          console.log(values.tags);
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
          onKeyPress={e => {
            e.key === 'Enter' && e.preventDefault();
          }}
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
              <Autocomplete
                freeSolo
                disableClearable
                options={options.map(
                  option => option.symbol + ': ' + option.securityName
                )}
                onChange={handleChangeTag}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    if (tag.symbol === '' || tag.securityName === '') {
                      return;
                    }
                    setFieldValue('tags', [...values.tags, tag]);
                    setTag(initialTag);
                    setSearch('');
                  }
                }}
                value={search}
                renderInput={params => (
                  <TextField
                    {...params}
                    fullWidth
                    name="tags"
                    label="Article Tags"
                    placeholder="Please choose at least one tag."
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps
                    }}
                    style={{ width: '52vw' }}
                    onChange={event => setSearch(event.target.value)}
                  />
                )}
              />
              <IconButton
                className={classes.addTab}
                onClick={() => {
                  if (tag.symbol === '' || tag.securityName === '') {
                    return;
                  }
                  setFieldValue('tags', [...values.tags, tag]);
                  setTag(initialTag);
                  setSearch('');
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
                      t =>
                        t.symbol !== tag.symbol &&
                        t.securityName !== tag.securityName
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
