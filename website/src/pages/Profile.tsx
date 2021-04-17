import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps, redirectTo } from '@reach/router';
import { Helmet } from 'react-helmet';
import { Container, Button } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

import Loader from '../components/Loader';
import UserCard from '../components/UserCard';
import SendMessage from '../components/SendMessage';
import PageTransition from '../components/PageTransition';
import UserCardSkeleton from '../components/UserCardSkeleton';
import OfflineIcon from '../components/OfflineIcon';
import type MiniUser from '../types/MiniUser';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

const getUser = async (username?: string) => {
  if (!username) return null;

  const snap = await db
    .collection('users')
    .where('username', '==', username)
    .limit(1)
    .get();

  const [userDoc] = snap.docs;

  if (!userDoc.exists) {
    throw new Error('no user');
  }

  return userDoc.data() as MiniUser;
};

export interface ProfileProps
  extends RouteComponentProps<{ username: string }> {}

const Profile: React.FC<ProfileProps> = ({ username }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [user, setUser] = useState<MiniUser | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (username === currentUser?.username) return redirectTo('/inbox');

    getUser(username)
      .then(user => {
        setUser(user);
        setIsOffline(false);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        if (err.message === 'no user') {
          return setIsNotFound(true);
        }
        console.error(err);
        setIsOffline(true);
      });
  }, [username, currentUser]);

  return (
    <PageTransition>
      <Helmet>
        <title>{user ? `${user.displayName} | ` : ''}فضفضة</title>
      </Helmet>

      <Container>
        {isLoading ? (
          <>
            <UserCardSkeleton />
            <Loader style={{ marginTop: 150, marginBottom: 20 }} />
          </>
        ) : isOffline ? (
          <div className="my-3">
            <OfflineIcon />
          </div>
        ) : user ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <UserCard user={{ ...user, username }} />

            <SendMessage user={user} />
          </motion.div>
        ) : (
          isNotFound && (
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
          )
        )}
      </Container>
    </PageTransition>
  );
};

export default Profile;
