import * as React from 'react';
import { useState, useRef, FormEvent } from 'react';

import { Helmet } from 'react-helmet';

import PageTransition from '../../components/PageTransition';
import { RouteComponentProps, Link } from '@reach/router';

import SignInFacebook from '../../components/auth/SignInFacebook';
import SignInGoogle from '../../components/auth/SignInGoogle';

import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { auth, messages } from '../../config/firebase';
import withoutAuth from '../../components/hoc/without-auth';

export interface LoginProps extends RouteComponentProps {}

const Login: React.FC<LoginProps> = () => {
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const loginButton = useRef<HTMLButtonElement>(null);

  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    loginButton.current!.disabled = true;

    try {
      await auth.signInWithEmailAndPassword(
        email.current!.value,
        password.current!.value
      );
    } catch (err) {
      console.error(err);
      // @ts-ignore
      setError(messages[err.code] || 'حدثت مشكلة ما');
    } finally {
      loginButton.current!.disabled = false;
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

            <Button block type="submit" ref={loginButton}>
              تسجيل الدخول
            </Button>
          </Form>

          <p className="mt-3">
            ليس لديك حساب؟ <Link to="/register">أنشئ واحداً</Link>
          </p>

          <hr />

          <SignInFacebook setError={setError} />
          <SignInGoogle setError={setError} />
        </Card>
      </Container>
    </PageTransition>
  );
};

export default withoutAuth<LoginProps>(Login);
