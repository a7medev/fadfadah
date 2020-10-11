import * as React from 'react';
import { Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaPaperPlane, FaCog, FaInbox } from 'react-icons/fa';

const BottomNavigation: React.FC = () => {
  return (
    <Navbar
      bg="white"
      expand="lg"
      fixed="bottom"
      className="d-sm-none bottom-navbar"
      style={{ height: 56, padding: 0, alignItems: 'stretch' }}
    >
      <LinkContainer to="/outbox">
        <div className="bottom-nav-icon">
          <FaPaperPlane size="25" />
        </div>
      </LinkContainer>

      <LinkContainer to="/inbox">
        <div className="bottom-nav-icon">
          <FaInbox size="25" />
        </div>
      </LinkContainer>

      <LinkContainer to="/settings">
        <div className="bottom-nav-icon">
          <FaCog size="25" />
        </div>
      </LinkContainer>
    </Navbar>
  );
};

export default BottomNavigation;
