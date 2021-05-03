import { Card } from 'react-bootstrap';
import { motion, Variants } from 'framer-motion';
import { Emojione as Emoji } from 'react-emoji-render';
import type { Timestamp } from '@firebase/firestore-types';

import type Message from '../../types/Message';
import MessageHeader from './MessageHeader';
import MessageFooter from './MessageFooter';

export interface MessageCardProps {
  message: Message<Timestamp>;
  outbox?: boolean;
  onDelete: (id: string) => void;
}

const fadeVariants: Variants = {
  out: { opacity: 0 },
  in: { opacity: 1 }
};

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  outbox,
  onDelete
}) => {
  return (
    <motion.div initial="out" animate="in" variants={fadeVariants}>
      <Card className="mb-3" id={message.id}>
        <Card.Body className={`pb-2 ${message.from || outbox ? 'pt-2' : ''}`}>
          <MessageHeader message={message} outbox={outbox} />

          <p style={{ fontSize: 18, whiteSpace: 'pre-line' }}>
            <Emoji text={message.content} />
          </p>

          <hr className="mb-2" />

          <MessageFooter
            message={message}
            outbox={outbox}
            onDelete={onDelete}
          />
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default MessageCard;
