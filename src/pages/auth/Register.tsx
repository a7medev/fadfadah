import * as React from 'react';
import { useRef, useState, useContext, FormEvent } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import PageTransition from '../../components/PageTransition';
import { auth, messages } from '../../config/firebase';
import { AuthContext } from '../../store/AuthContext';

const Register = () => {
  const fullName = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  // const username = useRef<HTMLInputElement>(null);

  const authContext = useContext(AuthContext);

  const [error, setError] = useState<string | null>(null);

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    // Validate full name
    if (!/^\p{L}+( \p{L}+)*$/u.test(fullName.current?.value.trim()!))
      return setError('رجاءاً أدخل اسماً صالحاً');
    
    const name = fullName.current?.value;

    // // Validate username
    // if (!/^[A-Z_0-9]+$/i.test(username.current?.value.trim()!))
    //   return setError(
    //     'اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام و _ فقط'
    //   );

    // const isValidUsername = functions.httpsCallable('isValidUsername');
    // const { data: validUsername } = await isValidUsername(
    //   username.current?.value
    // );

    // if (!validUsername) return setError('اسم المستخدم غير متاح');

    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email.current?.value!,
        password.current?.value!
      );

      user?.updateProfile({
        displayName: name!
      }).then(() => {
        authContext?.setUser(prevUser => ({ ...prevUser!, displayName: name! }))
      });

      user?.sendEmailVerification();

      // authContext?.setUser(user);

      // const setUsername = functions.httpsCallable('setUsername');
      // const updatedUsername = await setUsername(username.current?.value);
      // if (!updatedUsername) return setError('حدثت مشكلة أثناء تعيين اسم المسخدم الخاص بك')

      // if (updatedUsername) authContext?.setUser(auth.currentUser);
    } catch (err) {
      console.log(err);
      // @ts-ignore
      setError(messages[err.code] || 'حدثت مشكلة ما');
    }
  }

  return (
    <PageTransition>
      <Container>
        <Card style={{ maxWidth: '600px' }} className="mx-auto my-3">
          <Card.Body>
            <Card.Title className="text-center">
              <h3>إنشاء حساب</h3>
            </Card.Title>

            {error && (
              <Alert
                variant="danger"
                onClose={() => setError(null)}
                dismissible
              >
                {error}
              </Alert>
            )}

            <Form onSubmit={handleRegister}>
              <Form.Group controlId="name">
                <Form.Label>الاسم كامل</Form.Label>
                <Form.Control
                  ref={fullName}
                  type="text"
                  placeholder="مثال: محمد عبدالله"
                />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>البريد الإلكتروني</Form.Label>
                <Form.Control
                  ref={email}
                  type="email"
                  placeholder="مثال: muhammed@example.com"
                />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>كلمة المرور</Form.Label>
                <Form.Control
                  ref={password}
                  type="password"
                  placeholder="يجب أن تحتوي على 6 أحرف على الأقل"
                />
              </Form.Group>

              <Button type="submit">إنشاء حساب</Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </PageTransition>
  );
};

export default Register;
