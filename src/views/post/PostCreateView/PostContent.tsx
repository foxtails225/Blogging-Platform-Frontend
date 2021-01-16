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
import { Post } from 'src/types/post';

interface PostContentProps {
  className?: string;
  post: Post;
  onNext?: () => void;
  onBack?: () => void;
  onPost: (param: any) => void;
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

const PostContent: FC<PostContentProps> = ({
  className,
  post,
  onPost,
  onBack,
  onNext,
  ...rest
}) => {
  const classes = useStyles();
  const [content, setContent] = useState<string>(post.content || '');
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
      onPost({ content: content.trim() });

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
        Content
      </Typography>
      <Box mt={2}>
        <Typography variant="subtitle1" color="textSecondary">
          Do not advise people to make any financial decisions. <br />
          Plagiarism is not tolerated.
        </Typography>
      </Box>
      <Paper className={classes.editorContainer} variant="outlined">
        <QuillEditor
          onChange={handleChange}
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

PostContent.propTypes = {
  className: PropTypes.string,
  onPost: PropTypes.func,
  onNext: PropTypes.func,
  onBack: PropTypes.func
};

PostContent.defaultProps = {
  onPost: () => {},
  onNext: () => {},
  onBack: () => {}
};

export default PostContent;
