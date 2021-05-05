import { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { MdSend } from 'react-icons/md';
import TextareaAutosize from 'react-textarea-autosize';

import MiniUser from '../../types/MiniUser';
import CreateMessageDto from '../../types/CreateMessageDto';
import { useAlertMessage } from '../../contexts/AlertMessageContext';
import { useAuth } from '../../contexts/AuthContext';
import { functions } from '../../config/firebase';
import styles from './SendMessage.module.css';
import SendRecording from './SendRecording';

export interface SendMessageProps {
  user: MiniUser;
}

const SendMessage: React.FC<SendMessageProps> = ({ user }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);

  const { showAlertMessage } = useAlertMessage();
  const { user: currentUser, signedIn } = useAuth();

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
    ) {
      return setError('يجب أن تحتوي الرسالة على 5 إلى 500 حرف');
    }

    setIsLoading(true);

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
      .finally(() => setIsLoading(false));
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
        <div className="d-flex align-items-end mb-2">
          <Form.Group className="m-0 ml-2 flex-grow-1">
            <Form.Control
              as={TextareaAutosize}
              value={content}
              onChange={e => setContent(e.target.value)}
              minRows={1}
              placeholder="اكتب رسالتك هنا"
            />
          </Form.Group>
          {content ? (
            <Button type="submit" className="fab" disabled={isLoading}>
              <MdSend size={20} className={styles.sendButton} />
            </Button>
          ) : (
            <SendRecording onSend={() => {}} />
          )}
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
