import SignInFacebook from './SignInFacebook';
import SignInGoogle from './SignInGoogle';
import SignInPhoneButton from './SignInPhoneButton';

export interface AuthButtonsProps {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ setError }) => {
  return (
    <>
      <SignInFacebook setError={setError} />
      <SignInGoogle setError={setError} />
      <SignInPhoneButton />
    </>
  );
};

export default AuthButtons;
