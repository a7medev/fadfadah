import Head from 'next/head';

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

  return { props: { user: userDoc.data() } };
};

const Profile = ({ user }) => {
  const name = user.displayName || 'مستخدم فضفضة';
  const photoURL = user.photoURL || '/images/avatar.png';

  return (
    <div>
      <Head>
        <title>{name} | فضفضة</title>
        <meta property="og:image" content={photoURL} />
      </Head>

      <img src={photoURL} />
      <h1>{name}</h1>
      <h2>@{user.username}</h2>
    </div>
  );
};

export default Profile;
