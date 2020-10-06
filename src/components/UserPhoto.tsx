import * as React from 'react';
import { useState } from 'react';
import avatar from '../assets/images/avatar.svg';

export interface UserPhotoProps {
  url?: string;
  displayName?: string;
  size?: number;
}

const UserPhoto: React.FC<UserPhotoProps> = ({ url, displayName, size }) => {
  const [photo, setPhoto] = useState(url ? url : avatar);

  return (
    <img
      src={photo}
      onError={() => setPhoto(avatar)}
      alt={displayName ?? 'مستخدم فضفضة'}
      className="rounded-circle"
      style={{ width: size, height: size, objectFit: 'cover' }}
    />
  );
};

export default UserPhoto;
