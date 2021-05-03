import { Router } from '@reach/router';
import { AnimatePresence } from 'framer-motion';
import loadable from '@loadable/component';

import AlertMessageProvider from './contexts/AlertMessageContext';
import SafeArea from './components/SafeArea';
import Navigation from './components/Navbar';
import BottomNavigation from './components/BottomNavbar';
import useDarkMode from './hooks/useDarkMode';
import { useAuth } from './contexts/AuthContext';

const Home = loadable(() => import('./pages/Home'));
const Login = loadable(() => import('./pages/auth/Login'));
const Register = loadable(() => import('./pages/auth/Register'));
const PhoneLogin = loadable(() => import('./pages/auth/PhoneLogin'));
const ResetPassword = loadable(() => import('./pages/auth/ResetPassword'));
const Profile = loadable(() => import('./pages/Profile'));
const PrivacyPolicy = loadable(() => import('./pages/PrivacyPolicy'));
const Settings = loadable(() => import('./pages/signed/Settings'));
const Outbox = loadable(() => import('./pages/signed/Outbox'));
const Inbox = loadable(() => import('./pages/signed/Inbox'));
const NotFound = loadable(() => import('./pages/NotFound'));
const WhoRequests = loadable(() => import('./pages/signed/WhoRequests'));

const App: React.FC = () => {
  useDarkMode();
  const { signedIn } = useAuth();

  return (
    <>
      <Navigation />

      <SafeArea paddingTop="10px" noBottomNavbar={!signedIn}>
        <AlertMessageProvider>
          <AnimatePresence exitBeforeEnter>
            <Router primary={false}>
              {/* No Auth */}
              <Home path="/" />
              <Login path="login" />
              <Register path="register" />
              <PhoneLogin path="phone-login" />
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
        </AlertMessageProvider>
      </SafeArea>

      {signedIn && <BottomNavigation />}
    </>
  );
};

export default App;
