import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import EmailNotVerifiedMessage from './EmailNotVerifiedMessage';
import UserCard from '../UserCard';
import { motion, Variants } from 'framer-motion';
import UserCardSkeleton from '../UserCardSkeleton';
import CompleteAccountData from './CompleteAccountData';
import resizePhoto from '../../utils/resizePhoto';

const slideVariants: Variants = {
  out: {
    overflow: 'hidden',
    height: 0,
    transition: { type: 'tween', ease: 'linear', duration: 0.2 }
  },
  in: {
    height: 'auto',
    transition: { type: 'tween', ease: 'linear', duration: 0.2 }
  }
};

const fadeVariants: Variants = {
  out: {
    opacity: 0,
    transition: { type: 'tween', ease: 'linear', duration: 0.4 }
  },
  in: {
    opacity: 1,
    transition: { type: 'tween', ease: 'linear', duration: 0.4 }
  }
};

const SignedUserCard: React.FC = () => {
  const { user, firebaseUser } = useAuth();

  const resizedPhoto = resizePhoto(user?.photoURL);

  const [showEmailNotVerified, setShowEmailNotVerified] = useState<boolean>(
    !firebaseUser?.emailVerified && !!firebaseUser?.email
  );

  useEffect(() => {
    setShowEmailNotVerified(
      !firebaseUser?.emailVerified && !!firebaseUser?.email
    );
  }, [firebaseUser]);

  return (
    <>
      {user && user.username && (
        <motion.div
          initial="out"
          animate="in"
          exit="out"
          variants={fadeVariants}
        >
          <UserCard
            user={{
              ...user,
              photoURL: resizedPhoto
            }}
          />
        </motion.div>
      )}
      {user === undefined && (
        <motion.div
          initial="out"
          animate="in"
          exit="out"
          variants={fadeVariants}
        >
          <UserCardSkeleton />
        </motion.div>
      )}

      {showEmailNotVerified && (
        <motion.div
          initial="out"
          animate="in"
          exit="out"
          variants={slideVariants}
        >
          <EmailNotVerifiedMessage setShow={setShowEmailNotVerified} />
        </motion.div>
      )}

      {user && (!user.displayName || !user.username || !user.gender) && (
        <CompleteAccountData
          missingDisplayName={!user.displayName}
          missingUsername={!user.username}
          missingGender={!user.gender}
        />
      )}
    </>
  );
};

export default SignedUserCard;
