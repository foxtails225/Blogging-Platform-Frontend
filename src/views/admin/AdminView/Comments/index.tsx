import React, { FC, useCallback, useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  List,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import GenericMoreButton from 'src/components/GenericMoreButton';
import { FlagWithUser } from 'src/types/flag';
import FlagItem from './FlagItem';
import { socket } from 'src/constants';

interface TeamTasksProps {
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {}
}));

const TeamTasks: FC<TeamTasksProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [flags, setFlags] = useState<FlagWithUser[]>([]);

  const getFlags = useCallback(async () => {
    try {
      const response = await axios.get<{ flags: FlagWithUser[] }>(
        '/comments/flagsAll'
      );

      if (isMountedRef.current) {
        setFlags(response.data.flags);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getFlags();
    socket.on('adminComment', data => {
      getFlags();
    });
  }, [getFlags]);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader action={<GenericMoreButton />} title="Reports" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={400}>
          <List>
            {flags.map((flag, i) => (
              <FlagItem
                divider={i < flags.length - 1}
                key={flag._id}
                flag={flag}
              />
            ))}
          </List>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

TeamTasks.propTypes = {
  className: PropTypes.string
};

export default TeamTasks;
