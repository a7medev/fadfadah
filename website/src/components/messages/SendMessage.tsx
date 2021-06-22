import { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { MdSend } from 'react-icons/md';
import TextareaAutosize from 'react-textarea-autosize';
import { v4 as uuid } from 'uuid';

import type MiniUser from '../../types/MiniUser';
import type CreateMessagePayload from '../../types/CreateMessagePayload';
import SendRecording from './SendRecording';
import { useAlertMessage } from '../../contexts/AlertMessageContext';
import { useAuth } from '../../contexts/AuthContext';
import { analytics, functions, storage } from '../../config/firebase';
import getBlobFile from '../../utils/getFileBlob';
import styles from './SendMessage.module.css';

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

  const send = (message: CreateMessagePayload) => {
    if (!isAnonymous && currentUser) message.from = currentUser?.uid;

    setIsLoading(true);

    const sendMessage = functions.httpsCallable('sendMessage');

    sendMessage(message)
      .then(() => {
        setError(null);
        setContent('');
        showAlertMessage('تم إرسال الرسالة بنجاح');
        analytics.logEvent('send_message');
        setTimeout(() => {
          window.location.href = 'https://phaurtuh.net/4/4327150';
        }, 1000);
      })
      .catch(err => {
        console.dir(err);
        setError(
          err.code.toLowerCase() !== 'internal' ? err.message : 'حدثت مشكلة ما'
        );
      })
      .finally(() => setIsLoading(false));
  };

  const handleSendRecording = async (url: string) => {
    const file = await getBlobFile(url);
    const filePath = `${user.uid}/recordings/${uuid()}.webm`;
    const fileRef = storage.ref(filePath);

    try {
      await fileRef.put(file);

      const message = {
        to: user.uid,
        recording: filePath,
        isAnonymous
      };

      send(message);
    } catch (err) {
      setError('حدثت مشكلة ما');
      setIsLoading(false);
    }
  };

  const handleSendText = (event: React.FormEvent) => {
    event.preventDefault();

    const message = {
      to: user.uid,
      content,
      isAnonymous
    };

    if (
      message.content.trim().length < 5 ||
      message.content.trim().length > 500
    ) {
      return setError('يجب أن تحتوي الرسالة على 5 إلى 500 حرف');
    }

    send(message);
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

      <Form onSubmit={handleSendText}>
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
            <SendRecording onSend={handleSendRecording} />
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
