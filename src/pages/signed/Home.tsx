import * as React from 'react';
import { useState, useContext } from 'react';
import { AuthContext } from '../../store/AuthContext';
import { Container } from 'react-bootstrap';
import EmailNotVerifiedMessage from '../../components/signed/EmailNotVerifiedMessage';
import NameIsNotSet from '../../components/signed/NameIsNotSet';
import UsernameIsNotSet from '../../components/signed/UsernameIsNotSet';
import UserCard from '../../components/UserCard';
import MessagesLayout from '../../components/MessagesLayout';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from '../../config/firebase';
import Message from '../../types/Message';
import { Timestamp } from '@firebase/firestore-types';

const SignedHome = () => {
  const { user, username, verified } = useContext(AuthContext)!;

  let photoSuffix = '';
  if (user?.photoURL?.includes('facebook')) photoSuffix = '?height=64';
  if (user?.photoURL?.includes('google')) photoSuffix = '=s64-c';

  const [emailNotVerified, setEmailNotVerified] = useState(
    !user?.emailVerified!
  );

  const [messages, loadingMessages, messagesError] = useCollectionData<Message<Timestamp>>(
    db.collection('messages').where('to', '==', user?.uid),
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
      {messages && <MessagesLayout messages={messages} />}
    </Container>
  );
};

export default SignedHome;
