import { Card } from 'react-bootstrap';
import { Emojione as Emoji } from 'react-emoji-render';
import type { Timestamp } from '@firebase/firestore-types';

import type Message from '../../types/Message';
import MessageHeader from './MessageHeader';
import MessageFooter from './MessageFooter';
import FadeTransition from '../FadeTransition';
import styles from './MessageCard.module.css';

export interface MessageCardProps {
  message: Message<Timestamp>;
  outbox?: boolean;
  onDelete: (id: string) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  outbox,
  onDelete
}) => {
  return (
    <FadeTransition>
      <Card className="mb-3" id={message.id}>
        <Card.Body className={`pb-2 ${message.from || outbox ? 'pt-2' : ''}`}>
          <MessageHeader message={message} outbox={outbox} />

          <p className={styles.messageText}>
            <Emoji text={message.content} />
          </p>

          <MessageFooter
            message={message}
            outbox={outbox}
            onDelete={onDelete}
          />
        </Card.Body>
      </Card>
    </FadeTransition>
  );
};

export default MessageCard;
