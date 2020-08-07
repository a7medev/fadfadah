import * as React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { auth as firebaseAuth } from '../config/firebase';

export interface ProtectedRouteProps extends RouteProps {
  auth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  auth,
  component: Component,
  ...rest
}) => {
  const user = firebaseAuth.currentUser;

  return (
    <Route
      {...rest}
      render={props => {

        // Route requires Auth
        if (auth) {
          // User is Authenticated
          if (user) {
            // @ts-ignore
            return <Component {...rest} {...props} />;
          }

          // User is not Authenticated
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }}
            />
          );
        } else { // Route doesn't require Auth
          if (!user) { // User is not Authenticated
            // @ts-ignore
            return <Component {...rest} {...props} />;
          }

          // User is Authenticated
          return (
            <Redirect
              to={{
                pathname: '/home',
                state: { from: props.location }
              }}
            />
          )
        }

      }}
    />
  );
};

export default ProtectedRoute;
