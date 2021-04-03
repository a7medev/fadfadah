import * as React from 'react';
import { useCallback } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { auth as firebaseAuth, messages } from '../config/firebase';
import { Button } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';

export const googleProvider = new firebase.auth.GoogleAuthProvider();

export interface SignInGoogleProps {
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

const SignInGoogle: React.FC<SignInGoogleProps> = ({ setError }) => {
  const loginWithGoogle = useCallback(() => {
    firebaseAuth.signInWithPopup(googleProvider)
      .catch(err => {
        console.error(err);
        // @ts-ignore
        setError(messages[err.code] || 'حدثت مشكلة ما');
      })
  }, [setError])

  return (
    <Button block variant="google" onClick={loginWithGoogle}>
      <FaGoogle className="ml-2" />
      الدخول باستخدم جوجــــــل
    </Button>
  );
};

export default SignInGoogle;
