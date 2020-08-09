import * as React from 'react';
import { createContext, useState } from 'react';
import { auth } from '../config/firebase';

export const AuthContext = createContext<{
  user: firebase.User | null;
  setUser: React.Dispatch<React.SetStateAction<firebase.User | null>>;
} | null>(null);

const AuthContextProvider: React.FC = ({ children }) => {
  const localUser: firebase.User = JSON.parse(localStorage.getItem('user')!);
  const [user, setUser] = useState<firebase.User | null>(localUser);

  auth.onAuthStateChanged(user => {
    setUser(user)
    localStorage.setItem('user', JSON.stringify(user))
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
