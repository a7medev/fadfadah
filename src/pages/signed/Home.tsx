import * as React from 'react';
import { useState, useContext } from 'react';
import { AuthContext } from '../../store/AuthContext';
import { Container, Alert } from 'react-bootstrap';
import EmailNotVerifiedMessage from '../../components/signed/EmailNotVerifiedMessage';
import NameIsNotSet from '../../components/signed/NameIsNotSet';
import UsernameIsNotSet from '../../components/signed/UsernameIsNotSet';
import UserCard from '../../components/UserCard';
import MessagesLayout from '../../components/MessagesLayout';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { db, messages as firebaseMessages } from '../../config/firebase';
import Message from '../../types/Message';
import { Timestamp } from '@firebase/firestore-types';
import Loader from '../../components/Loader';
import { motion } from 'framer-motion';

const SignedHome = () => {
  const { user, username, verified } = useContext(AuthContext)!;

  let photoSuffix = '';
  if (user?.photoURL?.includes('facebook')) photoSuffix = '?height=64';
  if (user?.photoURL?.includes('google')) photoSuffix = '=s64-c';

  const [emailNotVerified, setEmailNotVerified] = useState(
    !user?.emailVerified!
  );

  const [messages, loadingMessages, messagesError] = useCollectionDataOnce<Message<Timestamp>>(
    db.collection('messages')
      .where('to', '==', user?.uid)
      .where('allowRead', '==', true)
      .orderBy('createdAt', 'desc'),
    {
      idField: 'id'
    }
  );

  return (
    <Container>
      {emailNotVerified && user?.email && (
        <EmailNotVerifiedMessage setEmailNotVerified={setEmailNotVerified} />
      )}
      {!user?.displayName && <NameIsNotSet />}
      {!username && <UsernameIsNotSet />}
      {user && username && (
        <UserCard
          user={{
            uid: user.uid,
            displayName: user.displayName!,
            photoURL: user.photoURL! + photoSuffix,
            verified
          }}
          username={username}
        />
      )}

      <h3 className="mt-4 mb-3">الرسائل المستلمة</h3>
      {messagesError && (
        <Alert variant="danger">
          {/* @ts-ignore */}
          {firebaseMessages[messagesError.code] ?? 'حدثت مشكلة ما'}
        </Alert>
      )}
      {loadingMessages && <Loader />}
      {messages && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <MessagesLayout messages={messages} />
        </motion.div>
      )}
    </Container>
  );
};

export default SignedHome;
