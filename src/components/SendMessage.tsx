import * as React from 'react';
import { useState, useRef } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { functions } from '../config/firebase';
import 'firebase/firestore';
import MiniUser from '../types/MiniUser';
import MessageBox from './MessageBox';

export interface SendMessageProps {
  user: MiniUser;
}

const SendMessage: React.FC<SendMessageProps> = ({ user }) => {
  const messageContent = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const sendButton = useRef<HTMLButtonElement>(null);

  function sendMessage(event: React.FormEvent) {
    event.preventDefault();
    
    const message = {
      to: user?.uid,
      content: messageContent.current?.value!
    };

    if (
      message.content.trim().length < 5 ||
      message.content.trim().length > 500
    )
      return setError('يجب أن تحتوي الرسالة على 5 إلى 500 حرف');

    sendButton.current!.disabled = true;
    const sendMessage = functions.httpsCallable('sendMessage');
    sendMessage(message)
      .then(() => {
        setError(null);
        setMessage('تم إرسال الرسالة بنجاح');
        messageContent.current?.form?.reset();
      })
      .catch(err => {
        console.dir(err);
        setError(
          err.code.toLowerCase() !== 'internal' ? err.message : 'حدثت مشكلة ما'
        );
      })
      .finally(() => {
        sendButton.current!.disabled = false;
      })
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

      <MessageBox
        show={!!message}
        onClose={() => setMessage(null)}
        title="رسالة من الموقع"
        text={message!}
      />

      <Form onSubmit={sendMessage}>
        <Form.Group className="mb-2">
          <Form.Control
            as="textarea"
            style={{ minHeight: 150 }}
            ref={messageContent}
            placeholder="اكتب رسالتك هنا"
          />
        </Form.Group>

        <Button type="submit" ref={sendButton}>إرسال</Button>
      </Form>
    </Card>
  );
};

export default SendMessage;
