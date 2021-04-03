import * as React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { auth } from '../config/firebase';

export interface EmailNotVerifiedMessageProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>
}

const EmailNotVerifiedMessage: React.FC<EmailNotVerifiedMessageProps> = ({ setShow }) => {
  const sendEmailVerification = () => {
    setShow(false);
    auth.currentUser?.sendEmailVerification();
  }

  return (
    <Alert
      variant="warning"
      className="mx-auto mb-2"
    >
      <p className="mb-2">
        رجاءاً قم بإثبات ملكية البريد الإلكتروني للاستمتاع بجميع مميزات فضفضة
      </p>

      <Button size="sm" variant="dark" onClick={sendEmailVerification}>
        إرسال رابط التأكيد على بريدي
      </Button>
    </Alert>
  );
}

export default EmailNotVerifiedMessage;
