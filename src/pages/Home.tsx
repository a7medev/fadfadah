import * as React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import PageTransition from '../components/PageTransition';
import Mailbox from '../assets/images/mailbox-animated.svg';
import styles from './Home.module.scss';
import { Helmet } from 'react-helmet';
import { RouteComponentProps } from '@reach/router';
import Link from '../components/Link';
import withoutAuth from '../components/withoutAuth';

export interface HomeProps extends RouteComponentProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <PageTransition>
      <Helmet>
        <title>فضفضة | افصح عما بداخلك للآخرين.</title>
      </Helmet>

      <Container className="text-center">
        <Row>
          <Col
            className={`${styles.content} d-flex align-items-center justify-content-center`}
          >
            <div className="text-lg-right">
              <h1 className="display-4 mb-2">فَضْفَضَة</h1>
              <p className="lead text-black-50 mb-4">
                فضفضة يسمح لك بالإفصاح عما بداخلك للآخرين.
              </p>

              <Button
                className={`${styles.joinButton} mb-2 mb-lg-0 ml-lg-2`}
                as={Link}
                to="/login"
              >
                تسجيل الدخول
              </Button>

              <Button
                variant="outline-primary"
                className={styles.joinButton}
                as={Link}
                to="/register"
              >
                إنشاء حساب
              </Button>
            </div>
          </Col>

          <Col lg="6" className={styles.mailboxImage}>
            <img src={Mailbox} alt="فضفضة" draggable={false} />
          </Col>
        </Row>
      </Container>
    </PageTransition>
  );
};

export default withoutAuth(Home);
