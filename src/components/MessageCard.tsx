import * as React from 'react';
import Message from '../types/Message';
import { Card } from 'react-bootstrap';
import { Timestamp } from '@firebase/firestore-types';
import Moment from 'react-moment';
import LoveButton from './LoveButton';

export interface MessageCardProps extends Message<Timestamp> {}

const MessageCard: React.FC<MessageCardProps> = ({
  content,
  createdAt,
  love
}) => {
  return (
    <Card body className="mb-4">
      <p style={{ fontSize: 20 }}>{content}</p>
      <hr />
      <div className="d-flex justify-content-between">
        <Moment locale="ar" fromNow className="text-muted">
          {createdAt.toDate()}
        </Moment>

        <LoveButton love={love} />
      </div>
    </Card>
  );
};

export default MessageCard;
