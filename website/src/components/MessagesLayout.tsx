import React from 'react';
import { Col } from 'react-bootstrap';
import Masonry from 'react-masonry-component';
import type { Timestamp } from '@firebase/firestore-types';

import Message from '../types/Message';
import MessageCard from './MessageCard';
import NoMessages from './NoMessagesIcon';

export interface MessagesLayoutProps {
  messages: Message<Timestamp>[];
  removeMessage: (id: string) => void;
  outbox?: boolean;
}

const MessagesLayout: React.FC<MessagesLayoutProps> = ({
  messages,
  removeMessage,
  outbox
}) => {
  return messages.length ? (
    <Masonry
      options={{ originLeft: false }}
      style={{ marginLeft: -15, marginRight: -15 }}
    >
      {messages.map(message => (
        <Col xs="12" md="6" lg="4" key={message.id}>
          <MessageCard {...message} outbox={outbox} removeMessage={removeMessage} />
        </Col>
      ))}
    </Masonry>
  ) : (
    <NoMessages />
  );
};

export default MessagesLayout;
