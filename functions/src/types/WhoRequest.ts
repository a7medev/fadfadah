import * as admin from 'firebase-admin';

interface WhoRequest {
  id?: string;
  from: string;
  message: {
    id: string;
    content: string;
  };
  sentAt: admin.firestore.Timestamp;
}

export default WhoRequest;
