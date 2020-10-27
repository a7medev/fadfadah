import { Redirect } from '@reach/router';
import * as React from 'react';
import { useAuth } from '../../contexts/AuthContext';

function withoutAuth<TProps = {}>(
  Route: React.ComponentType<TProps>
): React.FC<TProps> {
  return props => {
    const { signedIn } = useAuth();

    return signedIn ? <Redirect to="/inbox" noThrow /> : <Route {...props} />;
  };
}

export default withoutAuth;
