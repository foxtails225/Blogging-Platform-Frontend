import React, { useState, FC, FormEvent } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Paper,
  FormHelperText,
  Typography,
  Radio,
  Button,
  makeStyles
} from '@material-ui/core';
import { Theme } from 'src/theme';

interface PostReviewProps {
  className?: string;
  onComplete?: () => void;
  onBack?: () => void;
}

const typeOptions = [
  {
    value: 'freelancer',
    title: "I'm a freelancer",
    description: "I'm looking for teamates to join in a personal project"
  },
  {
    value: 'projectOwner',
    title: 'I’m a project owner',
    description:
      "I'm looking for freelancer or contractors to take care of my project"
  },
  {
    value: 'affiliate',
    title: 'I want to join affiliate',
    description:
      "I'm looking for freelancer or contractors to take care of my project"
  }
];

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
  }
}));

const PostReview: FC<PostReviewProps> = ({
  className,
  onBack,
  onComplete,
  ...rest
}) => {
  const classes = useStyles();
  const [type, setType] = useState<string>(typeOptions[1].value);
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (newType: string): void => {
    setType(newType);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      setSubmitting(true);

      // NOTE: Make API request

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
      <Box mt={2}>
        {typeOptions.map(typeOption => (
          <Paper
            className={classes.typeOption}
            elevation={type === typeOption.value ? 10 : 1}
            key={typeOption.value}
          >
            <Radio
              checked={type === typeOption.value}
              onClick={() => handleChange(typeOption.value)}
            />
            <Box ml={2}>
              <Typography gutterBottom variant="h5" color="textPrimary">
                {typeOption.title}
              </Typography>
              <Typography variant="body1" color="textPrimary">
                {typeOption.description}
              </Typography>
            </Box>
          </Paper>
        ))}
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