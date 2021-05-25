import { useLayoutEffect, useRef, useState } from 'react';
import { Button, Card, Dropdown, Popover, Overlay } from 'react-bootstrap';
import { FaEllipsisV, FaShare, FaUserLock } from 'react-icons/fa';

import MiniUser from '../../types/MiniUser';
import Share from '../Share';
import UserDetails from './UserDetails';
import useBlock from '../../hooks/useBlock';
import { useAuth } from '../../contexts/AuthContext';

export interface ShareActivatorProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const ShareActivator: React.FC<ShareActivatorProps> = ({ setShow }) => {
  const [isSeen, setIsSeen] = useState(true);
  const target = useRef<HTMLButtonElement | null>(null);
  const container = useRef<HTMLDivElement | null>(null);

  const handleDismiss = () => {
    localStorage.setItem('seen_share_message', 'true');
    setIsSeen(true);
  };

  useLayoutEffect(() => {
    setTimeout(() => {
      const isSeen = localStorage.getItem('seen_share_message');
      return setIsSeen(!!isSeen);
    }, 2000);
  }, []);

  return (
    <div ref={container}>
      <Button
        variant="outline-primary"
        onClick={() => setShow(true)}
        ref={target}
      >
        <FaShare size="1em" className="ml-sm-2" />
        <span className="d-none d-sm-inline">مشاركة</span>
      </Button>
      <Overlay
        show={!isSeen}
        target={target.current!}
        container={container.current!}
        placement="bottom"
      >
        <Popover id="share-popover" className="p-2">
          <p className="mb-1">
            شارك رابط حسابك مع أصدقائك وابدأ بتلقي الرسائل.
          </p>
          <Button onClick={handleDismiss} size="sm" className="d-block mr-auto">
            فهمت
          </Button>
        </Popover>
      </Overlay>
    </div>
  );
};

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
