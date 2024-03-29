import { useState, FormEvent } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { RouteComponentProps, Link } from '@reach/router';

import AuthButtons from '../../components/auth/AuthButtons';
import PageTransition from '../../components/PageTransition';
import withoutAuth from '../../components/auth/withoutAuth';
import authStyles from './Auth.module.scss';
import getErrorMessage from '../../utils/getErrorMessage';
import { auth } from '../../config/firebase';

export interface LoginProps extends RouteComponentProps {}

const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>تسجيل الدخول | فضفضة</title>
      </Helmet>

      <Container>
        <Card body className={authStyles.card}>
          <Card.Title className="text-center">
            <h3>تسجيل الدخول</h3>
          </Card.Title>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <AuthButtons setError={setError} />

          <hr />

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label>البريد الإلكتروني</Form.Label>
              <Form.Control
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="اكتب بريد حسابك الإلكتروني"
              />
            </Form.Group>
            <Form.Group controlId="password" className="mb-1">
              <Form.Label>كلمة المرور</Form.Label>
              <Form.Control
                value={password}
                onChange={e => setPassword(e.target.value)}
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

            <Button block type="submit" disabled={isLoading}>
              تسجيل الدخول
            </Button>
          </Form>

          <p className="mt-3 mb-0">
            ليس لديك حساب؟ <Link to="/register">أنشئ واحداً</Link>
          </p>
        </Card>
      </Container>
    </PageTransition>
  );
};

export default withoutAuth<LoginProps>(Login);
