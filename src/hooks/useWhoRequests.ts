import { useState, useEffect, useRef, useCallback } from 'react';
import type { DocumentData, FirestoreError } from '@firebase/firestore-types';

import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import type WhoRequest from '../types/WhoRequest';

const LIMIT = 12;

const getWhoRequests = async (userId: string, last?: DocumentData | null) => {
  let ref = db
    .collection('users')
    .doc(userId)
    .collection('who_requests')
    .limit(LIMIT)
    .orderBy('sentAt', 'desc');

  if (last) ref = ref.startAfter(last);

  const { docs } = await ref.get();
  const whoRequests = docs.map(doc => ({
    ...(doc.data() as WhoRequest),
    id: doc.id
  }));

  const lastDoc = docs.length === LIMIT ? docs[docs.length - 1] : null;

  return { whoRequests, lastDoc };
};

const useWhoRequests = () => {
  const [whoRequests, setWhoRequests] = useState<WhoRequest[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const last = useRef<DocumentData | null>(null);
  const { firebaseUser } = useAuth();

  useEffect(() => {
    if (!firebaseUser) return;

    getWhoRequests(firebaseUser.uid)
      .then(({ whoRequests, lastDoc }) => {
        last.current = lastDoc;

        if (lastDoc) setHasMore(true);
        else setHasMore(false);

        setWhoRequests(whoRequests);
      })
      .catch(err => setError(err))
      .finally(() => setIsLoading(false));
  }, [firebaseUser]);

  const loadMore = useCallback(async () => {
    if (!firebaseUser) return;

    setIsLoadingMore(true);

    try {
      const { whoRequests, lastDoc } = await getWhoRequests(firebaseUser.uid, last.current);
      last.current = lastDoc;

      if (lastDoc) setHasMore(true);
      else setHasMore(false);

      setWhoRequests(currWhoRequests => [...currWhoRequests, ...whoRequests]);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [firebaseUser]);


  const removeReq = (id: string) => {
    setWhoRequests(prevReqs => prevReqs.filter(req => req.id !== id));
  }

  return {
    whoRequests,
    loadMore,
    hasMore,
    isLoadingMore,
    isLoading,
    error,
    removeReq
  };
}

export default useWhoRequests;
