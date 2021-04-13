import { db } from '../config/firebase';

const getUIDByMessageId = async (messageId: string) => {
  const { docs: [message] } = await db
    .collectionGroup('messages')
    .where('messageId', '==', messageId)
    .get();

  return message?.ref.parent.parent?.id;
};

export default getUIDByMessageId;
