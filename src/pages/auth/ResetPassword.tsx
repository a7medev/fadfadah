import * as React from 'react';
import { useState, useRef, FormEvent } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import PageTransition from '../../components/PageTransition';
import { auth, messages } from '../../config/firebase';
import { Helmet } from 'react-helmet';
import MessageBox from '../../components/MessageBox';

const ResetPassword: React.FC = () => {
  const email = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  async function resetPassword(event: FormEvent) {
    event.preventDefault();

    try {
      await auth.sendPasswordResetEmail(email.current!.value);
      setMessage(
        'تم إرسال رابط إعادة تعيين كلمة المرور على بريدك الإلكتروني، افحص صندوق الوارد لمزيد من المعلومات.'
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
        <title>إعادة تعيين كلمة المرور | فضفضة</title>
      </Helmet>

      <Container>
        <Card body style={{ maxWidth: 600 }} className="mx-auto my-3">
          <Card.Title className="text-center">
            <h3>إعادة تعيين كلمة المرور</h3>
          </Card.Title>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <MessageBox
            title="رسالة من الموقع"
            text={message!}
            show={!!message}
            onClose={() => setMessage(null)}
          />

          <Form onSubmit={resetPassword}>
            <Form.Group controlId="email">
              <Form.Label>البريد الإلكتروني</Form.Label>
              <Form.Control
                ref={email}
                type="email"
                placeholder="اكتب بريد حسابك الإلكتروني"
              />
            </Form.Group>

            <Button block type="submit">
              إعادة التعيين
            </Button>
          </Form>
        </Card>
      </Container>
    </PageTransition>
  );
};

export default ResetPassword;
