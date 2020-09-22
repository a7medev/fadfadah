import * as React from 'react';
import { useContext } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext';

export interface ProtectedRouteProps extends RouteProps {
  auth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  auth,
  component: Component,
  ...rest
}) => {
  const authContext = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props => {
        // Route requires Auth
        if (auth) {
          return authContext?.user ? (
            // @ts-ignore
            <Component {...rest} {...props} />
          ) : (
            <Redirect to="/login" />
          );
        } else {
          // Route doesn't require Auth
          return !authContext?.user ? (
            // @ts-ignore
            <Component {...rest} {...props} />
          ) : (
            <Redirect to="/inbox" />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
