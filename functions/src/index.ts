import * as functions from 'firebase-functions';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as sharp from 'sharp';
import * as _ from 'lodash';
import { firestore } from 'firebase-admin';

import Gender from './types/Gender';
import MiniUser from './types/MiniUser';
import Settings from './types/Settings';
import { auth, db, storage } from './config/firebase';
import getUIDByMessageId from './utils/getUIDByMessageId';
import getUIDByUsername from './utils/getUIDByUsername';
import getUserById from './utils/getUserById';
import sendNotification from './utils/sendNotification';
import getSender from './utils/getSender';
import Message from './types/Message';

const { HttpsError } = functions.https;

const REGION = 'europe-west6';

export const initUserAccount = functions
  .region(REGION)
  .auth.user()
  .onCreate(async user => {
    interface UserDoc extends MiniUser {
      settings: Settings;
    }

    const userDoc: UserDoc = {
      uid: user.uid,
      verified: false,
      settings: {
        blockUnsignedMessages: false,
        airplaneMode: false
      }
    };

    if (user.displayName) {
      userDoc.displayName = user.displayName;
    }

    if (user.photoURL) {
      userDoc.photoURL = user.photoURL;
    }

    return db
      .collection('users')
      .doc(user.uid)
      .set(userDoc, { merge: true })
      .catch(err => console.error(err));
  });

export const denormalizeUserData = functions
  .region(REGION)
  .firestore.document('/users/{userId}')
  .onUpdate(async change => {
    const after = change.after.data() as MiniUser;
    const before = change.before.data() as MiniUser;

    if (
      after.displayName === before.displayName &&
      after.photoURL === before.photoURL &&
      after.gender === before.gender &&
      after.verified === before.verified
    ) {
      console.log('Nothing changed');
      return true;
    }

    const user = {
      uid: after.uid,
      displayName: after.displayName || null,
      photoURL: after.photoURL || null,
      gender: after.gender || null,
      verified: after.verified,
      username: after.username
    };
    const outbox = await db
      .collection('messages')
      .where('from.uid', '==', user.uid)
      .get();
    const outboxPromises = _.chunk(outbox.docs, 400).map(docs => {
      const batch = db.batch();
      docs.map(doc => batch.update(doc.ref, { ...doc.data(), from: user }));
      return batch.commit();
    });
    const inbox = await db
      .collection('messages')
      .where('to.uid', '==', user.uid)
      .get();
    const inboxPromises = _.chunk(inbox.docs, 400).map(docs => {
      const batch = db.batch();
      docs.map(doc => batch.update(doc.ref, { ...doc.data(), to: user }));
      return batch.commit();
    });
    const whoRequests = await db
      .collection('users')
      .doc(user.uid)
      .collection('who_requests')
      .where('from.uid', '==', user.uid)
      .get();
    const whoRequestsPromises = _.chunk(whoRequests.docs, 400).map(docs => {
      const batch = db.batch();
      docs.map(doc => batch.update(doc.ref, { ...doc.data(), from: user }));
      return batch.commit();
    });
    const promises = [
      ...inboxPromises,
      ...outboxPromises,
      ...whoRequestsPromises
    ];
    return Promise.all(promises);
  });

