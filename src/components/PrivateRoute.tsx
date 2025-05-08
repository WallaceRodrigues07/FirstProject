import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthenticationStatus } from '@nhost/react';

interface Props {
  //children: JSX.Element;
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  console.log('isLoading:', isLoading);
  console.log('isAuthenticated:', isAuthenticated);

  if (isLoading) return <div>Carregando...</div>;

   return isAuthenticated ? <>{children}</> : <Navigate to="/" />;

};

export default PrivateRoute;






