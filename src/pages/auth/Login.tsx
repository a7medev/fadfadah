import * as React from 'react';
import { useState, useRef, useContext, FormEvent } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import PageTransition from '../../components/PageTransition';
import { auth, messages } from '../../config/firebase';
import { AuthContext } from '../../contexts/AuthContext';
import SignInFacebook from '../../components/auth/SignInFacebook';
import SignInGoogle from '../../components/auth/SignInGoogle';
import { Helmet } from 'react-helmet';

const Login: React.FC = () => {
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);

  const authContext = useContext(AuthContext);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    try {
      const { user } = await auth.signInWithEmailAndPassword(
        email.current?.value!,
        password.current?.value!
      );

      authContext?.setUser(user);
    } catch (err) {
      console.error(err);
      // @ts-ignore
      setError(messages[err.code] || 'حدثت مشكلة ما');
    }
  }

  return (
    <PageTransition>
      <Helmet>
        <title>تسجيل الدخول | فضفضة</title>        
      </Helmet>

      <Container>
        <Card body style={{ maxWidth: 600 }} className="mx-auto my-3">
          <Card.Title className="text-center">
            <h3>تسجيل الدخول</h3>
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

          <Form onSubmit={handleLogin}>
            <Form.Group controlId="email">
              <Form.Label>البريد الإلكتروني</Form.Label>
              <Form.Control
                ref={email}
                type="email"
                placeholder="اكتب بريد حسابك الإلكتروني"
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>كلمة المرور</Form.Label>
              <Form.Control
                ref={password}
                type="password"
                placeholder="اكتب كلمة مرور حسابك"
              />
            </Form.Group>

            <Button block type="submit">تسجيل الدخول</Button>
          </Form>

          <hr />

          <SignInFacebook setError={setError} />
          <SignInGoogle setError={setError} />
        </Card>
      </Container>
    </PageTransition>
  );
};

export default Login;
