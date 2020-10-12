import * as React from 'react';
import { createContext, useState, useEffect } from 'react';
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

const AuthContextProvider: React.FC = ({ children }) => {
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

      // Get the username
      const {
        docs: [usernameDoc]
      } = await db.collection('usernames').where('userId', '==', uid).get();

      const username = usernameDoc?.id ?? null;

      // Get the verified state
      const { exists: verified } = await db
        .collection('verified_users')
        .doc(user.uid)
        .get();

      const userDoc = await db.collection('users').doc(uid).get();
      const { settings, gender } = userDoc.data() as UserData;

      const { displayName, photoURL } = user;

      setSettings(settings);
      setUser({
        uid,
        displayName,
        photoURL,
        username,
        verified,
        gender
      });

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

export default AuthContextProvider;