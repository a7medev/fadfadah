import * as React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { auth } from '../../config/firebase';

export interface EmailNotVerifiedMessageProps {
  setEmailNotVerified: React.Dispatch<React.SetStateAction<boolean>>
}

const EmailNotVerifiedMessage: React.FC<EmailNotVerifiedMessageProps> = ({ setEmailNotVerified }) => {
  function sendEmailVerification() {
    setEmailNotVerified(false);
    auth.currentUser?.sendEmailVerification();
  }

  return (
    <Alert
      variant="warning"
      className="mx-auto mb-2"
    >
      <p className="mb-2">
        رجاءاً قم بإثبات ملكية البريد الإلكتروني لتتمكن من استخدام فضفضة
        بكامل مميزاته
      </p>

      <Button size="sm" variant="dark" onClick={sendEmailVerification}>
        إرسال رابط التأكيد على بريدي
      </Button>
    </Alert>
  );
}

export default EmailNotVerifiedMessage;
