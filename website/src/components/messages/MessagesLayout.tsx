import { Col } from 'react-bootstrap';
import Masonry from 'react-masonry-component';

import Message from '../../types/Message';
import TextMessageCard from './TextMessageCard';
import OutboxIcon from '../icons/OutboxIcon';
import InboxIcon from '../icons/InboxIcon';
import styles from './MessagesLayout.module.css';
import RecordingMessageCard from './RecordingMessageCard';

export interface MessagesLayoutProps {
  messages: Message[];
  onMessageDelete: (id: string) => void;
  outbox?: boolean;
}

const MessagesLayout: React.FC<MessagesLayoutProps> = ({
  messages,
  onMessageDelete,
  outbox
}) => {
  return messages.length ? (
    <Masonry
      options={{ originLeft: false }}
      style={{ marginLeft: -15, marginRight: -15 }}
    >
      {messages.map(message => (
        <Col xs="12" md="6" lg="4" key={message.id}>
          {message.recording ? (
            <RecordingMessageCard
              message={message}
              outbox={outbox}
              onDelete={onMessageDelete}
            />
          ) : (
            <TextMessageCard
              message={message}
              outbox={outbox}
              onDelete={onMessageDelete}
            />
          )}
        </Col>
      ))}
    </Masonry>
  ) : (
    <div className="d-flex flex-column justify-content-center align-items-center">
      {outbox ? (
        <OutboxIcon size={50} className={styles.noMessagesIcon} />
      ) : (
        <InboxIcon size={50} className={styles.noMessagesIcon} />
      )}

      <h5 className="mt-2 text-muted">لا يوجد رسائل</h5>
    </div>
  );
};

export default MessagesLayout;
