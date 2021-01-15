import React, { useState, FC } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  Typography,
  colors,
  makeStyles,
  withStyles
} from '@material-ui/core';
import {
  Star as StarIcon,
  Briefcase as BriefcaseIcon,
  File as FileIcon
} from 'react-feather';
import GavelIcon from '@material-ui/icons/Gavel';
import RateReviewIcon from '@material-ui/icons/RateReview';
import { Theme } from 'src/theme';
import { Post } from 'src/types/post';
import Page from 'src/components/Page';
import ProjectDetails from './PostDetails';
import ProjectContent from './PostContent';
import PostDisclosure from './PostDisclosure';
import PostReview from './PostReview';

interface CustomStepIconProps {
  active?: boolean;
  completed?: boolean;
  icon: number;
}

const steps = [
  {
    label: 'Details',
    icon: BriefcaseIcon
  },
  {
    label: 'Content',
    icon: FileIcon
  },
  {
    label: 'Disclosure',
    icon: GavelIcon
  },
  {
    label: 'Review',
    icon: RateReviewIcon
  }
];

const CustomStepConnector = withStyles((theme: Theme) => ({
  vertical: {
    marginLeft: 19,
    padding: 0
  },
  line: {
    borderColor: theme.palette.divider
  }
}))(StepConnector);

const useCustomStepIconStyles = makeStyles((theme: Theme) => ({
  root: {},
  active: {
    backgroundColor: theme.palette.secondary.main,
    boxShadow: theme.shadows[10],
    color: theme.palette.secondary.contrastText
  },
  completed: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText
  }
}));

const CustomStepIcon: FC<CustomStepIconProps> = ({
  active,
  completed,
  icon
}) => {
  const classes = useCustomStepIconStyles();

  const Icon = steps[icon - 1].icon;

  return (
    <Avatar
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed
      })}
    >
      <Icon size="20" />
    </Avatar>
  );
};

CustomStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  icon: PropTypes.number.isRequired
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  avatar: {
    backgroundColor: colors.red[600]
  },
  stepper: {
    backgroundColor: 'transparent'
  }
}));

const PostCreateView: FC = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [post, setPost] = useState<Post>();

  const handleNext = (): void => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = (): void => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleComplete = (): void => {
    setCompleted(true);
  };

  const handlePost = (values): void => {
    setPost(prevState => ({ ...prevState, ...values }));
  };

  console.log(post)

  return (
    <Page className={classes.root} title="Project Create">
      <Container maxWidth="lg">
        <Box mb={3}>
          <Typography variant="h3" color="textPrimary">
            Post New Article
          </Typography>
        </Box>
        {!completed ? (
          <Paper>
            <Grid container>
              <Grid item xs={12} md={3}>
                <Stepper
                  activeStep={activeStep}
                  className={classes.stepper}
                  connector={<CustomStepConnector />}
                  orientation="vertical"
                >
                  {steps.map(step => (
                    <Step key={step.label}>
                      <StepLabel StepIconComponent={CustomStepIcon}>
                        {step.label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Grid>
              <Grid item xs={12} md={9}>
                <Box p={3}>
                  {activeStep === 0 && (
                    <ProjectDetails
                      post={post}
                      onPost={handlePost}
                      onNext={handleNext}
                    />
                  )}
                  {activeStep === 1 && (
                    <ProjectContent onBack={handleBack} onNext={handleNext} />
                  )}
                  {activeStep === 2 && (
                    <PostDisclosure onBack={handleBack} onNext={handleNext} />
                  )}
                  {activeStep === 3 && (
                    <PostReview
                      onBack={handleBack}
                      onComplete={handleComplete}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Card>
            <CardContent>
              <Box maxWidth={450} mx="auto">
                <Box display="flex" justifyContent="center">
                  <Avatar className={classes.avatar}>
                    <StarIcon />
                  </Avatar>
                </Box>
                <Box mt={2}>
                  <Typography variant="h3" color="textPrimary" align="center">
                    You are all done!
                  </Typography>
                </Box>
                <Box mt={2}>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    align="center"
                  >
                    Thank you for submitting your contribution to us. Your
                    article is now in review and we will come back to you with
                    our final decision.
                  </Typography>
                </Box>
                <Box mt={2} display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    color="secondary"
                    component={RouterLink}
                    to="/account/profile"
                  >
                    Back to Profile
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </Page>
  );
};

export default PostCreateView;
