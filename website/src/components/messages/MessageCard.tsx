import { useState } from 'react';
import { Card } from 'react-bootstrap';
import { motion, Variants } from 'framer-motion';
import { Emojione as Emoji } from 'react-emoji-render';
import type { Timestamp } from '@firebase/firestore-types';

import Message from '../../types/Message';
import MessageBox from '../MessageBox';
import MessageFooter from './MessageFooter';
import UserData from '../user/UserData';

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
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  return (
    <motion.div initial="out" animate="in" variants={fadeVariants}>
      <MessageBox
        title="رسالة من الموقع"
        text={alertMessage!}
        show={!!message}
        onClose={() => setAlertMessage(null)}
      />
      <Card className="mb-3" id={message.id}>
        <Card.Body className={`pb-2 ${message.from || outbox ? 'pt-2' : ''}`}>
          {(message.from || outbox) && (
            <>
              {outbox && (
                <small className="mb-1 text-muted d-block">
                  أرسلتها إلى
                </small>
              )}

              <UserData user={outbox ? message.to : message.from!} />

              <hr className="mt-2" />
            </>
          )}

          <p style={{ fontSize: 18, whiteSpace: 'pre-line' }}>
            <Emoji text={message.content} />
          </p>

          <hr className="mb-2" />

          <MessageFooter
            message={message}
            outbox={outbox}
            onDelete={onDelete}
            onAlertMessage={setAlertMessage}
          />
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default MessageCard;
