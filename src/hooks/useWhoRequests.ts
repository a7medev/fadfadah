import { useState, useEffect, useRef } from 'react';
import type firebase from 'firebase';

import { functions } from '../config/firebase';
import WhoRequest from '../types/WhoRequest';

const getWhoRequests = functions.httpsCallable('getWhoRequests');

const useWhoRequests = () => {
  const [whoRequests, setWhoRequests] = useState<WhoRequest[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<firebase.functions.HttpsError | null>(
    null
  );

  const last = useRef<string>();

  useEffect(() => {
    getWhoRequests()
      .then(({ data: whoRequests }) => {
        if (whoRequests.length >= 8) {
          last.current = whoRequests[whoRequests.length - 1].id;
          setHasMore(true);
        } else setHasMore(false);

        setWhoRequests(whoRequests);
      })
      .catch(err => {
        if (err.code === 'internal' || err.code === 'deadline-exceeded')
          setOffline(true);
        setError(err);
      })
      .finally(() => setLoading(false));

    // eslint-disable-next-line
  }, []);

  const loadMore = () => {
    setLoadingMore(true);

    getWhoRequests({ last: last.current })
      .then(({ data: whoRequests }) => {
        last.current = whoRequests[whoRequests - 1];

        if (whoRequests.length >= 8) setHasMore(true);
        else setHasMore(false);

        setWhoRequests(prevWhoRequests => [...prevWhoRequests, ...whoRequests]);
      })
      .catch(err => setError(err))
      .finally(() => setLoadingMore(false));
  }

  const removeReq = (id: string) => {
    setWhoRequests(prevReqs => prevReqs.filter(req => req.id !== id));
  }

  return {
    whoRequests,
    loadMore,
    hasMore,
    removeReq,
    loadingMore,
    loading,
    offline,
    error
  };
}

export default useWhoRequests;
