import * as React from 'react';
import { useContext } from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import VerifiedIcon from './icons/Verified';
import MiniUser from '../types/MiniUser';
import Share from './Share';
import Block from './Block';
import { AuthContext } from '../store/AuthContext';
import {
  BsReplyFill,
  BsFillPersonDashFill,
  BsThreeDotsVertical
} from 'react-icons/bs';

export interface ShareActivatorProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const ShareActivator: React.FC<ShareActivatorProps> = ({ setShow }) => (
  <Dropdown.Item className="d-inline-flex" onClick={() => setShow(true)}>
    <p className="ml-auto mb-0">مشاركة</p>
    <BsReplyFill size="1.2em" />
  </Dropdown.Item>
);

export interface BlockActivatorProps {
  block: () => void;
}
const BlockActivator: React.FC<BlockActivatorProps> = ({ block }) => (
  <Dropdown.Item className="d-inline-flex" onClick={() => block()}>
    <p className="ml-auto mb-0">حظر</p>
    <BsFillPersonDashFill size="1.2em" />
  </Dropdown.Item>
);

export interface UserCardProps {
  user: MiniUser;
  username: string;
}

const UserCard: React.FC<UserCardProps> = ({ user, username }) => {
  const { protocol, host } = window.location;
  const link = `${protocol}//${host}/u/${username}`;

  const { username: currentUsername } = useContext(AuthContext)!;

  return (
    <Card className="mb-2">
      <Card.Body className="d-flex user-data">
        <div className="d-flex align-items-center flex-grow-1">
          <img
            src={
              user.photoURL &&
              user.photoURL !== 'null' &&
              user.photoURL !== 'undefined'
                ? user.photoURL
                : '/images/avatar.svg'
            }
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
          <Dropdown.Toggle variant="text-dark">
            <BsThreeDotsVertical size="1.3em" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Share activator={ShareActivator} link={link} />
            {currentUsername && username !== currentUsername && (
              <Block activator={BlockActivator} id={username} type="username" />
            )}
          </Dropdown.Menu>
        </Dropdown>
      </Card.Body>
    </Card>
  );
};

export default UserCard;
