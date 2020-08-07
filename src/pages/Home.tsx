import * as React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import PageTransition from '../components/PageTransition';
import './Home.scss';
import Mailbox from '../assets/images/mailbox-animated.svg';

const Home = () => {
  return (
    <PageTransition>
      <Container className="text-center">
        <Row>
          <Col className="content d-flex align-items-center justify-content-center">
            <div>
              <h1 className="display-3">فضفضة</h1>
              <p className="lead text-black-50">
                فضفضة يتيح لك الحصول على نقد بناء
                <br />
                من أصدقائك وزملائك في العمل.
              </p>

              <LinkContainer to="/login">
                <Button className="join-btn mb-2">تسجيل الدخول</Button>
              </LinkContainer>
              <br />
              <LinkContainer to="/register">
                <Button variant="outline-primary" className="join-btn">
                  إنشاء حساب
                </Button>
              </LinkContainer>
            </div>
          </Col>

          <Col lg="6" className="mailbox-img">
            <img src={Mailbox} alt="فضفضة" draggable={false} />
          </Col>
        </Row>
      </Container>
    </PageTransition>
  );
};

export default Home;
