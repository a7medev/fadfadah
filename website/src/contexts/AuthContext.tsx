import { createContext, useContext, useState, useEffect } from 'react';
import type firebase from 'firebase';

import { auth, db, messaging } from '../config/firebase';
import MiniUser from '../types/MiniUser';
import Settings from '../types/Settings';
import UserData from '../types/UserData';

export interface AuthContextType {
  signedIn: boolean;
  user?: MiniUser | null;
  setUser: React.Dispatch<React.SetStateAction<MiniUser | null | undefined>>;
  settings?: Settings | null;
  setSettings: React.Dispatch<
    React.SetStateAction<Settings | null | undefined>
  >;
  firebaseUser?: firebase.User | null;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (value === undefined) {
    throw new Error('You must wrap the app with AuthProvider to use useAuth');
  }

  return value;
};

const AuthProvider: React.FC = ({ children }) => {
  const [signedIn, setSignedIn] = useState<boolean>(
    () => !!localStorage.getItem('signedIn')
  );

  const [user, setUser] = useState<MiniUser | null>();
  const [firebaseUser, setFirebaseUser] = useState<firebase.User | null>();
  const [settings, setSettings] = useState<Settings | null>();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    () => {
      return auth.onAuthStateChanged(user => {
        if (isLoading) {
          setIsLoading(false);
        }
        setFirebaseUser(user);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Set signed in state
  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (firebaseUser) {
      setSignedIn(true);
      localStorage.setItem('signedIn', 'true');
    } else {
      setSignedIn(false);
      localStorage.removeItem('signedIn');
    }
  }, [firebaseUser, isLoading]);

  // Handle messaging tokens
  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (messaging) {
      if (!firebaseUser) {
        messaging
          .getToken()
          .then(token =>
            Promise.all([
              messaging?.deleteToken(),
              db.collection('devices').doc(token).delete()
            ])
          )
          .catch(err => console.error(err));
      } else {
        messaging
          .getToken()
          .then(token =>
            db.collection('devices').doc(token).set({
              userId: auth.currentUser!.uid,
              token
            })
          )
          .catch(err => {
            console.error('Error storing the device token:', err);
          });
      }
    }
  }, [firebaseUser, isLoading]);

  // Get user data
  useEffect(() => {
    if (!firebaseUser) {
      setUser(null);
      setSettings(null);
      return;
    }

    const { uid } = firebaseUser;

    return db
      .collection('users')
      .doc(uid)
      .onSnapshot(snapshot => {
        if (!snapshot.exists) {
          setUser(null);
          setSettings(null);
          return;
        }

        const { settings, ...miniUser } = snapshot.data() as UserData;

        setUser(miniUser);
        setSettings(settings);
      });
  }, [firebaseUser]);

  return (
    <AuthContext.Provider
      value={{ signedIn, user, setUser, settings, setSettings, firebaseUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
