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
  return messages.length ? (
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
    ) : (
      <p className="h1 text-center text-muted my-4">لا يوجد رسائل</p>
    );
};

export default MessagesLayout;
