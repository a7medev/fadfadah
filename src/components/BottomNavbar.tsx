import * as React from 'react';
import { Navbar, Button } from 'react-bootstrap';
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
      style={{ height: 56 }}
    >
      <LinkContainer to="/outbox">
        <Button variant="text-primary">
          <FaPaperPlane size="21" />
        </Button>
      </LinkContainer>
      
      <LinkContainer to="/inbox">
        <Button variant="text-primary">
          <FaInbox size="21" />
        </Button>
      </LinkContainer>

      <LinkContainer to="/settings">
        <Button variant="text-primary">
          <FaCog size="21" />
        </Button>
      </LinkContainer>
    </Navbar>
  );
};

export default BottomNavigation;
