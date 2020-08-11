import * as React from 'react';
import { createContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';

export const AuthContext = createContext<{
  user: firebase.User | null;
  setUser: React.Dispatch<React.SetStateAction<firebase.User | null>>;
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
  verified: boolean;
} | null>(null);

const AuthContextProvider: React.FC = ({ children }) => {
  const localUser: firebase.User | null = JSON.parse(
    localStorage.getItem('user') ?? 'null'
  );
  const [user, setUser] = useState<firebase.User | null>(localUser);

  const localUsername: string | null = localStorage.getItem('username');
  const [username, setUsername] = useState<string | null>(localUsername);
  const localVerified: boolean = !!localStorage.getItem('verified');
  const [verified, setVerified] = useState<boolean>(localVerified);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      if (!user) {
        localStorage.removeItem('user');
        localStorage.removeItem('username');
        localStorage.removeItem('verified');
        return;
      };

      db.collection('usernames')
        .where('userId', '==', user.uid)
        .get()
        .then(snap => {
          const username = snap.docs[0]?.id ?? null;
          setUsername(username);
          if (username)
            localStorage.setItem('username', username);
        });
      
      db.collection('verified_users')
        .doc(user.uid)
        .get()
        .then(({ exists }) => {
          setVerified(exists)
          if (exists)
            localStorage.setItem('verified', '1');
          else
            localStorage.removeItem('verified');
        });
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, username, setUsername, verified }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
