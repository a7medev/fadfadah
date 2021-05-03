import { useState, FormEvent, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { RouteComponentProps } from '@reach/router';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import firebase from 'firebase/app';

import PageTransition from '../../components/PageTransition';
import authStyles from './Auth.module.scss';
import getErrorMessage from '../../utils/getErrorMessage';
import withoutAuth from '../../components/auth/withoutAuth';
import { auth } from '../../config/firebase';
import 'react-phone-input-2/lib/bootstrap.css';
import './PhoneLogin.scss';

const { RecaptchaVerifier } = firebase.auth;

export interface PhoneLoginProps extends RouteComponentProps {}

const PhoneLogin: React.FC<PhoneLoginProps> = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [
    confirmationResult,
    setConfirmationResult
  ] = useState<firebase.auth.ConfirmationResult>();
  const [recaptcha, setRecaptcha] = useState<firebase.auth.RecaptchaVerifier>();
  const recapchaElement = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePhoneLogin = async (event: FormEvent) => {
    event.preventDefault();

    if (!recaptcha) {
      setError('لم يتم تهيئة reCaptcha بعد');
      return;
    }

    try {
      const confirmationResult = await auth.signInWithPhoneNumber(
        phone,
        recaptcha
      );
      setConfirmationResult(confirmationResult);
    } catch (err) {
      setConfirmationResult(undefined);
      setError(getErrorMessage(err.code));
      console.error(err);
    }
  };

  const handleConfirmCode = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await confirmationResult?.confirm(code);
    } catch (err) {
      setError(getErrorMessage(err.code));
      console.error(err);
    }
  };

  useEffect(() => {
    if (!recaptcha) {
      const verifier = new RecaptchaVerifier(recapchaElement.current, {
        size: 'invisible'
      });

      verifier.verify().then(() => setRecaptcha(verifier));
    }
  }, [recaptcha]);

  return (
    <PageTransition>
      <Helmet>
        <title>الدخول باستخدام رقم الموبايل | فضفضة</title>
      </Helmet>

      <Container>
        <Card body className={authStyles.card}>
          <Card.Title className="text-center">
            <h3 className="mx-4" style={{ whiteSpace: 'pre' }}>
              الدخول باستخدام <wbr />
              رقم الموبايل
            </h3>
          </Card.Title>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Form
            onSubmit={confirmationResult ? handleConfirmCode : handlePhoneLogin}
          >
            <Form.Group controlId="phone">
              <Form.Label>رقم الموبايل</Form.Label>
              <div dir="ltr" style={{ textAlign: 'left' }}>
                <PhoneInput
                  value={phone}
                  onChange={value => setPhone('+' + value)}
                  inputProps={{ id: 'phone' }}
                  dropdownClass="border shadow-sm"
                  country="eg"
                />
              </div>
            </Form.Group>

            {confirmationResult && (
              <Form.Group controlId="code">
                <Form.Label>كود التأكيد</Form.Label>
                <Form.Control
                  type="number"
                  pattern="[0-9]*"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="اكتب كود التأكيد المرسل إليك"
                  autoComplete="one-time-code"
                />
              </Form.Group>
            )}

            <div ref={recapchaElement}></div>

            <Button block type="submit">
              {confirmationResult ? 'تأكيد الرمز' : 'إرسال رمز التأكيد'}
            </Button>
          </Form>
        </Card>
      </Container>
    </PageTransition>
  );
};

export default withoutAuth<PhoneLoginProps>(PhoneLogin);
