import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const initialSignedIn = !!localStorage.getItem('signedIn');
  const [signedIn, setSignedIn] = useState<boolean>(initialSignedIn);

  const [user, setUser] = useState<MiniUser | null>();
  const [firebaseUser, setFirebaseUser] = useState<firebase.User | null>();
  const [settings, setSettings] = useState<Settings | null>();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async user => {
      setFirebaseUser(user);

      if (!user) {
        setSignedIn(false);
        localStorage.removeItem('signedIn');

        messaging
          .getToken()
          .then(token =>
            Promise.all([
              messaging.deleteToken(),
              db.collection('devices').doc(token).delete()
            ])
          )
          .catch(err => console.error(err));
        return;
      }

      const { uid } = user;
      setSignedIn(true);
      localStorage.setItem('signedIn', 'true');

      try {
        const userDoc = await db.collection('users').doc(uid).get();

        // FIXME: it's broken when signup
        const { settings, ...miniUser } = userDoc.data() as UserData;

        setSettings(settings);
        setUser(miniUser);
      } catch (err) {
        console.error(err);
      }

      // Store the token of the user
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
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{ signedIn, user, setUser, settings, setSettings, firebaseUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
