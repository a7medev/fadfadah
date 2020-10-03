import { Timestamp } from '@firebase/firestore-types';

interface WhoRequest {
  id?: string;
  from: string;
  message: {
    id: string;
    content: string;
  };
  sentAt: Timestamp;
}

export default WhoRequest;
