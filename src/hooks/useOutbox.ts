import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import Message from '../types/Message';
import { Timestamp } from '@firebase/firestore-types';

function useOutbox(userId?: string): [Message<Timestamp>[], boolean, Error | null] {
  const [outbox, setOutbox] = useState<Message<Timestamp>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsub = db
      .collection('users')
      .doc(userId ?? 'non_existing')
      .collection('messages')
      .onSnapshot(
        snap => {
          if (loading) setLoading(false);
          if (error) setError(null);

          Promise.all(
            snap.docs.map(async ({ id }) => {
              const doc = await db.collection('messages').doc(id).get();
              const message = { ...doc.data(), id: doc.id };
              return message;
            })
          ).then(messages => {
            // @ts-ignore
            setOutbox(messages)
          });
        },
        err => setError(err)
      );

    return () => unsub();
  }, [userId, error, loading]);

  return [outbox, loading, error];
}

export default useOutbox;
