import Message from '../../types/Message';
import MessageContainer from './MessageContainer';

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
  return (
    <MessageContainer
      message={message}
      outbox={outbox}
      onDelete={onDelete}
    >
      <audio src={message.recordingURL} controls />
    </MessageContainer>
  );
};

export default RecordingMessageCard;
