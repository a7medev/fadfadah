import { useEffect } from 'react';
import qs from 'qs';
import { Helmet } from 'react-helmet';
import { RouteComponentProps, useLocation } from '@reach/router';
import { Container, Alert, Button } from 'react-bootstrap';
import { motion, Variants } from 'framer-motion';

import MessagesLayout from '../../components/messages/MessagesLayout';
import Loader from '../../components/Loader';
import PageTransition from '../../components/PageTransition';
import SignedUserCard from '../../components/user/SignedUserCard';
import useInbox from '../../hooks/useInbox';
import withAuth from '../../components/auth/withAuth';
import getErrorMessage from '../../utils/getErrorMessage';

const fadeVariants: Variants = {
  out: { opacity: 0 },
  in: { opacity: 1 }
};

export interface InboxProps extends RouteComponentProps {}

const Inbox: React.FC<InboxProps> = () => {
  const location = useLocation();

  const {
    inbox,
    loadMore,
    hasMore,
    isLoading,
    isLoadingMore,
    removeMessage,
    error
  } = useInbox();

  const { goto } = qs.parse(location.search, { ignoreQueryPrefix: true });

  useEffect(() => {
    if (!isLoading && goto) window.location.href = `#${goto}`;
  }, [isLoading, goto]);

  return (
    <PageTransition>
      <Helmet>
        <title>الرسائل المستلمة | فضفضة</title>
      </Helmet>

      <Container>
        <SignedUserCard />

        <h4 className="mt-4 mb-3">الرسائل المستلمة</h4>

        {error && <Alert variant="danger">{getErrorMessage(error.code)}</Alert>}

        {isLoading ? (
          <Loader />
        ) : (
          inbox && (
            <motion.div initial="out" animate="in" variants={fadeVariants}>
              <MessagesLayout messages={inbox} removeMessage={removeMessage} />
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

export default withAuth<InboxProps>(Inbox);
