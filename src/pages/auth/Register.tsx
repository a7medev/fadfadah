import * as React from 'react';
import { useRef, FormEvent } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import PageTransition from '../../components/PageTransition';

const Register = () => {
  const fullName = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const username = useRef(null);
  // const gender = useRef(null);
  // const birthDate = useRef(null);

  function handleRegister(event: FormEvent) {
    // Handle Login Here
  }

  return (
    <PageTransition>
      <Container>
        <Card style={{ maxWidth: '600px' }} className='mx-auto my-3'>
          <Card.Body>
            <Card.Title className="text-center">
              <h3>إنشاء حساب</h3>
            </Card.Title>

            <form onSubmit={handleRegister}>
              <Form.Group controlId="name">
                <Form.Label>الاسم كامل</Form.Label>
                <Form.Control ref={fullName} type="text" placeholder="مثال: محمد عبدالله" />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>البريد الإلكتروني</Form.Label>
                <Form.Control ref={email} type="email" placeholder="مثال: muhammed@example.com" />
              </Form.Group>
              <Form.Group controlId="username">
                <Form.Label>اسم المستخدم</Form.Label>
                <Form.Control ref={username} type="text" placeholder="مثال: mu7ammed" />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>كلمة المرور</Form.Label>
                <Form.Control ref={password} type="password" placeholder="يجب أن تحتوي على 8 أحرف على الأقل" />
              </Form.Group>

              <Button type="submit">إنشاء حساب</Button>
            </form>

          </Card.Body>
        </Card>
      </Container>
    </PageTransition>
  );
}

export default Register;
