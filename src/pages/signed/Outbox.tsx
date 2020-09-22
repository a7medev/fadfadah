import * as React from 'react';
import { useEffect, useContext } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import MessagesLayout from '../../components/MessagesLayout';
import { messages as firebaseMessages } from '../../config/firebase';
import Loader from '../../components/Loader';
import { motion, Variants } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import useOutbox from '../../hooks/useOutbox';
import SignedUserCard from '../../components/signed/UserCard';
import { AuthContext } from '../../store/AuthContext';
import { RouteComponentProps } from 'react-router-dom';
import qs from 'qs';
import Offline from '../../components/icons/Offline';

const fadeVariants: Variants = {
  out: { opacity: 0 },
  in: { opacity: 1 }
};

export interface OutboxProps extends RouteComponentProps {}

const Outbox: React.FC<OutboxProps> = ({ location }) => {
  const { user } = useContext(AuthContext)!;
  const [outbox, loadMore, hasMore, loadingMore, loadingOutbox, outboxOffline, outboxError] = useOutbox(user?.uid);
  const { goto } = qs.parse(location.search, { ignoreQueryPrefix: true });

  useEffect(() => {
    if (!loadingOutbox && goto)
      window.location.href = `#${goto}`;
  }, [loadingOutbox, goto]);

  return (
    <PageTransition>
      <Container>
        <SignedUserCard />

        <h4 className="mt-4 mb-3">الرسائل المرسلة</h4>

        {outboxOffline && <Offline />}
  
        {outboxError && (
          <Alert variant="danger">
            {/* @ts-ignore */}
            {firebaseMessages[outboxError.code] ?? 'حدثت مشكلة ما'}
          </Alert>
        )}
        {loadingOutbox && <Loader />}
        {!loadingOutbox && !outboxOffline && outbox && (
          <motion.div initial="out" animate="in" variants={fadeVariants}>
            <MessagesLayout messages={outbox} outbox />
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
