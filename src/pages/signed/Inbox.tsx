import * as React from 'react';
import { useEffect, useContext } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import MessagesLayout from '../../components/MessagesLayout';
import { messages as firebaseMessages } from '../../config/firebase';
import Loader from '../../components/Loader';
import { motion, Variants } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import SignedUserCard from '../../components/signed/UserCard';
import { AuthContext } from '../../store/AuthContext';
import { RouteComponentProps } from 'react-router-dom';
import qs from 'qs';
import useInbox from '../../hooks/useInbox';

const fadeVariants: Variants = {
  out: { opacity: 0 },
  in: { opacity: 1 }
};

export interface InboxProps extends RouteComponentProps {}

const Inbox: React.FC<InboxProps> = ({ location }) => {
  const { user } = useContext(AuthContext)!;

  const [
    inbox,
    loadMore,
    hasMore,
    loadingMore,
    loadingInbox,
    inboxError
  ] = useInbox(user?.uid);

  const { goto } = qs.parse(location.search, { ignoreQueryPrefix: true });

  useEffect(() => {
    if (!loadingInbox && goto) window.location.href = `#${goto}`;
  }, [loadingInbox, goto]);

  return (
    <PageTransition>
      <Container>
        <SignedUserCard />

        <h4 className="mt-4 mb-3">الرسائل المستلمة</h4>

        {inboxError && (
          <Alert variant="danger">
            {/* @ts-ignore */}
            {firebaseMessages[inboxError.code] ?? 'حدثت مشكلة ما'}
          </Alert>
        )}
        {loadingInbox && <Loader />}
        {!loadingInbox && inbox && (
          <motion.div initial="out" animate="in" variants={fadeVariants}>
            <MessagesLayout messages={inbox} />
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

export default Inbox;
