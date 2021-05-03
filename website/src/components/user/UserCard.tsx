import { Card, Dropdown } from 'react-bootstrap';
import { FaShare, FaEllipsisV, FaUserLock } from 'react-icons/fa';

import MiniUser from '../../types/MiniUser';
import Share from '../Share';
import UserDetails from './UserDetails';
import useBlock from '../../hooks/useBlock';
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

export interface UserCardProps {
  user: MiniUser;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const link = 'https://share.fadfadah.me/u/' + user.username;

  const { user: currentUser } = useAuth();

  const block = useBlock();
  const handleBlock = () => {
    if (!user.username) return;
    block({ id: user.username, type: 'username' });
  };

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
              <Dropdown.Item className="d-inline-flex" onClick={handleBlock}>
                <p className="ml-auto mb-0">حظر</p>
                <FaUserLock size="0.9em" />
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </Card.Body>
    </Card>
  );
};

export default UserCard;
