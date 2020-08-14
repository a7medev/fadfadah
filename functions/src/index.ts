import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

export const sendMessage = functions.https.onCall(
  async ({ content, to }, context) => {
    if (!content || !to)
      throw new functions.https.HttpsError(
        'invalid-argument',
        'رجاءاً تأكد من إدخال بيانات صحيحة'
      );

    if (content.trim().length <= 5 || content.trim().length >= 500)
      throw new functions.https.HttpsError(
        'invalid-argument',
        'يجب أن تحتوي الرسالة على 5 إلى 500 حرف'
      );

    try {
      const recieverExists = await auth.getUser(to);

      if (!recieverExists)
        throw new functions.https.HttpsError(
          'invalid-argument',
          'المستخدم الذي تحاول مراسلته غير موجود'
        );
    } catch (err) {
      console.error(err);
      throw new functions.https.HttpsError(
        'invalid-argument',
        'المستخدم الذي تحاول مراسلته غير موجود'
      );
    }

    if (context.auth) {
      const { exists: userIsBlocked } = await db
        .collection('users')
        .doc(to)
        .collection('blocked')
        .doc(context.auth.uid)
        .get();

      if (userIsBlocked)
        throw new functions.https.HttpsError(
          'permission-denied',
          'لا يمكنك مراسلة هذا المستخدم بعد الآن'
        );
    }

    const doc = {
      to,
      content: content.trim(),
      love: false,
      createdAt: new Date()
    };

    const snap = await db.collection('messages').add(doc);

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
  }
);

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
      .doc(username.toLowerCase())
      .get()
      .then(snap => !snap.exists)
      .catch(err => console.error(err));
  }
);

export const setUsername = functions.https.onCall(
  async (passedUsername: string, context) => {
    const username = passedUsername.trim().toLowerCase();

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

async function getUIDByUsername(username: string) {
  const doc = await db
    .collection('usernames')
    .doc(username.toLowerCase())
    .get();
  if (!doc.data()) return null;
  const { userId } = doc.data()!;

  return userId;
}

export const getUserData = functions.https.onCall(
  async ({ id, type }: { id: string; type: 'username' | 'uid' }) => {
    if (type === 'username') {
      const userId = await getUIDByUsername(id);
      return userId ? getUserById(userId) : null;
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

export const blockUser = functions.https.onCall(
  async (
    { id, type }: { id: string; type: 'uid' | 'username' | 'messageId' },
    context
  ) => {
    if (!context.auth)
      throw new functions.https.HttpsError(
        'unauthenticated',
        'قم بالدخول إلى حسابك لتتمكن من حظر المستخدمين'
      );

    function block(uid: string) {
      return db
        .collection('users')
        .doc(context.auth!.uid)
        .collection('blocked')
        .doc(uid)
        .set({ userId: uid });
    }

    switch (type) {
      case 'uid':
        return block(id);
      case 'username':
        const uid = await getUIDByUsername(id);
        return block(uid);
      case 'messageId':
        /** Locating the message in the author's subcollection of messages */
        const {
          docs: [message]
        } = await db
          .collectionGroup('messages')
          .where('messageId', '==', id)
          .get();

        const authorId = message.ref.parent.parent?.id;

        if (!message || !authorId)
          throw new functions.https.HttpsError(
            'not-found',
            'المستخدم الذي أرسل هذه الرسالة غير موجود ولا يمكننا حظره'
          );

        return block(authorId);
      default:
        throw new functions.https.HttpsError(
          'invalid-argument',
          'لا نستطيع إيجاد المستخدم الذي تحاول حظره'
        );
    }
  }
);

export const removeUserData = functions.auth.user().onDelete(async user => {
  const promises: Promise<any>[] = [];
  promises.push(db.collection('users').doc(user.uid).delete());
  promises.push(db.collection('verified_users').doc(user.uid).delete());
  promises.push(
    db
      .collection('usernames')
      .where('userId', '==', user.uid)
      .get()
      .then(({ docs }) => docs.map(doc => doc.ref.delete))
  );

  return Promise.all(promises);
});
