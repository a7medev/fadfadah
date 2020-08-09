import * as React from 'react';
import { useRef, FormEvent } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import PageTransition from '../../components/PageTransition';
import { auth } from '../../config/firebase';
import { AuthContext } from '../../store/AuthContext';

const Login = () => {
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const authContext = React.useContext(AuthContext);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    try {
      const { user } = await auth.signInWithEmailAndPassword(
        email.current?.value!,
        password.current?.value!
      );
  
      authContext?.setUser(user);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <PageTransition>
      <Container>
        <Card style={{ maxWidth: '600px' }} className="mx-auto my-3">
          <Card.Body>
            <Card.Title className="text-center">
              <h3>تسجيل الدخول</h3>
            </Card.Title>

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

              <Button type="submit">تسجيل الدخول</Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </PageTransition>
  );
};

export default Login;
