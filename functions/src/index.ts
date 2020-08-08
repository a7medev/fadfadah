import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const isValidUsername = functions.https.onCall(
  (username: string, context) => {
    // Only unauthenticated users can check for username
    if (!context.auth)
      return db
        .collection('usernames')
        .doc(username)
        .get()
        .then(snap => !snap.exists)
        .catch(err => console.error(err));

    return false;
  }
);

export const setUsername = functions.https.onCall(
  async (passedUsername: string, context) => {

    const username = passedUsername.trim();

    if (!context.auth || !/^[A-Z_0-9]+$/i.test(username)) return false;

    const { size: hasUsername } = await db.collection('usernames').where('userId', '==', context.auth?.uid).get();

    if (hasUsername) return false;

    const snap = await db.collection('usernames').doc(username).get();
    if (snap.exists) return false;
    return snap.ref.set({ userId: context.auth?.uid });
  }
);
