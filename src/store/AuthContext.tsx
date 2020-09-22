import * as React from 'react';
import { createContext, useState, useEffect } from 'react';
import { auth, db, messaging } from '../config/firebase';
import UserData from '../types/UserData';

export const AuthContext = createContext<{
  user: firebase.User | null;
  setUser: React.Dispatch<React.SetStateAction<firebase.User | null>>;
  username?: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  verified?: boolean;
  userData?: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData | undefined>>;
} | null>(null);

const AuthContextProvider: React.FC = ({ children }) => {
  const localUser: firebase.User | null = JSON.parse(
    localStorage.getItem('user') ?? 'null'
  );
  const [user, setUser] = useState<firebase.User | null>(localUser);

  const [userData, setUserData] = useState<UserData>();

  const [username, setUsername] = useState<string | null>();

  const [verified, setVerified] = useState<boolean>();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      if (!user) {
        localStorage.removeItem('user');
        localStorage.removeItem('username');
        localStorage.removeItem('verified');

        messaging
          .getToken()
          .then(token => {
            messaging.deleteToken();
            db.collection('devices').doc(token).delete();
          })
          .catch(err => console.error(err));
        return;
      }

      messaging
        .requestPermission()
        .then(() => messaging.getToken())
        .then(token =>
          db.collection('devices').doc(token).set({
            userId: auth.currentUser?.uid,
            device: token,
            token
          })
        )
        .catch(err => {
          console.error(err);
        });
      db.collection('users')
        .doc(user.uid)
        .get()
        .then(snap => {
          setUserData({ id: snap.id, ...(snap.data() as UserData) });
        });

      db.collection('usernames')
        .where('userId', '==', user.uid)
        .get()
        .then(snap => {
          const username = snap.docs[0]?.id ?? null;
          setUsername(username);
          if (username) localStorage.setItem('username', username);
        });

      db.collection('verified_users')
        .doc(user.uid)
        .get()
        .then(({ exists }) => {
          setVerified(exists);
          if (exists) localStorage.setItem('verified', '1');
          else localStorage.removeItem('verified');
        });
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        username,
        setUsername,
        verified,
        userData,
        setUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
