import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

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
  const { uid, displayName, photoURL } = await admin.auth().getUser(userId);

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
}

export const getUserData = functions.https.onCall(
  async ({ id, type }: { id: string; type: 'username' | 'uid' }) => {
    if (type === 'username') {
      const doc = await db.collection('usernames').doc(id).get();
      if (!doc.data()) return null;
      const { userId } = doc.data()!;
      return getUserById(userId);
    }
    else if (type === 'uid') return getUserById(id);
    else return null;
  }
);

export const belongMesssageToUser = functions.firestore
  .document('/messages/{messageId}')
  .onCreate(async snap => {
    const userId: string | null = snap.data().from;

    if (userId)
      return db
        .collection('users')
        .doc(userId)
        .collection('messages')
        .doc(snap.id)
        .set({
          messageId: snap.id
        })
        .then(() =>
          snap.ref.update({
            from: null,
            allowRead: true
          })
        );

    return snap.ref.update({
      from: null,
      allowRead: true
    });
  });

export const unbelongMessageToUser = functions.firestore
  .document('/messages/{messageId}')
  .onDelete(async (_, { params }) => {
    const { docs } = await db
      .collectionGroup('messages')
      .where('messageId', '==', params.messageId)
      .get();

    return docs.map(doc => doc.ref.delete());
  });
