import { useState, useEffect, useRef, useCallback } from 'react';
import type { DocumentData, FirestoreError } from '@firebase/firestore-types';

import { db, perf } from '../config/firebase';
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
        return { ...(doc.data() as Message), id };
      }
      return false;
    })
    .filter(m => m);

  const result = await Promise.all(
    outboxPromises.map(p => p.catch(err => console.error(err)))
  );

  const outbox = result.filter(m => m) as Message[];

  const lastDoc = docs.length === LIMIT ? docs[docs.length - 1] : null;

  return { outbox, lastDoc };
};

const useOutbox = () => {
  const [outbox, setOutbox] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const last = useRef<DocumentData | null>();
  const { firebaseUser } = useAuth();

  useEffect(() => {
    if (!firebaseUser) return;

    const outboxTrace = perf.trace('get_outbox');
    outboxTrace.start();
    outboxTrace.putAttribute('is_first_time', 'true');

    getOutbox(firebaseUser.uid)
      .then(({ outbox, lastDoc }) => {
        last.current = lastDoc;

        if (lastDoc) setHasMore(true);
        else setHasMore(false);

        setOutbox(outbox);
      })
      .catch(err => {
        setError(err);
        outboxTrace.putAttribute('has_error', 'true');
        if (err.code) {
          outboxTrace.putAttribute('error_code', err.code);
        }
      })
      .finally(() => {
        setIsLoading(false);
        outboxTrace.stop();
      });
  }, [firebaseUser]);

  const loadMore = useCallback(async () => {
    if (!firebaseUser) return;

    setIsLoadingMore(true);

    const outboxTrace = perf.trace('get_inbox');
    outboxTrace.start();

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
      setError(err);
      outboxTrace.putAttribute('has_error', 'true');
      if (err.code) {
        outboxTrace.putAttribute('error_code', err.code);
      }
    } finally {
      setIsLoadingMore(false);
      outboxTrace.stop();
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
