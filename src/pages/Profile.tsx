import * as React from 'react';
import { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';
import { functions } from '../config/firebase';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
import UserCard from '../components/UserCard';
import SendMessage from '../components/SendMessage';
import MiniUser from '../types/MiniUser';

export interface ProfileProps
  extends RouteComponentProps<{ username: string }> {}

const Profile: React.FC<ProfileProps> = ({
  match: {
    params: { username }
  }
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<MiniUser | null>(null);

  useEffect(() => {
      const getUserByUsername = functions.httpsCallable('getUserByUsername');
      getUserByUsername(username)
        .then(result => {
          setError(null);
          setLoading(false);
          setUser(result.data);
        })
        .catch(err => {
          setLoading(false);
          setError('حدثت مشكلة في الشبكة، تأكد من اتصال الإنترنت لديك')
        });
  }, [username]);

  return (
    <Container>
      {loading ? (
        <Loader style={{ marginTop: 150, marginBottom: 20 }} />
      ) : error ? (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      ) : user && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <UserCard user={user} username={username} />

          <SendMessage user={user} />
        </motion.div>
      )}
    </Container>
  );
};

export default Profile;
