import { useEffect, useState } from 'react';

import Message from '../../types/Message';
import AudioPlayer from '../audio/AudioPlayer';
import MessageContainer from './MessageContainer';
import { storage } from '../../config/firebase';

export interface RecordingMessageCardProps {
  message: Message;
  outbox?: boolean;
  onDelete: (id: string) => void;
}

const RecordingMessageCard: React.FC<RecordingMessageCardProps> = ({
  message,
  outbox,
  onDelete
}) => {
  const [recordingURL, setRecordingURL] = useState('');

  useEffect(() => {
    storage
      .ref(message.recording)
      .getDownloadURL()
      .then(setRecordingURL)
      .catch(() => setRecordingURL(''));
  }, [message.recording]);

  if (!recordingURL) {
    return null;
  }

  return (
    <MessageContainer message={message} outbox={outbox} onDelete={onDelete}>
      <AudioPlayer url={message.recording} />
    </MessageContainer>
  );
};

export default RecordingMessageCard;
