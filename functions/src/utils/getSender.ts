import type Message from '../types/Message';
import MiniUser from '../types/MiniUser';
import getUIDByMessageId from './getUIDByMessageId';
import getUserById from './getUserById';

const getSender = (messageId: string, message: Message<unknown>) => {
  if (message.from) return Promise.resolve(message.from);

  return new Promise<MiniUser>(async (resolve, reject) => {
    const senderId = await getUIDByMessageId(messageId);
    if (!senderId) return reject('Sender not found');
    const sender = await getUserById(senderId);
    if (!sender) return reject('Sender not found');
    resolve(sender);
  });
};

export default getSender;
