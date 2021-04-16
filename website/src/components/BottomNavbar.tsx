import React from 'react';
import { Navbar } from 'react-bootstrap';
import { FaPaperPlane, FaCog, FaInbox } from 'react-icons/fa';
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
        <FaPaperPlane size="25" />
      </Link>

      <Link
        to="/inbox"
        className="bottom-nav-icon"
        aria-label="الرسائل المستلمة"
      >
        <FaInbox size="25" />
      </Link>

      <Link to="/settings" className="bottom-nav-icon" aria-label="الإعدادات">
        <FaCog size="25" />
      </Link>
    </Navbar>
  );
};

export default BottomNavigation;
