import { useState, useEffect, useRef } from 'react';
import Moment from 'react-moment';
import { Dropdown } from 'react-bootstrap';
import {
  FaUserLock,
  FaEllipsisV,
  FaQuestionCircle,
  FaTrashAlt
} from 'react-icons/fa';
import type { Timestamp } from '@firebase/firestore-types';

import Message from '../../types/Message';
import Block from '../Block';
import StaticLoveButton from './StaticLoveButton';
import LoveButton from './LoveButton';
import { db, functions } from '../../config/firebase';
import { useAlertMessage } from '../../contexts/AlertMessageContext';

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

export interface MessageFooterProps {
  message: Message<Timestamp>;
  outbox?: boolean;
  onDelete: (id: string) => void;
}

const MessageFooter: React.FC<MessageFooterProps> = ({
  message,
  outbox,
  onDelete
}) => {
  const [love, setLove] = useState(message.love);
  const firstRender = useRef(true);

  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    if (firstRender.current) firstRender.current = false;
    else {
      db.collection('messages').doc(message.id).update({ love });
    }
  });

  const handleDelete = () => {
    onDelete(message.id);
    db.collection('messages').doc(message.id).delete();
  };

  const handleWhoRequest = async () => {
    try {
      const result = await sendWhoRequest(message.id);
      if (result) {
        showAlertMessage('تم إرسال طلب معرفة المرسل إلى صاحب الرسالة');
      }
    } catch (err) {
      showAlertMessage(
        err.code.toLowerCase() !== 'internal' ? err.message : 'حدثت مشكلة ما'
      );
    }
  };

  return (
    <div className="d-flex justify-content-between position-relative">
      <Moment
        locale="ar"
        fromNow
        className="text-muted"
        style={{ position: 'relative', top: 4 }}
      >
        {message.createdAt.toDate()}
      </Moment>

      {outbox ? (
        <StaticLoveButton love={love} />
      ) : (
        <LoveButton love={love} onLove={setLove} />
      )}

      <Dropdown drop="right">
        <Dropdown.Toggle variant="text-dark" aria-label="خيارات">
          <FaEllipsisV size="0.9em" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {!outbox && (
            <>
              <Block
                activator={BlockActivator}
                id={message.id}
                type="messageId"
              />
              {!message.from && (
                <Dropdown.Item
                  className="d-inline-flex"
                  onClick={() => handleWhoRequest()}
                >
                  <p className="ml-auto mb-0">من المرسل ؟</p>
                  <FaQuestionCircle size="0.9em" />
                </Dropdown.Item>
              )}
            </>
          )}
          <Dropdown.Item className="d-inline-flex" onClick={handleDelete}>
            <p className="ml-auto mb-0">حذف</p>
            <FaTrashAlt size="0.9em" />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default MessageFooter;
