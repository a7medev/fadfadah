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

    getInbox(firebaseUser.uid)
      .then(({ inbox, lastDoc }) => {
        last.current = lastDoc;

        if (lastDoc) setHasMore(true);
        else setHasMore(false);

        setInbox(inbox);
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
      const { inbox, lastDoc } = await getInbox(firebaseUser.uid, last.current);
      last.current = lastDoc;

      if (lastDoc) setHasMore(true);
      else setHasMore(false);

      setInbox(currInbox => [...currInbox, ...inbox]);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setIsLoadingMore(false);
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
