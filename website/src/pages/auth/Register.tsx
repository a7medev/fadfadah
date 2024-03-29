import { useState, FormEvent } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { RouteComponentProps, Link } from '@reach/router';

import PageTransition from '../../components/PageTransition';
import AuthButtons from '../../components/auth/AuthButtons';
import withoutAuth from '../../components/auth/withoutAuth';
import authStyles from './Auth.module.scss';
import getErrorMessage from '../../utils/getErrorMessage';
import { auth, db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';

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
      setUser(user => user && { ...user, displayName: name });
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err.code));
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
        <Card body className={authStyles.card}>
          <Card.Title className="text-center">
            <h3>إنشاء حساب</h3>
          </Card.Title>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <AuthButtons setError={setError} />

          <hr />

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
