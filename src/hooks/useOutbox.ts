import { useState, useEffect, useRef } from 'react';
import { db } from '../config/firebase';
import Message from '../types/Message';
import {
  Timestamp,
  DocumentData,
  QuerySnapshot
} from '@firebase/firestore-types';

function useOutbox(
  userId?: string
): [
  Message<Timestamp>[],
  () => void,
  boolean,
  boolean,
  boolean,
  boolean,
  Error | null
] {
  const [outbox, setOutbox] = useState<Message<Timestamp>[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const last = useRef<DocumentData>();

  const ref = db
    .collection('users')
    .doc(userId ?? 'non_existing')
    .collection('messages')
    .orderBy('createdAt', 'desc');

  useEffect(() => {
    if (!userId) {
      setOutbox([]);
      setLoading(false);
      setError(new Error('user id is not set'));
      return;
    }
    ref
      .limit(12)
      .get()
      .then(async snap => {
        last.current = snap.docs[snap.docs.length - 1];

        if (snap.docs.length < 12) setHasMore(false);

        const messages = await getMessages(snap);

        setOutbox(
          messages.filter(message => message !== null) as Message<Timestamp>[]
        );

        messages && setLoading(false);
        messages && setError(null);
      })
      .catch(err => {
        setLoading(false);

        if (err.code === 'unavailable') return setOffline(true);

        setError(err);
      });

    const unsub = ref.onSnapshot(snap => {
      const changes = snap.docChanges();

      const deleted = changes.filter(change => change.type === 'removed');

      deleted.forEach(snap => {
        setOutbox(prevOutbox =>
          prevOutbox.filter(message => message.id !== snap.doc.id)
        );
      });
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getMessages(snap: QuerySnapshot<DocumentData>) {
    return Promise.all(
      snap.docs.map(async ({ id }) => {
        const doc = await db.collection('messages').doc(id).get();

        if (doc.exists) {
          const message = { ...(doc.data() as Message<Timestamp>), id: doc.id };
          return message;
        }

        return null;
      })
    );
  }

  function loadMore() {
    setLoadingMore(true);

    ref
      .limit(12)
      .startAfter(last.current)
      .get()
      .then(async snap => {
        last.current = snap.docs[snap.docs.length - 1];

        const messages = await getMessages(snap);

        setOutbox(prevOutbox => {
          if (snap.docs.length < 12) setHasMore(false);

          return [
            ...prevOutbox,
            ...(messages.filter(message => message !== null) as Message<
              Timestamp
            >[])
          ];
        });

        setLoadingMore(false);
      })
      .catch(err => setError(err));
  }

  return [outbox, loadMore, hasMore, loadingMore, loading, offline, error];
}

export default useOutbox;
