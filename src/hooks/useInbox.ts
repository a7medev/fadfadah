import { useState, useEffect, useRef } from 'react';
import { db } from '../config/firebase';
import Message from '../types/Message';
import { Timestamp, DocumentData } from '@firebase/firestore-types';

function useInbox(
  userId?: string | null
): [Message<Timestamp>[], () => void, boolean, boolean, boolean, Error | null] {
  const [inbox, setInbox] = useState<Message<Timestamp>[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const last = useRef<DocumentData>();

  const ref = db
    .collection('messages')
    .where('to', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(12);

  useEffect(() => {
    if (!userId) {
      setInbox([]);
      setLoading(false);
      setError(new Error('user id is not set'));
      return;
    }

    ref
      .get()
      .then(snap => {
        last.current = snap.docs[snap.docs.length - 1];

        setInbox(
          snap.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Message<Timestamp>)
          }))
        );
        setLoading(false);
      })
      .catch(err => setError(err));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadMore() {
    setLoadingMore(true);

    ref
      .startAfter(last.current)
      .get()
      .then(snap => {

        last.current = snap.docs[snap.docs.length - 1];

        setInbox(prevInbox => {
          if (snap.docs.length === 0) {
            setHasMore(false);
            return prevInbox;
          }

          return [
            ...prevInbox,
            ...snap.docs.map(doc => ({
              id: doc.id,
              ...(doc.data() as Message<Timestamp>)
            }))
          ]
        });

        setLoadingMore(false);
      })
      .catch(err => setError(err));
  }

  return [inbox, loadMore, hasMore, loadingMore, loading, error];
}

export default useInbox;
