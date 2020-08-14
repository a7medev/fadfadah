import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navigation from './components/Navbar';
import SafeArea from './components/SafeArea';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './components/ProtectedRoute';
import SignedHome from './pages/signed/Home';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';

const App = () => {
  return (
    <>
      <Navigation />

      <SafeArea paddingTop="10px" fullHeight>
        <AnimatePresence exitBeforeEnter>
          <Switch>
            <ProtectedRoute path="/" component={Home} exact />
            <ProtectedRoute path="/login" component={Login} />
            <ProtectedRoute path="/register" component={Register} />
            <ProtectedRoute auth path="/home" component={SignedHome} />
            <Route path="/u/:username" component={Profile} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
          </Switch>
        </AnimatePresence>
      </SafeArea>
    </>
  );
}

export default App;
