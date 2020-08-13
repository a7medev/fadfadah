import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

export const sendMessage = functions.https.onCall(async ({ content, to }, context) => {
  if (!content || !to)
    throw new functions.https.HttpsError('invalid-argument', 'رجاءاً تأكد من إدخال بيانات صحيحة');

  if (content.trim().length <= 5 || content.trim().length >= 500)
    throw new functions.https.HttpsError('invalid-argument', 'يجب أن تحتوي الرسالة على 5 إلى 500 حرف');

  try {
    const recieverExists = await auth.getUser(to);
  
    if (!recieverExists)
      throw new functions.https.HttpsError('invalid-argument', 'المستخدم الذي تحاول مراسلته غير موجود');
  } catch (err) {
    console.error(err);
    throw new functions.https.HttpsError('invalid-argument', 'المستخدم الذي تحاول مراسلته غير موجود');
  }

  const doc = {
    to,
    content: content.trim(),
    love: false,
    createdAt: new Date()
  };

  const snap = await db.collection('messages').add(doc)

  if (context.auth?.uid)
    db.collection('users')
      .doc(context.auth?.uid)
      .collection('messages')
      .doc(snap.id)
      .set({
        messageId: snap.id
      })
      .catch(err => {
        console.error(err);
        throw new functions.https.HttpsError('unknown', 'حدثت مشكلة ما');
      });
  
  return true;
});

export const usernameIsAvailable = functions.https.onCall(
  async (username: string, context) => {
    // Only users without a username can check for username
    const { size: hasUsername } = await db
      .collection('usernames')
      .where('userId', '==', context.auth?.uid)
      .get();

    if (hasUsername) return false;

    return db
      .collection('usernames')
      .doc(username)
      .get()
      .then(snap => !snap.exists)
      .catch(err => console.error(err));
  }
);

export const setUsername = functions.https.onCall(
  async (passedUsername: string, context) => {
    const username = passedUsername.trim();

    if (!context.auth || !/^[A-Z_0-9]+$/i.test(username)) return false;

    const { size: hasUsername } = await db
      .collection('usernames')
      .where('userId', '==', context.auth?.uid)
      .get();

    if (hasUsername) return false;

    const snap = await db.collection('usernames').doc(username).get();
    if (snap.exists) return false;
    return snap.ref.set({ userId: context.auth?.uid });
  }
);

async function getUserById(userId: string) {
  if (!userId) return null;

  try {
    const { uid, displayName, photoURL } = await auth.getUser(userId);
    let photoSuffix = '';
    if (photoURL?.includes('facebook')) photoSuffix = '?height=64';
    if (photoURL?.includes('google')) photoSuffix = '=s64-c';

    const { exists: verified } = await db
      .collection('verified_users')
      .doc(uid)
      .get();

    const retrievableUser = {
      uid,
      displayName,
      photoURL: photoURL + photoSuffix,
      verified
    };

    return retrievableUser;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export const getUserData = functions.https.onCall(
  async ({ id, type }: { id: string; type: 'username' | 'uid' }) => {
    if (type === 'username') {
      const doc = await db.collection('usernames').doc(id).get();
      if (!doc.data()) return null;
      const { userId } = doc.data()!;
      return getUserById(userId);
    } else if (type === 'uid') return getUserById(id);
    else return null;
  }
);

export const unbelongMessageToUser = functions.firestore
  .document('/messages/{messageId}')
  .onDelete(async (_, { params }) => {
    const { docs } = await db
      .collectionGroup('messages')
      .where('messageId', '==', params.messageId)
      .get();

    return docs.map(doc => doc.ref.delete());
  });
