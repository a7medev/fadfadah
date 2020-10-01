import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Message from '../types/Message';
import { Button, Card, Dropdown } from 'react-bootstrap';
import { Timestamp } from '@firebase/firestore-types';
import Moment from 'react-moment';
import LoveButton from './LoveButton';
import { db, functions } from '../config/firebase';
import {
  BsThreeDotsVertical,
  BsFillPersonDashFill,
  BsFillQuestionCircleFill
} from 'react-icons/bs';
import { FiTrash2 } from 'react-icons/fi';
import Block from './Block';
import StaticLoveButton from './StaticLoveButton';
import MessageBox from './MessageBox';
import { motion, Variants } from 'framer-motion';
import MiniUser from '../types/MiniUser';
import UserData from './UserData';

export interface BlockActivatorProps {
  block: () => void;
}
const BlockActivator: React.FC<BlockActivatorProps> = ({ block }) => (
  <Dropdown.Item className="d-inline-flex" onClick={() => block()}>
    <p className="ml-auto mb-0">حظر المرسل</p>
    <BsFillPersonDashFill size="1.2em" />
  </Dropdown.Item>
);

const sendWhoRequest = functions.httpsCallable('sendWhoRequest');
const getUserData = functions.httpsCallable('getUserData');

export interface MessageCardProps extends Message<Timestamp> {
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
  love: initialLove,
  outbox
}) => {
  const [love, setLove] = useState(initialLove);
  const firstRender = useRef(true);

  const [message, setMessage] = useState<string | null>(null);

  const [author, setAuthor] = useState<MiniUser | null>(null);
  const getAuthorButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (firstRender.current) firstRender.current = false;
    else {
      db.collection('messages').doc(id).update({ love });
    }
  }, [id, love]);

  function deleteMessage() {
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
  

  async function getAuthor() {
    getAuthorButton.current!.disabled = true;

    try {
      const author = await getUserData({ id: from, type: 'uid' });
      setAuthor(author.data);
    } catch (err) {
      setMessage(
        err.code.toLowerCase() !== 'internal' ? err.message : 'حدثت مشكلة ما'
      );
    } finally {
      getAuthorButton.current!.disabled = false;
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
        <Card.Body className={`pb-2 ${from ? 'pt-2' : ''}`}>
          {from && (
            <>
              {author ? (
                <UserData user={author} />
              ) : (
                <div className="d-flex align-items-center justify-content-between">
                  <i className="text-muted">مُرسل هذه الرسالة معروف</i>

                  <Button
                    variant="text-dark"
                    size="sm"
                    ref={getAuthorButton}
                    onClick={() => getAuthor()}
                  >
                    إظهار المرسل
                  </Button>
                </div>
              )}
              <hr className="mt-2" />
            </>
          )}

          <p style={{ fontSize: 18, whiteSpace: 'pre-line' }}>{content}</p>
          <hr className="mb-2" />
          <div className="d-flex justify-content-between position-relative">
            <Moment
              locale="ar"
              fromNow
              className="text-muted"
              style={{ position: 'relative', top: 4 }}
            >
              {createdAt.toDate()}
            </Moment>

            {outbox ? (
              <StaticLoveButton love={love} />
            ) : (
              <LoveButton love={love} setLove={setLove} />
            )}

            <Dropdown drop="right">
              <Dropdown.Toggle variant="text-dark">
                <BsThreeDotsVertical size="1em" />
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
                        <BsFillQuestionCircleFill size="1.2em" />
                      </Dropdown.Item>
                    )}
                  </>
                )}
                <Dropdown.Item
                  className="d-inline-flex"
                  onClick={deleteMessage}
                >
                  <p className="ml-auto mb-0">حذف</p>
                  <FiTrash2 size="1.2em" />
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
