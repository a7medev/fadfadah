import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  DocumentData,
  Timestamp,
  FirestoreError
} from '@firebase/firestore-types';

import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Message from '../types/Message';

const LIMIT = 12;

const getOutbox = async (userId: string, last?: DocumentData | null) => {
  let ref = db
    .collection('users')
    .doc(userId)
    .collection('messages')
    .limit(LIMIT)
    .orderBy('createdAt', 'desc');

  if (last) ref = ref.startAfter(last);

  const { docs } = await ref.get();
  const outboxPromises = docs
    .filter(doc => doc.exists)
    .map(async ({ id }) => {
      const doc = await db.collection('messages').doc(id).get();
      if (doc.exists) {
        return { ...(doc.data() as Message<Timestamp>), id };
      }
      return false;
    })
    .filter(m => m);

  const result = await Promise.all(
    outboxPromises.map(p => p.catch(err => console.error(err)))
  );

  const outbox = result.filter(m => m) as Message<Timestamp>[];

  const lastDoc = docs.length === LIMIT ? docs[docs.length - 1] : null;

  return { outbox, lastDoc };
};

const useOutbox = () => {
  const [outbox, setOutbox] = useState<Message<Timestamp>[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const last = useRef<DocumentData | null>();
  const { firebaseUser } = useAuth();

  useEffect(() => {
    if (!firebaseUser) return;

    getOutbox(firebaseUser.uid)
      .then(({ outbox, lastDoc }) => {
        last.current = lastDoc;

        if (lastDoc) setHasMore(true);
        else setHasMore(false);

        setOutbox(outbox);
      })
      .catch(err => {
        console.error(err);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  }, [firebaseUser]);

  const loadMore = useCallback(async () => {
    if (!firebaseUser) return;

    setIsLoadingMore(true);

    try {
      const { outbox, lastDoc } = await getOutbox(
        firebaseUser.uid,
        last.current
      );
      last.current = lastDoc;

      if (lastDoc) setHasMore(true);
      else setHasMore(false);

      setOutbox(currInbox => [...currInbox, ...outbox]);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [firebaseUser]);

  const removeMessage = (id: string) => {
    setOutbox(prevOutbox => prevOutbox.filter(message => message.id !== id));
  };

  return {
    outbox,
    loadMore,
    hasMore,
    isLoadingMore,
    isLoading,
    error,
    removeMessage
  };
};

export default useOutbox;
