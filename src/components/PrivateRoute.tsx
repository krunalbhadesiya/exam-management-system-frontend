import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
  children: JSX.Element;
  adminRoute?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, adminRoute }) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  if (adminRoute) {
    if (!isAuthenticated || userRole !== 'admin') {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
  } else {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
  }

  return children;
};

export default PrivateRoute;
