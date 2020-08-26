import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();
const messaging = admin.messaging();

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

async function getUIDByMessageId(messageId: string) {
  const {
    docs: [message]
  } = await db
    .collectionGroup('messages')
    .where('messageId', '==', messageId)
    .get();

  const userId = message?.ref.parent.parent?.id;

  return userId;
}

async function sendNotification(
  userId: string,
  payload: admin.messaging.MessagingPayload
) {
  const devices = await db
    .collection('devices')
    .where('userId', '==', userId)
    .get();
  const tokens: string[] = devices.docs.map(doc => doc.data().token);

  // Send Notifications
  messaging.sendToDevice(tokens, payload).catch(err => console.error(err));
}

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

    sendNotification(to, {
      notification: {
        title: 'فضفضة: رسالة جديدة',
        body: content.length > 30 ? content.substring(0, 30) + '...' : content,
        icon: '/icons/android-chrome-192x192.png',
        clickAction: `/inbox?goto=${snap.id}`
      }
    }).catch(err => console.error(err));

    if (context.auth?.uid) {
      db.collection('users')
        .doc(context.auth?.uid)
        .collection('messages')
        .doc(snap.id)
        .set({
          messageId: snap.id,
          createdAt: new Date()
        })
        .catch(err => {
          console.error(err);
          throw new functions.https.HttpsError('unknown', 'حدثت مشكلة ما');
        });
    }

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

    function block(uid: string, isSender: boolean) {
      if (context.auth?.uid === id)
        throw new functions.https.HttpsError(
          'invalid-argument',
          'لا يمكنك القيام بحظر نفسك'
        );

      return db
        .collection('users')
        .doc(context.auth!.uid)
        .collection('blocked')
        .doc(uid)
        .set({ userId: uid, isSender });
    }

    switch (type) {
      case 'uid':
        return block(id, false);
      case 'username':
        const uid = await getUIDByUsername(id);
        return block(uid, false);
      case 'messageId':
        /** Locating the message in the author's subcollection of messages */
        const authorId = await getUIDByMessageId(id);

        if (!authorId)
          throw new functions.https.HttpsError(
            'not-found',
            'المستخدم الذي أرسل هذه الرسالة غير مُسَجَّل ولا يمكننا حظره، ولكن بإمكانك تعطيل استقبال الرسائل من العامة من الإعدادات'
          );

        return block(authorId, true);
      default:
        throw new functions.https.HttpsError(
          'invalid-argument',
          'لا نستطيع إيجاد المستخدم الذي تحاول حظره'
        );
    }
  }
);

export const removeUserData = functions.auth.user().onDelete(user => {
  db.collection('users')
    .doc(user.uid)
    .delete()
    .catch(err => console.error(err));
  db.collection('verified_users')
    .doc(user.uid)
    .delete()
    .catch(err => console.error(err));
  db.collection('messages')
    .where('to', '==', user.uid)
    .get()
    .then(({ docs }) => Promise.all(docs.map(doc => doc.ref.delete())))
    .catch(err => console.error(err));
});

export const sendWhoRequest = functions.https.onCall(
  async (messageId: string, context) => {
    if (!context.auth)
      throw new functions.https.HttpsError(
        'unauthenticated',
        'ثم بالدخول إلى حسابك للاستمتاع بكافة مميزات فضفضة'
      );

    const authorId = await getUIDByMessageId(messageId);

    if (!authorId)
      throw new functions.https.HttpsError(
        'not-found',
        'المستخدم الذي أرسل هذه الرسالة غير مُسَجَّل ولا يمكننا معرفة من يكون، ولكن بإمكانك تعطيل استقبال الرسائل من العامة من الإعدادات'
      );

    db.collection('users')
      .doc(authorId)
      .collection('who_requests')
      .add({
        on: messageId,
        sentAt: new Date()
      })
      .catch(err => console.error(err));

    return true;
  }
);

export const sendLoveNotification = functions.firestore
  .document('/messages/{messageId}')
  .onUpdate(async change => {
    const message = change.after.data();
    // Love State Changed
    if (message.love && message.love !== change.before.data().love) {
      const reciever = await getUserById(message.to);

      const senderId = await getUIDByMessageId(change.after.id);
      const sender = await getUserById(senderId!);

      const body = `أَحَبَّ ${reciever?.displayName} رسالتك "${
        message.content.length > 30
          ? message.content.substring(0, 30) + '...'
          : message.content
      }"`;

      sendNotification(sender?.uid ?? '', {
        notification: {
          body,
          title: 'فضفضة',
          icon: reciever?.photoURL ?? '/images/avatar.svg',
          clickAction: `/outbox?goto=${change.after.id}`
        }
      }).catch(err => console.error(err));
    }
  });
