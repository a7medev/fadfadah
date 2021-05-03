import { useCallback } from 'react';

import { functions } from '../config/firebase';
import { useAlertMessage } from '../contexts/AlertMessageContext';

export interface BlockOptions {
  id: string;
  type: 'uid' | 'username' | 'messageId';
}

const blockUser = functions.httpsCallable('blockUser');

const useBlock = () => {
  const { showAlertMessage } = useAlertMessage();

  const block = useCallback((options: BlockOptions) => {
    blockUser(options)
      .then(() => {
        showAlertMessage('تم حظر المستخدم بنجاح');
      })
      .catch(err => {
        showAlertMessage(
          err.code !== 'internal'
            ? err.message
            : 'حدثت مشكلة ما أثناء حظر المستخدم'
        );
      });
  }, [showAlertMessage]);

  return block;
};

export default useBlock;
