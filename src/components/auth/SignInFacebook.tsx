import * as React from 'react';
import { useCallback } from 'react';
import { auth } from 'firebase/app';
import 'firebase/auth';
import { auth as firebaseAuth, messages } from '../../config/firebase';
import { Button } from 'react-bootstrap';
import { FaFacebook } from 'react-icons/fa';

export const facebookProvider = new auth.FacebookAuthProvider();

export interface SignInFacebookProps {
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

const SignInFacebook: React.FC<SignInFacebookProps> = ({ setError }) => {
  const loginWithFacebook = useCallback(() => {
    firebaseAuth.signInWithPopup(facebookProvider)
      .catch(err => {
        console.error(err);
        // @ts-ignore
        setError(messages[err.code] || 'حدثت مشكلة ما');
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
