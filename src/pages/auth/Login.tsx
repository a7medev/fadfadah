import * as React from 'react';
import { useState, useRef, FormEvent } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import PageTransition from '../../components/PageTransition';
import { auth, messages } from '../../config/firebase';
import SignInFacebook from '../../components/auth/SignInFacebook';
import SignInGoogle from '../../components/auth/SignInGoogle';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    try {
      await auth.signInWithEmailAndPassword(
        email.current!.value,
        password.current!.value
      );
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
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
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
            <Form.Group controlId="password" className="mb-1">
              <Form.Label>كلمة المرور</Form.Label>
              <Form.Control
                ref={password}
                type="password"
                placeholder="اكتب كلمة مرور حسابك"
              />
            </Form.Group>

            <Link
              to="/reset-password"
              className="d-block text-left mb-2"
              style={{ fontSize: '0.95rem' }}
            >
              هل نسيت كلمة المرور ؟
            </Link>

            <Button block type="submit">
              تسجيل الدخول
            </Button>
          </Form>

          <p className="mt-3">ليس لديك حساب؟ <Link to="/register">أنشئ واحداً</Link></p>

          <hr />

          <SignInFacebook setError={setError} />
          <SignInGoogle setError={setError} />
        </Card>
      </Container>
    </PageTransition>
  );
};

export default Login;
