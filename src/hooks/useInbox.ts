import { useState, useEffect, useRef } from 'react';
import { functions } from '../config/firebase';
import Message from '../types/Message';

const getInbox = functions.httpsCallable('getInbox');

function useInbox(): [
  Message<string>[],
  () => void,
  boolean,
  boolean,
  boolean,
  boolean,
  firebase.functions.HttpsError | null
] {
  const [inbox, setInbox] = useState<Message<string>[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<firebase.functions.HttpsError | null>(null);

  const last = useRef<string>();

  useEffect(() => {
    getInbox()
      .then(({ data: inbox }) => {
        last.current = inbox[inbox.length - 1].id;

        if (inbox.length >= 8) setHasMore(true);
        else setHasMore(false);

        setInbox(inbox);
      })
      .catch(err => {
        if (err.code === 'internal') setOffline(true);
        setError(err);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadMore() {
    setLoadingMore(true);

    getInbox({ last: last.current })
      .then(({ data: inbox }) => {
        last.current = inbox[inbox - 1];

        if (inbox.length >= 8) setHasMore(true);
        else setHasMore(false);

        setInbox(prevInbox => [...prevInbox, ...inbox]);
      })
      .catch(err => setError(err))
      .finally(() => setLoadingMore(false));
  }

  return [inbox, loadMore, hasMore, loadingMore, loading, offline, error];
}

export default useInbox;
