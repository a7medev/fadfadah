import { Link } from '@reach/router';
import { Button } from 'react-bootstrap';
import { FaPhone } from 'react-icons/fa';

const SignInPhoneButton: React.FC = () => {
  return (
    <Button block variant="dark" as={Link} to="/phone-login">
      <FaPhone className="ml-2" />
      الدخول باستخدام رقم الموبايل
    </Button>
  );
};

export default SignInPhoneButton;
