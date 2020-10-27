import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, RouteComponentProps, redirectTo } from '@reach/router';
import { Container, Button } from 'react-bootstrap';
import { functions } from '../config/firebase';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
import UserCard from '../components/UserCard';
import SendMessage from '../components/SendMessage';
import MiniUser from '../types/MiniUser';
import { useAuth } from '../contexts/AuthContext';
import { FaArrowRight } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import { Helmet } from 'react-helmet';
import UserCardSkeleton from '../components/UserCardSkeleton';
import Offline from '../components/icons/Offline';

export interface ProfileProps
  extends RouteComponentProps<{ username: string }> {}

const Profile: React.FC<ProfileProps> = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState<boolean>(false);
  const [user, setUser] = useState<MiniUser | null>(null);
  const { user: currentUser } = useAuth();

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
    } else redirectTo('/inbox');
  }, [username, currentUser]);

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
            <Button as={Link} to="/inbox">
              <FaArrowRight className="ml-1" size="1em" />
              عودة إلى الرئيسية
            </Button>
          </motion.div>
        )}
      </Container>
    </PageTransition>
  );
};

export default Profile;
