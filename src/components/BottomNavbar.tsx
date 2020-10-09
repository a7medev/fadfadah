import * as React from 'react';
import { Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Navbar.scss';
import { FaPaperPlane, FaCog, FaInbox } from 'react-icons/fa';

const BottomNavigation: React.FC = () => {
  return (
    <Navbar
      bg="white"
      expand="lg"
      fixed="bottom"
      className="justify-content-around d-sm-none"
      style={{ height: 56, boxShadow: '0 -3px 5px -1px rgba(0, 0, 0, 0.05)' }}
    >
      <LinkContainer to="/outbox">
        <FaPaperPlane className="bottom-nav-icon" size="25" />
      </LinkContainer>

      <LinkContainer to="/inbox">
        <FaInbox className="bottom-nav-icon" size="25" />
      </LinkContainer>

      <LinkContainer to="/settings">
        <FaCog className="bottom-nav-icon" size="25" />
      </LinkContainer>
    </Navbar>
  );
};

export default BottomNavigation;
