import * as React from 'react';
import { Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Home.scss';
import PageTransition from '../components/PageTransition';

const Home = () => {
  return (
    <PageTransition>
      <Container
        className="text-center"
      >
        <h1 className="display-3">صراحة</h1>
        <p className="lead text-black-50">صراحة يتيح لك الحصول على نقد بناء<br />من أصدقائك وزملائك في العمل.</p>

        <LinkContainer to="/login">
          <Button className="join-btn mb-2">تسجيل الدخول</Button>
        </LinkContainer>
        <br />
        <LinkContainer to="/register">
          <Button variant="outline-primary" className="join-btn">إنشاء حساب</Button>
        </LinkContainer>
      </Container>
    </PageTransition>
  )
}

export default Home
