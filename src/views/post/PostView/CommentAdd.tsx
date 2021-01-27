import React, { useRef, useState, FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import {
  Avatar,
  Divider,
  IconButton,
  Input,
  Paper,
  Tooltip,
  useTheme,
  useMediaQuery,
  makeStyles
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import AddPhotoIcon from '@material-ui/icons/AddPhotoAlternate';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import axios from 'src/utils/axios';
import useAuth from 'src/hooks/useAuth';
import { Theme } from 'src/theme';
import { Comments } from 'src/types/comment';
import { Post } from 'src/types/post';

interface Status {
  depth: number;
  parent: string | null;
}

interface CommentAddProps {
  className?: string;
  post?: Post;
  status: Status;
  onFetch?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap'
    }
  },
  inputContainer: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  divider: {
    height: 24,
    width: 1
  },
  fileInput: {
    display: 'none'
  }
}));

const CommentAdd: FC<CommentAddProps> = ({
  className,
  post,
  status,
  onFetch,
  ...rest
}) => {
  const classes = useStyles();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const match = useMediaQuery(theme.breakpoints.down('sm'));
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setValue(event.target.value);
  };
  
  const handleClick = async () => {
    try {
      const params = {
        parent: status.parent,
        post: post._id,
        depth: status.depth,
        comment: value
      };
      await axios.post<{ comment: Comments }>('/comments/create', params);
      setValue('');
    } catch (err) {
      err.message &&
        enqueueSnackbar(err.message, {
          variant: 'error'
        });
    }
    onFetch();
  };

  const handleAttach = (): void => {
    fileInputRef.current.click();
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      {!match && <Avatar alt="Person" src={user ? user.avatar : ''} />}
      <Paper className={classes.inputContainer} variant="outlined">
        <Input
          value={value}
          disableUnderline
          fullWidth
          multiline
          rows={3}
          onChange={handleChange}
        />
      </Paper>
      <Tooltip title="Send">
        <span>
          <IconButton
            color={value.length > 0 ? 'primary' : 'default'}
            onClick={handleClick}
            disabled={value === ''}
          >
            <SendIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Divider className={classes.divider} />
      <Tooltip title="Attach image">
        <IconButton edge="end" onClick={handleAttach}>
          <AddPhotoIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Attach file">
        <IconButton edge="end" onClick={handleAttach}>
          <AttachFileIcon />
        </IconButton>
      </Tooltip>
      <input className={classes.fileInput} ref={fileInputRef} type="file" />
    </div>
  );
};

CommentAdd.propTypes = {
  className: PropTypes.string
};

export default CommentAdd;
