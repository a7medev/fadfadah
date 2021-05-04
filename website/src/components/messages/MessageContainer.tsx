import { Card } from 'react-bootstrap';

import type Message from '../../types/Message';
import MessageHeader from './MessageHeader';
import MessageFooter from './MessageFooter';
import FadeTransition from '../FadeTransition';

export interface MessageContainerProps {
  message: Message;
  outbox?: boolean;
  onDelete: (id: string) => void;
}

const MessageContainer: React.FC<MessageContainerProps> = ({
  children,
  message,
  outbox,
  onDelete
}) => {
  return (
    <FadeTransition>
      <Card className="mb-3" id={message.id}>
        <Card.Body className={`pb-2 ${message.from || outbox ? 'pt-2' : ''}`}>
          <MessageHeader message={message} outbox={outbox} />

          {children}

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

export default MessageContainer;
