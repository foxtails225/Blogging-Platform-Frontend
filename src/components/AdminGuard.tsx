import React, { FC, ReactNode } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

interface AdminGuardProps {
  children?: ReactNode;
}

const AdminGuard: FC<AdminGuardProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
};

AdminGuard.propTypes = {
  children: PropTypes.node
};

export default AdminGuard;
