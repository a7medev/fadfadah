import React, { useEffect } from 'react';
import qs from 'qs';
import { Helmet } from 'react-helmet';
import { RouteComponentProps, useLocation } from '@reach/router';
import { Container, Alert, Button } from 'react-bootstrap';
import { motion, Variants } from 'framer-motion';

import MessagesLayout from '../../components/MessagesLayout';
import Loader from '../../components/Loader';
import PageTransition from '../../components/PageTransition';
import SignedUserCard from '../../components/SignedUserCard';
import useOutbox from '../../hooks/useOutbox';
import withAuth from '../../components/withAuth';
import getErrorMessage from '../../utils/getErrorMessage';

const fadeVariants: Variants = {
  out: { opacity: 0 },
  in: { opacity: 1 }
};

export interface OutboxProps extends RouteComponentProps {}

const Outbox: React.FC<OutboxProps> = () => {
  const location = useLocation();

  const {
    outbox,
    loadMore,
    hasMore,
    isLoading,
    isLoadingMore,
    removeMessage,
    error
  } = useOutbox();
  const { goto } = qs.parse(location.search, { ignoreQueryPrefix: true });

  useEffect(() => {
    if (!isLoading && goto) window.location.href = `#${goto}`;
  }, [isLoading, goto]);

  return (
    <PageTransition>
      <Helmet>
        <title>الرسائل المرسلة | فضفضة</title>
      </Helmet>

      <Container>
        <SignedUserCard />

        <h4 className="mt-4 mb-3">الرسائل المرسلة</h4>

        {error && <Alert variant="danger">{getErrorMessage(error.code)}</Alert>}

        {isLoading ? (
          <Loader />
        ) : (
          outbox && (
            <motion.div initial="out" animate="in" variants={fadeVariants}>
              <MessagesLayout
                messages={outbox}
                removeMessage={removeMessage}
                isOutbox
              />
              <div className="text-center">
                {hasMore && !isLoadingMore && (
                  <Button
                    variant="text-primary"
                    className="rounded-pill"
                    onClick={() => loadMore()}
                  >
                    عرض المزيد
                  </Button>
                )}
                {isLoadingMore && <Loader small />}
              </div>
            </motion.div>
          )
        )}
      </Container>
    </PageTransition>
  );
};

export default withAuth<OutboxProps>(Outbox);
