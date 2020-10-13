import * as React from 'react';
import { Link, RouteComponentProps, useLocation } from '@reach/router';
import { Container, Button } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

export interface NotFoundProps extends RouteComponentProps {}

const NotFound: React.FC<NotFoundProps> = () => {
  const location = useLocation();

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

        <Button as={Link} to="/">
          <FaArrowRight size="1em" className="ml-1" />
          عودة للرئيسية
        </Button>
      </div>
    </Container>
  );
};

export default NotFound;
