import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  DocumentData,
  Timestamp,
  FirestoreError
} from '@firebase/firestore-types';

import Message from '../types/Message';
import { db, perf } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

const LIMIT = 12;

const getInbox = async (userId: string, last?: DocumentData | null) => {
  let ref = db
    .collection('messages')
    .where('to.uid', '==', userId)
    .limit(LIMIT)
    .orderBy('createdAt', 'desc');

  if (last) ref = ref.startAfter(last);

  const { docs } = await ref.get();
  const inbox = docs.map(doc => ({
    ...(doc.data() as Message<Timestamp>),
    id: doc.id
  }));

  const lastDoc = docs.length === LIMIT ? docs[docs.length - 1] : null;

  return { inbox, lastDoc };
};

const useInbox = () => {
  const [inbox, setInbox] = useState<Message<Timestamp>[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const last = useRef<DocumentData | null>(null);
  const { firebaseUser } = useAuth();

  useEffect(() => {
    if (!firebaseUser) return;

    const inboxTrace = perf.trace('get_inbox');
    inboxTrace.start();
    inboxTrace.putAttribute('is_first_time', 'true');

    getInbox(firebaseUser.uid)
      .then(({ inbox, lastDoc }) => {
        last.current = lastDoc;

        if (lastDoc) setHasMore(true);
        else setHasMore(false);

        setInbox(inbox);
      })
      .catch(err => {
        setError(err);
        inboxTrace.putAttribute('has_error', 'true');
        if (err.code) {
          inboxTrace.putAttribute('error_code', err.code);
        }
      })
      .finally(() => {
        setIsLoading(false);
        inboxTrace.stop();
      });
  }, [firebaseUser]);

  const loadMore = useCallback(async () => {
    if (!firebaseUser) return;

    setIsLoadingMore(true);

    const inboxTrace = perf.trace('get_inbox');
    inboxTrace.start();

    try {
      const { inbox, lastDoc } = await getInbox(firebaseUser.uid, last.current);
      last.current = lastDoc;

      if (lastDoc) setHasMore(true);
      else setHasMore(false);

      setInbox(currInbox => [...currInbox, ...inbox]);
    } catch (err) {
      setError(err);
      inboxTrace.putAttribute('has_error', 'true');
      if (err.code) {
        inboxTrace.putAttribute('error_code', err.code);
      }
    } finally {
      setIsLoadingMore(false);
      inboxTrace.stop();
    }
  }, [firebaseUser]);

  const removeMessage = (id: string) => {
    setInbox(currInbox => currInbox.filter(message => message.id !== id));
  };

  return {
    inbox,
    loadMore,
    hasMore,
    isLoadingMore,
    isLoading,
    error,
    removeMessage
  };
};

export default useInbox;
