import * as React from 'react';
import { useState, useContext } from 'react';
import { AuthContext } from '../../store/AuthContext';
import EmailNotVerifiedMessage from './EmailNotVerifiedMessage';
import UserCard from '../UserCard';
import { motion, Variants } from 'framer-motion';
import UserCardSkeleton from '../UserCardSkeleton';
import CompleteAccountData from './CompleteAccountData';
import { auth } from '../../config/firebase';

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
  const { user } = useContext(AuthContext);

  let photoSuffix = '';
  if (user?.photoURL?.includes('facebook')) photoSuffix = '?height=64';
  if (user?.photoURL?.includes('google')) photoSuffix = '=s64-c';
  if (user?.photoURL?.includes('firebase')) photoSuffix = '';

  const [emailNotVerified, setEmailNotVerified] = useState(
    !auth.currentUser?.emailVerified
  );

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
              photoURL: user.photoURL + photoSuffix
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

      {emailNotVerified && auth.currentUser?.email && (
        <motion.div
          initial="out"
          animate="in"
          exit="out"
          variants={slideVariants}
        >
          <EmailNotVerifiedMessage setEmailNotVerified={setEmailNotVerified} />
        </motion.div>
      )}

      {user && (!user.displayName || !user.username || !user.gender) && (
        <CompleteAccountData
          missingDisplayName={!user.displayName}
          missingUsername={!user.username}
          missingGender={!user.gender}
        />
      )}

      {/* {!user?.displayName && (
        <motion.div
          initial="out"
          animate="in"
          exit="out"
          variants={slideVariants}
        >
          <NameIsNotSet />
        </motion.div>
      )}
      {username === null && (
        <motion.div
          initial="out"
          animate="in"
          exit="out"
          variants={slideVariants}
        >
          <UsernameIsNotSet />
        </motion.div>
      )} */}
    </>
  );
};

export default SignedUserCard;
