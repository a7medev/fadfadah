import * as React from 'react';
import { useState, useRef, useContext, FormEvent } from 'react';
import { Card, Alert, Form, Button } from 'react-bootstrap';
import { auth, messages } from '../../config/firebase';
import { AuthContext } from '../../store/AuthContext';

const NameIsNotSet = () => {
  const fullName = useRef<HTMLInputElement>(null);

  const { setUser } = useContext(AuthContext)!;

  const [error, setError] = useState<string | null>(null);

  function changeDisplayName(event: FormEvent) {
    event.preventDefault();

    if (!/^\p{L}+( \p{L}+)*$/u.test(fullName.current?.value.trim()!))
      return setError('رجاءاً أدخل اسماً صالحاً');

    auth.currentUser
      ?.updateProfile({
        displayName: fullName.current?.value!
      })
      .then(() =>
        setUser(prevUser => ({
          ...prevUser!,
          displayName: fullName.current?.value!
        }))
      )
      .catch(err => {
        console.error(err);
        // @ts-ignore
        setError(messages[err.code] || 'حدثت مشكلة ما');
      });
  }

  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Title>
          <h5>يبدو أن الحساب لا يحتوي على اسم</h5>
        </Card.Title>
        <Card.Subtitle className="text-muted mb-3">
          يحدث ذلك غالباً بسبب مشاكل في الشبكة أثناء إنشاء الحساب
        </Card.Subtitle>

        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        <Form onSubmit={changeDisplayName}>
          <Form.Group className="mb-2">
            <Form.Control
              ref={fullName}
              type="text"
              placeholder="اكتب اسمك هنا"
            />
          </Form.Group>

          <Button type="submit">حفظ الاسم</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default NameIsNotSet;
