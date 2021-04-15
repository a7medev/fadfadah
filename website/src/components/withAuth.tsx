import { Redirect } from '@reach/router';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function withAuth<TProps = {}>(
  Route: React.ComponentType<TProps>
): React.FC<TProps> {
  return props => {
    const { signedIn } = useAuth();

    return signedIn ? <Route {...props} /> : <Redirect to="/login" noThrow />;
  };
}

export default withAuth;
