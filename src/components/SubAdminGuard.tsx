import React, { FC, ReactNode } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

interface SubAdminGuardProps {
  children?: ReactNode;
}

const SubAdminGuard: FC<SubAdminGuardProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || (user && user.role !== 'sub-admin')) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
};

SubAdminGuard.propTypes = {
  children: PropTypes.node
};

export default SubAdminGuard;
