import { Card } from 'react-bootstrap';

import MiniUser from '../types/MiniUser';
import UserPhoto from './UserPhoto';
import VerifiedIcon from './VerifiedIcon';

export interface UserDetailsProps {
  user: MiniUser;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  return (
    <div className="d-flex align-items-center flex-grow-1">
      <UserPhoto url={user.photoURL} displayName={user.displayName} size={55} />

      <div className="mr-3">
        <Card.Title>
          <h5>
            {user.displayName ?? 'مستخدم فضفضة'}
            {user.verified && (
              <VerifiedIcon size="18px" className="text-primary mr-2" />
            )}
          </h5>
        </Card.Title>
        {user.username && (
          <Card.Subtitle className="text-muted">@{user.username}</Card.Subtitle>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
