import { Button, Card, Dropdown } from 'react-bootstrap';
import { FaEllipsisV, FaShareAlt, FaUserLock } from 'react-icons/fa';

import MiniUser from '../../types/MiniUser';
import Share from '../Share';
import UserDetails from './UserDetails';
import useBlock from '../../hooks/useBlock';
import { useAuth } from '../../contexts/AuthContext';

export interface ShareActivatorProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const ShareActivator: React.FC<ShareActivatorProps> = ({ setShow }) => (
  <Button onClick={() => setShow(true)}>
    <FaShareAlt size="1em" className="ml-2" />
    مشاركة
  </Button>
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

  const isCurrentUser = currentUser && user.username === currentUser.username;

  return (
    <Card className="mb-2">
      <Card.Body className="d-flex user-data">
        <UserDetails user={user} />

        {isCurrentUser ? (
          <Share activator={ShareActivator} link={link} />
        ) : (
          currentUser && (
            <Dropdown>
              <Dropdown.Toggle variant="outline-dark" aria-label="خيارات">
                <FaEllipsisV size="0.9em" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item className="d-inline-flex" onClick={handleBlock}>
                  <p className="ml-auto mb-0">حظر</p>
                  <FaUserLock size="0.9em" />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )
        )}
      </Card.Body>
    </Card>
  );
};

export default UserCard;
