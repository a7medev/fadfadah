import * as React from 'react';
import Message from '../types/Message';
import { Card } from 'react-bootstrap';
import { Timestamp } from '@firebase/firestore-types';
import Moment from 'react-moment';

export interface MessageCardProps extends Message<Timestamp> {}

const MessageCard: React.FC<MessageCardProps> = ({
  content,
  createdAt,
  love
}) => {
  return (
    <Card body className="mb-4">
      <p style={{ fontSize: 22 }}>{content}</p>
      <hr />
      <Moment locale="ar" fromNow className="text-muted">
        {createdAt.toDate()}
      </Moment>
    </Card>
  );
};

export default MessageCard;
