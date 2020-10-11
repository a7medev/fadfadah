import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { functions } from '../config/firebase';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
import UserCard from '../components/UserCard';
import SendMessage from '../components/SendMessage';
import MiniUser from '../types/MiniUser';
import { AuthContext } from '../contexts/AuthContext';
import { LinkContainer } from 'react-router-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import { Helmet } from 'react-helmet';
import UserCardSkeleton from '../components/UserCardSkeleton';
import Offline from '../components/icons/Offline';

export interface ProfileProps
  extends RouteComponentProps<{ username: string }> {}

const Profile: React.FC<ProfileProps> = ({
  match: {
    params: { username }
  },
  history
}) => {
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState<boolean>(false);
  const [user, setUser] = useState<MiniUser | null>(null);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (username !== currentUser?.username) {
      const getUserData = functions.httpsCallable('getUserData');
      getUserData({ id: username, type: 'username' })
        .then(result => {
          setOffline(false);
          setLoading(false);
          setUser(result.data);
        })
        .catch(err => {
          setLoading(false);
          setOffline(true);
        });
    } else history.replace('/inbox');
  }, [username, currentUser, history]);

  return (
    <PageTransition>
      <Helmet>
        <title>{user ? `${user.displayName} | ` : ''}فضفضة</title>
      </Helmet>

      <Container>
        {loading ? (
          <>
            <UserCardSkeleton />
            <Loader style={{ marginTop: 150, marginBottom: 20 }} />
          </>
        ) : offline ? (
          <div className="my-3">
            <Offline />
          </div>
        ) : user ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <UserCard user={{ ...user, username }} />

            <SendMessage user={user} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-muted h2 mt-5 mb-3">هذا المستخدم غير موجود</p>
            <LinkContainer to="/inbox">
              <Button>
                <FaArrowRight className="ml-1" size="1em" />
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
