import * as React from 'react';
import { Button, Card } from 'react-bootstrap';
import IWhoRequest from '../types/WhoRequest';
import UserPhoto from './UserPhoto';

export interface WhoRequestProps extends IWhoRequest {}

const WhoRequest: React.FC<WhoRequestProps> = ({ message, from }) => {
  return (
    <Card>
      <Card.Body className="d-flex flex-wrap py-3">
        <div className="d-flex flex-grow-1">
          <UserPhoto url={from.photoURL} displayName={from.displayName} size={40} />

          <div className="flex-grow-1 mr-2">
            <p className="text-muted mb-n1" style={{ fontSize: '0.9rem' }}>يريد {from.displayName ?? 'مستخدم فضفضة'} أن يعرف من تكون على الرسالة</p>
            <p className="mb-0">
              {message.content}
            </p>
          </div>
        </div>

        <div className="mt-1 align-self-end mr-auto">
          <Button className="ml-1" size="sm">
            قبول
          </Button>
          <Button variant="text-dark" size="sm">
            رفض
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default WhoRequest;
