import { useState, useEffect, useRef } from 'react';
import {  functions } from '../config/firebase';
import Message from '../types/Message';

const getInbox = functions.httpsCallable('getInbox');

function useInbox(): [
  Message<Date>[],
  () => void,
  boolean,
  boolean,
  boolean,
  Error | null
] {
  const [inbox, setInbox] = useState<Message<Date>[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const last = useRef<string>();

  useEffect(() => {
    getInbox()
      .then(({ data: inbox }) => {
        last.current = inbox[inbox.length - 1].id;
        if (inbox.length < 8) setHasMore(false);
        setInbox(inbox);
        console.log(inbox);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadMore() {
    setLoadingMore(true);

    getInbox({ last: last.current })
      .then(({ data: inbox }) => {
        last.current = inbox[inbox - 1];
        if (inbox.length < 8) setHasMore(false);
        setInbox(prevInbox => [...prevInbox, ...inbox]);
      })
      .catch(err => setError(err))
      .finally(() => setLoadingMore(false));
  }

  return [inbox, loadMore, hasMore, loadingMore, loading, error];
}

export default useInbox;
