import Head from 'next/head';

import UserDetails from '../../components/UserDetails';
import useRedirectToFadfadah from '../../hooks/useRedirectToFadfadah';
import resizePhoto from '../../utils/resizePhoto';
import { db } from '../../config/firebase';

export const getServerSideProps = async ({ params }) => {
  const username = params.username.toLowerCase();
  const snap = await db
    .collection('users')
    .where('username', '==', username)
    .limit(1)
    .get();

  const [userDoc] = snap.docs;

  if (!userDoc) {
    return { notFound: true };
  }

  const user = userDoc.data();
  const displayName = user.displayName || 'مستخدم فضفضة';
  const photoURL = resizePhoto(user.photoURL, 500) || '/images/avatar.png';

  return { props: { user: { ...user, displayName, photoURL } } };
};

const Profile = ({ user }) => {
  useRedirectToFadfadah();

  return (
    <div>
      <Head>
        <title>{user.displayName} | فضفضة</title>
        <meta property="og:image" content={user.photoURL} />
      </Head>

      <UserDetails user={user} />
    </div>
  );
};

export default Profile;
