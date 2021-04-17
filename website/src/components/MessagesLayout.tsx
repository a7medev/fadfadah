import { Col } from 'react-bootstrap';
import Masonry from 'react-masonry-component';
import type { Timestamp } from '@firebase/firestore-types';

import Message from '../types/Message';
import MessageCard from './MessageCard';
import OutboxIcon from './icons/OutboxIcon';
import InboxIcon from './icons/InboxIcon';
import styles from './MessagesLayout.module.css';

export interface MessagesLayoutProps {
  messages: Message<Timestamp>[];
  removeMessage: (id: string) => void;
  isOutbox?: boolean;
}

const MessagesLayout: React.FC<MessagesLayoutProps> = ({
  messages,
  removeMessage,
  isOutbox
}) => {
  return messages.length ? (
    <Masonry
      options={{ originLeft: false }}
      style={{ marginLeft: -15, marginRight: -15 }}
    >
      {messages.map(message => (
        <Col xs="12" md="6" lg="4" key={message.id}>
          <MessageCard
            {...message}
            outbox={isOutbox}
            removeMessage={removeMessage}
          />
        </Col>
      ))}
    </Masonry>
  ) : (
    <div className="d-flex flex-column justify-content-center align-items-center">
      {isOutbox ? (
        <OutboxIcon size={50} className={styles.noMessagesIcon} />
      ) : (
        <InboxIcon size={50} className={styles.noMessagesIcon} />
      )}

      <h5 className="mt-2 text-muted">لا يوجد رسائل</h5>
    </div>
  );
};

export default MessagesLayout;
