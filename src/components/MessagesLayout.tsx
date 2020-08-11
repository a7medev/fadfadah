import * as React from 'react';
import { Col } from 'react-bootstrap';
import Masonry from 'react-masonry-component';
import Message from '../types/Message';
import MessageCard from './MessageCard';
import { Timestamp } from '@firebase/firestore-types';

export interface MessagesLayoutProps {
  messages: Message<Timestamp>[];
}

const MessagesLayout: React.FC<MessagesLayoutProps> = ({ messages }) => {
  return (
    <Masonry
      options={{ originLeft: false }}
      style={{ marginLeft: -15, marginRight: -15 }}
    >
      {messages.map(message => (
        <Col xs="12" md="6" lg="4" className="mb-4" key={message.id}>
          <MessageCard {...message} />
        </Col>
      ))}
    </Masonry>
  );
};

export default MessagesLayout;
