import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Message from '../types/Message';
import { Card } from 'react-bootstrap';
import { Timestamp } from '@firebase/firestore-types';
import Moment from 'react-moment';
import LoveButton from './LoveButton';
import { db } from '../config/firebase';

export interface MessageCardProps extends Message<Timestamp> {}

const MessageCard: React.FC<MessageCardProps> = ({
  id,
  content,
  createdAt,
  love: initialLove
}) => {
  const [love, setLove] = useState(initialLove);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current)
      firstRender.current = false;
    else {
      db.collection('messages')
        .doc(id)
        .update({ love });
    }
  }, [id, love]);

  return (
    <Card body className="mb-4">
      <p style={{ fontSize: 20 }}>{content}</p>
      <hr />
      <div className="d-flex justify-content-between">
        <Moment locale="ar" fromNow className="text-muted">
          {createdAt.toDate()}
        </Moment>

        <LoveButton love={love} setLove={setLove} />
      </div>
    </Card>
  );
};

export default MessageCard;
