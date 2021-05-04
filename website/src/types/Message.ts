import type { Timestamp } from '@firebase/firestore-types';

import MiniUser from './MiniUser';

interface Message<Time = Timestamp> {
  id: string;
  to: MiniUser;
  from?: MiniUser;
  love: boolean;
  isAnonymous?: boolean;
  content?: string;
  recordingURL?: string;
  createdAt: Time;
}

export default Message;
