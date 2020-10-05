import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

export interface NotFoundProps extends RouteComponentProps {}

const NotFound: React.FC<NotFoundProps> = ({ location }) => {
  return (
    <Container
      className="text-center d-flex justify-content-center align-items-center"
      style={{ minHeight: 'calc(100vh - 2rem - 50px)' }}
    >
      <Helmet>
        <title>الصفحة غير موجودة | فضفضة</title>
      </Helmet>

      <div>
        <h1 className="display-1">404</h1>
        <p className="lead">الصفحة {location.pathname} غير موجودة</p>

        <LinkContainer to="/" isActive={() => false}>
          <Button>
            <FaArrowRight size="1em" className="ml-1" />
            عودة للرئيسية
          </Button>
        </LinkContainer>
      </div>
    </Container>
  );
};

export default NotFound;
