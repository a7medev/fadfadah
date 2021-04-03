import { useState, useEffect, useRef } from 'react';
import type firebase from 'firebase';

import { functions } from '../config/firebase';
import Message from '../types/Message';

const getInbox = functions.httpsCallable('getInbox');

const useInbox = () => {
  const [inbox, setInbox] = useState<Message<string>[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<firebase.functions.HttpsError | null>(
    null
  );

  const last = useRef<string>();

  useEffect(() => {
    getInbox()
      .then(({ data: inbox }) => {
        if (inbox.length >= 8) {
          last.current = inbox[inbox.length - 1].id;
          setHasMore(true);
        } else setHasMore(false);

        setInbox(inbox);
      })
      .catch(err => {
        if (err.code === 'internal' || err.code === 'deadline-exceeded')
          setOffline(true);
        setError(err);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = () => {
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

  const removeMessage = (id: string) => {
    setInbox(prevInbox => prevInbox.filter(message => message.id !== id));
  }

  return {
    inbox,
    loadMore,
    hasMore,
    loadingMore,
    loading,
    offline,
    error,
    removeMessage
  };
}

export default useInbox;
