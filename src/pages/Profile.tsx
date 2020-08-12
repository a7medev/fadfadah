import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';
import { functions } from '../config/firebase';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
import UserCard from '../components/UserCard';
import SendMessage from '../components/SendMessage';
import MiniUser from '../types/MiniUser';
import { AuthContext } from '../store/AuthContext';
import { LinkContainer } from 'react-router-bootstrap';
import { BsArrowRightShort } from 'react-icons/bs';
import PageTransition from '../components/PageTransition';

export interface ProfileProps
  extends RouteComponentProps<{ username: string }> {}

const Profile: React.FC<ProfileProps> = ({
  match: {
    params: { username }
  },
  history
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<MiniUser | null>(null);
  const { username: currentUsername } = useContext(AuthContext)!;

  useEffect(() => {
    if (username !== currentUsername) {
      const getUserByUsername = functions.httpsCallable('getUserByUsername');
      getUserByUsername(username)
        .then(result => {
          setError(null);
          setLoading(false);
          setUser(result.data);
        })
        .catch(err => {
          setLoading(false);
          setError('حدثت مشكلة في الشبكة، تأكد من اتصال الإنترنت لديك');
        });
    } else history.replace('/home');
  }, [username, currentUsername, history]);

  return (
    <PageTransition>
      <Container>
        {loading ? (
          <Loader style={{ marginTop: 150, marginBottom: 20 }} />
        ) : error ? (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        ) : user ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <UserCard user={user} username={username} />

            <SendMessage user={user} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-muted h2 mt-5 mb-3">هذا المستخدم غير موجود</p>
            <LinkContainer to="/home">
              <Button>
                <BsArrowRightShort className="ml-1" size="1.5em" />
                عودة إلى الرئيسية
              </Button>
            </LinkContainer>
          </motion.div>
        )}
      </Container>
    </PageTransition>
  );
};

export default Profile;
