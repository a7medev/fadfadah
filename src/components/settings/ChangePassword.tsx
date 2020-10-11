import * as React from 'react';
import { useRef } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { auth, messages } from '../../config/firebase';
import { auth as appAuth } from 'firebase/app';
import 'firebase/auth';

export interface ChangePasswordProps {
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ setMessage }) => {
  const changePasswordButton = useRef<HTMLButtonElement>(null);
  const newPassword = useRef<HTMLInputElement>(null);
  const currentPassword = useRef<HTMLInputElement>(null);

  function changePassword(event: React.FormEvent) {
    event.preventDefault();
    changePasswordButton.current!.disabled = true;

    const user = auth.currentUser!;
    const emailProvider = user?.providerData.find(
      provider => provider?.providerId === appAuth.EmailAuthProvider.PROVIDER_ID
    );

    if (!emailProvider)
      return setMessage(
        'يمكن للأشخاص الذين يملكون حساباً مربوطاً بالبريد الإلكتروني فقط تغيير كلمة المرور'
      );

    const cred = appAuth.EmailAuthProvider.credential(
      emailProvider.email!,
      currentPassword.current?.value!
    );
    user
      .reauthenticateWithCredential(cred)
      .then(() => user.updatePassword(newPassword.current?.value!))
      .then(() => {
        setMessage('تم تغيير كلمة المرور بنجاح');
      })
      .catch(err => {
        // @ts-ignore
        setMessage(messages[err.code] ?? 'حدثت مشكلة ما');
      })
      .finally(() => {
        changePasswordButton.current!.disabled = false;
      });
  }

  return (
    <Card body className="mb-4" id="change-password">
      <h5 className="mb-3">تغيير كلمة المرور</h5>

      <Form onSubmit={changePassword}>
        <Form.Group controlId="current-password">
          <Form.Label>كلمة المرور الحالية</Form.Label>
          <Form.Control
            type="password"
            placeholder="أدخل كلمة المرور الحالية هنا"
            ref={currentPassword}
          />
        </Form.Group>

        <Form.Group controlId="new-password">
          <Form.Label>كلمة المرور الجديدة</Form.Label>
          <Form.Control
            type="password"
            placeholder="أدخل كلمة المرور الجديدة هنا"
            ref={newPassword}
          />
        </Form.Group>

        <Button type="submit" ref={changePasswordButton}>
          تغيرر كلمة المرور
        </Button>
      </Form>
    </Card>
  );
};

export default ChangePassword;
