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
import {
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete
} from '@material-ui/lab';
import { Plus as PlusIcon } from 'react-feather';
import { Theme } from 'src/theme';
import { Picker, Post, Tag } from 'src/types/post';

interface PostDetailsProps {
  className?: string;
  post?: Post;
  onPost?: (param: any) => void;
  onNext?: () => void;
}

interface Status {
  name: Picker;
  text: string;
}

const buttons: Status[] = [
  { name: 'bullish', text: 'Bullish' },
  { name: 'bearish', text: 'Bearish' },
  { name: 'neutral', text: 'Neutral' },
  { name: 'no_opinion', text: 'No Opinion' }
];

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
  },
  toggleBtn: {
    marginTop: theme.spacing(3),
    '&.MuiToggleButton-root': {
      color: theme.palette.text.primary
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white
    }
  }
}));

const initialTag: Tag = {
  symbol: '',
  securityName: '',
  main: false
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
          return {
            symbol: item.symbol,
            securityName: item.securityName,
            main: false
          };
        });
        setOptions(data);
      }
    };
    search !== '' ? fecthData() : setOptions([]);
  }, [search]);

  const handleChangeTag = (event, value) => {
    const val = value.split(': ');
    setTag({ symbol: val[0], securityName: val[1], main: false });
  };
  
  return (
    <Formik
      enableReinitialize
      initialValues={{
        title: post.title || '',
        tags: post.tags || [],
        picker: post.picker || buttons[0].name,
        submit: null
      }}
      validationSchema={Yup.object().shape({
        title: Yup.string()
          .min(3, 'Must be at least 3 characters')
          .max(255)
          .required('Required'),
        picker: Yup.string().required('Required'),
        tags: Yup.array().required()
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          onPost({
            title: values.title.trim(),
            tags: values.tags,
            picker: values.picker
          });
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
            <ToggleButtonGroup
              value={values.picker}
              exclusive
              size="small"
              onChange={(
                event: React.MouseEvent<HTMLElement>,
                newAlignment: string | null
              ) => {
                setFieldValue('picker', newAlignment);
              }}
              aria-label="text alignment"
            >
              {buttons.map((item: Status, idx: number) => (
                <ToggleButton
                  key={item.name + idx}
                  value={item.name}
                  className={classes.toggleBtn}
                >
                  {item.text}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
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
                    let tagValue: Tag = tag;
                    if (tag.symbol === '' || tag.securityName === '') {
                      return;
                    }

                    if (values.tags.length === 0) tagValue.main = true;
                    setFieldValue('tags', [...values.tags, tagValue]);
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
                    label="Ticker"
                    placeholder="Please choose at least one tag."
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps
                    }}
                    style={{ width: '47vw' }}
                    onChange={event => setSearch(event.target.value)}
                  />
                )}
              />
              <IconButton
                className={classes.addTab}
                onClick={() => {
                  let tagValue: Tag = tag;
                  if (tag.symbol === '' || tag.securityName === '') {
                    return;
                  }

                  if (values.tags.length === 0) tagValue.main = true;
                  setFieldValue('tags', [...values.tags, tagValue]);
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
                  variant={tag.main ? 'default' : 'outlined'}
                  key={i}
                  label={tag.symbol}
                  className={classes.tag}
                  onDelete={() => {
                    if (values.tags.length > 1 && tag.main)
                      values.tags[1].main = true;

                    const newTags = values.tags.filter(
                      t =>
                        t.symbol !== tag.symbol &&
                        t.securityName !== tag.securityName
                    );
                    setFieldValue('tags', newTags);
                  }}
                  color={tag.main ? 'secondary' : 'default'}
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
