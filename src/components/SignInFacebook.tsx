import * as React from 'react';
import { useCallback } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Button } from 'react-bootstrap';
import { FaFacebook } from 'react-icons/fa';

import { auth as firebaseAuth } from '../config/firebase';
import getErrorMessage from '../utils/getErrorMessage';

export const facebookProvider = new firebase.auth.FacebookAuthProvider();

export interface SignInFacebookProps {
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

const SignInFacebook: React.FC<SignInFacebookProps> = ({ setError }) => {
  const loginWithFacebook = useCallback(() => {
    firebaseAuth.signInWithPopup(facebookProvider)
      .catch(err => {
        console.error(err);
        setError(getErrorMessage(err.code));
      })
  }, [setError])

  return (
    <Button block variant="facebook" onClick={loginWithFacebook}>
      <FaFacebook className="ml-2" />
      الدخول باستخدم فيسبوك
    </Button>
  );
};

export default SignInFacebook;
