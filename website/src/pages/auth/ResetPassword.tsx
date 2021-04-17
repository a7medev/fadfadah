import { useState, FormEvent } from 'react';
import { Helmet } from 'react-helmet';
import { RouteComponentProps } from '@reach/router';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

import { auth } from '../../config/firebase';
import withoutAuth from '../../components/auth/withoutAuth';
import PageTransition from '../../components/PageTransition';
import MessageBox from '../../components/MessageBox';
import authStyles from './Auth.module.scss';
import getErrorMessage from '../../utils/getErrorMessage';

export interface ResetPasswordProps extends RouteComponentProps {}

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await auth.sendPasswordResetEmail(email);
      setMessage(
        'تم إرسال رابط إعادة تعيين كلمة المرور على بريدك الإلكتروني، افحص صندوق الوارد لمزيد من المعلومات.'
      );
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err.code));
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>إعادة تعيين كلمة المرور | فضفضة</title>
      </Helmet>

      <Container>
        <Card body className={authStyles.card}>
          <Card.Title className="text-center">
            <h3 className="mx-4" style={{ whiteSpace: 'pre' }}>
              إعادة تعيين <wbr />
              كلمة المرور
            </h3>
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

            <Button block type="submit">
              إعادة التعيين
            </Button>
          </Form>
        </Card>
      </Container>
    </PageTransition>
  );
};

export default withoutAuth<ResetPasswordProps>(ResetPassword);
