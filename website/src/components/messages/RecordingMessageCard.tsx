import Message from '../../types/Message';
import AudioPlayer from '../audio/AudioPlayer';
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
    <MessageContainer message={message} outbox={outbox} onDelete={onDelete}>
      {/* <audio src={message.recordingURL} controls /> */}
      <AudioPlayer url={message.recordingURL} />
    </MessageContainer>
  );
};

export default RecordingMessageCard;
