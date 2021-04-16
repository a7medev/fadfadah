import React from 'react';
import { Navbar } from 'react-bootstrap';
import InboxIcon from './icons/InboxIcon';

import InboxOutlinedIcon from './icons/InboxOutlinedIcon';
import OutboxIcon from './icons/OutboxIcon';
import OutboxOutlinedIcon from './icons/OutboxOutlinedIcon';
import SettingsIcon from './icons/SettingsIcon';
import SettingsOutlinedIcon from './icons/SettingsOutlinedIcon';
import Link from './Link';

const BottomNavigation: React.FC = () => {
  return (
    <Navbar
      bg="white"
      expand="lg"
      fixed="bottom"
      className="d-sm-none bottom-navbar"
      style={{ height: 56, padding: 0, alignItems: 'stretch' }}
    >
      <Link
        to="/outbox"
        className="bottom-nav-icon"
        aria-label="الرسائل المرسلة"
      >
        <OutboxIcon className="filled" size={25} />
        <OutboxOutlinedIcon className="outlined" size={25} />
      </Link>

      <Link
        to="/inbox"
        className="bottom-nav-icon"
        aria-label="الرسائل المستلمة"
      >
        <InboxIcon className="filled" size={25} />
        <InboxOutlinedIcon className="outlined" size={25} />
      </Link>

      <Link to="/settings" className="bottom-nav-icon" aria-label="الإعدادات">
        <SettingsIcon className="filled" size={25} />
        <SettingsOutlinedIcon className="outlined" size={25} />
      </Link>
    </Navbar>
  );
};

export default BottomNavigation;
