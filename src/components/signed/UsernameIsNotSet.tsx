import * as React from 'react';
import { useState, useRef, useContext, FormEvent } from 'react';
import { Card, Alert, Form, Button } from 'react-bootstrap';
import { messages, functions } from '../../config/firebase';
import { AuthContext } from '../../store/AuthContext';

const UsernameIsNotSet: React.FC = () => {
  const username = useRef<HTMLInputElement>(null);

  const { setUsername: setLocalUsername } = useContext(AuthContext)!;

  const [error, setError] = useState<string | null>(null);

  async function changeUsername(event: FormEvent) {
    event.preventDefault();

    // Validate username
    if (!/^[A-Z_0-9]+$/i.test(username.current?.value.trim()!))
      return setError('اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام و _ فقط');
    
    try {
      const usernameIsAvailable = functions.httpsCallable('usernameIsAvailable');
      const { data: validUsername } = await usernameIsAvailable(username.current?.value);
  
      if (!validUsername) return setError('اسم المستخدم غير متاح');
  
      const setUsername = functions.httpsCallable('setUsername');
      const usernameUpdated = await setUsername(username.current?.value);

      if (!usernameUpdated) return setError('حدثت مشكلة أثناء تعيين اسم المسخدم الخاص بك')

      setLocalUsername(username.current?.value.trim()!);
      localStorage.setItem('username', username.current?.value.trim()!);
    } catch (err) {
      console.error(err);
      // @ts-ignore
      setError(messages[err.code]);
    }
  }

  return (
    <Card >
      <Card.Body>
        <Card.Title>
          <h5>قم بإعداد اسم مستخدم</h5>
        </Card.Title>
        <Card.Subtitle className="text-danger mb-3">
          عدم وجود اسم مستخدم سيمنع الأشخاص من إرسال الرسائل إليك
        </Card.Subtitle>

        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        <Form onSubmit={changeUsername}>
          <Form.Group className="mb-2">
            <Form.Control
              ref={username}
              type="text"
              placeholder="اكتب اسم المستخدم هنا"
            />

            <Form.Text className="text-muted">
              يجب أن يحتوي على أحرف إنجليزية وأرقام و _ فقط
            </Form.Text>
          </Form.Group>

          <Button type="submit">تعيين اسم المستخدم</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UsernameIsNotSet;
