import * as React from 'react';
import { useState, useEffect, useRef } from 'react';

import { useAuth } from '../contexts/AuthContext';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { auth } from '../config/firebase';
import logo from '../assets/images/logo.svg';
import Link from './router/Link';

const Navigation: React.FC = () => {
  const { signedIn } = useAuth();

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
  }, []);

  return (
    <Navbar bg="white" expand="lg" fixed="top">
      <Navbar.Brand>
        <img
          alt="فضفضة"
          src={logo}
          width="30"
          height="30"
          className="d-inline-block align-top ml-2"
        />
        <span className="font-weight-bold text-primary">فضفضه</span>
      </Navbar.Brand>

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
            <Nav.Link as={Link} to="/">
              الرئيسية
            </Nav.Link>
          )}

          {signedIn && (
            <>
              <Nav.Link as={Link} to="/inbox">
                الرسائل المستلمة
              </Nav.Link>

              <Nav.Link as={Link} to="/outbox">
                الرسائل المرسلة
              </Nav.Link>

              <Nav.Link as={Link} to="/who-requests">
                طلبات معرفة المرسل
              </Nav.Link>

              <Nav.Link as={Link} to="/settings">
                الإعدادات
              </Nav.Link>
            </>
          )}

          <Nav.Link as={Link} to="/privacy-policy">
            سياسة الخصوصية
          </Nav.Link>
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
              <Button
                variant="text-primary"
                className="ml-lg-1 mb-1 mb-lg-0"
                as={Link}
                to="/login"
              >
                تسجيل الدخول
              </Button>
              <Button variant="text-primary" as={Link} to="/register">
                إنشاء حساب
              </Button>
            </>
          )}
        </Nav>
      </div>
    </Navbar>
  );
};

export default Navigation;
