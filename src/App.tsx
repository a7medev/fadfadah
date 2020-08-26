import * as React from 'react';
import { useLayoutEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navigation from './components/Navbar';
import SafeArea from './components/SafeArea';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Settings from './pages/signed/Settings';
import Outbox from './pages/signed/Outbox';
import Inbox from './pages/signed/Inbox';
import NotFound from './pages/NotFound';

const App = () => {
  useLayoutEffect(() => {
    const darkModeOn = !!localStorage.getItem('darkMode');

    if (darkModeOn)
      document.body.classList.add('dark');
  }, []);

  return (
    <>
      <Navigation />

      <SafeArea paddingTop="10px" fullHeight>
        <AnimatePresence exitBeforeEnter>
          <Switch>
            <ProtectedRoute path="/" component={Home} exact />
            <ProtectedRoute path="/login" component={Login} />
            <ProtectedRoute path="/register" component={Register} />
            <ProtectedRoute auth path="/inbox" component={Inbox} />
            <ProtectedRoute auth path="/outbox" component={Outbox} />
            <ProtectedRoute auth path="/settings" component={Settings} />
            <Route path="/u/:username" component={Profile} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route component={NotFound} />
          </Switch>
        </AnimatePresence>
      </SafeArea>
    </>
  );
}

export default App;
