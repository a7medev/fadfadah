import { useState, useRef } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';

import MiniUser from '../../types/MiniUser';
import CreateMessageDto from '../../types/CreateMessageDto';
import { useAlertMessage } from '../../contexts/AlertMessageContext';
import { useAuth } from '../../contexts/AuthContext';
import { functions } from '../../config/firebase';

export interface SendMessageProps {
  user: MiniUser;
}

const SendMessage: React.FC<SendMessageProps> = ({ user }) => {
  const messageContent = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string | null>(null);

  const { showAlertMessage } = useAlertMessage();

  const { user: currentUser, signedIn } = useAuth();

  const [isAnonymous, setIsAnonymous] = useState(true);

  const sendButton = useRef<HTMLButtonElement>(null);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();

    const message: CreateMessageDto = {
      to: user.uid,
      content: messageContent.current?.value!,
      isAnonymous
    };

    if (!isAnonymous && currentUser) message.from = currentUser?.uid;

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
        showAlertMessage('تم إرسال الرسالة بنجاح');
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
      });
  };

  return (
    <Card body className="mb-2">
      <Card.Title>
        <h4>كتابة رسالة</h4>
      </Card.Title>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Form onSubmit={sendMessage}>
        <Form.Group className="mb-2">
          <Form.Control
            as={TextareaAutosize}
            minRows={5}
            ref={messageContent}
            placeholder="اكتب رسالتك هنا"
          />
        </Form.Group>

        {signedIn && (
          <Form.Group>
            <Form.Switch
              id="is-anonymous-switch"
              checked={isAnonymous}
              onChange={() => setIsAnonymous(prev => !prev)}
              label="رسالة مجهولة المصدر"
            />
          </Form.Group>
        )}

        <Button type="submit" ref={sendButton}>
          إرسال
        </Button>
      </Form>
    </Card>
  );
};

export default SendMessage;
