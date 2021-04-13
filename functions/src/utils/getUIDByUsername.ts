import { db } from '../config/firebase';

const getUIDByUsername = async (username: string) => {
  const doc = await db
    .collection('usernames')
    .doc(username.toLowerCase())
    .get();
  const data = doc.data();
  if (!data) return null;
  const { userId } = doc.data() as { userId: string };
  return userId;
};

export default getUIDByUsername;
