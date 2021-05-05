import { useState, useRef } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import { MdSend } from 'react-icons/md';

import MiniUser from '../../types/MiniUser';
import CreateMessageDto from '../../types/CreateMessageDto';
import { useAlertMessage } from '../../contexts/AlertMessageContext';
import { useAuth } from '../../contexts/AuthContext';
import { functions } from '../../config/firebase';
import styles from './SendMessage.module.css';

export interface SendMessageProps {
  user: MiniUser;
}

const SendMessage: React.FC<SendMessageProps> = ({ user }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { showAlertMessage } = useAlertMessage();

  const { user: currentUser, signedIn } = useAuth();

  const [isAnonymous, setIsAnonymous] = useState(true);

  const sendButton = useRef<HTMLButtonElement>(null);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();

    const message: CreateMessageDto = {
      to: user.uid,
      content,
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
        setContent('');
        showAlertMessage('تم إرسال الرسالة بنجاح');
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
        <h4>إرسال رسالة</h4>
      </Card.Title>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Form onSubmit={sendMessage}>
        <div className="d-flex align-items-start mb-2">
          <Form.Group className="m-0 ml-2 flex-grow-1 align-items-start">
            <Form.Control
              as={TextareaAutosize}
              value={content}
              onChange={e => setContent(e.target.value)}
              minRows={1}
              placeholder="اكتب رسالتك هنا"
            />
          </Form.Group>
          <Button type="submit" className="fab">
            <MdSend size={20} className={styles.sendButton} />
          </Button>
        </div>

        {signedIn && (
          <Form.Switch
            id="is-anonymous-switch"
            checked={isAnonymous}
            onChange={() => setIsAnonymous(prev => !prev)}
            label="رسالة مجهولة المصدر"
          />
        )}
      </Form>
    </Card>
  );
};

export default SendMessage;
