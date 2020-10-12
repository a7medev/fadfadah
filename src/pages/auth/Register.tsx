import * as React from 'react';
import { useRef, useState, useContext, FormEvent } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import PageTransition from '../../components/PageTransition';
import { auth, messages } from '../../config/firebase';
import { AuthContext } from '../../contexts/AuthContext';
import SignInFacebook from '../../components/auth/SignInFacebook';
import SignInGoogle from '../../components/auth/SignInGoogle';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Register: React.FC = () => {
  const fullName = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const { setUser } = useContext(AuthContext);

  const [error, setError] = useState<string | null>(null);

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    // Validate full name
    if (!/^\p{L}+( \p{L}+)*$/u.test(fullName.current?.value.trim()!))
      return setError('رجاءاً أدخل اسماً صالحاً');

    const name = fullName.current?.value;

    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email.current?.value!,
        password.current?.value!
      );

      user!
        .updateProfile({
          displayName: name!
        })
        .then(() => {
          setUser(prevUser => ({
            ...prevUser!,
            displayName: name!
          }));
        });

      user!.sendEmailVerification();
    } catch (err) {
      console.log(err);
      // @ts-ignore
      setError(messages[err.code] || 'حدثت مشكلة ما');
    }
  }

  return (
    <PageTransition>
      <Helmet>
        <title>إنشاء حساب | فضفضة</title>
      </Helmet>

      <Container>
        <Card body style={{ maxWidth: '600px' }} className="mx-auto my-3">
          <Card.Title className="text-center">
            <h3>إنشاء حساب</h3>
          </Card.Title>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
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

            <Button block type="submit">
              إنشاء حساب
            </Button>
          </Form>

          <p className="mt-3">لديك حساب بالفعل؟ <Link to="/login">سجّل الدخول</Link></p>

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

export default Register;
