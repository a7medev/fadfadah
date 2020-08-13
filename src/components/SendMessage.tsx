import * as React from 'react';
import { useState, useRef } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { functions } from '../config/firebase';
import 'firebase/firestore';
import MiniUser from '../types/MiniUser';

export interface SendMessageProps {
  user: MiniUser;
}

const SendMessage: React.FC<SendMessageProps> = ({ user }) => {
  const messageContent = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string | null>(null);

  function sendMessage(event: React.FormEvent) {
    event.preventDefault();

    const message = {
      to: user?.uid,
      content: messageContent.current?.value!
    };

    if (message.content.length <= 5 || message.content.length >= 500)
      return setError('يجب أن تحتوي الرسالة على 5 إلى 500 حرف');

    const sendMessage = functions.httpsCallable('sendMessage');
    sendMessage(message)
      .then(() => {
        setError(null);
        messageContent.current?.form?.reset();
      })
      .catch(err => {
        console.dir(err);
        setError(err.message ?? 'حدثت مشكلة ما');
      });
  }

  return (
    <Card body className="mb-2">
      <Card.Title>
        <h4>كتابة رسالة</h4>
      </Card.Title>
      <Card.Subtitle className="text-muted mb-3">
        لن يعرف {user?.displayName} أنك من أرسلها
      </Card.Subtitle>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Form onSubmit={sendMessage}>
        <Form.Group className="mb-2">
          <Form.Control
            as="textarea"
            style={{ minHeight: 150 }}
            ref={messageContent}
            placeholder="اكتب رسالتك هنا"
          />
        </Form.Group>

        <Button type="submit">إرسال</Button>
      </Form>
    </Card>
  );
};

export default SendMessage;
