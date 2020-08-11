import * as React from 'react';
import { Card } from 'react-bootstrap';
import VerifiedIcon from './icons/Verified';
import MiniUser from '../types/MiniUser';

export interface UserCardProps {
  user: MiniUser;
  username: string;
}

const UserCard: React.FC<UserCardProps> = ({ user, username }) => {
  return (
    <Card body className="mb-2">
      <div className="d-flex align-items-center">
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
    </Card>
  );
};

export default UserCard;
