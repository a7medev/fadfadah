import * as React from 'react';
import { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navigation from './components/Navbar';
import BottomNavigation from './components/BottomNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import SafeArea from './components/SafeArea';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Settings from './pages/signed/Settings';
import Outbox from './pages/signed/Outbox';
import Inbox from './pages/signed/Inbox';
import NotFound from './pages/NotFound';
import WhoRequests from './pages/signed/WhoRequests';
import useDarkMode from './hooks/useDarkMode';
import { AuthContext } from './store/AuthContext';

const App: React.FC = () => {
  useDarkMode();
  const { signedIn } = useContext(AuthContext);

  return (
    <>
      <Navigation />

      <SafeArea paddingTop="10px" noBottomNavbar={!signedIn}>
        <AnimatePresence exitBeforeEnter>
          <Switch>
            <ProtectedRoute path="/" component={Home} exact />
            <ProtectedRoute path="/login" component={Login} />
            <ProtectedRoute path="/register" component={Register} />
            <ProtectedRoute auth path="/inbox" component={Inbox} />
            <ProtectedRoute auth path="/outbox" component={Outbox} />
            <ProtectedRoute auth path="/who-requests" component={WhoRequests} />
            <ProtectedRoute auth path="/settings" component={Settings} />
            <Route path="/u/:username" component={Profile} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route component={NotFound} />
          </Switch>
        </AnimatePresence>
      </SafeArea>

      {signedIn && <BottomNavigation />}
    </>
  );
};

export default App;
