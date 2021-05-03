import type { Timestamp } from '@firebase/firestore-types';

import Message from '../../types/Message';
import UserData from '../user/UserData';

export interface MessageHeaderProps {
  message: Message<Timestamp>;
  outbox?: boolean;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ message, outbox }) => {
  if (!message.from && !outbox) {
    return null;
  }

  return (
    <>
      {outbox && <small className="mb-1 text-muted d-block">أرسلتها إلى</small>}

      <UserData user={outbox ? message.to : message.from!} />

      <hr className="mt-2" />
    </>
  );
};

export default MessageHeader;
