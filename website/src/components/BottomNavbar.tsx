import { Navbar } from 'react-bootstrap';
import InboxIcon from './icons/InboxIcon';

import InboxOutlinedIcon from './icons/InboxOutlinedIcon';
import OutboxIcon from './icons/OutboxIcon';
import OutboxOutlinedIcon from './icons/OutboxOutlinedIcon';
import WhoRequestIcon from './icons/WhoRequestIcon';
import WhoRequestOutlinedIcon from './icons/WhoRequestOutlinedIcon';
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

      <Link to="/who-requests" className="bottom-nav-icon" aria-label="طلبات معرفة المرسل">
        <WhoRequestIcon className="filled" size={25} />
        <WhoRequestOutlinedIcon className="outlined" size={25} />
      </Link>
    </Navbar>
  );
};

export default BottomNavigation;
