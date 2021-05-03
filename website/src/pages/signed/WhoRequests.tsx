import { useEffect } from 'react';
import qs from 'qs';
import { RouteComponentProps, useLocation } from '@reach/router';
import { Helmet } from 'react-helmet';
import { Alert, Button, Container } from 'react-bootstrap';

import PageTransition from '../../components/PageTransition';
import Loader from '../../components/Loader';
import WhoRequest from '../../components/WhoRequest';
import useWhoRequests from '../../hooks/useWhoRequests';
import withAuth from '../../components/auth/withAuth';
import getErrorMessage from '../../utils/getErrorMessage';
import SignedUserCard from '../../components/user/SignedUserCard';
import WhoRequestIcon from '../../components/icons/WhoRequestIcon';
import styles from '../../components/messages/MessagesLayout.module.css';

export interface WhoRequestsProps extends RouteComponentProps {}

const WhoRequests: React.FC<WhoRequestsProps> = () => {
  const location = useLocation();

  const {
    whoRequests,
    loadMore,
    hasMore,
    removeReq,
    isLoadingMore,
    isLoading,
    error
  } = useWhoRequests();

  const { goto } = qs.parse(location.search, { ignoreQueryPrefix: true });

  useEffect(() => {
    if (!isLoading && goto) window.location.href = `#${goto}`;
  }, [isLoading, goto]);

  return (
    <PageTransition>
      <Helmet>
        <title>طلبات معرفة المرسل | فضفضة</title>
      </Helmet>

      <Container className="pt-2">
        <SignedUserCard />

        <h4 className="mt-4 mb-3">طلبات معرفة المرسل</h4>

        {error && <Alert variant="danger">{getErrorMessage(error.code)}</Alert>}
        {isLoading ? (
          <Loader />
        ) : (
          whoRequests && (
            <>
              {whoRequests.length === 0 && (
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <WhoRequestIcon size={50} className={styles.noMessagesIcon} />
                  <h5 className="mt-2 text-muted">لا يوجد طلبات</h5>
                </div>
              )}
              {whoRequests.map(request => (
                <WhoRequest
                  {...request}
                  onDelete={removeReq}
                  key={request.id}
                />
              ))}

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
            </>
          )
        )}
      </Container>
    </PageTransition>
  );
};

export default withAuth<WhoRequestsProps>(WhoRequests);
