import * as React from 'react';
import { useEffect } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import MessagesLayout from '../../components/MessagesLayout';
import { messages as firebaseMessages } from '../../config/firebase';
import Loader from '../../components/Loader';
import { motion, Variants } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import useOutbox from '../../hooks/useOutbox';
import SignedUserCard from '../../components/signed/UserCard';
import { RouteComponentProps } from 'react-router-dom';
import qs from 'qs';
import Offline from '../../components/icons/Offline';
import { Helmet } from 'react-helmet';

const fadeVariants: Variants = {
  out: { opacity: 0 },
  in: { opacity: 1 }
};

export interface OutboxProps extends RouteComponentProps {}

const Outbox: React.FC<OutboxProps> = ({ location }) => {
  const {
    outbox,
    loadMore,
    hasMore,
    loadingMore,
    removeMessage,
    loading: loadingOutbox,
    offline: outboxOffline,
    error: outboxError
  } = useOutbox();
  const { goto } = qs.parse(location.search, { ignoreQueryPrefix: true });

  useEffect(() => {
    if (!loadingOutbox && goto) window.location.href = `#${goto}`;
  }, [loadingOutbox, goto]);

  return (
    <PageTransition>
      <Helmet>
        <title>الرسائل المرسلة | فضفضة</title>
      </Helmet>

      <Container>
        <SignedUserCard />

        <h4 className="mt-4 mb-3">الرسائل المرسلة</h4>

        {outboxOffline && <Offline />}

        {outboxError && !(outboxError.code === 'internal') && (
          <Alert variant="danger">
            {/* @ts-ignore */}
            {firebaseMessages[outboxError.code] ?? 'حدثت مشكلة ما'}
          </Alert>
        )}
        {loadingOutbox && <Loader />}
        {!loadingOutbox &&
          !(outboxOffline && outbox.length === 0) &&
          !outboxOffline &&
          outbox && (
            <motion.div initial="out" animate="in" variants={fadeVariants}>
              <MessagesLayout messages={outbox} removeMessage={removeMessage} outbox />
              <div className="text-center">
                {hasMore && !loadingMore && (
                  <Button
                    variant="text-primary"
                    className="rounded-pill"
                    onClick={() => loadMore()}
                  >
                    عرض المزيد
                  </Button>
                )}
                {loadingMore && <Loader small />}
              </div>
            </motion.div>
          )}
      </Container>
    </PageTransition>
  );
};

export default Outbox;
