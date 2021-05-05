import { Emojione as Emoji } from 'react-emoji-render';

import type Message from '../../types/Message';
import MessageContainer from './MessageContainer';
import styles from './MessageCard.module.css';

export interface MessageCardProps {
  message: Message;
  outbox?: boolean;
  onDelete: (id: string) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  outbox,
  onDelete
}) => {
  return (
    <MessageContainer message={message} outbox={outbox} onDelete={onDelete}>
      <p className={styles.messageText}>
        <Emoji text={message.content} />
      </p>
    </MessageContainer>
  );
};

export default MessageCard;
