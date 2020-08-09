import * as React from 'react';
import { Switch } from 'react-router-dom';
import Home from './pages/Home';
import Navigation from './components/Navbar';
import SafeArea from './components/SafeArea';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './components/ProtectedRoute';
import AuthContextProvider from './store/AuthContext';
import SignedHome from './pages/signed/Home';

const App = () => {
  return (
    <AuthContextProvider>
      <Navigation />

      <SafeArea paddingTop="10px" fullHeight>
        <AnimatePresence exitBeforeEnter>
          <Switch>
            <ProtectedRoute path="/" component={Home} exact />
            <ProtectedRoute path="/login" component={Login} />
            <ProtectedRoute path="/register" component={Register} />
            <ProtectedRoute auth path="/home" component={SignedHome} />
          </Switch>
        </AnimatePresence>
      </SafeArea>
    </AuthContextProvider>
  );
}

export default App;
