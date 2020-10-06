import * as React from 'react';
import { useEffect } from 'react';
import { Alert, Button, Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { RouteComponentProps } from 'react-router-dom';
import Offline from '../../components/icons/Offline';
import Loader from '../../components/Loader';
import PageTransition from '../../components/PageTransition';
import WhoRequest from '../../components/WhoRequest';
import useWhoRequests from '../../hooks/useWhoRequests';
import qs from 'qs';

export interface WhoRequestsProps extends RouteComponentProps {}

const WhoRequests: React.FC<WhoRequestsProps> = ({ location }) => {
  const {
    whoRequests,
    loadMore,
    hasMore,
    removeReq,
    loadingMore,
    loading: loadingWhoRequests,
    error: whoRequestsError,
    offline: whoRequestsOffline
  } = useWhoRequests();

  const { goto } = qs.parse(location.search, { ignoreQueryPrefix: true });

  useEffect(() => {
    if (!loadingWhoRequests && goto) window.location.href = `#${goto}`;
  }, [loadingWhoRequests, goto]);

  return (
    <PageTransition>
      <Helmet>
        <title>طلبات معرفة المرسل | فضفضة</title>
      </Helmet>

      <Container className="pt-2">
        <h4 className="mb-3">طلبات معرفة المرسل</h4>
        <hr />

        {whoRequestsOffline && <Offline />}

        {whoRequestsError && !(whoRequestsError.code === 'internal') && (
          <Alert variant="danger">
            {/* @ts-ignore */}
            {firebaseMessages[whoRequestsError.code] ?? 'حدثت مشكلة ما'}
          </Alert>
        )}
        {loadingWhoRequests && <Loader />}
        {!loadingWhoRequests &&
          !(whoRequestsOffline && whoRequests.length === 0) &&
          whoRequests && (
            <>
              {whoRequests.length === 0 && (
                <h5 className="text-center text-muted">لا يوجد طلبات</h5>
              )}
              {whoRequests.map(request => (
                <WhoRequest {...request} removeReq={removeReq} key={request.id} />
              ))}

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
            </>
          )}
      </Container>
    </PageTransition>
  );
};

export default WhoRequests;
