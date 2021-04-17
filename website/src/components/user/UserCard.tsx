import { Card, Dropdown } from 'react-bootstrap';
import { FaShare, FaEllipsisV, FaUserLock } from 'react-icons/fa';

import MiniUser from '../../types/MiniUser';
import Share from '../Share';
import Block from '../Block';
import UserDetails from './UserDetails';
import { useAuth } from '../../contexts/AuthContext';

export interface ShareActivatorProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const ShareActivator: React.FC<ShareActivatorProps> = ({ setShow }) => (
  <Dropdown.Item className="d-inline-flex" onClick={() => setShow(true)}>
    <p className="ml-auto mb-0">مشاركة</p>
    <FaShare size="0.9em" />
  </Dropdown.Item>
);

export interface BlockActivatorProps {
  block: () => void;
}
const BlockActivator: React.FC<BlockActivatorProps> = ({ block }) => (
  <Dropdown.Item className="d-inline-flex" onClick={() => block()}>
    <p className="ml-auto mb-0">حظر</p>
    <FaUserLock size="0.9em" />
  </Dropdown.Item>
);

export interface UserCardProps {
  user: MiniUser;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const link = 'https://share.fadfadah.me/u/' + user.username;

  const { user: currentUser } = useAuth();

  return (
    <Card className="mb-2">
      <Card.Body className="d-flex user-data">
        <UserDetails user={user} />

        <Dropdown>
          <Dropdown.Toggle variant="text-dark" aria-label="خيارات">
            <FaEllipsisV size="0.9em" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Share activator={ShareActivator} link={link} />
            {currentUser && user.username !== currentUser.username && (
              <Block
                activator={BlockActivator}
                id={user.username ?? ''}
                type="username"
              />
            )}
          </Dropdown.Menu>
        </Dropdown>
      </Card.Body>
    </Card>
  );
};

export default UserCard;
