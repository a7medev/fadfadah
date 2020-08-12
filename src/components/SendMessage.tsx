import * as React from 'react';
import { useState, useRef, useContext } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { db, messages } from '../config/firebase';
import { firestore } from 'firebase/app';
import 'firebase/firestore';
import MiniUser from '../types/MiniUser';
import Message from '../types/Message';
import { AuthContext } from '../store/AuthContext';

export interface SendMessageProps {
  user: MiniUser;
}

const SendMessage: React.FC<SendMessageProps> = ({ user }) => {
  const messageContent = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useContext(AuthContext)!;

  function sendMessage(event: React.FormEvent) {
    event.preventDefault();

    const message: Message<firestore.FieldValue> = {
      to: user?.uid,
      from: currentUser?.uid ?? null,
      love: false,
      allowRead: false,
      content: messageContent.current?.value!,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    if (message.content.length <= 5 || message.content.length >= 500)
      return setError('يجب أن تحتوي الرسالة على 5 إلى 500 حرف')

    db.collection('messages')
      .add(message)
      .then(() => {
        setError(null);
        messageContent.current?.form?.reset();
      })
      .catch(err => {
        console.log('HERE', err.code);
        // @ts-ignore
        setError(messages[err.code]);
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
