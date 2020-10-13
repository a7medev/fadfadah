import { Redirect } from '@reach/router';
import * as React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

function withAuth<TProps = {}>(
  Route: React.ComponentType<TProps>
): React.FC<TProps> {
  return props => {
    const { signedIn } = useContext(AuthContext);

    return signedIn ? <Route {...props} /> : <Redirect to="/login" />;
  };
}

export default withAuth;
