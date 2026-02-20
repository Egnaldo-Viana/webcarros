import React from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router';

interface PrivateProps {
  children: React.ReactNode;
}

export function Private({ children }: PrivateProps): any {
  const { signed, loadingAuth } = React.useContext(AuthContext);

  if (loadingAuth) {
    return <div></div>;
  }

  if (!signed) {
    return <Navigate to="/login" />;
  }

  return children;
}
