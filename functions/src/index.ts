import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as sharp from 'sharp';
import type Message from './types/Message';
import type WhoRequest from './types/WhoRequest';
import type UserData from './types/UserData';
import Gender from './types/Gender';
import resizePhoto from './utils/resizePhoto';

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();
const messaging = admin.messaging();

const getUserById = async (
  userId: string,
  options?: { withUsername?: boolean }
) => {
  if (!userId) return null;

  try {
    const { uid, displayName, photoURL } = await auth.getUser(userId);
    const resizedPhoto = resizePhoto(photoURL);

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

    const userDoc = await db.collection('users').doc(uid).get();
    let { gender } = userDoc.data() as UserData;
    gender = gender ? gender : Gender.MALE;

    const retrievableUser: {
      uid: string;
      displayName: string | undefined;
      photoURL: string | null;
      verified: boolean;
      username?: string | null;
      gender: Gender;
    } = {
      uid,
      displayName,
      photoURL: resizedPhoto,
      verified,
      gender
    };

    if (options?.withUsername) retrievableUser.username = username;

    return retrievableUser;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const getUIDByUsername = async (username: string) => {
  const doc = await db
    .collection('usernames')
    .doc(username.toLowerCase())
    .get();
  if (!doc.data()) return null;
  const { userId } = doc.data()!;

  return userId;
};

const getUIDByMessageId = async (messageId: string) => {
  const {
    docs: [message]
  } = await db
    .collectionGroup('messages')
    .where('messageId', '==', messageId)
    .get();

  const userId = message?.ref.parent.parent?.id;

  return userId;
};

const sendNotification = async (
  userId: string,
  payload: admin.messaging.MessagingPayload
) => {
  const devices = await db
    .collection('devices')
    .where('userId', '==', userId)
    .get();
  const tokens: string[] = devices.docs.map(doc => doc.data().token);

  // Send Notifications
  messaging.sendToDevice(tokens, payload).catch(err => console.error(err));
};

export const initUserAccount = functions.auth.user().onCreate(async user => {
  return db
    .collection('users')
    .doc(user.uid)
    .set({
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      verified: false,
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

    const userDoc = await db.collection('users').doc(to).get();
    const { settings, gender } = userDoc.data() as UserData;

    const thisUserWord =
      gender === Gender.FEMALE ? 'هذه المستخدمة' : 'هذا المستخدم';

    if (settings!.airplaneMode) {
      throw new functions.https.HttpsError(
        'permission-denied',
        `لا يمكن لأحدٍ مراسلة ${thisUserWord} في الوقت الحالي`
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
          `لا يمكنك مراسلة ${thisUserWord} بعد الآن`
        );
    } else if (settings!.blockUnsignedMessages) {
      throw new functions.https.HttpsError(
        'permission-denied',
        `رجاءاً قم بالتسجيل في فضفضة لتتمكن من مراسلة ${thisUserWord}`
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
      .where('userId', '==', context.auth.uid)
      .get();

    if (hasUsername) return false;

    const snap = await db.collection('usernames').doc(username).get();

    if (snap.exists) return false;

    return snap.ref
      .set({ userId: context.auth.uid })
      .then(() =>
        db
          .collection('users')
          .doc(context.auth!.uid)
          .set({ username: true }, { merge: true })
      );
  }
);

export const setUserVerifiedState = functions.firestore
  .document('/verified/{userId}')
  .onCreate(snap => {
    return db.collection('users').doc(snap.id).update({
      verified: true
    });
  });

export const removeUserVerifiedState = functions.firestore
  .document('/verified/{userId}')
  .onDelete(snap => {
    return db.collection('users').doc(snap.id).update({
      verified: false
    });
  });

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

export const removeMessageData = functions.firestore
  .document('/messages/{messageId}')
  .onDelete(async (_, { params }) => {
    const { docs: messages } = await db
      .collectionGroup('messages')
      .where('messageId', '==', params.messageId)
      .get();

    const { docs: whoRequests } = await db
      .collectionGroup('who_request')
      .where('message.id', '==', params.messageId)
      .get();

    return Promise.all(
      [...messages, ...whoRequests].map(doc => doc.ref.delete())
    );
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

    const block = (uid: string, isSender: boolean) => {
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
    };

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
        'يمكن للأشخاص المسجلين فقط إرسال طلبات معرفة المرسل.'
      );

    const authorId = await getUIDByMessageId(messageId);

    if (!authorId)
      throw new functions.https.HttpsError(
        'not-found',
        'المستخدم الذي أرسل هذه الرسالة غير مُسَجَّل ولا يمكننا معرفة من يكون.'
      );

    const messageSnap = await db.collection('messages').doc(messageId).get();
    const message = messageSnap.data()!;

    if (message.from)
      throw new functions.https.HttpsError(
        'invalid-argument',
        'يمكنك إرسال طلب معرفة المرسل على رسالة مجهولة فقط.'
      );

    const user = (await getUserById(context.auth.uid))!;

    db.collection('users')
      .doc(authorId)
      .collection('who_requests')
      .doc(messageId)
      .set({
        from: user.uid,
        message: {
          id: messageId,
          content: message.content
        },
        sentAt: new Date()
      })
      .then(() => {
        const wantWord = user.gender === Gender.FEMALE ? 'تريد' : 'يريد';
        const userWord = user.gender === Gender.FEMALE ? 'مستخدمة' : 'مستخدم';
        const knowWord = user.gender === Gender.FEMALE ? 'تعرف' : 'يعرف';
        const body = `${wantWord} ${
          user.displayName ?? `${userWord} فضفضة`
        } أن ${knowWord} من أنت على الرسالة "${
          message.content.length > 50
            ? message.content.substring(0, 50) + '...'
            : message.content
        }"`;

        return sendNotification(authorId, {
          notification: {
            title: 'فضفضة',
            body,
            icon: user.photoURL ?? '/images/avatar.svg',
            clickAction: `/who-requests?goto=${messageId}`
          }
        });
      })
      .catch(err => console.error(err));

    return true;
  }
);

export const acceptWhoRequest = functions.https.onCall(
  async (reqId, context) => {
    if (!context.auth)
      throw new functions.https.HttpsError(
        'unauthenticated',
        'يمكن للمسجلين على فضفضة فقط قبول أو رفض طلبات معرفة المرسل.'
      );

    const userId = context.auth.uid;
    const user = (await getUserById(userId))!;

    const reqSnap = await db
      .collection('users')
      .doc(userId)
      .collection('who_requests')
      .doc(reqId)
      .get();

    if (!reqSnap.exists)
      throw new functions.https.HttpsError(
        'not-found',
        'طلب معرفة المرسل الذي تحاول قبوله غير موجود'
      );

    const req = reqSnap.data()!;

    const messageId = req.message.id;
    return db
      .collection('messages')
      .doc(messageId)
      .update({
        from: userId
      })
      .then(() => reqSnap.ref.delete())
      .then(() => {
        const haveWord = user.gender === Gender.FEMALE ? 'قامت' : 'قام';
        const userWord = user.gender === Gender.FEMALE ? 'مستخدمة' : 'مستخدم';
        const body = `${haveWord} ${
          user.displayName ?? `${userWord} فضفضة`
        } بقبول طلب معرفة المرسل على الرسالة "${
          req.message.content.length > 50
            ? req.message.content.substring(0, 50) + '...'
            : req.message.content
        }"`;

        sendNotification(req.from, {
          notification: {
            title: 'فضفضة',
            body,
            icon: user.photoURL ?? '/images/avatar.svg',
            clickAction: `/inbox?goto=${messageId}`
          }
        }).catch(err => console.error(err));

        return true;
      })
      .catch(err => {
        console.error(err);
        return false;
      });
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

      const lovedWord =
        sender?.gender === Gender.FEMALE ? 'أَحَبَّت' : 'أَحَبَّ';
      const body = `${lovedWord} ${reciever?.displayName} رسالتك "${
        message.content.length > 100
          ? message.content.substring(0, 100) + '...'
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
    if (object.metadata?.resizedImage === 'true') return false;

    const bucket = storage.bucket(object.bucket);
    const filePath = object.name!;

    // Check if it's a profile photo path
    const profilePhotoPath = /^[^/]+\/profile_photo\/[^/]+$/;
    if (!profilePhotoPath.test(filePath)) return false;

    const photoName = filePath.split('/').pop()!;
    const bucketDir = path.dirname(filePath);

    const workingDir = path.join(os.tmpdir(), 'profile_photos');
    const tmpFilePath = path.join(workingDir, 'source.png');

    await fs.ensureDir(workingDir);

    await bucket.file(filePath).download({
      destination: tmpFilePath
    });

    const photoPath = path.join(workingDir, photoName);

    await sharp(tmpFilePath).resize(100, 100).toFile(photoPath);

    // Remove previous photos
    const [prevPhotos] = await bucket.getFiles({ directory: bucketDir });
    await Promise.all(prevPhotos.map(photo => photo.delete()));

    await bucket.upload(photoPath, {
      destination: filePath,
      metadata: {
        metadata: {
          resizedImage: 'true'
        }
      }
    });

    return fs.remove(workingDir);
  });

// Data Joining Functions
export const getInbox = functions.https.onCall(async (data, context) => {
  if (!context.auth)
    throw new functions.https.HttpsError(
      'unauthenticated',
      'فقط المستخدمين المُسَجَّلين يستطيعون استلام الرسائل.'
    );

  const userId = context.auth.uid;

  let ref = db
    .collection('messages')
    .where('to', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(8);

  if (data?.last) {
    const lastDoc = await db.collection('messages').doc(data.last).get();
    ref = ref.startAfter(lastDoc);
  }

  return ref.get().then(snap => {
    return Promise.all(
      snap.docs
        .map(doc => ({
          id: doc.id,
          ...(doc.data() as Message<admin.firestore.Timestamp>)
        }))
        .map(async message => {
          if (message.from) {
            const author = await getUserById(message.from, {
              withUsername: true
            });
            (message as any).from = author;
          }

          (message as any).createdAt = message.createdAt.toDate().toISOString();

          return message;
        })
    );
  });
});

export const getOutbox = functions.https.onCall(async (data, context) => {
  if (!context.auth)
    throw new functions.https.HttpsError(
      'unauthenticated',
      'فقط المستخدمين المُسَجَّلين يستطيعون رؤية رسائلهم المرسلة.'
    );

  const userId = context.auth.uid;

  let ref = db
    .collection('users')
    .doc(userId)
    .collection('messages')
    .orderBy('createdAt', 'desc');

  if (data?.last) {
    const lastDoc = await db
      .collection('users')
      .doc(userId)
      .collection('messages')
      .doc(data.last)
      .get();
    ref = ref.startAfter(lastDoc);
  }

  return ref
    .limit(8)
    .get()
    .then(snap =>
      Promise.all(
        snap.docs
          .filter(doc => doc.exists)
          .map(async ({ id }) => {
            const doc = await db.collection('messages').doc(id).get();

            const { content, createdAt, love, to } = doc.data()!;

            const reciever = await getUserById(to, { withUsername: true });

            const message = {
              id: doc.id,
              content,
              love,
              to: reciever,
              createdAt: createdAt.toDate().toISOString()
            };
            return message;
          })
      )
    );
});

export const getWhoRequests = functions.https.onCall(async (data, context) => {
  if (!context.auth)
    throw new functions.https.HttpsError(
      'unauthenticated',
      'يمكن للأشخاص المسجلين فقط استقبال طلبات معرفة المرسل.'
    );

  const userId = context.auth.uid;

  let ref = db
    .collection('users')
    .doc(userId)
    .collection('who_requests')
    .limit(8);

  if (data?.last) {
    const lastDoc = await db
      .collection('users')
      .doc(userId)
      .collection('who_requests')
      .doc(data.last)
      .get();
    ref = ref.startAfter(lastDoc);
  }

  return ref.get().then(snap =>
    Promise.all(
      snap.docs
        .map(doc => ({
          id: doc.id,
          ...(doc.data() as WhoRequest)
        }))
        .map(async req => {
          const from = await getUserById(req.from, { withUsername: true });

          return {
            id: req.id,
            from,
            message: req.message,
            sentAt: req.sentAt.toDate().toISOString()
          };
        })
    )
  );
});
