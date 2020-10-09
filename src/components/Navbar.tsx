import * as React from 'react';
import { useState, useEffect, useRef, useContext } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AuthContext } from '../store/AuthContext';
import { auth } from '../config/firebase';
import Logo from '../assets/images/logo.svg';

const Navigation: React.FC = () => {
  const { signedIn } = useContext(AuthContext);

  const [collapseOffCanvas, setCollapseOffCanvas] = useState(false);

  const navbarToggler = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const closeNavbarHandler = () => {
      navbarToggler.current?.click();
    };

    const navItems = document.querySelectorAll('.navbar .navbar-nav *');
    navItems.forEach(el => el.addEventListener('click', closeNavbarHandler));

    return () =>
      navItems.forEach(el =>
        el.removeEventListener('click', closeNavbarHandler)
      );
  });

  return (
    <Navbar bg="white" expand="lg" fixed="top">
      <LinkContainer to={signedIn ? '/inbox' : '/'}>
        <Navbar.Brand>
          <img
            alt="فضفضة"
            src={Logo}
            width="30"
            height="30"
            className="d-inline-block align-top ml-2"
          />
          <span className="font-weight-bold text-primary">فضفضه</span>
        </Navbar.Brand>
      </LinkContainer>

      <Navbar.Toggle
        aria-controls="nav"
        ref={navbarToggler}
        onClick={() => setCollapseOffCanvas(prev => !prev)}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </Navbar.Toggle>
      <div
        id="nav"
        className={`navbar-collapse offcanvas-collapse ${
          collapseOffCanvas ? 'open' : ''
        }`}
      >
        <Nav className="main-links ml-auto mr-lg-3 pr-lg-2">
          {!signedIn && (
            <LinkContainer to="/" exact>
              <Nav.Link active={false}>الرئيسية</Nav.Link>
            </LinkContainer>
          )}

          {signedIn && (
            <>
              <LinkContainer to="/inbox" exact>
                <Nav.Link active={false}>الرسائل المستلمة</Nav.Link>
              </LinkContainer>

              <LinkContainer to="/outbox" exact>
                <Nav.Link active={false}>الرسائل المرسلة</Nav.Link>
              </LinkContainer>

              <LinkContainer to="/who-requests" exact>
                <Nav.Link active={false}>طلبات معرفة المرسل</Nav.Link>
              </LinkContainer>

              <LinkContainer to="/settings" exact>
                <Nav.Link active={false}>الإعدادات</Nav.Link>
              </LinkContainer>
            </>
          )}

          <LinkContainer to="/privacy-policy" exact>
            <Nav.Link active={false}>سياسة الخصوصية</Nav.Link>
          </LinkContainer>
        </Nav>

        <Nav className="mr-auto">
          {signedIn ? (
            <Button
              onClick={() => auth.signOut()}
              variant="text-danger"
              className="ml-lg-1 mb-1 mb-lg-0"
            >
              تسجيل الخروج
            </Button>
          ) : (
            <>
              <LinkContainer to="/login">
                <Button variant="text-primary" className="ml-lg-1 mb-1 mb-lg-0">
                  تسجيل الدخول
                </Button>
              </LinkContainer>
              <LinkContainer to="/register">
                <Button variant="text-primary">إنشاء حساب</Button>
              </LinkContainer>
            </>
          )}
        </Nav>
      </div>
    </Navbar>
  );
};

export default Navigation;
