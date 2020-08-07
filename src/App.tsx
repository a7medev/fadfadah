import * as React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Navigation from './components/Navbar';
import SafeArea from './components/SafeArea';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const location = useLocation();

  return (
    <>
      <Navigation />

      <SafeArea paddingTop="10px" fullHeight>
        <AnimatePresence exitBeforeEnter>
          <Switch location={location} key={location.pathname}>
            <ProtectedRoute path="/" component={Home} exact />
            <ProtectedRoute path="/login" component={Login} />
            <ProtectedRoute path="/register" component={Register} />
          </Switch>
        </AnimatePresence>
      </SafeArea>
    </>
  );
}

export default App;
