import React, { useState, FC, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
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
import axios from 'src/utils/axios';
import useAuth from 'src/hooks/useAuth';
import { Theme } from 'src/theme';
import { Post, PostWithAuthor } from 'src/types/post';
import Page from 'src/components/Page';
import PostDetails from './PostDetails';
import PostContent from './PostContent';
import PostDisclosure from './PostDisclosure';
import PostReview from './PostReview';
import LoadingScreen from 'src/components/LoadingScreen';

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

const initialPost = {
  slug: '',
  title: '',
  content: '',
  disclosure: '',
  tags: []
};

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
  const { user } = useAuth();
  const location = useLocation();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [post, setPost] = useState<Post>(initialPost);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post<{ data: string }>('/stripe/create', {
        returnUrl: '/posts/new'
      });
      window.location.replace(response.data.data);
    };
    !user.stripeId && fetchData();
  }, [user]);

  useEffect(() => {
    const paths = location.pathname.split('/');
    const fetchPost = async () => {
      const response = await axios.get<{ post: PostWithAuthor }>(
        `/posts/get/${paths[3]}`,
        {
          params: { user: user._id }
        }
      );

      response.data && setPost(response.data.post);
    };
    if (paths[2] === 'edit') {
      fetchPost();
      setIsEdit(true);
    }
  }, [location.pathname, user._id]);

  const handleNext = (): void => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = (): void => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleComplete = async (): Promise<void> => {
    const specialReg = /[^\w\s]/gi;
    const slug = post.title
      .replace(specialReg, '')
      .replace('/', '-')
      .split(' ')
      .join('-')
      .trim()
      .toLowerCase();

    isEdit
      ? await axios.put<{ post: Post }>('/posts/update', { ...post, slug })
      : await axios.post<{ post: Post }>('/posts/new', { ...post, slug });
    setCompleted(true);
  };

  const handlePost = (values): void => {
    setPost(prevState => ({ ...prevState, ...values }));
  };

  return (
    <>
      {!user.stripeId ? (
        <LoadingScreen />
      ) : (
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
                        <PostDetails
                          post={post}
                          onPost={handlePost}
                          onNext={handleNext}
                        />
                      )}
                      {activeStep === 1 && (
                        <PostContent
                          post={post}
                          onPost={handlePost}
                          onBack={handleBack}
                          onNext={handleNext}
                        />
                      )}
                      {activeStep === 2 && (
                        <PostDisclosure
                          post={post}
                          onPost={handlePost}
                          onBack={handleBack}
                          onNext={handleNext}
                        />
                      )}
                      {activeStep === 3 && (
                        <PostReview
                          post={post}
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
                      <Typography
                        variant="h3"
                        color="textPrimary"
                        align="center"
                      >
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
                        article is now in review and we will come back to you
                        with our final decision.
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
      )}
    </>
  );
};

export default PostCreateView;
