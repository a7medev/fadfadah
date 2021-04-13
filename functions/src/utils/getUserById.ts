import MiniUser from '../types/MiniUser';
import { db } from '../config/firebase';
import resizePhoto from './resizePhoto';

const getUserById = async (userId: string) => {
  if (!userId) return null;

  try {
    const snap = await db.collection('users').doc(userId).get();
    const user = snap.data() as MiniUser;
    const resizedPhoto = resizePhoto(user.photoURL);

    return { ...user, photoURL: resizedPhoto };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export default getUserById;
