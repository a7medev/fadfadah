import { Redirect } from '@reach/router';
import * as React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

function withoutAuth<TProps = {}>(
  Route: React.ComponentType<TProps>
): React.FC<TProps> {
  return props => {
    const { signedIn } = useContext(AuthContext);

    return signedIn ? <Redirect to="/inbox" /> : <Route {...props} />;
  };
}

export default withoutAuth;
