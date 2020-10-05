import * as React from 'react';
import { Button, Card } from 'react-bootstrap';
import IWhoRequest from '../types/WhoRequest';
import UserData from './UserData';
import { Emojione as Emoji } from 'react-emoji-render';

export interface WhoRequestProps extends IWhoRequest {}

const WhoRequest: React.FC<WhoRequestProps> = ({ message, from }) => {
  return (
    <Card>
      <Card.Body className="py-2">
        <UserData user={from} />
        <hr className="mt-2" />

        <p>
          <small className="mb-1 text-muted d-block">على الرسالة</small>
          <Emoji text={message.content} />
        </p>

        <hr className="mb-2" />

        <div className="d-flex justify-content-end">
          <Button className="ml-2">قبول</Button>
          <Button variant="text-dark">رفض</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default WhoRequest;
