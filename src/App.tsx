import * as React from 'react';

import { Router } from '@reach/router';
import { AnimatePresence } from 'framer-motion';

import { useAuth } from './contexts/AuthContext';

import SafeArea from './components/SafeArea';
import Navigation from './components/Navbar';
import BottomNavigation from './components/BottomNavbar';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Settings from './pages/signed/Settings';
import Outbox from './pages/signed/Outbox';
import Inbox from './pages/signed/Inbox';
import NotFound from './pages/NotFound';
import WhoRequests from './pages/signed/WhoRequests';

import useDarkMode from './hooks/useDarkMode';

const App: React.FC = () => {
  useDarkMode();
  const { signedIn } = useAuth();

  return (
    <>
      <Navigation />

      <SafeArea paddingTop="10px" noBottomNavbar={!signedIn}>
        <AnimatePresence exitBeforeEnter>
          <Router primary={false}>
            {/* No Auth */}
            <Home path="/" />
            <Login path="login" />
            <Register path="register" />
            <ResetPassword path="reset-password" />
            {/* End No Auth */}

            {/* Auth */}
            <Inbox path="inbox" />
            <Outbox path="outbox" />
            <WhoRequests path="who-requests" />
            <Settings path="settings" />
            {/* End Auth */}

            <Profile path="u/:username" />
            <PrivacyPolicy path="privacy-policy" />

            <NotFound default />
          </Router>
        </AnimatePresence>
      </SafeArea>

      {signedIn && <BottomNavigation />}
    </>
  );
};

export default App;
