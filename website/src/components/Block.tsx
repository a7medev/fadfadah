import { functions } from '../config/firebase';
import { useAlertMessage } from '../contexts/AlertMessageContext';

export interface BlockProps {
  id: string;
  type: 'uid' | 'username' | 'messageId';
  activator: React.ComponentType<any>;
}

const blockUser = functions.httpsCallable('blockUser');

const Block: React.FC<BlockProps> = ({ activator: Activator, id, type }) => {
  const { showAlertMessage } = useAlertMessage();

  const block = () => {
    blockUser({ id, type })
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
  };
  return <Activator block={block} />;
};

export default Block;
