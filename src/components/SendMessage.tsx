import * as React from 'react';
import { useRef } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { db } from '../config/firebase';
import { firestore } from 'firebase/app';
import 'firebase/firestore';
import MiniUser from '../types/MiniUser';
import Message from '../types/Message';

export interface SendMessageProps {
  user: MiniUser;
}

const SendMessage: React.FC<SendMessageProps> = ({ user }) => {
  const messageContent = useRef<HTMLTextAreaElement>(null);
  function sendMessage(event: React.FormEvent) {
    event.preventDefault();

    const message: Message<firestore.FieldValue> = {
      to: user?.uid,
      love: false,
      content: messageContent.current?.value!,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    db.collection('messages')
      .add(message)
      .then(() => {
        // Do something
      })
      .catch(err => {
        // Do something
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

      {/* {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )} */}

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
