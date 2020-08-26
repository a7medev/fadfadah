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

  useEffect(() => {
    if (!userId) {
      setInbox([]);
      setLoading(false);
      setError(new Error('user id is not set'));
      return;
    }

    ref
      .limit(12)
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
        setError(null);
      })
      .catch(err => setError(err));

    const unsub = ref.onSnapshot(snap => {
      const changes = snap.docChanges();

      const deleted = changes.filter(change => change.type === 'removed');

      deleted.forEach(snap => {
        setInbox(prevInbox =>
          prevInbox.filter(message => message.id !== snap.doc.id)
        );
      });
    });

    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadMore() {
    setLoadingMore(true);

    ref
      .limit(12)
      .startAfter(last.current)
      .get()
      .then(snap => {
        last.current = snap.docs[snap.docs.length - 1];

        setInbox(prevInbox => {
          if (snap.docs.length < 12) setHasMore(false);

          return [
            ...prevInbox,
            ...snap.docs.map(doc => ({
              id: doc.id,
              ...(doc.data() as Message<Timestamp>)
            }))
          ];
        });

        setLoadingMore(false);
      })
      .catch(err => setError(err));
  }

  return [inbox, loadMore, hasMore, loadingMore, loading, error];
}

export default useInbox;
