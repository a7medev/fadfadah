import type * as admin from 'firebase-admin';
import { db, messaging } from '../config/firebase';

type MessagingPayload = admin.messaging.MessagingPayload;
const sendNotification = async (userId: string, payload: MessagingPayload) => {
  const devices = await db
    .collection('devices')
    .where('userId', '==', userId)
    .get();
  const tokens: string[] = devices.docs.map(doc => doc.data().token);

  if (!tokens.length) return;

  messaging.sendToDevice(tokens, payload).catch(err => console.error(err));
};

export default sendNotification;
