import * as React from 'react';
import { Col } from 'react-bootstrap';
import Masonry from 'react-masonry-component';
import Message from '../types/Message';
import MessageCard from './MessageCard';
import NoMessages from './icons/NoMessages';

export interface MessagesLayoutProps {
  // TODO: Change the `any` type
  messages: Message<any>[];
  outbox?: boolean;
}

const MessagesLayout: React.FC<MessagesLayoutProps> = ({
  messages,
  outbox
}) => {
  return messages.length ? (
    <Masonry
      options={{ originLeft: false }}
      style={{ marginLeft: -15, marginRight: -15 }}
    >
      {messages.map(message => (
        <Col xs="12" md="6" lg="4" key={message.id}>
          <MessageCard {...message} outbox={outbox} />
        </Col>
      ))}
    </Masonry>
  ) : (
    <NoMessages />
  );
};

export default MessagesLayout;
