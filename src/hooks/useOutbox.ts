import { useState, useEffect, useRef } from 'react';
import { functions } from '../config/firebase';
import Message from '../types/Message';

const getOutbox = functions.httpsCallable('getOutbox');

function useOutbox(): [
  Message<string>[],
  () => void,
  boolean,
  boolean,
  boolean,
  boolean,
  firebase.functions.HttpsError | null
] {
  const [outbox, setOutbox] = useState<Message<string>[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<firebase.functions.HttpsError | null>(
    null
  );

  const last = useRef<string>();

  useEffect(() => {
    getOutbox()
      .then(({ data: outbox }) => {
        if (outbox.length >= 8) {
          setHasMore(true);
          last.current = outbox[outbox.length - 1].id;
        } else setHasMore(false);

        setOutbox(outbox);
      })
      .catch(err => {
        if (err.code === 'internal' || err.code === 'deadline-exceeded') setOffline(true);
        setError(err);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadMore() {
    setLoadingMore(true);

    getOutbox({ last: last.current })
      .then(({ data: outbox }) => {
        last.current = outbox[outbox.length - 1].id;

        if (outbox.length >= 8) setHasMore(true);
        else setHasMore(false);

        setOutbox(prevOutbox => [...prevOutbox, ...outbox]);
      })
      .catch(err => setError(err))
      .finally(() => setLoadingMore(false));
  }

  return [outbox, loadMore, hasMore, loadingMore, loading, offline, error];
}

export default useOutbox;
