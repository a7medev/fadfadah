import * as React from 'react';
import { useState } from 'react';
import MiniUser from '../types/MiniUser';
import avatar from '../assets/images/avatar.svg';
import VerifiedIcon from './icons/Verified';
import { useHistory } from 'react-router-dom';

export interface UserDataProps {
  user: MiniUser;
}

const UserData: React.FC<UserDataProps> = ({ user }) => {
  const [photo, setPhoto] = useState(user.photoURL ? user.photoURL : avatar);
  const history = useHistory();

  return (
    <div className="d-flex align-items-center" onClick={user.username ? () => history.push(`/u/${user.username}`) : undefined}>
      <img
        src={photo}
        onError={() => setPhoto(avatar)}
        alt={user.displayName ?? 'لا يوجد اسم'}
        className="rounded-circle"
        style={{ width: 40, height: 40, objectFit: 'cover' }}
      />
      <div className="flex-grow-1 mr-2">
        <p className="mb-n1">
          {user.displayName ?? 'لا يوجد اسم'}
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
