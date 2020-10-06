import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Message from '../types/Message';
import { Card, Dropdown } from 'react-bootstrap';
import Moment from 'react-moment';
import LoveButton from './LoveButton';
import { db, functions } from '../config/firebase';
import { FaQuestionCircle, FaTrashAlt, FaUserLock, FaEllipsisV } from 'react-icons/fa';
import Block from './Block';
import StaticLoveButton from './StaticLoveButton';
import MessageBox from './MessageBox';
import { motion, Variants } from 'framer-motion';
import UserData from './UserData';
import { Emojione as Emoji } from 'react-emoji-render';

export interface BlockActivatorProps {
  block: () => void;
}
const BlockActivator: React.FC<BlockActivatorProps> = ({ block }) => (
  <Dropdown.Item className="d-inline-flex" onClick={() => block()}>
    <p className="ml-auto mb-0">حظر المرسل</p>
    <FaUserLock size="0.9em" />
  </Dropdown.Item>
);

const sendWhoRequest = functions.httpsCallable('sendWhoRequest');

export interface MessageCardProps extends Message<string> {
  removeMessage: (id: string) => void;
  outbox?: boolean;
}

const fadeVariants: Variants = {
  out: { opacity: 0 },
  in: { opacity: 1 }
};

const MessageCard: React.FC<MessageCardProps> = ({
  id,
  content,
  createdAt,
  from,
  to,
  love: initialLove,
  outbox,
  removeMessage
}) => {
  const [love, setLove] = useState(initialLove);
  const firstRender = useRef(true);

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (firstRender.current) firstRender.current = false;
    else {
      db.collection('messages').doc(id).update({ love });
    }
  }, [id, love]);

  function deleteMessage() {
    removeMessage(id!);
    db.collection('messages').doc(id).delete();
  }

  async function whoIsTheAuthor() {
    try {
      const result = await sendWhoRequest(id);
      if (result) setMessage('تم إرسال طلب معرفة المرسل إلى صاحب الرسالة');
    } catch (err) {
      setMessage(
        err.code.toLowerCase() !== 'internal' ? err.message : 'حدثت مشكلة ما'
      );
    }
  }

  return (
    <motion.div initial="out" animate="in" variants={fadeVariants}>
      <MessageBox
        title="رسالة من الموقع"
        text={message!}
        show={!!message}
        onClose={() => setMessage(null)}
      />
      <Card className="mb-3" id={id}>
        <Card.Body className={`pb-2 ${from || outbox ? 'pt-2' : ''}`}>
          {(from || outbox) && (
            <>
              {outbox && (
                <small className="mb-1 text-muted d-block">أرسلتها إلى</small>
              )}

              <UserData user={outbox ? to : from!} />

              <hr className="mt-2" />
            </>
          )}

          <p style={{ fontSize: 18, whiteSpace: 'pre-line' }}>
            <Emoji text={content} />
          </p>
          <hr className="mb-2" />
          <div className="d-flex justify-content-between position-relative">
            <Moment
              locale="ar"
              fromNow
              className="text-muted"
              style={{ position: 'relative', top: 4 }}
            >
              {createdAt}
            </Moment>

            {outbox ? (
              <StaticLoveButton love={love} />
            ) : (
              <LoveButton love={love} setLove={setLove} />
            )}

            <Dropdown drop="right">
              <Dropdown.Toggle variant="text-dark">
                <FaEllipsisV size="0.9em" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {!outbox && (
                  <>
                    <Block
                      activator={BlockActivator}
                      id={id!}
                      type="messageId"
                    />
                    {!from && (
                      <Dropdown.Item
                        className="d-inline-flex"
                        onClick={() => whoIsTheAuthor()}
                      >
                        <p className="ml-auto mb-0">من المرسل ؟</p>
                        <FaQuestionCircle size="0.9em" />
                      </Dropdown.Item>
                    )}
                  </>
                )}
                <Dropdown.Item
                  className="d-inline-flex"
                  onClick={deleteMessage}
                >
                  <p className="ml-auto mb-0">حذف</p>
                  <FaTrashAlt size="0.9em" />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default MessageCard;