export const sendMessage = functions
  .region(REGION)
  .https.onCall(async ({ content, to, isAnonymous }, context) => {
    if (!content || !to) {
      throw new HttpsError(
        'invalid-argument',
        'رجاءاً تأكد من إدخال بيانات صحيحة'
      );
    }

    if (!isAnonymous && !context.auth) {
      throw new HttpsError(
        'invalid-argument',
        'لابد من تسجيل الدخول لإرسال رسائل غير مجهولة'
      );
    }

    if (content.trim().length < 5 || content.trim().length > 500) {
      throw new HttpsError(
        'invalid-argument',
        'يجب أن تحتوي الرسالة على 5 إلى 500 حرف'
      );
    }

    try {
      const recieverExists = await auth.getUser(to);

      if (!recieverExists) {
        throw new HttpsError(
          'invalid-argument',
          'المستخدم الذي تحاول مراسلته غير موجود'
        );
      }
    } catch (err) {
      console.error(err);

      throw new HttpsError(
        'invalid-argument',
        'المستخدم الذي تحاول مراسلته غير موجود'
      );
    }

    const recieverDoc = await db.collection('users').doc(to).get();
    const reciever = recieverDoc.data() as MiniUser;

    const thisUserWord =
      reciever.gender === Gender.FEMALE ? 'هذه المستخدمة' : 'هذا المستخدم';

    if (reciever.settings.airplaneMode) {
      throw new HttpsError(
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
        throw new HttpsError(
          'permission-denied',
          `لا يمكنك مراسلة ${thisUserWord} بعد الآن`
        );
    } else if (reciever.settings.blockUnsignedMessages) {
      throw new HttpsError(
        'permission-denied',
        `رجاءاً قم بالتسجيل في فضفضة لتتمكن من مراسلة ${thisUserWord}`
      );
    }

    // TODO: Add good types
    const doc: any = {
      to: {
        uid: to,
        displayName: reciever.displayName || null,
        photoURL: reciever.photoURL || null,
        gender: reciever.gender || null,
        verified: reciever.verified,
        username: reciever.username
      },
      content: content.trim(),
      love: false,
      createdAt: firestore.FieldValue.serverTimestamp()
    };

    if (!isAnonymous) {
      const senderId = context.auth!.uid;
      const senderDoc = await db.collection('users').doc(senderId).get();
      const sender = senderDoc.data() as MiniUser;

      doc.from = {
        uid: senderId,
        displayName: sender.displayName || null,
        photoURL: sender.photoURL || null,
        gender: sender.gender || null,
        verified: sender.verified,
        username: sender.username
      };
    }

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

    if (context.auth) {
      db.collection('users')
        .doc(context.auth.uid)
        .collection('messages')
        .doc(snap.id)
        .set({
          messageId: snap.id,
          createdAt: firestore.FieldValue.serverTimestamp()
        })
        .catch(err => {
          console.error(err);
          throw new HttpsError('unknown', 'حدثت مشكلة ما');
        });
    }

    return true;
  });

export const usernameIsAvailable = functions
  .region(REGION)
  .https.onCall(async (username: string, context) => {
    // Only users without a username can check for username
    const { size: hasUsername } = await db
      .collection('usernames')
      .where('userId', '==', context.auth?.uid)
      .get();

    if (hasUsername) {
      return false;
    }

    return db
      .collection('usernames')
      .doc(username.toLowerCase())
      .get()
      .then(snap => !snap.exists)
      .catch(err => console.error(err));
  });

export const setUsername = functions
  .region(REGION)
  .https.onCall(async (passedUsername: string, context) => {
    const username = passedUsername.trim().toLowerCase();

    if (!context.auth || !/^[A-Z_0-9]+$/i.test(username)) {
      return false;
    }

    const { size: hasUsername } = await db
      .collection('usernames')
      .where('userId', '==', context.auth.uid)
      .get();

    if (hasUsername) {
      return false;
    }

    const snap = await db.collection('usernames').doc(username).get();

    if (snap.exists) {
      return false;
    }

    return snap.ref
      .set({ userId: context.auth.uid })
      .then(() =>
        db
          .collection('users')
          .doc(context.auth!.uid)
          .set({ username }, { merge: true })
      );
  });

export const removeMessageData = functions
  .region(REGION)
  .firestore.document('/messages/{messageId}')
  .onDelete(async (__, { params }) => {
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

export const blockUser = functions
  .region(REGION)
  .https.onCall(
    async (
      { id, type }: { id: string; type: 'uid' | 'username' | 'messageId' },
      context
    ) => {
      if (!context.auth) {
        throw new HttpsError(
          'unauthenticated',
          'قم بالدخول إلى حسابك لتتمكن من حظر المستخدمين'
        );
      }

      const block = (uid: string, isSender: boolean) => {
        if (context.auth?.uid === id) {
          throw new HttpsError('invalid-argument', 'لا يمكنك القيام بحظر نفسك');
        }

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
          if (!uid) {
            throw new HttpsError(
              'not-found',
              'لا نستطيع إيجاد المستخدم الذي تحاول حظره'
            );
          }
          return block(uid, false);
        case 'messageId':
          const authorId = await getUIDByMessageId(id);
          if (!authorId) {
            throw new HttpsError(
              'not-found',
              'المستخدم الذي أرسل هذه الرسالة غير مُسَجَّل ولا يمكننا حظره، ولكن بإمكانك تعطيل استقبال الرسائل من العامة من الإعدادات'
            );
          }
          return block(authorId, true);
        default:
          throw new HttpsError(
            'invalid-argument',
            'لا نستطيع إيجاد المستخدم الذي تحاول حظره'
          );
      }
    }
  );

export const removeUserData = functions
  .region(REGION)
  .auth.user()
  .onDelete(user => {
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

export const sendWhoRequest = functions
  .region(REGION)
  .https.onCall(async (messageId: string, context) => {
    if (!context.auth) {
      throw new HttpsError(
        'unauthenticated',
        'يمكن للأشخاص المسجلين فقط إرسال طلبات معرفة المرسل.'
      );
    }

    const authorId = await getUIDByMessageId(messageId);

    if (!authorId) {
      throw new HttpsError(
        'not-found',
        'المستخدم الذي أرسل هذه الرسالة غير مُسَجَّل ولا يمكننا معرفة من يكون.'
      );
    }

    const messageSnap = await db.collection('messages').doc(messageId).get();
    const message = messageSnap.data()!;

    if (message.from) {
      throw new HttpsError(
        'invalid-argument',
        'يمكنك إرسال طلب معرفة المرسل على رسالة مجهولة فقط.'
      );
    }

    const user = await getUserById(context.auth.uid);

    if (!user) {
      throw new HttpsError('not-found', 'لم يتم العثور على بياناتك');
    }

    db.collection('users')
      .doc(authorId)
      .collection('who_requests')
      .doc(messageId)
      .set({
        from: {
          uid: user.uid,
          displayName: user.displayName || null,
          photoURL: user.photoURL || null,
          gender: user.gender || null,
          verified: user.verified,
          username: user.username
        },
        message: {
          id: messageId,
          content: message.content
        },
        sentAt: firestore.FieldValue.serverTimestamp()
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
  });

export const acceptWhoRequest = functions
  .region(REGION)
  .https.onCall(async (reqId, context) => {
    if (!context.auth) {
      throw new HttpsError(
        'unauthenticated',
        'يمكن للمسجلين على فضفضة فقط قبول أو رفض طلبات معرفة المرسل.'
      );
    }

    const userId = context.auth.uid;
    const user = await getUserById(userId);

    if (!user) {
      throw new HttpsError('not-found', 'لم يتم العثور على بياناتك');
    }

    const reqSnap = await db
      .collection('users')
      .doc(userId)
      .collection('who_requests')
      .doc(reqId)
      .get();

    if (!reqSnap.exists) {
      throw new HttpsError(
        'not-found',
        'طلب معرفة المرسل الذي تحاول قبوله غير موجود'
      );
    }

    const req = reqSnap.data()!;

    const messageId = req.message.id;
    const from = {
      uid: userId,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      gender: user.gender || null,
      verified: user.verified,
      username: user.username
    };
    return db
      .collection('messages')
      .doc(messageId)
      .update({ from })
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
  });

export const sendLoveNotification = functions
  .region(REGION)
  .firestore.document('/messages/{messageId}')
  .onUpdate(async change => {
    const message = change.after.data() as Message<unknown>;
    // Love State Changed
    if (message.love && message.love !== change.before.data().love) {
      const sender = await getSender(change.after.id, message);
      const lovedWord =
        message.to.gender === Gender.FEMALE ? 'أَحَبَّت' : 'أَحَبَّ';
      const messageContent =
        message.content.length > 100
          ? message.content.substring(0, 100) + '...'
          : message.content;
      const body = `${lovedWord} ${message.to.displayName} رسالتك "${messageContent}"`;
      sendNotification(sender.uid, {
        notification: {
          body,
          title: 'فضفضة',
          icon: message.to.photoURL ?? '/images/avatar.svg',
          clickAction: `/outbox?goto=${change.after.id}`
        }
      }).catch(err => console.error(err));
    }
  });

export const resizeProfilePhoto = functions
  .region(REGION)
  .storage.object()
  .onFinalize(async object => {
    if (object.metadata?.resizedImage === 'true') {
      return false;
    }

    const bucket = storage.bucket(object.bucket);
    const filePath = object.name!;

    // Check if it's a profile photo path
    const profilePhotoPath = /^[^/]+\/profile_photo\/[^/]+$/;
    if (!profilePhotoPath.test(filePath)) {
      return false;
    }

    const photoName = filePath.split('/').pop()!;
    const bucketDir = path.dirname(filePath);

    const workingDir = path.join(os.tmpdir(), 'profile_photos');
    const tmpFilePath = path.join(workingDir, 'source.png');

    await fs.ensureDir(workingDir);

    await bucket.file(filePath).download({
      destination: tmpFilePath
    });

    const photoPath = path.join(workingDir, photoName);

    await sharp(tmpFilePath).resize(350, 350).toFile(photoPath);

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
