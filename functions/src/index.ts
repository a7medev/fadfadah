import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as sharp from 'sharp';
import type Settings from '../types/Settings';

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();
const messaging = admin.messaging();

async function getUserById(
  userId: string,
  options?: { withUsername?: boolean }
) {
  if (!userId) return null;

  try {
    const { uid, displayName, photoURL } = await auth.getUser(userId);
    let photoSuffix = '';
    if (photoURL?.includes('facebook')) photoSuffix = '?height=64';
    if (photoURL?.includes('google')) photoSuffix = '=s64-c';
    if (photoURL?.includes('firebase')) photoSuffix = '';

    const { exists: verified } = await db
      .collection('verified_users')
      .doc(uid)
      .get();

    let username: string | null = null;

    if (options?.withUsername) {
      const snap = await db
        .collection('usernames')
        .where('userId', '==', userId)
        .get();

      username = snap.docs[0]?.id ?? null;
    }

    const retrievableUser: {
      uid: string;
      displayName: string | undefined;
      photoURL: string;
      verified: boolean;
      username?: string | null;
    } = {
      uid,
      displayName,
      photoURL: photoURL + photoSuffix,
      verified
    };

    if (options?.withUsername) retrievableUser.username = username;

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

export const initUserAccount = functions.auth.user().onCreate(user => {
  return db
    .collection('users')
    .doc(user.uid)
    .set({
      settings: {
        blockUnsignedMessages: false,
        airplaneMode: false
      }
    })
    .catch(err => console.error(err));
});

export const sendMessage = functions.https.onCall(
  async ({ content, to, isAnonymous }, context) => {
    if (!content || !to)
      throw new functions.https.HttpsError(
        'invalid-argument',
        'رجاءاً تأكد من إدخال بيانات صحيحة'
      );

    if (!isAnonymous && !context.auth)
      throw new functions.https.HttpsError(
        'invalid-argument',
        'لابد من تسجيل الدخول لإرسال رسائل غير مجهولة'
      );

    if (content.trim().length < 5 || content.trim().length > 500)
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

    const settingsSnap = await db.collection('users').doc(to).get();
    const settings: Settings = settingsSnap.data()?.settings;

    if (settings.airplaneMode) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'لا يمكن لأحدٍ مراسلة هذا المستخدم في الوقت الحالي'
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
    } else if (settings.blockUnsignedMessages) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'رجاءاً قم بالتسجيل في فضفضة لتتمكن من مراسلة هذا المستخدم'
      );
    }

    const doc: {
      to: string;
      from?: string;
      content: string;
      love: boolean;
      createdAt: Date;
    } = {
      to,
      content: content.trim(),
      love: false,
      createdAt: new Date()
    };

    if (!isAnonymous) doc.from = context.auth!.uid;

    const snap = await db.collection('messages').add(doc);

    sendNotification(to, {
      notification: {
        title: 'فضفضة: رسالة جديدة',
        body:
          content.length > 100 ? content.substring(0, 100) + '...' : content,
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
      return userId ? { ...(await getUserById(userId)), username: id } : null;
    } else if (type === 'uid') {
      return getUserById(id, { withUsername: true });
    } else {
      return null;
    }
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
  // Delete User's data like: Setttings, Messages he sent ...etc
  db.collection('users')
    .doc(user.uid)
    .delete()
    .catch(err => console.error(err));

  // Delete User's verified status
  db.collection('verified_users')
    .doc(user.uid)
    .delete()
    .catch(err => console.error(err));

  // Delete the messages are sent to the User
  db.collection('messages')
    .where('to', '==', user.uid)
    .get()
    .then(({ docs }) => Promise.all(docs.map(doc => doc.ref.delete())))
    .catch(err => console.error(err));

  // Delete User's signed devices and FCM tokens
  db.collection('devices')
    .where('userId', '==', user.uid)
    .get()
    .then(({ docs }) => Promise.all(docs.map(doc => doc.ref.delete())))
    .catch(err => console.error(err));
});

export const sendWhoRequest = functions.https.onCall(
  async (messageId: string, context) => {
    if (!context.auth)
      throw new functions.https.HttpsError(
        'unauthenticated',
        'قم بالدخول إلى حسابك للاستمتاع بكافة مميزات فضفضة'
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

export const resizeProfilePhoto = functions.storage
  .object()
  .onFinalize(async object => {
    const bucket = storage.bucket(object.bucket);
    const filePath = object.name!;

    // Check if it's a profile photo path
    const profilePhotoPath = /^[^/]+\/profile_photo\/[^/]+$/;
    if (!profilePhotoPath.test(filePath)) return false;

    const fileName = filePath.split('/').pop()!;
    const bucketDir = path.dirname(filePath);

    const workingDir = path.join(os.tmpdir(), 'profile_photos');
    const tmpFilePath = path.join(workingDir, 'source.png');

    if (fileName.includes('__photo__@')) return false;

    await fs.ensureDir(workingDir);

    await bucket.file(filePath).download({
      destination: tmpFilePath
    });

    const photoName = `__photo__@${fileName}`;
    const photoPath = path.join(workingDir, photoName);

    await sharp(tmpFilePath).resize(100, 100).toFile(photoPath);

    await bucket.upload(photoPath, {
      destination: path.join(bucketDir, photoName)
    });

    await fs.remove(workingDir);

    const userId = filePath.split('/').shift()!;

    const photoURL = `https://firebasestorage.googleapis.com/v0/b/fad-fadah.appspot.com/o/${userId}%2Fprofile_photo%2F${photoName}?alt=media`;

    return auth.updateUser(userId, {
      photoURL
    });
  });
