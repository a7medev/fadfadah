import { useCallback } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { auth as firebaseAuth } from '../../config/firebase';
import { Button } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';
import getErrorMessage from '../../utils/getErrorMessage';

export const googleProvider = new firebase.auth.GoogleAuthProvider();

export interface SignInGoogleProps {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const SignInGoogle: React.FC<SignInGoogleProps> = ({ setError }) => {
  const loginWithGoogle = useCallback(() => {
    firebaseAuth.signInWithPopup(googleProvider).catch(err => {
      console.error(err);
      setError(getErrorMessage(err.code));
    });
  }, [setError]);

  return (
    <Button block variant="google" onClick={loginWithGoogle}>
      <FaGoogle className="ml-2" />
      الدخول باستخدم جوجـــــــــــــــــل
    </Button>
  );
};

export default SignInGoogle;
