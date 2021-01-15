import React, { useState, FC, FormEvent } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  FormHelperText,
  Paper,
  Typography,
  makeStyles
} from '@material-ui/core';
import QuillEditor from 'src/components/QuillEditor';
import { Theme } from 'src/theme';

interface PostDisclosureProps {
  className?: string;
  onNext?: () => void;
  onBack?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  editorContainer: {
    marginTop: theme.spacing(3)
  },
  editor: {
    '& .ql-editor': {
      height: 400
    }
  }
}));

const PostDisclosure: FC<PostDisclosureProps> = ({
  className,
  onBack,
  onNext,
  ...rest
}) => {
  const classes = useStyles();
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (value: string): void => {
    setContent(value);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      setSubmitting(true);

      // NOTE: Make API request

      if (onNext) {
        onNext();
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
        Disclosure
      </Typography>
      <Box mt={2}>
        <Typography variant="subtitle1" color="textSecondary">
          Let the readers know if you hold or do not hold any position in the
          companies you are talking about. Make sure to also let readers know if
          you are receiving compensation for the article. You may receive one
          from us if your article is approved and you may receive tips from
          readers.
        </Typography>
      </Box>
      <Paper className={classes.editorContainer} variant="outlined">
        <QuillEditor
          handleChange={handleChange}
          value={content}
          className={classes.editor}
        />
      </Paper>
      {error && (
        <Box mt={2}>
          <FormHelperText error>{FormHelperText}</FormHelperText>
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
          Next
        </Button>
      </Box>
    </form>
  );
};

PostDisclosure.propTypes = {
  className: PropTypes.string,
  onNext: PropTypes.func,
  onBack: PropTypes.func
};

PostDisclosure.defaultProps = {
  onNext: () => {},
  onBack: () => {}
};

export default PostDisclosure;
