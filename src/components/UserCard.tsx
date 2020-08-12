import * as React from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import VerifiedIcon from './icons/Verified';
import MiniUser from '../types/MiniUser';
import Share from './Share';

export interface ShareActivatorProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShareActivator: React.FC<ShareActivatorProps> = ({ setShow }) => (
  <Dropdown.Item onClick={() => setShow(true)}>مشاركة</Dropdown.Item>
);

export interface UserCardProps {
  user: MiniUser;
  username: string;
}

const UserCard: React.FC<UserCardProps> = ({ user, username }) => {
  const { protocol, host } = window.location;
  const link = `${protocol}//${host}/u/${username}`;

  return (
    <Card className="mb-2">
      <Card.Body className="d-flex user-data">
        <div className="d-flex align-items-center flex-grow-1">
          <img
            src={user.photoURL}
            alt={user.displayName ?? 'لا يوجد اسم'}
            className="rounded-circle border"
            style={{ width: 64, height: 64 }}
          />
          <div className="mr-3">
            <Card.Title>
              <h4>
                {user.displayName ?? 'لا يوجد اسم'}
                {user.verified && (
                  <VerifiedIcon size="20px" className="text-primary mr-2" />
                )}
              </h4>
            </Card.Title>
            <Card.Subtitle className="text-muted">@{username}</Card.Subtitle>
          </div>
        </div>

        <Dropdown>
          <Dropdown.Toggle variant="text-dark"></Dropdown.Toggle>

          <Dropdown.Menu>
            <Share activator={ShareActivator} link={link} />
          </Dropdown.Menu>
        </Dropdown>
      </Card.Body>
    </Card>
  );
};

export default UserCard;
