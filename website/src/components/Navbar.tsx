import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { IoIosLogOut } from 'react-icons/io';

import UserDetails from './UserDetails';
import Link from './Link';
import logo from '../assets/images/logo.svg';
import { auth } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { signedIn, user } = useAuth();

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
  }, [signedIn]);

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
        {user && (
          <div className="mt-2 mb-3 d-flex align-items-center d-lg-none">
            <UserDetails user={user} />
            <Button variant="text-secondary" className="fab">
              <IoIosLogOut size={25} />
            </Button>
          </div>
        )}

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
              variant="text-danger d-none d-lg-inline-block"
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
