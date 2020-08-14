import * as React from 'react';
import { useState } from 'react';
import { functions } from '../config/firebase';
import MessageBox from './MessageBox';

export interface BlockProps {
  id: string;
  type: 'uid' | 'username' | 'messageId';
  activator: React.ComponentType<any>;
}

const blockUser = functions.httpsCallable('blockUser');

const Block: React.FC<BlockProps> = ({ activator: Activator, id, type }) => {
  const [message, setMessage] = useState<string | null>(null);

  function block() {
    blockUser({ id, type })
      .then(() => {
        setMessage('تم حظر المستخدم بنجاح');
      })
      .catch(err => {
        console.dir(err);
        setMessage(
          err.code !== 'internal'
            ? err.message
            : 'حدثت مشكلة ما أثناء حظر المستخدم'
        );
      });
  }
  return (
    <>
      <Activator block={block} />

      <MessageBox
        show={!!message}
        onClose={() => setMessage(null)}
        title="رسالة من الموقع"
        text={message!}
      />
    </>
  );
};

export default Block;
