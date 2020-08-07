import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const isValidUsername = functions.https.onCall((username: string, context) => {
  // Only unauthenticated users can check for username
  if (!context.auth) {
    return db.collection('usernames')
      .doc(username)
      .get()
      .then(snap => !snap.exists)
      .catch(err => console.error(err));
  }

  return false;
});
