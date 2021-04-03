import React, { useState, FormEvent } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { RouteComponentProps, Link } from '@reach/router';

import { auth, db, messages } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import PageTransition from '../../components/PageTransition';
import SignInFacebook from '../../components/auth/SignInFacebook';
import SignInGoogle from '../../components/auth/SignInGoogle';
import withoutAuth from '../../components/hoc/without-auth';
import authStyles from './Auth.module.scss';

export interface RegisterProps extends RouteComponentProps {}

const Register: React.FC<RegisterProps> = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setUser } = useAuth();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    if (!/^\p{L}+( \p{L}+)*$/u.test(name.trim())) {
      setIsLoading(false);
      setError('رجاءاً أدخل اسماً صالحاً');
      return;
    }

    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (!user) {
        setIsLoading(false);
        setError('فشل إنشاء الحساب، رجاءًا أعد المحاولة');
        return;
      }

      await db
        .collection('users')
        .doc(user.uid)
        .set({ displayName: name }, { merge: true });
      await user.updateProfile({ displayName: name });
      setUser(user => user && ({ ...user, displayName: name }));
    } catch (err) {
      console.error(err);

      if (err.code in messages) {
        setError(messages[err.code]);
      }
    } finally {
      setIsLoading(true);
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>إنشاء حساب | فضفضة</title>
      </Helmet>

      <Container>
        <Card body className={`${authStyles.card} mx-auto my-3`}>
          <Card.Title className="text-center">
            <h3>إنشاء حساب</h3>
          </Card.Title>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>الاسم كامل</Form.Label>
              <Form.Control
                value={name}
                onChange={e => setName(e.target.value)}
                type="text"
                placeholder="مثال: محمد عبدالله"
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>البريد الإلكتروني</Form.Label>
              <Form.Control
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="مثال: muhammed@example.com"
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>كلمة المرور</Form.Label>
              <Form.Control
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                placeholder="يجب أن تحتوي على 6 أحرف على الأقل"
              />
            </Form.Group>

            <Button block type="submit" disabled={isLoading}>
              إنشاء حساب
            </Button>
          </Form>

          <p className="mt-3">
            لديك حساب بالفعل؟ <Link to="/login">سجّل الدخول</Link>
          </p>

          <hr />

          <SignInFacebook setError={setError} />
          <SignInGoogle setError={setError} />

          <hr />

          <p className="mb-0">
            عند تسجيلك بالموقع، فإنك توافق على{' '}
            <Link to="/privacy-policy">سياسة الخصوصية</Link> بموقع فضفضة
          </p>
        </Card>
      </Container>
    </PageTransition>
  );
};

export default withoutAuth<RegisterProps>(Register);
