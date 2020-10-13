import * as React from 'react';
import MiniUser from '../types/MiniUser';
import VerifiedIcon from './icons/Verified';
import { navigate } from '@reach/router';
import UserPhoto from './UserPhoto';

export interface UserDataProps {
  user: MiniUser;
}

const UserData: React.FC<UserDataProps> = ({ user }) => {
  return (
    <div className="d-flex align-items-center" onClick={user.username ? () => navigate(`/u/${user.username}`) : undefined}>
      <UserPhoto url={user.photoURL} displayName={user.displayName} size={40} />
      <div className="flex-grow-1 mr-2">
        <p className="mb-n1">
          {user.displayName ?? 'مستخدم فضفضة'}
          {user.verified && (
            <VerifiedIcon size="14px" className="text-primary mr-1" />
          )}
        </p>
        {user.username && (
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            @{user.username}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserData;
